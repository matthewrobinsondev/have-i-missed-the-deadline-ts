import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import { Prisma, PrismaClient, UserPreferences } from "@prisma/client";
import { Player } from "@/app/types/fpl/Players";
import { log } from "next-axiom";
import { FplService } from "@/app/fpl/FplService";
import TwilioApi from "@/app/third-party/TwilioApi";
import { DefaultArgs } from "@prisma/client/runtime/library";

const tolerance = 180;

export const TwilioUpdateRouter = router({
  updateOneDay: publicProcedure.mutation(async ({ ctx }) => {
    const oneDayTime = 86400;
    const deadline = await ctx.fplService.getDeadline();
    const nextDeadline = await ctx.fplService.getNextDeadline();
    const valid = isUpdateTimeValid(deadline, oneDayTime);

    if (!valid) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Fpl Data not updated. Not sending SMS.",
      });
    }

    const users = await ctx.db.userPreferences.findMany({
      where: {
        reminder_schedule: {
          send_1_day_before: true,
        },
      },
    });

    if (!users) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No Users have selected this reminder type. Not sending SMS.",
      });
    }

    log.info("Running cron for one day before updates.");

    await sendSmsUpdates(users, ctx, "One Day");

    const delay = Math.floor((nextDeadline - Date.now()) / 1000);

    await setCronForNextDeadline(delay, "updateOneDay");

    return `SMS updates sent.`;
  }),
  updateThreeHours: publicProcedure.mutation(async ({ ctx }) => {
    const threeHoursTime = 18000;
    const deadline = await ctx.fplService.getDeadline();
    const nextDeadline = await ctx.fplService.getNextDeadline();
    const valid = isUpdateTimeValid(deadline, threeHoursTime);

    if (!valid) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Fpl Data not updated. Not sending SMS.",
      });
    }

    const users = await ctx.db.userPreferences.findMany({
      where: {
        reminder_schedule: {
          send_3_hours_before: true,
        },
      },
    });

    if (!users) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No Users have selected this reminder type. Not sending SMS.",
      });
    }

    log.info("Running cron for three hours before updates.");

    await sendSmsUpdates(users, ctx, "Three Hours");

    const delay = Math.floor((nextDeadline - Date.now()) / 1000);

    await setCronForNextDeadline(delay, "updateThreeHours");

    return `SMS updates sent.`;
  }),
  updateThirtyMinutes: publicProcedure.mutation(async ({ ctx }) => {
    const thirtyMinutesTime = 1800;
    const deadline = await ctx.fplService.getDeadline();
    const nextDeadline = await ctx.fplService.getNextDeadline();
    const valid = isUpdateTimeValid(deadline, thirtyMinutesTime);

    if (!valid) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Fpl Data not updated. Not sending SMS.",
      });
    }

    const users = await ctx.db.userPreferences.findMany({
      where: {
        reminder_schedule: {
          send_30_minutes_before: true,
        },
      },
    });

    if (!users) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No Users have selected this reminder type. Not sending SMS.",
      });
    }

    log.info("Running cron for thirty minutes before updates.");

    await sendSmsUpdates(users, ctx, "30 Minutes");

    const delay = Math.floor((nextDeadline - Date.now()) / 1000);

    await setCronForNextDeadline(delay, "updateThirtyMinutes");

    return `SMS updates sent.`;
  }),
});

function isUpdateTimeValid(deadline: number, oneDayTime: number) {
  const currentTime = Date.now();
  const expectedDeadline = currentTime + oneDayTime;
  return Math.abs(expectedDeadline - deadline) <= tolerance;
}

async function sendSmsUpdates(
  users: UserPreferences[],
  ctx: {
    userId: string | null;
    headers: Headers;
    db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
    fplService: FplService;
    twilioApi: TwilioApi;
  },
  updateTime: string,
) {
  const topTransferredIn = await ctx.fplService.getTopTransferredIn();
  const topTransferredOut = await ctx.fplService.getTopTransferredOut();

  for (const user of users) {
    const smsBody = await getSmsBody(
      user,
      topTransferredIn
        .sort((a, b) => b.transfers_in_event - a.transfers_in_event)
        .slice(0, 5),
      topTransferredOut
        .sort((a, b) => b.transfers_out_event - a.transfers_out_event)
        .slice(0, 5),
      updateTime,
      ctx.db,
    );

    const userContact = await ctx.db.userContact.findUnique({
      where: { user_id: user.user_id },
    });

    if (!userContact?.is_verified) {
      log.info(`${user.user_id} does not have a verified phone number.`);
      continue;
    }

    ctx.twilioApi.sendSmsUpdate(userContact.phone_number, smsBody);
  }
}

async function getSmsBody(
  user: UserPreferences,
  topTransferredIn: Player[],
  topTransferredOut: Player[],
  updateTime: string,
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
): Promise<string> {
  const reminderType = await db.reminderType.findUnique({
    where: { id: user.reminder_type_id },
  });

  let transferInText = "";
  let transferOutText = "";
  let fplUpdateHeader = "";

  if (reminderType?.send_transfer_in || reminderType?.send_transfer_out) {
    fplUpdateHeader = "🔥 Here are your FPL updates 🔥";
  }
  if (reminderType?.send_transfer_in) {
    transferInText = `📈 Top Transferred In: 
    ${topTransferredIn
      .map(
        (player, index) =>
          `${index + 1}. ${player.first_name} - ${
            player.second_name
          }\n   Transfers In: ${player.transfers_in_event}`,
      )
      .join("\n")}`;
  }

  if (reminderType?.send_transfer_out) {
    transferOutText = `📉 Top Transferred Out:
    ${topTransferredOut
      .map(
        (player, index) =>
          `${index + 1}. ${player.first_name} - ${
            player.second_name
          }\n   Transfers Out: ${player.transfers_out_event}`,
      )
      .join("\n")}`;
  }
  const smsBody = `⏰ FPL deadline is in ${updateTime} ⏰
  ${fplUpdateHeader}

  ${transferInText}

  ${transferOutText}`;

  return smsBody;
}

async function setCronForNextDeadline(delay: number, endpoint: string) {
  const url = `${process.env.QSTASH_BASE_URL}${endpoint}`;
  const authorizationToken = `Bearer ${process.env.QSTASH_AUTH_TOKEN}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authorizationToken,
        "Upstash-Delay": `${delay}s`,
      },
    });

    if (!response.ok) {
      log.error(`Update request failed with status: ${response.status}`);
      log.error(`Response body: ${await response.text()}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      log.error(error.message);
    }
  }
}

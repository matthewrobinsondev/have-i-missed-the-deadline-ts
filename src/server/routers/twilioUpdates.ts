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

    await sendSmsUpdates(users, ctx);

    return `SMS updates sent.`;
  }),
  updateThreeHours: publicProcedure.mutation(async ({ ctx }) => {
    const threeHoursTime = 18000;
    const deadline = await ctx.fplService.getDeadline();
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

    await sendSmsUpdates(users, ctx);

    return `SMS updates sent.`;
  }),
  updateThirtyMinutes: publicProcedure.mutation(async ({ ctx }) => {
    const thirtyMinutesTime = 1800;
    const deadline = await ctx.fplService.getDeadline();
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

    await sendSmsUpdates(users, ctx);

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
) {
  const topTransferredIn = await ctx.fplService.getTopTransferredIn();
  const topTransferredOut = await ctx.fplService.getTopTransferredOut();

  for (const user of users) {
    const smsBody = getSmsBody(
      user,
      topTransferredIn
        .sort((a, b) => b.transfers_in_event - a.transfers_in_event)
        .slice(0, 5),
      topTransferredOut
        .sort((a, b) => b.transfers_out_event - a.transfers_out_event)
        .slice(0, 5),
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

function getSmsBody(
  user: UserPreferences,
  topTransferredIn: Player[],
  topTransferredOut: Player[],
): string {  
  const smsBody = `🔥 Here are your FPL updates 🔥
  📈 Top Transferred In: 
  ${topTransferredIn
    .map(
      (player, index) =>
        `${index + 1}. ${player.first_name} - ${
          player.second_name
        }\n   Transfers In: ${player.transfers_in_event}`,
    )
    .join("\n")}

  📉 Top Transferred Out:
   ${topTransferredOut
     .map(
       (player, index) =>
         `${index + 1}. ${player.first_name} - ${
           player.second_name
         }\n   Transfers Out: ${player.transfers_out_event}`,
     )
     .join("\n")}`;

  return smsBody;
}

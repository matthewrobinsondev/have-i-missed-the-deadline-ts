import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";

export const TwilioUpdateRouter = router({
  updateOneDay: publicProcedure.mutation(async ({ ctx }) => {
    const oneDayTime = 86400000;
    const deadline = await ctx.fplService.getDeadline();
    // const topTransferredIn = await ctx.fplService.getTopTransferredIn();
    // const topTransferredOut = await ctx.fplService.getTopTransferredOut();

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

    // for (const user of users) {
    //   const smsBody = getSmsBody(user, topTransferredIn, topTransferredOut);
    // }

    return "SMS updates have been sent.";
  }),
});

function isUpdateTimeValid(deadline: number, oneDayTime: number) {
  const currentTime = Date.now();
  console.log(currentTime);
  const timeDifference = currentTime - deadline;
  const valid = timeDifference < oneDayTime;
  return valid;
}

function getSmsBody(
  user: any,
  topTransferredIn: any,
  topTransferredOut: any,
): string {
  const smsBody = `Hello ${user.user_id}! Here are your FPL updates for today: ${topTransferredIn} ${topTransferredOut}`;
  return smsBody;
}

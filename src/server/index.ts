import { db } from "@/db";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";

export const appRouter = router({
  getTasks: publicProcedure.query(async () => {
    return [
        { id: 1, text: 'Buy milk', done: false },
        { id: 2, text: 'Buy eggs', done: true },
    ];
  }),
//   updateUserPreferences: publicProcedure
//     .input(
//       z.object({
//         send_fixture_reminder: z.boolean(),
//         send_transfer_in: z.boolean(),
//         send_transfer_out: z.boolean(),
//         send_1_day_before: z.boolean(),
//         send_3_hours_before: z.boolean(),
//         send_30_minutes_before: z.boolean(),
//       })
//     )
//     .mutation(async ({ input }) => {
//       const reminderType = await db.reminderType.create({
//         data: {
//           send_fixture_reminder: input.send_fixture_reminder,
//           send_transfer_in: input.send_transfer_in,
//           send_transfer_out: input.send_transfer_out,
//         },
//       });

//       const reminderSchedule = await db.reminderSchedule.create({
//         data: {
//           send_1_day_before: input.send_1_day_before,
//           send_3_hours_before: input.send_3_hours_before,
//           send_30_minutes_before: input.send_30_minutes_before,
//         },
//       });

//       const userId = 
//     //   const userPreferences = await db.userPreferences.create({
//     //     data: {
//     //         user_id: userId
//     //       reminderTypeId: reminderType.id,
//     //       reminderScheduleId: reminderSchedule.id,
//     //     },
//     //   });
//       return post;
//     }),
});

export type AppRouter = typeof appRouter;

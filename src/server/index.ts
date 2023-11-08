import { db } from "@/db";
import { router, privateProcedure, publicProcedure } from "./trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { UserPreferences } from "@prisma/client";
import { UserPreferencesInput } from "@/app/types/db/UserPreferencesInput";

// @TODO: Refactor this to use specific files for each procedure

export const appRouter = router({
  updateUserPreferences: privateProcedure
    .input(
      z.object({
        send_fixture_reminder: z.boolean(),
        send_transfer_in: z.boolean(),
        send_transfer_out: z.boolean(),
        send_1_day_before: z.boolean(),
        send_3_hours_before: z.boolean(),
        send_30_minutes_before: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const getUserPreferences = await db.userPreferences.findUnique({
        where: { user_id: userId },
      });

      if (getUserPreferences) {
        return updateUserPreferences(userId, input, getUserPreferences);
      }

      return createUserPreferences(userId, input);
    }),
});

async function createUserPreferences(
  userId: string,
  input: UserPreferencesInput
): Promise<UserPreferences> {
  const reminderType = await db.reminderType.create({
    data: {
      send_fixture_reminder: input.send_fixture_reminder,
      send_transfer_in: input.send_transfer_in,
      send_transfer_out: input.send_transfer_out,
    },
  });

  const reminderSchedule = await db.reminderSchedule.create({
    data: {
      send_1_day_before: input.send_1_day_before,
      send_3_hours_before: input.send_3_hours_before,
      send_30_minutes_before: input.send_30_minutes_before,
    },
  });

  const userPreferences = await db.userPreferences.upsert({
    where: { user_id: userId },
    create: {
      user_id: userId,
      reminder_type_id: reminderType.id,
      reminder_schedule_id: reminderSchedule.id,
    },
    update: {
      reminder_type_id: reminderType.id,
      reminder_schedule_id: reminderSchedule.id,
    },
  });

  return userPreferences;
}

async function updateUserPreferences(
  userId: string,
  input: UserPreferencesInput,
  getUserPreferences: UserPreferences
): Promise<UserPreferences> {
  const reminderType = await db.reminderType.update({
    where: { id: getUserPreferences.reminder_type_id },
    data: {
      send_fixture_reminder: input.send_fixture_reminder,
      send_transfer_in: input.send_transfer_in,
      send_transfer_out: input.send_transfer_out,
    },
  });

  const reminderSchedule = await db.reminderSchedule.update({
    where: { id: getUserPreferences.reminder_schedule_id },
    data: {
      send_1_day_before: input.send_1_day_before,
      send_3_hours_before: input.send_3_hours_before,
      send_30_minutes_before: input.send_30_minutes_before,
    },
  });

  const userPreferences = await db.userPreferences.update({
    where: { user_id: userId },
    data: {
      reminder_type_id: reminderType.id,
      reminder_schedule_id: reminderSchedule.id,
    },
  });

  return userPreferences;
}

export type AppRouter = typeof appRouter;

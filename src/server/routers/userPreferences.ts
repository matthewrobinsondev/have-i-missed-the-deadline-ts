import { z } from "zod";
import { privateProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Prisma, PrismaClient, UserPreferences } from "@prisma/client";
import { UserPreferencesInput } from "@/app/types/db/UserPreferencesInput";
import { DefaultArgs } from "@prisma/client/runtime/library";

export const UserPreferencesRouter = router({
  updateUserPreferences: privateProcedure
    .input(
      z.object({
        send_fixture_reminder: z.boolean(),
        send_transfer_in: z.boolean(),
        send_transfer_out: z.boolean(),
        send_1_day_before: z.boolean(),
        send_3_hours_before: z.boolean(),
        send_30_minutes_before: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const getUserPreferences = await ctx.db.userPreferences.findUnique({
        where: { user_id: userId },
      });

      if (getUserPreferences) {
        return updateUserPreferences(userId, input, getUserPreferences, ctx.db);
      }

      return createUserPreferences(userId, input, ctx.db);
    }),
  getUserPreferences: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const getUserPreferences = await ctx.db.userPreferences.findUnique({
      where: { user_id: userId },
    });

    if (!getUserPreferences) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User preferences not found",
      });
    }

    getUserPreferences.reminder_type = await ctx.db.reminderType.findUnique({
      where: { id: getUserPreferences.reminder_type_id },
    });

    getUserPreferences.reminder_schedule =
      await ctx.db.reminderSchedule.findUnique({
        where: { id: getUserPreferences.reminder_schedule_id },
      });

    return {
      ...getUserPreferences.id,
      ...getUserPreferences.reminder_type,
      ...getUserPreferences.reminder_schedule,
    };
  }),
});

async function createUserPreferences(
  userId: string,
  input: UserPreferencesInput,
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
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
  getUserPreferences: UserPreferences,
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
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

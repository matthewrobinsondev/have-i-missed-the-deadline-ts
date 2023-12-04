import { jest, test, expect, mock, it, describe } from "bun:test";
import { appRouter } from "../../src/server";
import { TRPCError } from "@trpc/server";

const mockInput = {
  send_fixture_reminder: true,
  send_transfer_in: false,
  send_transfer_out: true,
  send_1_day_before: true,
  send_3_hours_before: false,
  send_30_minutes_before: true,
};

const mockUserPreferences = {
  id: "456",
  user_id: "123",
  send_fixture_reminder: false,
  send_transfer_in: true,
  send_transfer_out: false,
  send_1_day_before: false,
  send_3_hours_before: true,
  send_30_minutes_before: false,
};

const mockDb = {
  userPreferences: {
    findUnique: jest.fn().mockResolvedValue(mockUserPreferences),
    update: jest.fn().mockResolvedValue(mockUserPreferences),
  },
  reminderType: {
    update: jest.fn().mockResolvedValue(mockUserPreferences),
  },
  reminderSchedule: {
    update: jest.fn().mockResolvedValue(mockUserPreferences),
  },
};

describe("updateUserPreferences", () => {
  it("will return a successful UserPreferenceType", async () => {
    const caller = appRouter.createCaller({ db: mockDb, userId: "123" });

    const result = await caller.updateUserPreferences(mockInput);

    expect(result).toEqual(mockUserPreferences);
  });

  it("Will return an unauthenticated error", async () => {
    const caller = appRouter.createCaller({ db: mockDb });

    await expect(caller.updateUserPreferences(mockInput)).rejects.toEqual(
      new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      }),
    );
  });
});

import { test, expect, mock, beforeEach, jest } from "bun:test";
import { appRouter } from "../src/server";
import { TestHelper } from "./TestHelper";
import { TRPCError } from "@trpc/server";

const mockDateNow = () => 1699617119; // Fri Nov 10 2023 11:51:59 GMT+0000

beforeEach(() => {
  Date.now = mockDateNow;
});

const mockUserPreferences = [
  {
    id: "456",
    user_id: "123",
    send_fixture_reminder: false,
    send_transfer_in: true,
    send_transfer_out: false,
    send_1_day_before: true,
    send_3_hours_before: false,
    send_30_minutes_before: false,
  },
  {
    id: "689",
    user_id: "322",
    send_fixture_reminder: true,
    send_transfer_in: true,
    send_transfer_out: true,
    send_1_day_before: true,
    send_3_hours_before: false,
    send_30_minutes_before: false,
  },
];

const mockUserContact = {
  id: 55,
  user_id: "322",
  phone_number: "+test",
  is_verified: true,
};

const mockReminderType = {
  id: 55,
  send_fixture_reminder: false,
  send_transfer_in: true,
  send_transfer_out: true,
};

const mockDb = {
  userPreferences: {
    findMany: jest.fn().mockResolvedValue(mockUserPreferences),
  },
  userContact: {
    findUnique: jest.fn().mockResolvedValue(mockUserContact),
  },
  reminderType: {
    findUnique: jest.fn().mockResolvedValue(mockReminderType),
  },
};

const fplApiMock = mock(() => ({
  getDeadline: mock().mockResolvedValue(Promise.resolve(1699703519)), // Sat Nov 11 2023 11:51:59 GMT+0000

  topTransferredIn: mock().mockResolvedValue(
    Promise.resolve(TestHelper.getTransferredIn()),
  ),
  topTransferredOut: mock().mockResolvedValue(
    Promise.resolve(TestHelper.getTransferredOut()),
  ),
}));

const fplServiceMock = {
  getDeadline: fplApiMock().getDeadline,
  getTopTransferredIn: fplApiMock().topTransferredIn,
  getTopTransferredOut: fplApiMock().topTransferredOut,
};

const twilioApiMock = {
  sendSmsUpdate: mock().mockResolvedValue(Promise.resolve(true)),
};

test("updateOneDay - valid time", async () => {
  const ctx = {
    db: mockDb,
    fplService: fplServiceMock,
    twilioApi: twilioApiMock,
  };
  const caller = appRouter.createCaller(ctx);
  const result = await caller.updateOneDay();

  expect(result).toBe(`SMS updates sent.`);

  expect(ctx.db.userPreferences.findMany).toHaveBeenCalledTimes(1);
  expect(ctx.db.userContact.findUnique).toHaveBeenCalledTimes(2);
  expect(ctx.db.reminderType.findUnique).toHaveBeenCalledTimes(2);
  expect(ctx.fplService.getDeadline).toHaveBeenCalledTimes(1);
  expect(ctx.fplService.getTopTransferredIn).toHaveBeenCalledTimes(1);
  expect(ctx.fplService.getTopTransferredOut).toHaveBeenCalledTimes(1);
  expect(ctx.twilioApi.sendSmsUpdate).toHaveBeenCalledTimes(
    mockUserPreferences.length,
  );
});

test("updateOneDay - invalid time", async () => {
  Date.now = () => 1700912695; // Sat Nov 25 2023 11:44:55 GMT+0000

  const ctx = {
    db: mockDb,
    fplService: fplServiceMock,
    twilioApi: twilioApiMock,
  };
  const caller = appRouter.createCaller(ctx);
  await expect(caller.updateOneDay()).rejects.toEqual(
    new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Invalid Time Request. Not sending SMS.",
    }),
  );
});

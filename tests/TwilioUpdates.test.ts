import { test, expect, mock, beforeEach, jest, snapshot } from "bun:test";
import { appRouter } from "../src/server";
import { TestHelper } from "./TestHelper";

const mockDateNow = () => 1699617119;

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

const mockDb = {
  userPreferences: {
    findMany: jest.fn().mockResolvedValue(mockUserPreferences),
  },
  userContact: {
    findUnique: jest.fn().mockResolvedValue(mockUserContact),
  },
};

const fplApiMock = mock(() => ({
  getDeadline: mock().mockResolvedValue(Promise.resolve(1699703519)),
  topTransferredIn: mock().mockResolvedValue(
    Promise.resolve(TestHelper.getTransferredIn())
  ),
  topTransferredOut: mock().mockResolvedValue(
    Promise.resolve(TestHelper.getTransferredOut())
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
  expect(ctx.fplService.getDeadline).toHaveBeenCalledTimes(1);
  expect(ctx.fplService.getTopTransferredIn).toHaveBeenCalledTimes(1);
  expect(ctx.fplService.getTopTransferredOut).toHaveBeenCalledTimes(1);
  expect(ctx.twilioApi.sendSmsUpdate).toHaveBeenCalledTimes(
    mockUserPreferences.length,
  );

  // TODO: Implement when bun fixes this
  // expect(ctx.twilioApi.sendSmsUpdate).toHaveBeenCalledWith(
  //   "+test", // expected phone number for the second call,
  //   `🔥 Here are your FPL updates 🔥
  //   📈 Top Transferred In: 
  //   1. Player6 - LastName6
  //    Transfers In: 8306
  // 2. Player7 - LastName7
  //    Transfers In: 7307
  // 3. Player5 - LastName5
  //    Transfers In: 6305
  // 4. Player8 - LastName8
  //    Transfers In: 5308
  // 5. Player2 - LastName2
  //    Transfers In: 3402
  
  //   📉 Top Transferred Out:
  //    1. Player11 - LastName11
  //    Transfers Out: 11411
  // 2. Player22 - LastName22
  //    Transfers Out: 7422
  // 3. Player23 - LastName23
  //    Transfers Out: 6423
  // 4. Player21 - LastName21
  //    Transfers Out: 4921
  // 5. Player17 - LastName17
  //    Transfers Out: 4317`,
  // );
});

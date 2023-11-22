import { test, expect, mock, beforeEach, jest } from "bun:test";
import { appRouter } from "../src/server";

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

const mockDb = {
  userPreferences: {
    findMany: jest.fn().mockResolvedValue(mockUserPreferences),
  },
};
const fplApiMock = mock(() => ({
  getDeadline: () => Promise.resolve(1699703519),
  topTransferredIn: () => Promise.resolve(),
  topTransferredOut: () => Promise.resolve(),
}));

const fplServiceMock = {
  getDeadline: fplApiMock().getDeadline,
  getTopTransferredIn: fplApiMock().topTransferredIn,
  getTopTransferredOut: fplApiMock().topTransferredOut,
};


// TODO: Complete Test
test("updateOneDay - valid time", async () => {
  const ctx = { db: mockDb, fplService: fplServiceMock };
  const caller = appRouter.createCaller(ctx);
  const result = await caller.updateOneDay();

  expect(result).toBe('SMS updates have been sent.');
});
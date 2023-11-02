import { FplService } from "../src/app/fpl/FplService";
import { jest, expect, describe, beforeEach, it } from "bun:test";

describe("FplService", () => {
  let fplService: FplService;
  let fplApiMock: any;

  beforeEach(() => {
    fplApiMock = {
      getGeneralInformation: jest.fn(),
    };
    fplService = new FplService(fplApiMock);
  });

  describe("getDeadline", () => {
    it("should return next gameweek deadline if current gameweek is finished", async () => {
      const generalInformation = {
        events: [
          {
            id: 1,
            is_current: true,
            is_next: false,
            finished: true,
            deadline_time: "2023-08-18T17:15:00Z",
            deadline_time_epoch: 1000,
          },
          {
            id: 2,
            is_current: false,
            is_next: true,
            finished: false,
            deadline_time: "2023-08-25T17:15:00Z",
            deadline_time_epoch: 2000,
          },
        ],
      };
      fplApiMock.getGeneralInformation.mockResolvedValueOnce(
        generalInformation
      );

      const result = await fplService.getDeadline();

      // Epoch timestamp for 25th August 17:15:00
      expect(result).toBe(1692983700000);
    });

    it("should return current gameweek deadline if current gameweek is not finished", async () => {
      const generalInformation = {
        events: [
          {
            id: 1,
            is_current: true,
            is_next: false,
            finished: false,
            deadline_time: "2023-08-18T17:15:00Z",
            deadline_time_epoch: 1000,
          },
          {
            id: 2,
            is_current: false,
            is_next: true,
            finished: false,
            deadline_time: "2023-08-25T17:15:00Z",
            deadline_time_epoch: 2000,
          },
        ],
      };
      fplApiMock.getGeneralInformation.mockResolvedValueOnce(
        generalInformation
      );

      const result = await fplService.getDeadline();

      // Epoch timestamp for 18th August 17:15:00
      expect(result).toBe(1692378900000);
    });
  });
});

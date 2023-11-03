import FplApi from "@/app/third-party/FplApi";
import { describe, beforeEach, it, expect, jest, mock } from "bun:test";

const fetchMock = mock(() => fetch);

describe("FplApi", () => {
  let fplApi: FplApi;

  beforeEach(() => {
    fplApi = new FplApi();
  });

  describe("getGeneralInformation", () => {
    it("should return general information from the FPL API", async () => {
      const data = { foo: "bar" };

      global.fetch = mock(() =>
        Promise.resolve({
          json: () => Promise.resolve(data),
        })
      );
    
      const result = await fplApi.getGeneralInformation();

      expect(result).toEqual(data);

    });

    it("should throw an error if the FPL API call fails", async () => {
      const error = new Error("Failed to fetch data from the FPL API.");

      global.fetch.mockImplementationOnce(() => Promise.reject("incorrect"));

      await expect(fplApi.getGeneralInformation()).rejects.toEqual(error);
    });
  });
});

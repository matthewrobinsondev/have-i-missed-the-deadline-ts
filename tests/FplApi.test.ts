import FplApi from "@/app/third-party/FplApi";
import { describe, beforeEach, it, expect, jest } from "bun:test";
import { AxiosInstance } from "axios";

describe("FplApi", () => {
  let fplApi: FplApi;
  let mockAxiosInstance: { get: jest.Mock };

  beforeEach(() => {
    mockAxiosInstance = { get: jest.fn() };
    fplApi = new FplApi(mockAxiosInstance as any);
  });

  describe("getGeneralInformation", () => {
    it("should return general information from the FPL API", async () => {
      const data = { foo: "bar" };
      mockAxiosInstance.get.mockResolvedValueOnce({ data });

      const result = await fplApi.getGeneralInformation();

      expect(mockAxiosInstance.get.mock.calls[0][0]).toEqual("bootstrap-static/");
      expect(result).toEqual(data);
    });

    it("should throw an error if the FPL API call fails", async () => {
      const error = new Error("Failed to fetch data from the FPL API.");
      mockAxiosInstance.get.mockRejectedValueOnce(error);

      await expect(fplApi.getGeneralInformation()).rejects.toEqual(error);
    });
  });
});
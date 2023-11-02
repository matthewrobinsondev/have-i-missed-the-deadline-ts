import axiosInstance from "./FplAxiosConfig";

class FplApi implements FplApiInterface {
  constructor(private FplAxiosInstance = axiosInstance) {}

  public async getGeneralInformation(): Promise<any> {
    try {
      const response = await this.FplAxiosInstance.get("bootstrap-static/");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data from the FPL API.");
    }
  }
}

export default FplApi;

import { log } from "next-axiom";
import axiosInstance from "./FplAxiosConfig";

class FplApi implements FplApiInterface {
  constructor(private FplAxiosInstance = axiosInstance) {}

  public async getGeneralInformation(): Promise<any> {
    try {
      const response = await this.FplAxiosInstance.get("bootstrap-static/");
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        log.error(error.message);
      }      
      throw new Error("Failed to fetch data from the FPL API.");
    }
  }
}

export default FplApi;

import { log } from "next-axiom";
import axiosInstance from "./FplAxiosConfig";

class FplApi implements FplApiInterface {
  constructor(private FplAxiosInstance = axiosInstance) {}

  public async getGeneralInformation(): Promise<any> {
    try {
      const response = await fetch("http://localhost:3000/fpl", {
        next: { revalidate: 300 },
      });

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        log.error(error.message);
      }
      throw new Error("Failed to fetch data from the FPL API.");
    }
  }
}

export default FplApi;

import { log } from "next-axiom";

class FplApi implements FplApiInterface {
  public async getGeneralInformation(): Promise<any> {
    try {
      const response = await fetch("https://have-i-missed-the-deadline-ts.vercel.app/fpl", {
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

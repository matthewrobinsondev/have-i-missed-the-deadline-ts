import axios from "axios";

class FplApi implements FplApiInterface {
  public async getGeneralInformation(): Promise<any> {
    const response = await axios.get(
      "https://fantasy.premierleague.com/api/bootstrap-static/"
    );

    return await response.data;
  }
}

export default FplApi;

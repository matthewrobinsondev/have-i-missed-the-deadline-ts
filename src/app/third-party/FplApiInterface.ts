import { GeneralInformation } from "../types/fpl/GeneralInformation";

export interface FplApiInterface {
  getGeneralInformation(): Promise<GeneralInformation>;
}

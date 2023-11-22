import { log } from "next-axiom";
import { Event } from "../types/fpl/Events";
import { Player, PlayerTransferKey } from "../types/fpl/Players";

export class FplService {
  private fplApi: FplApiInterface;

  constructor(fplApi: FplApiInterface) {
    this.fplApi = fplApi;
  }

  async getDeadline() {
    try {
      const generalInformation = await this.fplApi.getGeneralInformation();

      const currentGameweek = generalInformation.events.find(
        (event: Event) => event.is_current,
      );
      const nextGameweek = generalInformation.events.find(
        (event: Event) => event.is_next,
      );

      return this.calculateDeadline(currentGameweek, nextGameweek);
    } catch (error) {
      if (error instanceof Error) {
        log.error(error.message);
      }

      return 0;
    }
  }

  async getTopTransferredIn() {
    return this.getTopTransferredPlayers("transfers_in_event");
  }

  async getTopTransferredOut() {
    return this.getTopTransferredPlayers("transfers_out_event");
  }

  private async getTopTransferredPlayers(event: PlayerTransferKey) {
    try {
      const generalInformation = await this.fplApi.getGeneralInformation();
      const players = generalInformation.elements;

      players.sort((a: Player, b: Player) => b[event] - a[event]);

      const topTransferredEvents = players
        .slice(0, 10)
        .map((player: Player) => player[event]);

      return players.filter((player: Player) =>
        topTransferredEvents.includes(player[event]),
      );
    } catch (error) {
      if (error instanceof Error) {
        log.error(error.message);
      }
    }
  }

  private calculateDeadline(
    currentGameweek: Event,
    nextGameweek: Event,
  ): number {
    return currentGameweek.finished
      ? Date.parse(nextGameweek.deadline_time)
      : Date.parse(currentGameweek.deadline_time);
  }
}

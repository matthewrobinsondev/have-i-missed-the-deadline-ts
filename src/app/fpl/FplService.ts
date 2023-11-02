interface Event {
  is_current: boolean;
  is_next: boolean;
  deadline_time: string;
  deadline_time_epoch: number;
  finished: boolean;
}

export class FplService {
  private fplApi: FplApiInterface;

  constructor(fplApi: FplApiInterface) {
    this.fplApi = fplApi;
  }

  async getDeadline() {
    const generalInformation = await this.fplApi.getGeneralInformation();

    const currentGameweek = generalInformation.events.find(
      (event: Event) => event.is_current
    );
    const nextGameweek = generalInformation.events.find(
      (event: Event) => event.is_next
    );

    return this.calculateDeadline(currentGameweek, nextGameweek);
  }

  private calculateDeadline(
    currentGameweek: Event,
    nextGameweek: Event
  ): number {
    return currentGameweek.finished
      ? nextGameweek.deadline_time_epoch
      : currentGameweek.deadline_time_epoch;
  }
}

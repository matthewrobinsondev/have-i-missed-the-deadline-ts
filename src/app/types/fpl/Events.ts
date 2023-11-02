export interface Event {
  is_current: boolean;
  is_next: boolean;
  deadline_time: string;
  deadline_time_epoch: number;
  finished: boolean;
}

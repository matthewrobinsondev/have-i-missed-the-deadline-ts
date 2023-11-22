export interface Player {
  id: number;
  first_name: string;
  second_name: string;
  team: number;
  transfers_in_event: number;
  transfers_out_event: number;
}

export type PlayerTransferKey = "transfers_out_event" | "transfers_in_event";

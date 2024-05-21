import type { PlayerColor } from "$lib/color";

export type PlayerStatus = "in" | "out";
export type Player = {
  name: string;
  color: PlayerColor;
  status: PlayerStatus;
  bought: number;
  cashed: number;
};

export type LogAction = "buyIn" | "cashOut";
export type LogEntry = { type: LogAction; playerId: number; amount: number };

export type Payout = { from: number; to: number; amount: number };

export type GameData = {
  defaultBuyIn: number;
  players: Player[];
  log: LogEntry[];
};

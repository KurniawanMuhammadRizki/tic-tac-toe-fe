export interface Game {
  gameId: string;
  board: string[][];
  currentPlayer: string;
  status: "PLAYING" | "WIN" | "DRAW";
  winner?: string;
}

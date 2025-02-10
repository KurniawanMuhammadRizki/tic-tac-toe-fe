import React from "react";
import { Game } from "@/types/game";

interface GameStatusProps {
  game: Game;
  playerSymbol: string;
}

const GameStatus: React.FC<GameStatusProps> = ({ game, playerSymbol }) => {
  const getStatusMessage = () => {
    if (game.status === "WIN") {
      return game.winner === playerSymbol ? "You won!" : "You lost!";
    }
    if (game.status === "DRAW") {
      return "It's a draw!";
    }
    return game.currentPlayer === playerSymbol
      ? "Your turn"
      : "Opponent's turn";
  };

  return (
    <div className="text-center my-4 text-xl font-semibold">
      <p>{getStatusMessage()}</p>
      <p className="text-sm mt-2">You are playing as {playerSymbol}</p>
    </div>
  );
};

export default GameStatus;

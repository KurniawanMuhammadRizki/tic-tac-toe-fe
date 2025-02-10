import React from "react";
import { Game } from "@/types/game";

interface GameBoardProps {
  game: Game;
  onCellClick: (row: number, col: number) => void;
  playerSymbol: string;
}

const GameBoard: React.FC<GameBoardProps> = ({
  game,
  onCellClick,
  playerSymbol,
}) => {
  const canPlay = (row: number, col: number) => {
    return game.status === "PLAYING" && !game.board[row][col];
  };

  const gridSize = game.board.length;

  return (
    <div className="grid gap-2 max-w-2xl mx-auto my-8">
      {game.board.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid gap-2`}
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}>
          {row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`aspect-square text-2xl font-bold border-2 rounded
                                ${
                                  canPlay(rowIndex, colIndex)
                                    ? "hover:bg-gray-100"
                                    : ""
                                }
                                ${
                                  cell === "X"
                                    ? "text-blue-600"
                                    : "text-red-600"
                                }`}
              onClick={() =>
                canPlay(rowIndex, colIndex) && onCellClick(rowIndex, colIndex)
              }
              disabled={!canPlay(rowIndex, colIndex)}>
              {cell}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;

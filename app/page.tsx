"use client";
import { useEffect, useState, useCallback } from "react";
import { Game } from "@/types/game";
import {
  connectWebSocket,
  disconnectWebSocket,
  sendMove,
} from "@/lib/webSocket";
import { Move } from "@/types/move";
import GameStatus from "./components/gameStatus";
import GameBoard from "./components/gameBoard";

export default function Home() {
  const [game, setGame] = useState<Game | null>(null);
  const [playerSymbol, setPlayerSymbol] = useState<string>("X");
  const [boardSize, setBoardSize] = useState<number>(3);
  const [winningCondition, setWinningCondition] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const boardSizeOptions = Array.from({ length: 8 }, (_, i) => i + 3);
  const winningConditionOptions = Array.from(
    { length: boardSize - 2 },
    (_, i) => i + 3
  );

  const resetGame = useCallback(async () => {
    setIsLoading(true);
    setGame(null);
    disconnectWebSocket();

    try {
      const response = await fetch(
        `https://tic-tac-toe-be-338908152060.asia-southeast2.run.app/api/v1/game/start?size=${boardSize}&winningCondition=${winningCondition}`,
        {
          method: "POST",
        }
      );
      const newGame = await response.json();
      setGame(newGame);
      setPlayerSymbol("X");

      connectWebSocket((gameState: Game) => {
        setGame(gameState);
        if (
          gameState.currentPlayer === "X" ||
          gameState.currentPlayer === "O"
        ) {
          setPlayerSymbol(gameState.currentPlayer);
        }
      });
    } catch (error) {
      console.error("Error creating game:", error);
    } finally {
      setIsLoading(false);
    }
  }, [boardSize, winningCondition]);

  useEffect(() => {
    resetGame();

    return () => {
      disconnectWebSocket();
    };
  }, [resetGame]);

  useEffect(() => {
    if (winningCondition > boardSize) {
      setWinningCondition(boardSize);
    }
  }, [boardSize, winningCondition]);

  const handleCellClick = (row: number, col: number) => {
    if (!game) return;

    const move: Move = {
      row,
      col,
      gameId: game.gameId,
      playerSymbol: game.currentPlayer,
    };

    sendMove(move);
  };

  const handleNewGame = () => {
    resetGame();
  };

  const handleBoardSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSize = parseInt(event.target.value);
    setBoardSize(newSize);
  };

  const handleWinningConditionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newCondition = parseInt(event.target.value);
    setWinningCondition(newCondition);
  };

  if (isLoading || !game) {
    return <div className="text-center mt-8">Loading</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Kuki Tic Tac Toe</h1>

      <div className="flex justify-center gap-4 mb-6">
        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Board Size:
          </label>
          <select
            value={boardSize}
            onChange={handleBoardSizeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            {boardSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}x{size}
              </option>
            ))}
          </select>
        </div>

        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Win:
          </label>
          <select
            value={winningCondition}
            onChange={handleWinningConditionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            {winningConditionOptions.map((condition) => (
              <option key={condition} value={condition}>
                {condition} in a row
              </option>
            ))}
          </select>
        </div>
      </div>

      <GameStatus game={game} playerSymbol={playerSymbol} />

      <GameBoard
        game={game}
        onCellClick={handleCellClick}
        playerSymbol={playerSymbol}
      />

      <div className="text-center mt-8">
        <button
          onClick={handleNewGame}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          New Game
        </button>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Game } from "@/types/game";
import { connectWebSocket, sendMove } from "@/lib/webSocket";
import { Move } from "@/types/move";
import GameStatus from "./components/gameStatus";
import GameBoard from "./components/gameBoard";

export default function Home() {
  const [game, setGame] = useState<Game | null>(null);
  const [playerSymbol, setPlayerSymbol] = useState<string>("X");
  const [boardSize, setBoardSize] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const boardSizes = [3, 5, 7, 9];

  useEffect(() => {
    const initializeGame = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://tic-tac-toe-be-338908152060.asia-southeast2.run.app/api/v1/game/start?size=${boardSize}`,
          {
            method: "POST",
          }
        );
        const newGame = await response.json();
        setGame(newGame);
      } catch (error) {
        console.error("Error creating game:", error);
      } finally {
        setIsLoading(false);
      }
    };

    connectWebSocket((gameState: Game) => {
      setGame(gameState);
      if (gameState.currentPlayer === "X" || gameState.currentPlayer === "O") {
        setPlayerSymbol(gameState.currentPlayer);
      }
    });

    initializeGame();
  }, [boardSize]);

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

  const handleNewGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://tic-tac-toe-be-338908152060.asia-southeast2.run.app/api/v1/game/start?size=${boardSize}`,
        {
          method: "POST",
        }
      );
      const newGame = await response.json();
      setGame(newGame);
      setPlayerSymbol("X");
    } catch (error) {
      console.error("Error creating new game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoardSizeChange = (size: number) => {
    setBoardSize(size);
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading game...</div>;
  }

  if (!game) {
    return <div className="text-center mt-8">Loading game...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Tic Tac Toe</h1>

      <div className="text-center mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Board Size:
        </label>
        <div className="flex justify-center gap-2 flex-wrap">
          {boardSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleBoardSizeChange(size)}
              className={`px-4 py-2 rounded ${
                boardSize === size
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}>
              {size}x{size}
            </button>
          ))}
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

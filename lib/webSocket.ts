import SockJS from "sockjs-client";
import { Client, Message } from "@stomp/stompjs";
import { Game } from "@/types/game";
import { Move } from "@/types/move";

let stompClient: Client | null = null;

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};

export const connectWebSocket = (
  onMessageReceived: (message: Game) => void
) => {
  disconnectWebSocket();

  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS(
        "https://tic-tac-toe-be-338908152060.asia-southeast2.run.app/ws"
      ),
    onConnect: () => {
      console.log("Connected to WebSocket");
      stompClient?.subscribe("/topic/game", (message: Message) => {
        const gameState: Game = JSON.parse(message.body);
        onMessageReceived(gameState);
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from WebSocket");
    },
  });

  stompClient.activate();
  return stompClient;
};

export const sendMove = (move: Move) => {
  if (stompClient?.connected) {
    stompClient.publish({
      destination: "/app/move",
      body: JSON.stringify(move),
    });
  }
};

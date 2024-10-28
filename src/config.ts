import WebSocket, { WebSocketServer } from 'ws';

export function setupWebSocketServer(port: number): WebSocketServer {
    return new WebSocketServer({ port });
}
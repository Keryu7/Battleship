import { WebSocketServer } from 'ws';

export const setupWebSocketServer = (port: number): WebSocketServer => {
    return new WebSocketServer({ port });
}
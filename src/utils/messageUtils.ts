import WebSocket from 'ws';

export const sendErrorMessage = (ws: WebSocket, message: string) => {
    ws.send(JSON.stringify({
        type: 'reg',
        data: JSON.stringify({ error: true, errorText: message }),
    }));
}
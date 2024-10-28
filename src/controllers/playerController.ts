import { Player } from '../interfaces';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { sendErrorMessage } from '../utils/messageUtils';

const players: Player[] = [];
const wsToPlayerId = new Map<WebSocket, string>();

export function handlePlayerRegistration(ws: WebSocket, data: { name: string; password: string }) {
    const { name, password } = data;

    const existingPlayer = players.find(player => player.name === name);
    if (existingPlayer) {
        sendErrorMessage(ws, 'Player already exists');
        return;
    }

    const newPlayer: Player = { id: uuidv4(), name, password };
    players.push(newPlayer);
    wsToPlayerId.set(ws, newPlayer.id);

    ws.send(JSON.stringify({
        type: 'reg',
        data: JSON.stringify({ name, index: newPlayer.id, error: false, errorText: '' }),
    }));
}

export function getPlayerIdBySocket(ws: WebSocket): string | undefined {
    return wsToPlayerId.get(ws);
}
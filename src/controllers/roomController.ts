import {Player, Room} from '../interfaces';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { sendErrorMessage } from '../utils/messageUtils';

const rooms: Room[] = [];
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
export function handleCreateRoom(ws: WebSocket) {
    const roomId = uuidv4();
    const newRoom: Room = { id: roomId, players: [] };
    rooms.push(newRoom);

    ws.send(JSON.stringify({
        type: 'update_room',
        data: JSON.stringify(rooms.map(room => ({
            roomId: room.id,
            roomUsers: room.players.map(player => ({ name: player.name, index: player.id }))
        }))),
    }));
}

export function handleAddUserToRoom(ws: WebSocket, data: { indexRoom: string }) {
    const room = rooms.find(room => room.id === data.indexRoom);

    if (!room || room.players.length >= 2) {
        ws.send(JSON.stringify({
            error: true,
            errorText: 'Room not found or already full',
        }));
        return;
    }

    const playerId = wsToPlayerId.get(ws);
    if (!playerId) {
        ws.send(JSON.stringify({
            error: true,
            errorText: 'Player not found',
        }));
        return;
    }

    const player = players.find(p => p.id === playerId);
    if (!player) {
        ws.send(JSON.stringify({
            error: true,
            errorText: 'Player not found',
        }));
        return;
    }

    room.players.push(player);

    ws.send(JSON.stringify({
        type: 'create_game',
        data: JSON.stringify({ idGame: room.id, idPlayer: player.id }),
    }));
}
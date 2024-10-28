import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const wss = new WebSocketServer({ port: Number(PORT) });

interface Player {
    id: string;
    name: string;
    password: string;
}

interface Room {
    id: string;
    players: Player[];
}

const players: Player[] = [];
const rooms: Room[] = [];

const wsToPlayerId = new Map<WebSocket, string>();

wss.on('connection', (ws: WebSocket) => {
    console.log('New player connected');

    ws.on('message', (message: string) => {
        try {
            const parsedMessage = JSON.parse(message);
            console.log('Received message:', parsedMessage);

            switch (parsedMessage.type) {
                case 'reg':
                    handlePlayerRegistration(ws, JSON.parse(parsedMessage.data));
                    break;
                case 'create_room':
                    handleCreateRoom(ws);
                    break;
                case 'add_user_to_room':
                    handleAddUserToRoom(ws, JSON.parse(parsedMessage.data));
                    break;
                default:
                    ws.send(JSON.stringify({ error: 'Unknown command' }));
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
    });

    ws.on('close', () => {
        console.log('Player disconnected');
        wsToPlayerId.delete(ws);
    });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

function handlePlayerRegistration(ws: WebSocket, data: { name: string; password: string }) {
    const { name, password } = data;

    const existingPlayer = players.find(player => player.name === name);
    if (existingPlayer) {
        ws.send(JSON.stringify({
            type: 'reg',
            data: { name, index: existingPlayer.id, error: true, errorText: 'Player already exists' },
        }));
        return;
    }

    const newPlayer: Player = { id: uuidv4(), name, password };
    players.push(newPlayer);
    wsToPlayerId.set(ws, newPlayer.id);

    console.log('Registered players:', players);
    ws.send(JSON.stringify({
        type: 'reg',
        data: JSON.stringify({ name, index: newPlayer.id, error: false, errorText: '' }),
    }));
}

function handleCreateRoom(ws: WebSocket) {
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

function handleAddUserToRoom(ws: WebSocket, data: { indexRoom: string }) {
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
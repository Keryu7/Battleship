import WebSocket from 'ws';
import dotenv from 'dotenv';
import { setupWebSocketServer } from './config';
import { handlePlayerRegistration } from './controllers/playerController';
import { handleCreateRoom, handleAddUserToRoom } from './controllers/roomController';
import { handleStartGame, handlePlaceShip, handleAttack } from './controllers/gameController';

dotenv.config();

const PORT = process.env.PORT || 3000;
const wss = setupWebSocketServer(Number(PORT));

wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: string) => {
        try {
            const parsedMessage = JSON.parse(message);

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
                case 'start_game':
                    handleStartGame(ws, parsedMessage.roomId);
                    break;
                case 'place_ship':
                    handlePlaceShip(ws, parsedMessage.roomId, parsedMessage.ship);
                    break;
                case 'attack':
                    handleAttack(ws, parsedMessage.roomId, parsedMessage.target);
                    break;
                default:
                    ws.send(JSON.stringify({ error: 'Unknown command' }));
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
    });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
import {GameBoard, AttackResult, Ship} from '../interfaces';
import { createEmptyBoard, placeShipOnBoard, processAttack } from '../utils/boardUtils';
import WebSocket from 'ws';
import { sendErrorMessage } from '../utils/messageUtils';

export const games: { [roomId: string]: GameBoard } = {};

export function handleStartGame(ws: WebSocket, roomId: string) {
    console.log('VALUE_0', games)

    const board = createEmptyBoard(10);
    games[roomId] = board;

    ws.send(JSON.stringify({
        type: 'game_started',
        data: { roomId, message: 'Game has started!' },
    }));
}

export function handlePlaceShip(ws: WebSocket, roomId: string, ship: Ship[]) {
    games[roomId] = createEmptyBoard(10);
    const game = games[roomId];
    console.log('VALUE_GAME', ship)
    if (!game) {
        sendErrorMessage(ws, 'Game not found');
        return;
    }

    /*const placementSuccess = */
    ship.forEach((ship) => {
        placeShipOnBoard(game, ship);
    })
    ws.send(JSON.stringify({
        type: 'ship_placed',
        data: { message: 'Ship placed successfully' },
    }));
}

export function handleAttack(ws: WebSocket, roomId: string, target: { x: number; y: number }) {
    const game = games[roomId];
    if (!game) {
        sendErrorMessage(ws, 'Game not found');
        return;
    }

    const result: AttackResult = processAttack(game, target);
    ws.send(JSON.stringify({
        type: 'attack_result',
        data: result,
    }));
}
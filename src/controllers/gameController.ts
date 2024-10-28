import {AttackResult, GameBoard, Ship} from '../interfaces';
import {createEmptyBoard, placeShipOnBoard, processAttack} from '../utils/boardUtils';
import WebSocket from 'ws';
import {sendErrorMessage} from '../utils/messageUtils';

export const games: { [roomId: string]: GameBoard } = {};

export const handleStartGame = (ws: WebSocket, roomId: string) =>  {
    games[roomId] = createEmptyBoard(10);

    ws.send(JSON.stringify({
        type: 'game_started',
        data: { roomId, message: 'Game has started!' },
    }));
}

export const handlePlaceShip = (ws: WebSocket, roomId: string, ship: Ship[]) => {
    games[roomId] = createEmptyBoard(10);
    const game = games[roomId];
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

export const handleAttack = (ws: WebSocket, roomId: string, target: { x: number; y: number }) => {
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
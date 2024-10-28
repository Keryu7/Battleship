import { GameBoard, Ship, AttackResult } from '../interfaces';

export const createEmptyBoard = (size: number): GameBoard => {
    return {
        grid: Array.from({ length: size }, () => Array(size).fill(0)),
        ships: []
    };
}

export const placeShipOnBoard = (board: GameBoard, ship: Ship): boolean => {
    const { length, direction } = ship;
    const { x, y } = ship.position;
    const grid = board.grid;

    if (direction && x + length > grid.length) return false;
    if (!direction && y + length > grid[0].length) return false;

    for (let i = 0; i < length; i++) {
        const xPos = direction ? x + i : x;
        const yPos = direction ? y : y + i;

        if (grid[yPos][xPos] !== 0) return false;
    }

    const newShip: Ship = { position: { x, y }, direction, length, hits: 0 };
    for (let i = 0; i < length; i++) {
        const xPos = direction ? x + i : x;
        const yPos = direction ? y : y + i;
        grid[yPos][xPos] = 1;
    }
    board.ships.push(newShip);
    return true;
}

export const processAttack = (board: GameBoard, target: { x: number; y: number }): AttackResult => {
    const { x, y } = target;
    const grid = board.grid;

    if (grid[y][x] === 1) {
        grid[y][x] = 2;
        const hitShip = board.ships.find(ship =>
            ship.direction
                ? ship.position.y === y && x >= ship.position.x && x < ship.position.x + ship.length
                : ship.position.x === x && y >= ship.position.y && y < ship.position.y + ship.length
        );

        if (hitShip) {
            hitShip.hits++;
            const shipSunk = hitShip.hits === hitShip.length;
            return { hit: true, shipSunk };
        }
        return { hit: true };
    }
    return { hit: false };
}
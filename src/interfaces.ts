export interface Player {
    id: string;
    name: string;
    password: string;
}

export interface Room {
    id: string;
    players: Player[];
    gameBoard?: GameBoard;
}

export interface Ship {
    position: { x: number; y: number };
    direction: boolean;
    length: number;
    hits: number;
}

export interface GameBoard {
    grid: number[][];
    ships: Ship[];
}

export interface AttackResult {
    hit: boolean;
    shipSunk?: boolean;
}
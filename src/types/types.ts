import type { Pawn } from "../enums/enums";

export interface AbstractCell {
    id?: number;
    posX: number;
    posY: number;
    walls: boolean[],
    entrance?: boolean;
    exit?: boolean;
    trap?: boolean;
}

export interface MazeCell extends AbstractCell {
    visited?: boolean;
    previous?: MazeCell;
    score?: number;
}

export interface ChecksCell extends AbstractCell {
    hasPawn?: Pawn;
}
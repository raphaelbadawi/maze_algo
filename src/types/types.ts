import type { PawnColor } from "../enums/enums";

// because a cell can contain itself, it may be used as a path on simple structures
export interface AbstractCell {
    id?: number;
    posX: number;
    posY: number;
    start?: boolean;
    end?: boolean;
    treated?: boolean;
    previous?: AbstractCell;
    score?: number;
}

export interface MazeCell extends AbstractCell {
    walls: boolean[],
    trap?: boolean;
}

export interface ChecksCell extends AbstractCell {
    color: PawnColor;
    hasPawn?: PawnColor;
}
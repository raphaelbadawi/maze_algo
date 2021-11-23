export type Cell = {
    id?: number;
    posX: number;
    posY: number;
    entrance?: boolean;
    exit?: boolean;
    walls: boolean[],
    visited?: boolean;
    previous?: Cell;
}
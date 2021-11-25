export interface AbstractCell {
    id?: number;
    posX: number;
    posY: number;
    walls: boolean[],
    entrance?: boolean;
    exit?: boolean;
    trap?: boolean;
}

export interface CalculableCell extends AbstractCell {
    visited?: boolean;
    previous?: CalculableCell;
    score?: number;
}
import type { AbstractCell } from "../../types/types";

export abstract class Renderer {
    map: AbstractCell[];
    canvas: HTMLDivElement;

    constructor(map: AbstractCell[]) {
        this.map = map;
        const { colsCount, rowsCount } = this.getCanvasDimensions();
        this.canvas = this.renderCanvas(colsCount, rowsCount);
    }

    private getCanvasDimensions(): { colsCount: number, rowsCount: number } {
        const colsCount: number = Math.max(...this.map.map((cell) => cell.posX)) + 1;
        const rowsCount: number = Math.max(...this.map.map((cell) => cell.posY)) + 1;
        return { colsCount, rowsCount };
    }

    private renderCanvas(colsCount: number, rowsCount: number): HTMLDivElement {
        const canvas: HTMLDivElement = document.createElement("div");
        canvas.classList.add("canvas");
        canvas.style.gridTemplateColumns = `repeat(${colsCount.toString()}, 1fr)`;
        canvas.style.gridTemplateRows = `repeat(${rowsCount.toString()}, 1fr)`;
        return canvas;
    }

    renderCell(cell: AbstractCell): HTMLDivElement {
        const { posX, posY } = cell;
        let cellElement: HTMLDivElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.style.gridRow = (posX + 1).toString();
        cellElement.style.gridColumn = (posY + 1).toString();
        cellElement.id = `cell-${cell.id}`;
        return cellElement;
    }

    pinCells(path: AbstractCell) {
        while (path?.previous) {
            this.pinCell(path);
            path = path.previous;
        }
    }

    pinCell(cell: AbstractCell) {
        const cellElement = document.querySelector(`#cell-${cell.id}`) as HTMLDivElement;
        cellElement.style.backgroundImage = "radial-gradient(closest-side at 50%, darkgrey, transparent)";
    }

    clearCell(cell: AbstractCell) {
        const cellElement = document.querySelector(`#cell-${cell.id}`) as HTMLDivElement;
        cellElement.style.backgroundImage = "";
    }
}
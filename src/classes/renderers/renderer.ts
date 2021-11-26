import type { AbstractCell } from "../../types/types";

export abstract class Renderer {
    map: AbstractCell[];
    canvas: HTMLDivElement;

    constructor(map: AbstractCell[]) {
        this.map = map;
        const { colsCount, rowsCount } = this.getCanvasDimensions();
        this.canvas = this.renderCanvas(colsCount, rowsCount);
    }

    private getCanvasDimensions() {
        const colsCount: number = Math.max(...this.map.map((cell) => cell.posX)) + 1;
        const rowsCount: number = Math.max(...this.map.map((cell) => cell.posY)) + 1;
        return { colsCount, rowsCount };
    }

    private renderCanvas(colsCount: number, rowsCount: number) {
        const canvas: HTMLDivElement = document.createElement("div");
        canvas.classList.add("canvas");
        canvas.style.gridTemplateColumns = `repeat(${colsCount.toString()}, 1fr)`;
        canvas.style.gridTemplateRows = `repeat(${rowsCount.toString()}, 1fr)`;
        return canvas;
    }
}
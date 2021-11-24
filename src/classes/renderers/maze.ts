import type { Cell } from "../../types/types";

export class MazeRenderer {
  map: Cell[];
  canvas: HTMLDivElement;
  constructor(map: Cell[]) {
    this.map = map;
    const { colsCount, rowsCount } = this.getCanvasDimensions();
    this.canvas = this.renderCanvas(colsCount, rowsCount);
  }

  getCanvasDimensions() {
    const colsCount: number = Math.max(...this.map.map((cell) => cell.posX)) + 1;
    const rowsCount: number = Math.max(...this.map.map((cell) => cell.posY)) + 1;
    return { colsCount, rowsCount };
  }

  renderCanvas(colsCount: number, rowsCount: number) {
    const canvas: HTMLDivElement = document.createElement("div");
    canvas.classList.add("canvas");
    canvas.style.gridTemplateColumns = `repeat(${colsCount.toString()}, 1fr)`;
    canvas.style.gridTemplateRows = `repeat(${rowsCount.toString()}, 1fr)`;
    return canvas;
  }

  renderWalls(cellElement: HTMLDivElement, walls: boolean[]) {
    const [top, right, bottom, left] = walls;
    if (top) cellElement.classList.add("top");
    if (right) cellElement.classList.add("right");
    if (bottom) cellElement.classList.add("bottom");
    if (left) cellElement.classList.add("left");
    return cellElement;
  }

  renderCell(cell: Cell) {
    const { posX, posY, walls } = cell;
    let cellElement: HTMLDivElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.style.gridRow = (posX + 1).toString();
    cellElement.style.gridColumn = (posY + 1).toString();
    cellElement.id = `cell-${cell.id}`;
    cellElement = this.renderWalls(cellElement, walls);
    if (cell.entrance) cellElement.classList.add("entrance");
    if (cell.exit) cellElement.classList.add("exit");
    this.canvas.appendChild(cellElement);
  }

  pinCells(path: Cell) {
    while (path.previous) {
      this.pinCell(path);
      path = path.previous;
    }
  }

  pinCell(cell: Cell) {
    if (cell.entrance || cell.exit) return;
    const cellElement = document.querySelector(`#cell-${cell.id}`) as HTMLDivElement;
    cellElement.style.backgroundImage = "radial-gradient(closest-side at 50%, darkgrey, transparent)";
  }

  clearBoard() {
    for (const cell of this.map) {
      if (cell.entrance || cell.exit) continue;
      const cellElement = document.querySelector(`#cell-${cell.id}`) as HTMLDivElement;
      cellElement.style.backgroundImage = "";
    }
  }
}
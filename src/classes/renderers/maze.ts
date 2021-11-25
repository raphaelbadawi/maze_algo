import type { CalculableCell } from "../../types/types";

export class MazeRenderer {
  map: CalculableCell[];
  canvas: HTMLDivElement;

  constructor(map: CalculableCell[]) {
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

  private renderWalls(cellElement: HTMLDivElement, walls: boolean[]) {
    const [top, right, bottom, left] = walls;
    if (top) cellElement.classList.add("top");
    if (right) cellElement.classList.add("right");
    if (bottom) cellElement.classList.add("bottom");
    if (left) cellElement.classList.add("left");
    return cellElement;
  }

  renderCell(cell: CalculableCell) {
    const { posX, posY, walls } = cell;
    let cellElement: HTMLDivElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.style.gridRow = (posX + 1).toString();
    cellElement.style.gridColumn = (posY + 1).toString();
    cellElement.id = `cell-${cell.id}`;
    cellElement = this.renderWalls(cellElement, walls);
    if (cell.entrance) cellElement.classList.add("entrance");
    if (cell.exit) cellElement.classList.add("exit");
    if (cell.trap) cellElement.classList.add("trap");
    this.canvas.appendChild(cellElement);
  }

  pinCells(path: CalculableCell) {
    if (!path) return false;
    while (path.previous) {
      this.pinCell(path);
      path = path.previous;
    }
  }

  pinCell(cell: CalculableCell) {
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

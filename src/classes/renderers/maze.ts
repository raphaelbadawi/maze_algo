import type { MazeCell } from "../../types/types";
import { Renderer } from "./renderer";

export class MazeRenderer extends Renderer {
  map: MazeCell[];
  canvas: HTMLDivElement;

  constructor(map: MazeCell[]) {
    super (map);
  }

  private renderWalls(cellElement: HTMLDivElement, walls: boolean[]) {
    const [top, right, bottom, left] = walls;
    if (top) cellElement.classList.add("top");
    if (right) cellElement.classList.add("right");
    if (bottom) cellElement.classList.add("bottom");
    if (left) cellElement.classList.add("left");
    return cellElement;
  }

  renderCell(cell: MazeCell) {
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

  pinCells(path: MazeCell) {
    if (!path) return false;
    while (path.previous) {
      this.pinCell(path);
      path = path.previous;
    }
  }

  pinCell(cell: MazeCell) {
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

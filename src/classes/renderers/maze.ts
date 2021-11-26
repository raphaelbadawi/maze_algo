import type { MazeCell } from "../../types/types";
import { Renderer } from "./renderer";

export class MazeRenderer extends Renderer {
  map: MazeCell[];
  canvas: HTMLDivElement;

  constructor(map: MazeCell[]) {
    super(map);
  }

  private renderWalls(cellElement: HTMLDivElement, walls: boolean[]) {
    const [top, right, bottom, left] = walls;
    if (top) cellElement.classList.add("top");
    if (right) cellElement.classList.add("right");
    if (bottom) cellElement.classList.add("bottom");
    if (left) cellElement.classList.add("left");
    return cellElement;
  }

  override renderCell(cell: MazeCell): HTMLDivElement {
    let cellElement: HTMLDivElement = super.renderCell(cell);
    const { walls } = cell;
    cellElement = this.renderWalls(cellElement, walls);
    if (cell.start) cellElement.classList.add("start");
    if (cell.end) cellElement.classList.add("end");
    if (cell.trap) cellElement.classList.add("trap");
    this.canvas.appendChild(cellElement);
    return cellElement;
  }

  override pinCell(cell: MazeCell) {
    if (cell.start || cell.end) return;
    super.pinCell(cell);
  }

  clearBoard() {
    for (const cell of this.map) {
      if (cell.start || cell.end) continue;
      super.clearCell(cell);
    }
  }
}
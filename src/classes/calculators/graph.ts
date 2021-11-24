import { Algos } from "../../enums/enums";
import type { Cell } from "../../types/types";
import type { MazeRenderer } from "../renderers/maze";

export class MazeGraph {
  map: Cell[];
  board: MazeRenderer;
  algoToHandler = { [Algos.DFS]: "calcDFSSolution", [Algos.BFS]: "calcBFSSolution", [Algos.ASTAR]: "calcAStarSolution" };
  startPoint: Cell;
  endPoint: Cell;
  maxHeuristic: number;

  constructor(map: Cell[], board: MazeRenderer) {
    this.map = map;
    this.board = board;
  }

  seed(algo: Algos) {
    this.startPoint = this.map.find((cell) => cell.entrance);
    this.endPoint = this.map.find((cell) => cell.exit);
    const path = this[this.algoToHandler[algo]]();
    this.board.pinCells(path);
  }

  /** Get available moves from current instance of the map */
  private getAvailableMoves(startPoint: Cell) {
    const {
      posX: currentPosX,
      posY: currentPosY,
      walls: currentWalls,
    } = startPoint;
    return this.map.filter((cell) => {
      if (cell.visited) return false;
      if (
        (!currentWalls[0] &&
          cell.posX == currentPosX - 1 &&
          cell.posY == currentPosY) ||
        (!currentWalls[1] &&
          cell.posY == currentPosY + 1 &&
          cell.posX == currentPosX) ||
        (!currentWalls[2] &&
          cell.posX == currentPosX + 1 &&
          cell.posY == currentPosY) ||
        (!currentWalls[3] &&
          cell.posY == currentPosY - 1 &&
          cell.posX == currentPosX)
      )
        return cell;
    });
  }

  private calcDFSSolution(currentPoint: Cell = this.startPoint) {
    if (currentPoint.visited) return false;
    this.map[currentPoint.id].visited = true;
    if (currentPoint.exit) return currentPoint;
    const availableMoves = this.getAvailableMoves(currentPoint);
    for (const availableMove of availableMoves) {
      availableMove.previous = currentPoint;
      const path = this.calcDFSSolution(availableMove);
      if (path.exit) return path;
    }
    return false;
  }

  private calcBFSSolution() {
    let queue = [this.startPoint];
    while (queue.length > 0) {
      const currentPoint = queue.shift();
      this.map[currentPoint.id].visited = true;
      if (currentPoint.exit) return currentPoint;
      const availableMoves = this.getAvailableMoves(currentPoint);
      for (const availableMove of availableMoves) {
        if (availableMove.visited) continue;
        availableMove.previous = currentPoint;
        queue.push(availableMove);
      }
    }
    return false;
  }

  private calcHeuristic(referencePoint: Cell) {
    const { posX: endPosX, posY: endPosY } = this.endPoint;
    const { posX: refPosX, posY: refPosY } = referencePoint;
    return Math.abs(endPosX - refPosX) + Math.abs(endPosY - refPosY);
  }

  private calcPathCost(referencePath: Cell) {
    let pathCost = 0;
    while (referencePath.previous) {
      pathCost ++;
      referencePath = referencePath.previous;
    }
    return pathCost;
  }

  private calcAStarSolution() {
    this.startPoint.score = this.calcHeuristic(this.startPoint);
    let queue: Cell[] = [this.startPoint];
    while (queue.length > 0) {
      const currentPoint: Cell = queue.length == 1 ? queue[0] : queue.reduce((p, c) => p.score < c.score ? p : c);
      queue = queue.filter((cell) => cell !== currentPoint);
      this.map[currentPoint.id].visited = true;
      if (currentPoint.exit) return currentPoint;
      const availableMoves = this.getAvailableMoves(currentPoint);
      for (const availableMove of availableMoves) {
        if (availableMove.visited) continue;
        availableMove.previous = currentPoint;
        const cost: number = this.calcPathCost(availableMove);
        const heuristic: number = this.calcHeuristic(availableMove);
        availableMove.score = cost + heuristic;
        if (queue.find(cell => cell.id == availableMove.id && cell.score < availableMove.score)) continue;
        queue.push(availableMove);
      }
    }
  }

  clearMap() {
    this.map.forEach((cell) => {
      cell.visited = false;
      cell.previous = null;
    });
  }
}

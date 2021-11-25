import { Algos } from "../../enums/enums";
import type { CalculableCell } from "../../types/types";
import { MazeHelper } from "../helpers/maze";
import type { MazeRenderer } from "../renderers/maze";

export class MazeGraph {
  map: CalculableCell[];
  board: MazeRenderer;
  algoToHandler = { [Algos.DFS]: "calcDFSSolution", [Algos.BFS]: "calcBFSSolution", [Algos.ASTAR]: "calcAStarSolution" };
  startPoint: CalculableCell;
  endPoint: CalculableCell;
  maxHeuristic: number;

  constructor(map: CalculableCell[], board: MazeRenderer) {
    this.map = map;
    this.board = board;
  }

  calc(algo: Algos) {
    this.startPoint = this.map.find((cell) => cell.entrance);
    this.endPoint = this.map.find((cell) => cell.exit);
    return this[this.algoToHandler[algo]]();
  }

  private calcDFSSolution(currentPoint: CalculableCell = this.startPoint) {
    if (currentPoint.visited) return false;
    this.map[currentPoint.id].visited = true;
    if (currentPoint.exit) return currentPoint;
    const availableMoves = MazeHelper.getAvailableMoves(this.map, currentPoint);
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
      const availableMoves = MazeHelper.getAvailableMoves(this.map, currentPoint);
      for (const availableMove of availableMoves) {
        if (availableMove.visited) continue;
        availableMove.previous = currentPoint;
        queue.push(availableMove);
      }
    }
    return false;
  }

  private calcHeuristic(referencePoint: CalculableCell) {
    const { posX: endPosX, posY: endPosY } = this.endPoint;
    const { posX: refPosX, posY: refPosY } = referencePoint;
    return Math.abs(endPosX - refPosX) + Math.abs(endPosY - refPosY);
  }

  private calcPathCost(referencePath: CalculableCell) {
    let pathCost = 0;
    while (referencePath.previous) {
      pathCost ++;
      referencePath = referencePath.previous;
    }
    return pathCost;
  }

  private calcAStarSolution() {
    this.startPoint.score = this.calcHeuristic(this.startPoint);
    let queue: CalculableCell[] = [this.startPoint];
    while (queue.length > 0) {
      const currentPoint: CalculableCell = queue.length == 1 ? queue[0] : queue.reduce((p, c) => p.score < c.score ? p : c);
      queue = queue.filter((cell) => cell !== currentPoint);
      this.map[currentPoint.id].visited = true;
      if (currentPoint.exit) return currentPoint;
      const availableMoves = MazeHelper.getAvailableMoves(this.map, currentPoint);
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
}

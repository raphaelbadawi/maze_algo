import { Algos } from "../../enums/enums";
import type { Cell } from "../../types/types";
import type { MazeRenderer } from "../renderers/maze";

export class MazeGraph {
  map: Cell[];
  board: MazeRenderer;
  algoToHandler = { [Algos.DFS]: "calcDFSSolution", [Algos.BFS]: "calcBFSSolution", [Algos.ASTAR]: "calcAStarSolution" };
  constructor(map: Cell[], board: MazeRenderer) {
    this.map = map;
    this.board = board;
  }

  seed(algo: Algos) {
    const startPoint = this.map.find((cell) => cell.entrance);
    const path = this[this.algoToHandler[algo]](startPoint);
    this.board.pinCells(path);
  }

  /** Get available moves from current instance of the map */
  getAvailableMoves(startPoint: Cell) {
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

  calcDFSSolution(startPoint: Cell) {
    let stack = [startPoint];
    while (stack.length > 0) {
      const currentPoint = stack.pop();
      this.map[currentPoint.id].visited = true;
      if (currentPoint.exit) return currentPoint;
      const availableMoves = this.getAvailableMoves(currentPoint);
      for (const availableMove of availableMoves) {
        if (!availableMove.visited) {
          availableMove.previous = currentPoint;
          stack.push(availableMove);
        }
      }
    }
    return false;
  }

  calcBFSSolution(startPoint: Cell) {
    let queue = [startPoint];
    while (queue.length > 0) {
      const currentPoint = queue.shift();
      this.map[currentPoint.id].visited = true;
      if (currentPoint.exit) return currentPoint;
      const availableMoves = this.getAvailableMoves(currentPoint);
      for (const availableMove of availableMoves) {
        if (!availableMove.visited) {
          availableMove.previous = currentPoint;
          queue.push(availableMove);
        }
      }
    }
    return false;
  }

  clearMap() {
    this.map.forEach((cell) => {
      cell.visited = false;
      cell.previous = null;
    });
  }
}

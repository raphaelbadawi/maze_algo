import type { MazeCell } from "../../types/types";

export class MazeHelper {
    /** Get available moves from an instance of the map */
    static getAvailableMoves(map: MazeCell[], startPoint: MazeCell, ignoreWalls: boolean = false): MazeCell[] {
      const {
        posX: currentPosX,
        posY: currentPosY,
        walls: currentWalls,
      } = startPoint;
      return map.filter((cell) => {
        if (cell.visited) return false;
        if (
          ((ignoreWalls ? true : !currentWalls[0]) &&
            cell.posX == currentPosX - 1 &&
            cell.posY == currentPosY) ||
          ((ignoreWalls ? true : !currentWalls[1]) &&
            cell.posY == currentPosY + 1 &&
            cell.posX == currentPosX) ||
          ((ignoreWalls ? true : !currentWalls[2]) &&
            cell.posX == currentPosX + 1 &&
            cell.posY == currentPosY) ||
          ((ignoreWalls ? true : !currentWalls[3]) &&
            cell.posY == currentPosY - 1 &&
            cell.posX == currentPosX)
        )
          return cell;
      });
    }

    static clearMap(map: MazeCell[]): MazeCell[] {
        map.forEach(cell => {
            cell.visited = false;
            cell.previous = null;
            cell.score = null;
        });
        return map;
    }
}
import type { MazeCell } from "../../types/types";
import { Helper } from "./helper";

export class MazeHelper extends Helper {
    /** Get available moves from an instance of the maze map */
    override getAvailableMoves(map: MazeCell[], startPoint: MazeCell, builderMode: boolean = false): MazeCell[] {
        let availableMoves = super.getAvailableMoves(map, startPoint) as MazeCell[];
        if (builderMode) return availableMoves;
        return availableMoves.filter(cell => {
            if (cell.trap) return false;
            if (
                (cell.posX == startPoint.posX - 1 && !startPoint.walls[0])
                || (cell.posY == startPoint.posY + 1 && !startPoint.walls[1])
                || (cell.posX == startPoint.posX + 1 && !startPoint.walls[2])
                || (cell.posY == startPoint.posY - 1 && !startPoint.walls[3])
            ) {
                return cell;
            }
            return false;
        });
    }
}
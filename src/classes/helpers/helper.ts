import type { AbstractCell } from "../../types/types";

export abstract class Helper {
    static clearMap(map: AbstractCell[]): AbstractCell[] {
        map.forEach(cell => {
            cell.treated = false;
            cell.previous = null;
            cell.score = null;
        });
        return map;
    }

    getAvailableMoves(map: AbstractCell[], startPoint: AbstractCell): AbstractCell[] {
        const {
            posX: currentPosX,
            posY: currentPosY,
        } = startPoint;
        return map.filter((cell) => {
            if (cell.treated) return false;
            if (
                (cell.posX == currentPosX - 1 && cell.posY == currentPosY)
                || (cell.posY == currentPosY + 1 && cell.posX == currentPosX)
                || (cell.posX == currentPosX + 1 && cell.posY == currentPosY)
                || (cell.posY == currentPosY - 1 && cell.posX == currentPosX)
            ) {
                return cell;
            }
        });
    }
}
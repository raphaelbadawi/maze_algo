import type { ChecksCell } from "../../types/types";
import { Helper } from "./helper";

export class ChecksHelper extends Helper {
    private traverseDiagonal(map: ChecksCell[], cell: ChecksCell, deltaX: number, deltaY: number): ChecksCell {
        let originalCell: ChecksCell = cell;
        while (!cell.hasPawn) {
            cell = map.find(({ posX, posY }) => posX === cell.posX + deltaX && posY === cell.posY + deltaY);
            if (!cell) return originalCell;
        }
        cell = map.find(({ posX, posY }) => posX === cell.posX + deltaX && posY === cell.posY + deltaY);
        if (!cell || cell.hasPawn) return originalCell;
        return cell;
    }

    /** Get available moves from an instance of the checks map */
    override getAvailableMoves(map: ChecksCell[], startPoint: ChecksCell): ChecksCell[] {
        const {
            posX: currentPosX,
            posY: currentPosY,
        } = startPoint;
        map = map.filter((cell) => {
            if (
                (cell.posX == currentPosX - 1 && cell.posY == currentPosY - 1)
                || (cell.posX == currentPosX - 1 && cell.posY == currentPosY + 1)
                || (cell.posX == currentPosX + 1 && cell.posY == currentPosY - 1)
                || (cell.posX == currentPosX + 1 && cell.posY == currentPosY + 1)
            ) {
                if (cell.hasPawn) return false;
                const deltaX = Math.sign(cell.posX - currentPosX);
                const deltaY = Math.sign(cell.posY - currentPosY);
                return this.traverseDiagonal(map, cell, deltaX, deltaY);
            }
        });
        return map;
    }
}
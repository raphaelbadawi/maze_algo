import { PawnColor } from "../../enums/enums";
import type { ChecksCell } from "../../types/types";
import { Renderer } from "./renderer";

export class ChecksRenderer extends Renderer {
    playerColor: PawnColor;

    constructor(map: ChecksCell[], playerColor: PawnColor) {
        super(map);
        this.playerColor = playerColor;
    }

    handlePlayerDrag = (event: DragEvent) => {
        
    };

    addPawn(cellElement: HTMLDivElement, color: PawnColor): HTMLDivElement {
        const pawnElement = document.createElement("div");
        pawnElement.classList.add("pawn", color);
        if (color === this.playerColor) {
            pawnElement.classList.add("cursor-pointer");
            pawnElement.setAttribute("draggable", "true");
            pawnElement.addEventListener("drag", this.handlePlayerDrag);
        }
        return pawnElement;
    }

    override renderCell(cell: ChecksCell): HTMLDivElement {
        let cellElement: HTMLDivElement = super.renderCell(cell);
        const { color } = cell;
        if (cell.color == PawnColor.WHITE) cellElement.classList.add("white");
        if (cell.color == PawnColor.BLACK) cellElement.classList.add("black");
        if (cell.hasPawn) cellElement.appendChild(this.addPawn(cellElement, cell.hasPawn));
        this.canvas.appendChild(cellElement);
        return cellElement;
    }
}
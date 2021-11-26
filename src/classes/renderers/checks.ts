import { PawnColor } from "../../enums/enums";
import type { ChecksCell } from "../../types/types";
import { ChecksHelper } from "../helpers/checks";
import { Renderer } from "./renderer";

export class ChecksRenderer extends Renderer {
    override map: ChecksCell[];
    playerColor: PawnColor;
    dragged: HTMLDivElement;
    helper: ChecksHelper;

    constructor(map: ChecksCell[], playerColor: PawnColor) {
        super(map);
        this.playerColor = playerColor;
        this.helper = new ChecksHelper();
    }

    addPawn(cellElement: HTMLDivElement, color: PawnColor): HTMLDivElement {
        const pawnElement = document.createElement("div");
        pawnElement.classList.add("pawn", color);
        if (color === this.playerColor) {
            pawnElement.classList.add("cursor-pointer");
            pawnElement.setAttribute("draggable", "true");
            pawnElement.addEventListener("dragstart", e => {
                this.dragged = e.target as HTMLDivElement;
                this.dragged.style.opacity = "0.5";
            });
        }
        return pawnElement;
    }

    override renderCell(cell: ChecksCell): HTMLDivElement {
        let cellElement: HTMLDivElement = super.renderCell(cell);
        cellElement.addEventListener("dragenter", e => {
            const target = e.target as HTMLDivElement;
            target.style.filter = "drop-shadow(16px 16px 20px red) invert(75%)";
        });
        cellElement.addEventListener("dragleave", e => {
            const target = e.target as HTMLDivElement;
            target.style.filter = "";
        });
        cellElement.addEventListener("dragover", e => e.preventDefault());
        cellElement.addEventListener("drop", e => {
            const target = e.target as HTMLDivElement;
            target.style.filter = "";
            this.dragged.style.opacity = "1";
            const draggedCell = this.map.find(cell => cell.id == parseInt(this.dragged.parentElement.id.split("-")[1]));
            const targetCell = this.map.find(cell => cell.id == parseInt(target.id.split("-")[1]));
            if (!draggedCell || !targetCell) return;
            const availableMoves = this.helper.getAvailableMoves(this.map, draggedCell);
            if (availableMoves.includes(targetCell)) target.appendChild(this.dragged);
        });
        if (cell.color == PawnColor.WHITE) cellElement.classList.add("white");
        if (cell.color == PawnColor.BLACK) cellElement.classList.add("black");
        if (cell.hasPawn) cellElement.appendChild(this.addPawn(cellElement, cell.hasPawn));
        this.canvas.appendChild(cellElement);
        return cellElement;
    }
}
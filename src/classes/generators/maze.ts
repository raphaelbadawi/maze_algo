import type { Cell } from "../../types/types";

export class MazeGenerator {
    width: number;
    height: number;
    map: Cell[] = [];

    constructor(width: number, height: number) {
        // we start with walls everywhere
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                this.map.push({
                    posX: i,
                    posY: j,
                    walls: [true, true, true, true]
                });
            }
        }
        this.map.forEach((cell, index) => cell.id = index);
        // random end and start point
        this.map[Math.floor(Math.random() * this.map.length)].entrance = true;
        this.map[Math.floor(Math.random() * this.map.length)].exit = true;
        // BREAKING THE WALL(S)
        this.breakWalls();
    }

    private carve(cell: Cell) {
        const previousCell = cell.previous;
        if (previousCell.posY < cell.posY) this.map[cell.id].walls[0] = false;
        if (previousCell.posX < cell.posX) this.map[cell.id].walls[1] = false;
        if (previousCell.posY > cell.posY) this.map[cell.id].walls[2] = false;
        if (previousCell.posX > cell.posX) this.map[cell.id].walls[3] = false;
    }

    private breakWalls(startCell: Cell = this.map[Math.floor(Math.random() * this.map.length)]) {
        const queue: Cell[] = [startCell];
        while (queue.length > 0) {
            let currentCell = queue.shift();
            const nextCells: Cell[] = [
                this.map.find(cell => cell.posX == currentCell.posX + 1),
                this.map.find(cell => cell.posX == currentCell.posX - 1),
                this.map.find(cell => cell.posX == currentCell.posY + 1),
                this.map.find(cell => cell.posX == currentCell.posY - 1),
            ].filter(e => e !== undefined);
            const nextCell: Cell = nextCells[Math.floor(Math.random() * nextCells.length)];
            nextCell.previous = currentCell;
            this.carve(nextCell);
        }
    }
}
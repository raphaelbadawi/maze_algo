import type { CalculableCell } from "../../types/types";
import { MazeHelper } from "../helpers/maze";

export class MazeGenerator {
    width: number;
    height: number;
    map: CalculableCell[] = [];

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

    private carve(cell: CalculableCell) {
        const previousCell = cell.previous;
        if (previousCell.posX < cell.posX) {
            this.map[cell.id].walls[0] = false;
            this.map[previousCell.id].walls[2] = false;
        }
        if (previousCell.posY > cell.posY) {
            this.map[cell.id].walls[1] = false;
            this.map[previousCell.id].walls[3] = false;
        }
        if (previousCell.posX > cell.posX) {
            this.map[cell.id].walls[2] = false;
            this.map[previousCell.id].walls[0] = false;
        }
        if (previousCell.posY < cell.posY) {
            this.map[cell.id].walls[3] = false;
            this.map[previousCell.id].walls[1] = false;
        }
    }

    private breakWalls(currentCell: CalculableCell = this.map[Math.floor(Math.random() * this.map.length)]) {
        this.map[currentCell.id].visited = true;
        let carveCandidates: CalculableCell[] = [];
        do {
            const nextCandidates: CalculableCell[] = MazeHelper.getAvailableMoves(this.map, currentCell, true).filter(cell => !carveCandidates.includes(cell));
            nextCandidates.forEach(cell => cell.previous = currentCell);
            carveCandidates.push(...nextCandidates);
            let carveCandidate: CalculableCell = carveCandidates[Math.floor(Math.random() * carveCandidates.length)];
            this.map[carveCandidate.id].visited = true;
            carveCandidates = carveCandidates.filter(e => e != carveCandidate);
            this.carve(carveCandidate);
            currentCell = carveCandidate;
        } while (carveCandidates.length > 0);
    }
}
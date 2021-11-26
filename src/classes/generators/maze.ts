import type { MazeCell } from "../../types/types";
import { MazeHelper } from "../helpers/maze";

export class MazeGenerator {
    width: number;
    height: number;
    map: MazeCell[] = [];
    helper: MazeHelper;

    constructor(width: number, height: number) {
        this.helper = new MazeHelper();

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
        const startIndex: number = Math.floor(Math.random() * this.map.length);
        this.map[startIndex].start = true;

        let endIndex: number; 
        do {
            endIndex = Math.floor(Math.random() * this.map.length);
        } while (endIndex == startIndex);
        this.map[endIndex].end = true;

        const trapsIndexes: number[] = [];
        for (let i = 0; i < Math.floor(width / 2); i++) {
            do {
                trapsIndexes[i] = Math.floor(Math.random() * this.map.length);
            } while (trapsIndexes[i] == startIndex || trapsIndexes[i] == endIndex || trapsIndexes.filter((_, trapI) => trapI !== i).includes(trapsIndexes[i]));
        }
        for (const trapIndex of trapsIndexes) this.map[trapIndex].trap = true;

        // BREAKING THE WALL(S)
        this.breakWalls();
    }

    private carve(cell: MazeCell) {
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

    private breakWalls(currentCell: MazeCell = this.map[Math.floor(Math.random() * this.map.length)]) {
        this.map[currentCell.id].treated = true;
        let carveCandidates: MazeCell[] = [];
        do {
            const nextCandidates: MazeCell[] = this.helper.getAvailableMoves(this.map, currentCell, true).filter(cell => !carveCandidates.includes(cell));
            nextCandidates.forEach(cell => cell.previous = currentCell);
            carveCandidates.push(...nextCandidates);
            let carveCandidate: MazeCell = carveCandidates[Math.floor(Math.random() * carveCandidates.length)];
            this.map[carveCandidate.id].treated = true;
            carveCandidates = carveCandidates.filter(e => e != carveCandidate);
            this.carve(carveCandidate);
            currentCell = carveCandidate;
        } while (carveCandidates.length > 0);
    }
}
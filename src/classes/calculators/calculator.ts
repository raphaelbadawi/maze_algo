import { Algos } from "../../enums/enums";
import type { AbstractCell } from "../../types/types";
import type { Helper } from "../helpers/helper";
import type { Renderer } from "../renderers/renderer";

/** @todo refactor using graph */
export abstract class Calculator {
    map: AbstractCell[];
    board: Renderer;
    startPoint: AbstractCell;
    endPoint: AbstractCell;
    algoToHandler = { [Algos.DFS]: "calcDFSSolution", [Algos.BFS]: "calcBFSSolution", [Algos.ASTAR]: "calcAStarSolution" };
    maxHeuristic: number;
    helper: Helper;

    constructor(map: AbstractCell[], board: Renderer, helper: Helper) {
        this.map = map;
        this.board = board;
        this.startPoint = this.map.find((cell) => cell.start);
        this.endPoint = this.map.find((cell) => cell.end);
        this.helper = helper;
    }

    calc(algo: Algos) {
        return this[this.algoToHandler[algo]]();
    }

    private calcDFSSolution(startPoint: AbstractCell = this.startPoint) {
        if (startPoint.treated) return false;
        this.map[startPoint.id].treated = true;
        if (startPoint.end) return startPoint;
        const availableMoves = this.helper.getAvailableMoves(this.map, startPoint);
        for (const availableMove of availableMoves) {
            availableMove.previous = startPoint;
            const path = this.calcDFSSolution(availableMove);
            if (path.end) return path;
        }
        return false;
    }

    private calcBFSSolution(startPoint: AbstractCell) {
        let queue = [startPoint];
        while (queue.length > 0) {
          const currentPoint = queue.shift();
          this.map[currentPoint.id].treated = true;
          if (currentPoint.end) return currentPoint;
          const availableMoves = this.helper.getAvailableMoves(this.map, currentPoint);
          for (const availableMove of availableMoves) {
            if (availableMove.treated) continue;
            availableMove.previous = currentPoint;
            queue.push(availableMove);
          }
        }
        return false;
    }

    private calcHeuristic(referencePoint: AbstractCell) {
        const { posX: endPosX, posY: endPosY } = this.endPoint;
        const { posX: refPosX, posY: refPosY } = referencePoint;
        return Math.abs(endPosX - refPosX) + Math.abs(endPosY - refPosY);
      }
    
    private calcPathCost(referencePath: AbstractCell) {
        let pathCost = 0;
        while (referencePath.previous) {
          pathCost ++;
          referencePath = referencePath.previous;
        }
        return pathCost;
    }
    
    private calcAStarSolution() {
        this.startPoint.score = this.calcHeuristic(this.startPoint);
        let queue: AbstractCell[] = [this.startPoint];
        while (queue.length > 0) {
            const currentPoint: AbstractCell = queue.length == 1 ? queue[0] : queue.reduce((p, c) => p.score < c.score ? p : c);
            queue = queue.filter((cell) => cell !== currentPoint);
            this.map[currentPoint.id].treated = true;
            if (currentPoint.end) return currentPoint;
            const availableMoves = this.helper.getAvailableMoves(this.map, currentPoint);
            for (const availableMove of availableMoves) {
            if (availableMove.treated) continue;
            availableMove.previous = currentPoint;
            const cost: number = this.calcPathCost(availableMove);
            const heuristic: number = this.calcHeuristic(availableMove);
            availableMove.score = cost + heuristic;
            if (queue.find(cell => cell.id == availableMove.id && cell.score < availableMove.score)) continue;
            queue.push(availableMove);
            }
        }
    }
}
export class MazeGraph {
  constructor(map, board) {
    this.map = map;
    this.board = board;
  }

  seed() {
    const startPoint = this.map.find((cell) => cell.entrance);

    // exec iterative deep search
    const path = this.buildPathIterative(startPoint);
    this.board.pinCells(path);

    // // exec recursive deep search
    // const path = this.buildPathRecursive(startPoint);
    // if (path) return;
    // this.clearMap();
    // this.board.clearBoard();
    // this.seed();
  }

  /** Get available moves from current instance of the map */
  getAvailableMoves(startPoint) {
    const {
      posX: currentPosX,
      posY: currentPosY,
      walls: currentWalls,
    } = startPoint;
    return this.map.filter((cell) => {
      if (cell.visited) return false;
      if (
        (!currentWalls[0] &&
          cell.posX == currentPosX - 1 &&
          cell.posY == currentPosY) ||
        (!currentWalls[1] &&
          cell.posY == currentPosY + 1 &&
          cell.posX == currentPosX) ||
        (!currentWalls[2] &&
          cell.posX == currentPosX + 1 &&
          cell.posY == currentPosY) ||
        (!currentWalls[3] &&
          cell.posY == currentPosY - 1 &&
          cell.posX == currentPosX)
      )
        return cell;
    });
  }

  /** Iterative deep search with propagation on all possible paths */
  buildPathIterative(startPoint) {
    let stack = [startPoint];
    while (stack.length > 0) {
      const currentPoint = stack.pop();
      this.map[currentPoint.id].visited = true;
      if (currentPoint.exit) return currentPoint;
      const availableMoves = this.getAvailableMoves(currentPoint);
      for (const availableMove of availableMoves) {
        if (!availableMove.visited) {
          availableMove.previous = currentPoint;
          stack.push(availableMove);
        }
      }
    }
    return false;
  }

  /** Recursive deep search with multiple tries on random paths */
  buildPathRecursive(startPoint) {
    this.map[startPoint.id].visited = true;
    const availableMoves = this.getAvailableMoves(startPoint);
    if (availableMoves.length > 0) {
      const nextPoint = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      if (nextPoint.exit) return nextPoint;
      if (nextPoint.visited) this.buildPath(startPoint);
      this.board.pinCell(nextPoint);
      this.map[startPoint.id].previous = startPoint;
      return this.buildPath(nextPoint);
    }
    return false;
  }

  clearMap() {
    this.map.forEach((cell) => {
      cell.visited = false;
      cell.previous = null;
    });
  }
}

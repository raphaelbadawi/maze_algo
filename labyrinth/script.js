import { MazeRenderer } from "./renderers/maze.js";
import { MazeGraph } from "./calculators/graph.js";

async function loadJSON(url) {
  const res = await fetch(url);
  return await res.json();
}

loadJSON("mazeConfig.json").then((mazes) => {
  const currentMap = mazes["25"]["ex-2"];

  // render canvas
  const board = new MazeRenderer(currentMap);
  document.body.appendChild(board.canvas);

  // render cells
  currentMap.forEach((cell, index) => {
    cell.id = index;
    board.renderCell(cell)
  });

  // render graph
  const mazeGraph = new MazeGraph(currentMap, board);
  mazeGraph.seed();
});

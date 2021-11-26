import type { MazeCell } from "../../types/types";
import { MazeHelper } from "../helpers/maze";
import type { MazeRenderer } from "../renderers/maze";
import { Graph } from "./graph";

export class MazeGraph extends Graph {
  override map: MazeCell[];
  override startPoint: MazeCell;
  override helper: MazeHelper;

  constructor(map: MazeCell[], board: MazeRenderer) {
    super(map, board, new MazeHelper());
  }
}

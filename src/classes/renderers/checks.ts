import type { ChecksCell } from "../../types/types";
import { Renderer } from "./renderer";

export class ChecksRenderer extends Renderer {
    constructor(map: ChecksCell[]) {
        super(map);
    }
}
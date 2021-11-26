<script lang="ts">
    import { onMount } from "svelte";
    import { ChecksRenderer } from "../classes/renderers/checks";
    import { PawnColor } from "../enums/enums";
    import type { ChecksCell } from "../types/types";

    let map: ChecksCell[] = [];
    let board: ChecksRenderer;
    const playerColor: PawnColor = PawnColor.WHITE;

    const handleHasPawn = (index: number, cellColor: PawnColor) => {
        if (cellColor === PawnColor.WHITE) return undefined;
        if (index < 4) return PawnColor.BLACK;
        if (index > 5) return PawnColor.WHITE;
        return undefined;
    };

    onMount(() => {
        // generate checks board template for the map
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cellColor: PawnColor = (i % 2 === 0 && j % 2 === 0 || i % 2 !== 0 && j % 2 !== 0) ? PawnColor.WHITE : PawnColor.BLACK;
                map.push({
                    posX: i,
                    posY: j,
                    color: cellColor,
                    hasPawn: handleHasPawn(i, cellColor),
                });
            }
        }
        // render canvas
        board = new ChecksRenderer(map, playerColor);
        document.querySelector("#currentMap").appendChild(board.canvas);

        // render cells
        map.forEach((cell, index) => {
            cell.id = index;
            board.renderCell(cell);
        });
    });
</script>

<h2>Checks Game</h2>
<div id="currentMap"></div>

<style>
#currentMap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80vh;
    height: 80vh;
}
</style>
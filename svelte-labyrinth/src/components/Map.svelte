<script lang="ts">
    import { onMount } from "svelte";
    import { MazeRenderer } from "../classes/renderers/maze";
    import type { Cell } from "../types/types";

    export let map: Cell[];

    onMount(() => {
        // render canvas
        const board = new MazeRenderer(map);
        document.querySelector("#currentMap").appendChild(board.canvas);

        // render cells
        map.forEach((cell, index) => {
            cell.id = index;
            board.renderCell(cell)
        });
    });
</script>
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
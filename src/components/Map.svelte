<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { MazeGraph } from "../classes/calculators/graph";
    import { MazeRenderer } from "../classes/renderers/maze";
    import { Algos } from "../enums/enums";
    import type { Cell } from "../types/types";

    export let map: Cell[];

    let board: MazeRenderer;
    let R2D2: MazeGraph;

    const fullMazeClean = () => {
        board.clearBoard();
        R2D2.clearMap();
    };

    const showMazeSolution = (algo: Algos) => {
        fullMazeClean();
        R2D2.seed(algo);
    };

    const dispatchClickOnMapEvent = createEventDispatcher();

    onMount(() => {
        // render canvas
        board = new MazeRenderer(map);
        document.querySelector("#currentMap").appendChild(board.canvas);

        // render cells
        map.forEach((cell, index) => {
            cell.id = index;
            board.renderCell(cell)
        });

        R2D2 = new MazeGraph(map, board);
    });
</script>
<div class="btn-group">
    {#each Object.keys(Algos).map(k => Algos[k]) as algo}
        <button on:click="{e => showMazeSolution(algo)}">{ algo }</button>
    {/each}
    <button on:click="{fullMazeClean}">Remove thread</button>
</div>
<div id="currentMap" on:click="{e => dispatchClickOnMapEvent('mapClicked')}"></div>

<style>
    .btn-group {
        display: flex;
        justify-content: space-between;
        gap: 2rem;
    }
    .btn-group button {
        cursor: pointer;
        border: 0;
        color: white;
        background-color: teal;
        padding: 0.5rem 1rem;
        border-radius: 10px;
    }
    .btn-group button:hover {
        background-color: #00bcd4;
    }
    #currentMap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80vh;
        height: 80vh;
    }
</style>
<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { MazeGraph } from "../classes/calculators/graph";
    import { MazeHelper } from "../classes/helpers/maze";
    import { MazeRenderer } from "../classes/renderers/maze";
    import { Algos } from "../enums/enums";
    import type { CalculableCell } from "../types/types";

    export let map: CalculableCell[];

    let board: MazeRenderer;
    let R2D2: MazeGraph;
    let stepDisplay: false;
    let currentPath: CalculableCell;

    const incrementPath = () => {
        if (!currentPath.previous) return;
        board.pinCell(currentPath);
        currentPath = currentPath.previous;
    };

    const pathSequenceListener = (e) => {
        if (e.key == " ") incrementPath();
    }

    const fullMazeClean = () => {
        board.clearBoard();
        map = MazeHelper.clearMap(map);
    };

    const showMazeSolution = (algo: Algos) => {
        fullMazeClean();
        currentPath = R2D2.calc(algo);
        if (stepDisplay) {
            incrementPath();
            window.addEventListener("keydown", pathSequenceListener);
            return;
        }
        board.pinCells(currentPath);
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

    onDestroy(() => window.removeEventListener("keydown", pathSequenceListener));
</script>
<div class="btn-group">
    {#each Object.keys(Algos).map(k => Algos[k]) as algo}
        <button on:click="{e => showMazeSolution(algo)}">{ algo }</button>
    {/each}
    <button on:click="{fullMazeClean}">Remove thread</button>
    <label class="mapCheckbox"><input type="checkbox" bind:checked="{stepDisplay}"><span>Display by step</span></label>
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
        border-radius: 5px;
    }
    .btn-group button:hover {
        background-color: #00bcd4;
    }
    .mapCheckbox {
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .mapCheckbox > input {
        filter: invert(100%);
    }
    .mapCheckbox > span {
        line-height: 1.5rem;
    }
    #currentMap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80vh;
        height: 80vh;
    }
</style>
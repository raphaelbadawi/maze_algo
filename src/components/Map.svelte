<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { MazeCalculator } from "../classes/calculators/maze";
    import { MazeHelper } from "../classes/helpers/maze";
    import { MazeRenderer } from "../classes/renderers/maze";
    import { Algos } from "../enums/enums";
    import type { MazeCell } from "../types/types";
    import Checkbox from "./widgets/Checkbox.svelte";

    export let map: MazeCell[];

    let board: MazeRenderer;
    let R2D2: MazeCalculator;
    let stepDisplay: false;
    let currentPath: MazeCell;

    const incrementPath = () => {
        if (!currentPath) return false;
        if (!currentPath.previous) return true;
        board.pinCell(currentPath);
        currentPath = currentPath.previous as MazeCell;
    };

    const pathSequenceListener = (e) => {
        if (e.key == " ") incrementPath();
    }

    const fullMazeClean = () => {
        board.clearBoard();
        map = MazeHelper.clearMap(map) as MazeCell[];
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

        R2D2 = new MazeCalculator(map, board);
    });

    onDestroy(() => window.removeEventListener("keydown", pathSequenceListener));
</script>
<div class="btn-group">
    {#each Object.keys(Algos).map(k => Algos[k]) as algo}
        <button on:click="{e => showMazeSolution(algo)}">{ algo }</button>
    {/each}
    <button on:click="{fullMazeClean}">Remove thread</button>
    <Checkbox label="Display by step" currentValue={stepDisplay} on:updateValue="{e => stepDisplay = e.detail.currentValue}" />
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
    #currentMap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80vh;
        height: 80vh;
    }
</style>
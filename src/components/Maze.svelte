<script lang="ts">
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import { createEventDispatcher } from 'svelte';
    import { MazeGenerator } from "../classes/generators/maze";
    import type { Cell } from "../types/types";

    import Map from "./Map.svelte";

    export let triggerMap: boolean;
    export let selectionIndex: number;

    // make sure a new map has been fetched from the maps object before displaying any map
    let mapFetched: boolean = false;

    let currentMap: Cell[] = [];
    let maps: Promise<{}> = new Promise(() => {});
    let mapsChoices: string[] = [];

    const dispatchMapsChoices = createEventDispatcher();

    const randomMazeHandler = () => {
        /** @todo */
        const mazeGenerator: MazeGenerator = new MazeGenerator(4, 4);
        currentMap = mazeGenerator.map;
        triggerMap = true;
        mapFetched = true;
    }

    const displayMaze = (index: number = -1): void => {
        let currentChoiceElement: HTMLDivElement = document.querySelector(".mapSelector li.selected");
        if (index >= 0) {
            triggerMap = !triggerMap;
            currentChoiceElement = document.querySelector(`#map-${index.toString()}`);
            selectionIndex = index;
        }
        if (currentChoiceElement) {
            let currentChoice: string = currentChoiceElement.innerHTML;
            const [dim, ex]: RegExpMatchArray = currentChoice.match(/\d+/g);
            currentMap = maps[dim]["ex-" + ex];
        }
        mapFetched = true;
    }

    const stringifyMapsChoices = (): void => {
        for (const key of Object.keys(maps)) {
            for (const subKey of Object.keys(maps[key])) {
                mapsChoices.push("Dim " + key + " - " + subKey.replace("ex-", "Map "));
            }
        }
    };

    afterUpdate(() => {
        if (!triggerMap) mapFetched = false;
        const selectedItem = document.querySelector(".mapSelector li.selected");
        if (!selectedItem) return;
        document.querySelector(".mapSelector li.selected").scrollIntoView({ behavior: "smooth" });
        if (triggerMap) displayMaze();
    });

    onMount(async () => {
        const res: Response = await fetch("./maps/mazeConfig.json");
        if (!res.ok) {
            maps = Promise.reject(res.statusText);
            return;
        }
        maps = await Promise.resolve(await res.json());
        dispatchMapsChoices('keyboardHandlerChanged', {
            choices: mapsChoices
        });
        stringifyMapsChoices();
    });

    onDestroy(() => {
        dispatchMapsChoices('keyboardHandlerChanged', {
            choices: false
        });
    });
</script>

<div class="content">
    {#await maps}
    <div class="maze">Loading...</div>
    {:then}
        {#if currentMap.length && mapFetched}
            <Map map={currentMap} on:mapClicked="{e => { displayMaze(selectionIndex); }}"/>
        {:else}
            <div class="maze">Choose wisely</div>
            <ul class="mapSelector">
                {#each mapsChoices as choice, index (choice)}
                    <li id="map-{index}" class="{index == selectionIndex ? "selected" : ""}" on:click="{e => displayMaze(index)}">{ choice }</li>
                {/each}
            </ul>
            <button on:click="{randomMazeHandler}">Generate random maze</button>
        {/if}
    {:catch error}
    <div class="error">Error: { error }</div>
    {/await}
</div>

<style>
    .maze {
        color: teal;
    }
    .error {
        color: red;
    }
    .mapSelector {
        height: calc(100vh - 500px);
        overflow-y: scroll;
        scrollbar-width: thin;
        padding-inline: 1rem;
    }
    .mapSelector::-webkit-scrollbar {
        width: 6px;
        background-color: white;
    }
    .mapSelector::-webkit-scrollbar-thumb {
        background-color: teal;
    }
    .mapSelector li {
        cursor: pointer;
    }
    .mapSelector li:hover, .selected {
        color: darkorange;
    }
    button {
        color: white;
        background-color: darkorange;
        border: 0;
        padding: 0.5rem 1rem;
        margin-top: 1rem;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: white 0px 3px 10px;
        transition: all 0.3s ease-in-out;
    }
    button:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: white 0px 5px 20px;
    }
</style>
<script lang="ts">
import { onMount, onDestroy } from "svelte";
import { createEventDispatcher } from 'svelte';
import type { Cell } from "../types/types";

import Map from "./Map.svelte";

let maps: Promise<{}> = new Promise(() => {});
let mapsChoices: string[] = [];
let currentMap: Cell[] = [];
const dispatchMapsChoices = createEventDispatcher();

const displayMaze = (choice: string): void => {
    const [dim, ex]: RegExpMatchArray = choice.match(/\d+/g);
    currentMap = maps[dim]["ex-" + ex];
}

const stringifyMapsChoices = (): void => {
    for (const key of Object.keys(maps)) {
        for (const subKey of Object.keys(maps[key])) {
            mapsChoices.push("Dim " + key + " - " + subKey.replace("ex-", "Map "));
        }
    }
};

onMount(async () => {
    const res: Response = await fetch("./maps/mazeConfig.json");
    if (!res.ok) {
        maps = Promise.reject(res.statusText);
        return;
    }
    maps = await Promise.resolve(await res.json());
    dispatchMapsChoices('keyHandleChanged', {
        choices: mapsChoices
    });
    stringifyMapsChoices();
});

onDestroy(() => {
    dispatchMapsChoices('keyHandleChanged', {
        choices: false
    });
});
</script>

<div class="content">
    {#await maps}
    <div class="maze">Loading...</div>
    {:then}
        {#if currentMap.length}
            <Map />
        {:else}
            <div class="maze">Choose wisely</div>
            <ul class="mapSelector">
                {#each mapsChoices as choice (choice)}
                    <li on:click="{ e => displayMaze(choice) }">{ choice }</li>
                {/each}
            </ul>
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
        overflow: scroll;
    }
    .mapSelector li {
        cursor: pointer;
    }
    .mapSelector li:hover {
        color: yellow;
    }
</style>
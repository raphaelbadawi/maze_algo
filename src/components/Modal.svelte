<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatchCloseModalEvent = createEventDispatcher();
    export let mazeSize: number;
    export let hasTraps: boolean;
</script>

<div class="backdrop">
    <div class="modalContainer">
        <span on:click="{e =>  dispatchCloseModalEvent('modalClosed')}" class="modalCross">&times;</span>
        <h2>Select Maze Size</h2>
        <div class="modalSelect">
            <select bind:value="{mazeSize}">
                {#each Array(26) as _, i}
                    {#if i > 2}
                        <option value="{i}">{i}</option>
                    {/if}
                {/each}
            </select>
            <label class="modalCheckbox"><input type="checkbox" bind:checked="{hasTraps}"><span>Add traps</span></label>
        </div>
        <button class="modalButton" on:click="{e => dispatchCloseModalEvent('generateMaze', { mazeSize, hasTraps })}">Generate Maze</button>
    </div>
</div>

<style>
    .backdrop {
        display: flex;
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .modalCross {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 3rem;
        cursor: pointer;
    }
    .modalSelect {
        position: relative;
        display: flex;
        width: max-content;
        gap: 2rem;
        margin: auto;
        padding: 0.5rem 1rem;
    }
    /** @todo refactor checkboxes as a reusable component */
    .modalCheckbox {
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .modalCheckbox > input {
        filter: invert(100%);
    }
    .modalCheckbox > span {
        line-height: 1.5rem;
    }
    .modalButton {
        cursor: pointer;
        position: absolute;
        bottom: 3rem;
        left: 50%;
        transform: translateX(-50%);
        padding: 0.5rem 1rem;
        font-size: 2rem;
        color: white;
        background-color: darkorange;
        border: 0;
        border-radius: 5px;
        box-shadow: black 0px 3px 10px;
    }
    .modalContainer {
        padding: 1rem;
        position: relative;
        margin: auto;
        border: 1px solid black;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(255, 255, 255, 0.20), 0 20px 40px rgba(255, 255, 255, 0.25);
        width: 50vh;
        height: 25vh;
        color: black;
        background-color: white;
    }
</style>
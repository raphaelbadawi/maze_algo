<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Checkbox from "./widgets/Checkbox.svelte";

    export let mazeSize: number;
    export let hasTraps: boolean;

    const dispatchModalEvent = createEventDispatcher();

    const moveModal = (e) => {
        const modalContainer = document.querySelector(".modalContainer") as HTMLDivElement;
        const move = (e) => {
            modalContainer.style.left = e.clientX + "px";
            modalContainer.style.top = e.clientY + "px";
        }
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", _ => document.removeEventListener("mousemove", move));

        const modalElement: HTMLDivElement = document.querySelector(".modalContainer");
        if (e.clientX !== 0) modalElement.style.left = e.clientX + "px";
        if (e.clientY !== 0) modalElement.style.top = e.clientY + "px";
    };
</script>

<div class="backdrop">
    <div class="modalContainer">
        <div class="modalHeader" on:mousedown="{moveModal}">
            <span on:mousedown|preventDefault|stopPropagation="{e => dispatchModalEvent('modalClosed') }" class="modalClose">&times;</span>
        </div>
        <div class="modalBody">
            <h2>Select Maze Size</h2>
            <div class="modalSelect">
                <select bind:value="{mazeSize}" on:change="{e => dispatchModalEvent('updateMazeSize', { mazeSize })}">
                    {#each Array(26) as _, i}
                        {#if i > 2}
                            <option value="{i}">{i}</option>
                        {/if}
                    {/each}
                </select>
                <Checkbox label="Add traps" currentValue={hasTraps} on:updateValue="{e => { dispatchModalEvent('updateHasTraps', { hasTraps: e.detail.currentValue }) }}" />
            </div>
            <button class="modalButton" on:click="{e => dispatchModalEvent('generateMaze')}">Generate Maze</button>
        </div>
    </div>
</div>

<style>
    .backdrop {
        display: flex;
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .modalHeader {
        width: 100%;
        height: 6rem;
        background-color: black;
        cursor: move;
    }
    .modalClose {
        position: absolute;
        top: 1rem;
        right: 1rem;
        color: white;
        font-size: 3rem;
        cursor: pointer;
    }
    .modalBody {
        padding: 1rem;
    }
    .modalSelect {
        position: relative;
        display: flex;
        width: max-content;
        gap: 2rem;
        margin: auto;
        padding: 0.5rem 1rem;
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
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid black;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(255, 255, 255, 0.20), 0 20px 40px rgba(255, 255, 255, 0.25);
        width: 50vh;
        height: 30rem;
        color: black;
        background-color: white;
    }
</style>
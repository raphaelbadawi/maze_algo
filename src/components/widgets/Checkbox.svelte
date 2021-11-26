<script lang="ts">
import { createEventDispatcher } from "svelte";
    export let label: string;
    export let currentValue: boolean;
    const dispatchCheckboxEvent = createEventDispatcher();
</script>

<label class="checkbox"><input type="checkbox" bind:checked="{currentValue}" on:change="{e => dispatchCheckboxEvent('updateValue', { currentValue })}"><span>{ label }</span></label>

<style>
    .checkbox {
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .checkbox > input {
        filter: invert(100%);
    }
    .checkbox > span {
        line-height: 1.5rem;
    }
</style>
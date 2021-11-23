<script lang="ts">
	import Maze from "./components/Maze.svelte";
	import MazeVanilla from "./components/MazeVanilla.svelte";
	import Coffee from "./components/Coffee.svelte";
	import { Screens } from "./enums/enums";

	let currentScreen: string = Screens.MAZE_SCREEN;

	let menuItems: string[] = [Screens.MAZE_SCREEN, Screens.MAZE_VANILLA_SCREEN, Screens.COFFEE_SCREEN];
	export let screenIndex = 0;

	const changeMenuSelect = (event: CustomEvent<any>) => {
		screenIndex = 0;
		if(!event.detail.choices) {
			currentScreen = Screens.MAIN_MENU;
			menuItems = [Screens.MAZE_SCREEN, Screens.MAZE_VANILLA_SCREEN, Screens.COFFEE_SCREEN];
			return;
		}
		menuItems = event.detail.choices;
	};

	const handleMenuSelect = (event: { key: string; }) => {
		if (event.key == "Enter") currentScreen = menuItems[screenIndex];
		if (event.key === "ArrowDown") screenIndex++;
		if (event.key === "ArrowUp") screenIndex--;
		if (screenIndex > menuItems.length - 1) screenIndex = 0;
		if (screenIndex < 0) screenIndex = menuItems.length - 1;
		if (event.key == "Escape") currentScreen = Screens.MAIN_MENU;
	};
</script>

<svelte:window on:keydown="{handleMenuSelect}" />
<main>
	<h1>Meow Maze</h1>
	{#if currentScreen == Screens.MAIN_MENU}
		<ul id="menuSelector">
			{#each menuItems as item, index (item)}
				<li class="{index == screenIndex ? "selected" : ""}" on:click="{e => currentScreen = menuItems[index]}">{ item }</li>
			{/each}
		</ul>
	{/if}
	{#if currentScreen == Screens.MAZE_SCREEN}
		<Maze on:keyHandleChanged="{changeMenuSelect}"/>
	{/if}
	{#if currentScreen == Screens.MAZE_VANILLA_SCREEN}
		<MazeVanilla />
	{/if}
	{#if currentScreen == Screens.COFFEE_SCREEN}
		<Coffee />
	{/if}
</main>

<style>
	li {
		cursor: pointer;
	}
	li:hover {
		color: yellow;
	}
	.selected {
		color: yellow;
		font-weight: 700;
	}
</style>
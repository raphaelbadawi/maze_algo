<script lang="ts">
	import Maze from "./components/Maze.svelte";
	import MazeVanilla from "./components/MazeVanilla.svelte";
	import Coffee from "./components/Coffee.svelte";
	import { Screens } from "./enums/enums";

	let triggerMap: boolean = false;

	let screenIndex: number = 0;
	let currentScreen: string = Screens.MAZE_SCREEN;
	let menuItems: string[] = [Screens.MAZE_SCREEN, Screens.MAZE_VANILLA_SCREEN, Screens.COFFEE_SCREEN];

	const changeMenuSelection = (event: CustomEvent<any>) => {
		triggerMap = false;
		screenIndex = 0;
		if(!event.detail.choices) {
			currentScreen = Screens.MAIN_MENU;
			menuItems = [Screens.MAZE_SCREEN, Screens.MAZE_VANILLA_SCREEN, Screens.COFFEE_SCREEN];
			return;
		}
		menuItems = event.detail.choices;
	};

	const handleKeyboardNavigation = (event: { key: string; }) => {
		if (event.key == "Enter" && currentScreen == Screens.MAIN_MENU) currentScreen = menuItems[screenIndex];
		if (event.key == "Enter" && currentScreen == Screens.MAZE_SCREEN) triggerMap = !triggerMap;
		if (event.key === "ArrowDown") screenIndex++;
		if (event.key === "ArrowUp") screenIndex--;
		if (screenIndex > menuItems.length - 1) screenIndex = 0;
		if (screenIndex < 0) screenIndex = menuItems.length - 1;
		if (event.key == "Escape") currentScreen = Screens.MAIN_MENU;
	};
</script>

<svelte:window on:keydown|preventDefault|stopPropagation="{handleKeyboardNavigation}" />
<main>
	<h1>Meow Maze</h1>
	{#if currentScreen == Screens.MAIN_MENU}
		<ul id="menuSelector">
			{#each menuItems as item, index (item)}
				<li class="{index == screenIndex ? "selected" : ""}" on:click="{e => { screenIndex = index; currentScreen = menuItems[index]; }}">{ item }</li>
			{/each}
		</ul>
	{/if}
	{#if currentScreen == Screens.MAZE_SCREEN}
		<Maze on:keyboardHandlerChanged="{changeMenuSelection}" selectionIndex={screenIndex} triggerMap={triggerMap} />
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
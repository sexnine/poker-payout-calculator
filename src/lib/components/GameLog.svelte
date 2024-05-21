<script lang="ts">
  import { COLOR_CLASSES } from "$lib/color";
  import { createEventDispatcher } from "svelte";
  import PhArrowCounterClockwiseBold from "~icons/ph/arrow-counter-clockwise-bold";
  import PhCopySimpleBold from "~icons/ph/copy-simple-bold";
  import { slide } from "svelte/transition";
  import { copyText } from "svelte-copy";
  import type { Player } from "$lib/types";

  const eventDispatcher = createEventDispatcher<{
    undo: never;
  }>();

  export let log: { type: "buyIn" | "cashOut"; playerId: number; amount: number }[] = [];
  export let players: Player[];

  const undo = () => {
    // @ts-expect-error idk why svelte/ts be doing this
    eventDispatcher("undo");
  };

  const actions = {
    buyIn: {
      text: "bought in with",
      emoji: "💵",
    },
    cashOut: {
      text: "cashed out",
      emoji: "⬅️",
    },
  };

  const copyLog = () => {
    const logString = log
      .map((entry) => {
        return `${actions[entry.type].emoji} **${players[entry.playerId].name}** ${actions[entry.type].text} **$${entry.amount}**`;
      })
      .join("\n");

    copyText(logString);
  };
</script>

{#if log.length > 0}
  <div class="mx-auto w-full max-w-md px-4" transition:slide>
    <h2 class="pt-8 text-center font-poppins text-lg font-semibold">Log</h2>

    <ul class="divide-y divide-white/10">
      {#each log as entry}
        <li class="py-1 text-sm text-gray-300" transition:slide>
          <span class="font-semibold {COLOR_CLASSES[players[entry.playerId].color].text}">
            {players[entry.playerId].name}
          </span>
          <span>{actions[entry.type].text}</span>
          <span>${entry.amount}</span>
        </li>
      {/each}
    </ul>

    <div class="flex justify-end">
      <button
        on:click={copyLog}
        class="mr-2 rounded-sm font-poppins text-xs font-semibold text-gray-500 outline-0 ring-blue-500 transition hover:text-gray-300 focus:text-gray-300 focus:ring-2"
      >
        <PhCopySimpleBold class="inline" /> Copy
      </button>
      <button
        on:click={undo}
        class="rounded-sm font-poppins text-xs font-semibold text-gray-500 outline-0 ring-blue-500 transition hover:text-gray-300 focus:text-gray-300 focus:ring-2"
      >
        <PhArrowCounterClockwiseBold class="inline" /> Undo
      </button>
    </div>
  </div>
{/if}

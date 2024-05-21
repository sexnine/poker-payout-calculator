<script lang="ts">
  import type { Payout, Player } from "$lib/types";
  import { COLOR_CLASSES } from "$lib/color";
  import PhCopySimpleBold from "~icons/ph/copy-simple-bold";
  import { copyText } from "svelte-copy";
  import { slide } from "svelte/transition";

  export let payouts: Payout[] = [];
  export let players: Player[];

  const copyLog = () => {
    const payoutString = payouts
      .map((payout) => {
        return `**$${payout.amount}** from **${players[payout.from].name}** to **${players[payout.to].name}**`;
      })
      .join("\n");

    copyText(payoutString);
  };
</script>

{#if payouts.length > 0}
  <div class="mx-auto w-full max-w-md px-4" transition:slide>
    <h2 class="pt-8 text-center font-poppins text-lg font-semibold">Payouts</h2>

    <ul class="divide-y divide-white/10">
      {#each payouts as payout}
        <li class="py-1 text-sm text-gray-300">
          <span class="font-semibold text-white">${payout.amount}</span>
          <span>from</span>
          <span class="font-semibold {COLOR_CLASSES[players[payout.from].color].text}">
            {players[payout.from].name}
          </span>
          <span>to</span>
          <span class="font-semibold {COLOR_CLASSES[players[payout.to].color].text}">
            {players[payout.to].name}
          </span>
        </li>
      {/each}
    </ul>

    <div class="flex justify-end">
      <button
        on:click={copyLog}
        class="rounded-sm font-poppins text-xs font-semibold text-gray-500 outline-0 ring-blue-500 transition hover:text-gray-300 focus:text-gray-300 focus:ring-2"
      >
        <PhCopySimpleBold class="inline" /> Copy
      </button>
    </div>
  </div>
{/if}

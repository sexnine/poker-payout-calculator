<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import PhArrowBendUpRightBold from "~icons/ph/arrow-bend-up-right-bold";
  import PhHandArrowDownBold from "~icons/ph/hand-arrow-down-bold";
  import { createEventDispatcher, tick } from "svelte";
  import { COLOR_CLASSES, type PlayerColor } from "$lib/color";
  import { scale } from "svelte/transition";

  const eventDispatcher = createEventDispatcher<{
    buyIn: { playerId: number; amount: number };
    cashOut: { playerId: number; amount: number };
    changeName: { playerId: number; name: string };
  }>();

  export let playerId: number;
  export let playerName = "Player";
  export let color: PlayerColor;
  export let status: "in" | "out";
  export let bought: number;
  export let cashed: number;
  export let defaultBuyIn: number;
  export let cashOutDefaultAmount: number;

  let editName = false;

  const calculateNetInfo = (_bought: number, _cashed: number) => {
    const net = _cashed - _bought;
    return {
      class: net < 0 ? "text-red-500" : net == 0 ? "" : "text-green-500",
      text: net < 0 ? `-$${Math.abs(net)}` : `+$${net}`,
    };
  };
  $: netInfo = calculateNetInfo(bought, cashed);

  let buyInRawValue = "";
  let cashOutRawValue = "";

  const resetCustomValues = () => {
    buyInRawValue = "";
    cashOutRawValue = "";
  };

  const buyInDefault = () => {
    eventDispatcher("buyIn", { playerId, amount: defaultBuyIn });
    resetCustomValues();
  };

  const cashOutDefault = () => {
    eventDispatcher("cashOut", { playerId, amount: cashOutDefaultAmount });
    resetCustomValues();
  };

  const buyInCustom = () => {
    const amount = parseInt(buyInRawValue);
    if (Number.isNaN(amount) || amount < 0) return;

    eventDispatcher("buyIn", { playerId, amount });
    resetCustomValues();
  };

  const cashOutCustom = () => {
    const amount = parseInt(cashOutRawValue);
    if (Number.isNaN(amount) || amount < 0) return;

    eventDispatcher("cashOut", { playerId, amount });
    resetCustomValues();
  };

  let nameInputEl: HTMLInputElement;
  export const startEditName = async () => {
    editName = true;
    await tick();
    nameInputEl.focus();
  };

  const editNameKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      commitNameChange();
    }
  };

  const commitNameChange = () => {
    editName = false;
    eventDispatcher("changeName", { playerId, name: playerName });
  };
</script>

<div
  class="frosty w-full max-w-sm rounded-lg border-[1px] border-white/40 bg-white/10 p-2"
  transition:scale={{ duration: 250 }}
>
  <div class="flex items-center pb-2">
    <div class="ml-1.5 mr-2 h-2 w-2 flex-shrink-0 rounded-full {COLOR_CLASSES[color].bg}" />
    {#if editName}
      <input
        bind:this={nameInputEl}
        bind:value={playerName}
        on:focusout={commitNameChange}
        on:keydown={editNameKeydown}
        type="text"
        class="w-full transform-gpu rounded-lg border-[1px] border-white/40 bg-white/10 py-0.5 pl-2 font-poppins font-medium shadow-inner outline-0 ring-blue-500 transition-all hover:bg-white/15 focus:ring-2"
      />
    {:else}
      <h1 class="pb-0.5 font-poppins text-lg font-bold" on:click={startEditName}>
        {playerName}
      </h1>
      <span
        class="ml-2 h-min rounded-md px-1 py-0.5 font-poppins text-sm font-bold leading-none {status ===
        'in'
          ? 'bg-green-500 text-green-950'
          : 'bg-red-500 text-red-950'}"
      >
        {status === "in" ? "IN" : "OUT"}
      </span>
    {/if}
  </div>

  <div class="space-y-2">
    {#if status === "out"}
      <div class="flex items-center">
        <PhArrowBendUpRightBold class="mr-1 text-green-500" />
        <span class="text-nowrap pr-2 font-poppins text-sm font-medium">Buy-in</span>
        <Button on:click={buyInDefault}>${defaultBuyIn}</Button>
        <span class="px-2 text-sm text-gray-400">or</span>
        <div class="relative">
          <input
            bind:value={buyInRawValue}
            placeholder={defaultBuyIn.toString()}
            type="number"
            class="no-spin w-full transform-gpu rounded-lg border-[1px] border-white/40 bg-white/10 py-1 pl-[1.15rem] pr-2 font-poppins font-medium shadow-inner outline-0 ring-blue-500 transition-all hover:bg-white/15 focus:ring-2"
          />
          <span class="pointer-events-none absolute left-0 ml-2 select-none pt-1 font-medium">
            $
          </span>
          <button
            on:click={buyInCustom}
            class="absolute right-0 h-full transform-gpu rounded-r-lg border-l-[1px] border-white/40 px-1 py-1 font-poppins font-medium outline-0 ring-blue-500 transition-all hover:bg-white/10 focus:ring-2"
          >
            ✅
          </button>
        </div>
      </div>
    {:else if status === "in"}
      <div class="flex items-center justify-between">
        <PhHandArrowDownBold class="mr-1 text-red-500" />
        <span class="text-nowrap pr-2 font-poppins text-sm font-medium">Cash out</span>
        <Button on:click={cashOutDefault}>
          {cashOutDefaultAmount === 0 ? "Bust" : `$${cashOutDefaultAmount}`}
        </Button>
        <span class="px-2 text-sm text-gray-400">or</span>
        <div class="relative">
          <input
            bind:value={cashOutRawValue}
            placeholder="500"
            type="number"
            class="no-spin w-full transform-gpu rounded-lg border-[1px] border-white/40 bg-white/10 py-1 pl-[1.15rem] pr-2 font-poppins font-medium shadow-inner outline-0 ring-blue-500 transition-all hover:bg-white/15 focus:ring-2"
          />
          <span class="absolute left-0 ml-2 select-none pt-1 font-medium">$</span>
          <button
            on:click={cashOutCustom}
            class="absolute right-0 h-full transform-gpu rounded-r-lg border-l-[1px] border-white/40 px-1 py-1 font-poppins font-medium outline-0 ring-blue-500 transition-all hover:bg-white/10 focus:ring-2"
          >
            ✅
          </button>
        </div>
      </div>
    {/if}
    <hr class="border-white/10" />
    <div class="flex justify-evenly">
      <p class="min-w-24 text-nowrap text-center text-sm leading-none">
        <span class="font-poppins text-lg font-semibold">${bought}</span> <br />
        Bought
      </p>
      <p class="min-w-24 text-nowrap text-center text-sm leading-none">
        <span class="font-poppins text-lg font-semibold">${cashed}</span> <br />
        Cashed
      </p>
      <p class="min-w-24 text-nowrap text-center text-sm leading-none">
        <span class="font-poppins text-lg font-semibold {netInfo.class}">{netInfo.text}</span>
        <br />
        Net
      </p>
    </div>
  </div>
</div>

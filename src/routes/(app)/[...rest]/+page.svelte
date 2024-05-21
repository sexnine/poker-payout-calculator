<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import PlayerCard from "$lib/components/PlayerCard.svelte";
  import { onMount, tick } from "svelte";
  import GameLog from "$lib/components/GameLog.svelte";
  import type { GameData, Payout } from "$lib/types";
  import PhUserPlusBold from "~icons/ph/user-plus-bold";
  import MdiCardsPlayingOutline from "~icons/mdi/cards-playing-outline";
  import SimpleIconsGithub from "~icons/simple-icons/github";
  import PhArrowsCounterClockwiseBold from "~icons/ph/arrows-counter-clockwise-bold";
  import PhUploadSimpleBold from "~icons/ph/upload-simple-bold";
  import PayoutsDisplay from "$lib/components/PayoutsDisplay.svelte";
  import { browser } from "$app/environment";
  import { serialize } from "$lib/share";
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";
  import DefaultBuyInInput from "$lib/components/DefaultBuyInInput.svelte";
  import { PLAYER_COLORS } from "$lib/color";
  import { copyText } from "svelte-copy";

  const MAX_PLAYERS = 9;
  const POKER_DATA_LOCALSTORAGE_KEY = "sn-poker-current-game";

  let pageData: PageData;
  export { pageData as data };

  let data: GameData = {
    defaultBuyIn: 500,
    players: [],
    log: [],
  };

  if (pageData.data) {
    data = pageData.data;
  }

  let loading = true;
  let payouts: Payout[] = [];

  $: inPlay = data.players.reduce((acc, player) => acc + player.bought - player.cashed, 0);
  $: playerCount = data.players.length;
  $: playersIn = data.players.filter((player) => player.status === "in").length;

  let playerCards: any[] = [];

  const invalidateData = () => {
    // eslint-disable-next-line no-self-assign
    data = data; // svelte reactivity moment
  };

  const handleBuyIn = ({ detail }: CustomEvent<{ playerId: number; amount: number }>) => {
    const player = data.players[detail.playerId];

    if (player.status === "in") return;

    payouts = [];

    player.bought += detail.amount;
    player.status = "in";

    data.log.push({
      type: "buyIn",
      playerId: detail.playerId,
      amount: detail.amount,
    });

    invalidateData();
  };

  const handleCashOut = ({ detail }: CustomEvent<{ playerId: number; amount: number }>) => {
    const player = data.players[detail.playerId];

    if (player.status === "out" || detail.amount > inPlay) return;

    player.cashed += detail.amount;
    player.status = "out";

    data.log.push({
      type: "cashOut",
      playerId: detail.playerId,
      amount: detail.amount,
    });

    invalidateData();
    calculatePayoutsIfShouldBeDone();
  };

  const handleChangeName = ({ detail }: CustomEvent<{ playerId: number; name: string }>) => {
    data.players[detail.playerId].name = detail.name;

    invalidateData();
  };

  const addPlayer = async () => {
    if (playerCount >= MAX_PLAYERS) return;

    data.players.push({
      name: `Player ${playerCount + 1}`,
      color: PLAYER_COLORS[playerCount],
      status: "out",
      bought: 0,
      cashed: 0,
    });

    invalidateData();

    await tick();

    playerCards[playerCards.length - 1].startEditName();
  };

  const handleUndo = () => {
    const lastLog = data.log.pop();
    if (!lastLog) return;

    const player = data.players[lastLog.playerId];

    if (lastLog.type === "buyIn") {
      player.bought -= lastLog.amount;
      player.status = "out";
      calculatePayoutsIfShouldBeDone();
    } else {
      player.cashed -= lastLog.amount;
      player.status = "in";
      payouts = [];
    }

    invalidateData();
  };

  const calculatePayouts = () => {
    console.debug("Calculating payouts");

    const balances = data.players
      .map((player, playerIndex) => ({
        id: playerIndex,
        bal: player.cashed - player.bought,
      }))
      .filter((player) => player.bal !== 0);

    const sortBalances = () => {
      // Sort by balance descending
      balances.sort((a, b) => b.bal - a.bal);
    };

    const transactions = [];

    while (balances.length > 0) {
      sortBalances();

      const creditor = balances[0];
      const debtor = balances[balances.length - 1];
      const amount = Math.min(Math.abs(debtor.bal), creditor.bal);

      const transaction = {
        from: debtor.id,
        to: creditor.id,
        amount,
      };
      transactions.push(transaction);

      debtor.bal += amount;
      creditor.bal -= amount;

      if (debtor.bal === 0) balances.pop();
      if (creditor.bal === 0) balances.shift();
    }

    console.log(transactions);
    payouts = transactions;
  };

  const calculatePayoutsIfShouldBeDone = () => {
    tick().then(() => {
      if (
        inPlay === 0 &&
        playersIn === 0 &&
        data.players.some(({ bought, cashed }) => bought !== cashed)
      ) {
        calculatePayouts();
      }
    });
  };

  const reset = () => {
    data = {
      defaultBuyIn: 500,
      players: [],
      log: [],
    };

    payouts = [];
  };

  const share = () => {
    copyText(`${window.location.origin}/${serialize(data)}`);
  };

  const saveData = () => {
    if (!loading && browser) {
      localStorage.setItem(POKER_DATA_LOCALSTORAGE_KEY, JSON.stringify(data));
    }
  };
  $: data, saveData();

  onMount(() => {
    if (browser) {
      if (window.location.pathname) {
        goto("/", { replaceState: true });
      }

      if (!pageData.data) {
        const savedDataString = localStorage.getItem(POKER_DATA_LOCALSTORAGE_KEY);
        if (savedDataString) {
          try {
            data = JSON.parse(savedDataString);
          } catch (e) {
            console.error("Failed to parse saved data: ", e);
          }
        }
      }

      loading = false;

      if (pageData.data) {
        saveData();
      }
    }
  });
</script>

<div class="flex min-h-screen flex-col items-center justify-between">
  <div class="w-full">
    <header class="relative flex flex-col items-center">
      <h1 class="w-full pb-4 pt-4 text-center font-poppins text-base font-bold">
        <MdiCardsPlayingOutline class="mr-1 inline" />Poker Payout Calculator
      </h1>
      <a
        title="GitHub Repository"
        class="absolute right-4 top-4 block rounded-full text-white/40 outline-0 ring-blue-500 transition hover:text-white focus:text-white focus:ring-2"
        target="_blank"
        href="https://github.com/sexnine/poker-payout-calculator"
      >
        <SimpleIconsGithub />
      </a>
    </header>

    <main class="w-full">
      <div class="mx-auto w-fit">
        <DefaultBuyInInput bind:value={data.defaultBuyIn} />

        <div class="flex justify-center pt-4">
          <p class="min-w-24 text-nowrap text-center leading-none">
            <span class="font-poppins text-xl font-semibold">{playerCount}</span> <br />
            Players
          </p>
          <p class="min-w-24 text-nowrap text-center leading-none">
            <span class="font-poppins text-xl font-semibold">${inPlay}</span> <br />
            In play
          </p>
          <p class="min-w-24 text-nowrap text-center leading-none">
            <span class="font-poppins text-xl font-semibold">{playersIn}</span> <br />
            Playing
          </p>
        </div>
        <div class="flex justify-center pt-8">
          <Button on:click={share} class="mr-4">
            <PhUploadSimpleBold class="mr-0.5 inline" /> Share
          </Button>
          <Button on:click={addPlayer} class="mr-4">
            <PhUserPlusBold class="mr-0.5 inline" /> Add Player
          </Button>
          <Button on:click={reset}>
            <PhArrowsCounterClockwiseBold class="mr-0.5 inline" /> Reset
          </Button>
        </div>
      </div>

      <div class="mx-auto flex w-full max-w-7xl flex-wrap justify-center gap-4 px-4 pt-4">
        {#each data.players as player, index}
          <PlayerCard
            bind:this={playerCards[index]}
            playerId={index}
            playerName={player.name}
            color={player.color}
            status={player.status}
            defaultBuyIn={data.defaultBuyIn}
            bought={player.bought}
            cashed={player.cashed}
            cashOutDefaultAmount={playersIn === 1 ? inPlay : 0}
            on:buyIn={handleBuyIn}
            on:cashOut={handleCashOut}
            on:changeName={handleChangeName}
          />
        {/each}
      </div>

      <GameLog log={data.log} players={data.players} on:undo={handleUndo} />

      <PayoutsDisplay {payouts} players={data.players} />
    </main>
  </div>
  <footer class="pb-6 pt-24">
    <p class="text-center text-xs text-neutral-500">© 2024 sexnine</p>
  </footer>
</div>

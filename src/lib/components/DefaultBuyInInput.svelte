<script lang="ts">
  const DEFAULT = 500;

  export let value: number;

  let rawValue: string | null = value.toString();

  const onFocusOut = () => {
    rawValue = value.toString();
  };

  const rawValueUpdated = () => {
    if (rawValue === null) {
      value = DEFAULT;
      return;
    }

    const parsed = parseInt(rawValue);
    if (Number.isNaN(parsed) || parsed < 0) return;

    value = parsed;
  };
  $: rawValue, rawValueUpdated();

  const valueUpdated = () => {
    if (rawValue === null) return;

    rawValue = value.toString();
  };
  $: value, valueUpdated();
</script>

<div class="mx-auto flex w-fit flex-col">
  <label class="pb-0.5 font-poppins text-sm font-medium text-gray-300" for="default-buy-in-input">
    Default Buy-in
  </label>
  <div class="relative max-w-[8rem]">
    <input
      bind:value={rawValue}
      on:focusout={onFocusOut}
      id="default-buy-in-input"
      placeholder={DEFAULT.toString()}
      type="number"
      class="frosty no-spin w-full transform-gpu rounded-lg border-[1px] border-white/40 bg-white/10 py-1 pl-[1.15rem] pr-2 font-poppins font-medium shadow-inner outline-0 ring-blue-500 transition-all hover:bg-white/15 focus:ring-2"
    />
    <span class="pointer-events-none absolute left-0 ml-2 select-none pt-1 font-medium">$</span>
  </div>
</div>

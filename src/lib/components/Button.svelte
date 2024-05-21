<script lang="ts">
  let additionalClasses: string = "";
  export { additionalClasses as class };
</script>

<button
  class="frosty transform-gpu rounded-lg border-[1px] border-white/40 bg-white/10 px-2 py-1 font-poppins font-medium outline-0 ring-blue-500 transition-all hover:bg-white/15 focus:ring-2 {additionalClasses}"
  on:click
  {...$$restProps}
>
  <slot />
</button>

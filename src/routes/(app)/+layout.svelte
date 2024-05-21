<script lang="ts">
</script>

<div class="min-h-screen w-full font-inter text-white">
  <div class="relative min-h-screen">
    <div>
      <slot />
    </div>

    <div class="absolute top-0 -z-20 h-full w-full overflow-hidden bg-neutral-950">
      <div
        class="absolute right-[-20vw] top-[-10rem] h-[36rem] w-[40vw] bg-[#012b10] blur-[150px]"
      />
      <div
        class="absolute left-[-25rem] top-[36rem] h-[56rem] w-[60vw] bg-[#01132b] blur-[200px]"
      />
      <div
        class="absolute bottom-[-16rem] right-[6rem] h-[36rem] w-[24rem] bg-[#2b0123] blur-[150px]"
      />
    </div>
  </div>
</div>

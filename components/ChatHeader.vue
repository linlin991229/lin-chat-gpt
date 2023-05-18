<script lang="ts" setup>
const appStore = useAppStore()
function showMenu() {
  appStore.changeExpandStatus()
}
</script>

<template>
  <div class="max-w-full min-h-14 flex items-center p-2 shadow-xl">
    <div class="m-1 flex flex-1">
      <button class="menuCtl text-3xl" icon-btn @click="showMenu">
        <div i="carbon-menu" />
      </button>
      <img w-32 class="inline-block" src="~/assets/svg/openai.svg" alt="Lin-ChatGPT">
    </div>
    <div class="flex flex-none gap-2">
      <div class="h-12 w-12 overflow-hidden border-rd-9">
        <img src="~/assets/images/head.jpg" alt="头像">
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.menuCtl {
  display: none;
}

@media(max-width:600px) {
  .menuCtl {
    display: flex;
  }
}
</style>

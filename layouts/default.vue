<script setup lang="ts">
const appStore = useAppStore()
</script>

<template>
  <main class="flex text-center" overflow="hidden">
    <div class="menu inset-0 h-[100%] w-65 flex" :class="{ after: appStore.isExpanded }">
      <Aside />
    </div>
    <div class="content">
      <ChatHeader />
      <slot />
    </div>
    <!-- <Footer /> -->
  </main>
</template>

<style lang="postcss" scoped>
a {
  @apply duration-200 transition-colors text-sm p-3 border rounded-md gap-3 items-center cursor-pointer flex-shrink-0 mb-1 text-white hover: bg-dark-200
}

main {
  height: 100%;
}

.content {
  width: calc(100% - 16.25rem);
  transition: width 0.5s ease-out;
  /* 过渡动画 */
}

@media(max-width: 600px) {
  .content {
    width: 100%;
  }

  .menu {
    position: fixed;
    left: -16.25rem;
    width: 16.25rem;
    transition: left 0.5s ease-out;
    /* 过渡动画 */
    z-index: 1;
  }

  /*动态绑定样式*/
  .after {
    left: 0;
    width: 16.25rem;
  }
}
</style>

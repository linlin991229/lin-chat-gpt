<script setup lang="ts">
import { appName } from '~/constants'

useHead({
  title: appName,
})
</script>

<template>
  <!-- <VitePwaManifest /> -->
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html, body , #__nuxt{
  height: 100vh;
  margin: 0;
  padding: 0;
/* 使用微软雅黑字体 */
  font-family: "微软雅黑", "Arial", "Helvetica", "SimSun", "SimHei" sans-serif;
  font-weight: 600;
  font-size: 16px;
}
@media screen and (max-width: 760px){
  html,body,#__nuxt{
    font-size: 14px;
    font-weight: 500;
  }
}

html.dark {
  background: #222222;
  color: white;
}
</style>

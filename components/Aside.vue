<script setup lang="ts">
const appStore = useAppStore()
function newChat() {
  // eslint-disable-next-line no-console
  console.log('new')
}
function closeMenu() {
  appStore.changeExpandStatus()
}
const records = useCookie('recordList')
function deleteMessage() {
  localStorage.removeItem('messages')
  localStorage.removeItem('recordList')
  // 删除cookie中的数据
  records.value = ''
}
function openDialog() {
  appStore.changeApiKeyFormStatus()
}
</script>

<template>
  <div class="h-full w-full flex flex-col translate-x-0 bg-dark">
    <div class="relative w-full flex-1">
      <nav class="h-full w-full flex flex-col p-2">
        <a class="flex flex-row" @click="newChat">
          <div i="carbon-add" /> <span>新对话</span>
        </a>
        <div class="w-full flex flex-col">
          <span class="text-xl font-400 text-warm-gray-100">聊天记录</span>
          <div class="w-full flex flex-col">
            <!-- 将a中的两个标签水平对齐 -->
            <a class="flex flex-row items-center" title="对话记录1">
              <div i="carbon-chat" />
              <span>对话记录</span>
              <div absolute right-6>
                <button class="text-gray-300 hover:text-white" @click="deleteMessage">
                  <div i="carbon-trash-can" />
                </button>
              </div>
            </a>
          </div>
        </div>
        <!-- <div class="flex-1 flex-col translate-0 overflow-y-auto duration-500 -mr-2"> -->
        <!-- <div class="flex flex-col gap-2 pb-2">
            <div>
              <div class="relative">
                <div class="sticky top-0 z-[16]">
                  <ol>
                    <li class="relative z-[15] h-auto">
                      <a class="relative flex items-center gap-3 rounded-md px-3 py-3">对话记录</a>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div> -->
        <!-- </div> -->
      </nav>
    </div>
    <el-button round @click="openDialog">
      输入Key
    </el-button>
  </div>
  <div>
    <button v-if="appStore.isExpanded" @click="closeMenu">
      <div bg-gray-4 i="carbon-close-outline" />
    </button>
  </div>
</template>

<style lang="postcss" scoped>
a {
  @apply duration-200 transition-colors text-sm p-3 border border-cool-gray-400 rounded-md gap-3 items-center cursor-pointer flex-shrink-0 mb-1 text-white hover: bg-dark-200
}
.el-button:hover{
  background-color: #222;
  color: white;
  border-color: gray;
}
.el-button,.el-button:focus:not(:hover){
  color: gray;
  background-color: white;
}
</style>

<script setup lang="ts">
import { MdPreview } from 'md-editor-v3'
import type { FormInstance } from 'element-plus'
import type { Message, RecordList } from '~/types/communications'
import 'md-editor-v3/lib/preview.css'

// apiKey
// const { public: { apiKey } } = useRuntimeConfig()
const formValue = reactive({
  apiKey: '',
})
const formRef = ref<FormInstance>()
const appStore = useAppStore()
// 提交表单
async function submitForm(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  await formEl.validate((valid) => {
    if (valid) {
      getBill()
      appStore.changeApiKeyFormStatus()
      localStorage.setItem('apiKey', formValue.apiKey)
    }
  })
}
// 验证apiKey
function getBill() {
  // eslint-disable-next-line no-console
  console.log('getBill')
}
// 发送的消息
const question = ref('')
// 展示对话数据
const recordList = reactive<RecordList>({
  items: [],
})
// 获取数据用于展示
const getRecordList = computed(() => {
  return [...recordList.items]
})
// 定义Message对象用于发生Api请求
const messages = ref<Message[]>([])
// 是否正在加载
const isLoading = ref(false)
// 获取输入框的DOM对象
const textInput = ref<HTMLInputElement | null>(null)
// 错误信息
const errorMessage = ref('')
// 异步发送消息
async function handlerSend() {
  isLoading.value = true
  // 除去空格
  const questionValue = question.value.trim()
  if (questionValue) {
    // 加入消息列表
    addMessage(questionValue)
    // 清空输入框
    question.value = ''

    // 发送请求
    await getCompletion()
    // 添加响应消息
    // 定位于最后一条消息
    const lastMessage = recordList.items[recordList.items.length - 1]
    messages.value.push({
      role: 'assistant',
      content: lastMessage.delta.content,
    })
    // 计算tokens
    recordList.items[recordList.items.length - 1].usageTokens.completionTokens = computeTokens(lastMessage.delta.content)
  }
  else {
    isLoading.value = false
  }
}
function addMessage(question: string) {
  messages.value.push({
    role: 'user',
    content: question,
  })
  // 加入对话列表
  recordList.items.push({
    question,
    delta: {
      role: 'user',
      content: '',
    },
    usageTokens: { promptTokens: computeTokens(question), completionTokens: 0 },
  })
}
async function getCompletion() {
  try {
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${formValue.apiKey}`,
      },
      method: 'POST',
      body: JSON.stringify({
        messages: messages.value,
        model: 'gpt-3.5-turbo',
        stream: true,
      }),
    }).then((res) => {
      // 状态码判断
      if (res.status === 200)
        return res
      else if (res.status === 401)
        errorMessage.value = '请输入apiKey'

      else if (res.status === 429)
        errorMessage.value = '您超出了当前配额，请检查您的计划和账单明细'

      else if (res.status === 500)
        errorMessage.value = '服务器出错'

      else if (!res.ok)
        errorMessage.value = '请求失败'
      isLoading.value = false
    }).catch((e) => {
      // eslint-disable-next-line no-console
      console.log(e)
      isLoading.value = false
      errorMessage.value = '获取信息失败,超时请检查是否开启代理'
    })

    // 判断是否获取到数据
    if (completion) {
      // 获取读取器
      const reader = completion.body?.getReader()
      // 读取器是否获取成功
      if (!reader) {
        errorMessage.value = '获取信息失败'
        return
      }
      // 开始读取流
      await read(reader, recordList)
      isLoading.value = false
    }
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }
}
// 监听输入框高度变化
watch(() => question.value, () => {
  if (textInput.value) {
    textInput.value.style.height = 'auto'
    textInput.value.style.height = `${textInput.value.scrollHeight}px`
  }
})

const id = 'preview-only'

// 监控content高度
const content = ref<HTMLDivElement | null>(null)
watch(
  () => recordList,
  () => {
    if (content.value)
      content.value.scrollTop = content.value.scrollHeight
  },
  {
    deep: true,
  },
)
// 数据缓存
onMounted(() => {
  readCache()
  // 监听页面关闭事件
  window.onbeforeunload = () => {
    localStorage.setItem('recordList', JSON.stringify(recordList))
    localStorage.setItem('messages', JSON.stringify(messages.value))
  }
})
function readCache() {
  const cacheRecordList = localStorage.getItem('recordList')
  const cacheMessages = localStorage.getItem('messages')
  const cacheApiKey = localStorage.getItem('apiKey')
  if (cacheRecordList) {
    const records = JSON.parse(cacheRecordList)
    if (records.items && records.items.length > 0)
      recordList.items = records.items
  }
  if (cacheMessages)
    messages.value = JSON.parse(cacheMessages)
  if (cacheApiKey)
    formValue.apiKey = cacheApiKey
  // 定位于底部
  nextTick(() => {
    if (content.value)
      content.value.scrollTop = content.value.scrollHeight
  })
}
// 清空消息
function clearMessage() {
  recordList.items = []
  messages.value = []
  localStorage.removeItem('recordList')
  localStorage.removeItem('messages')
}
</script>

<template>
  <div class="relative h-full flex py-3">
    <!-- 聊天信息展示区 -->
    <div ref="content" class="myScroller mb-36 flex-1 overflow-y-auto">
      <ul>
        <div v-for="(item, index) in getRecordList" :key="index" class="px-3 py-2">
          <!-- 问 -->
          <div class="question mb-2">
            <li
              class="mt-1.5 inline-block max-w-8/10 w-max rounded-lg bg-sky-500 px-3 py-2 align-top text-warm-gray-100 dark:bg-gray-8"
            >
              {{ item.question }}
            </li>
            <div class="ml-1 inline-block h-12 w-12 overflow-hidden border-rd-9 align-top">
              <img src="~/assets/images/head.jpg" alt="头像" srcset="">
            </div>
            <p class="mr-12 text-xs text-gray-400">
              token消耗:
              <CountTo :start-val="0" :end-val="item.usageTokens.promptTokens" :duration="1000" />
            </p>
          </div>
          <!-- 答 -->
          <div v-show="!errorMessage" text-left>
            <div class="inline-block h-12 w-12 overflow-hidden border-rd-9 align-top">
              <img src="~/assets/svg/chatgpt.svg" alt="chatgpt">
            </div>
            <li class="inline-block max-w-8/10 w-max rounded-lg bg-gray-100 px-3 py-2">
              <MdPreview :editor-id="id" :model-value="item.delta.content" />
            </li>
            <p class="ml-12 text-xs text-gray-400">
              token消耗:
              <CountTo :start-val="0" :end-val="item.usageTokens.completionTokens" :duration="1000" />
            </p>
          </div>
        </div>
        <!-- error信息 -->
        <div v-if="errorMessage" class="w-full flex gap-4 border-rd-4 bg-gray-300 p-4 shadow-lg">
          <div class="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0 stroke-current text-red" fill="none"
              viewBox="0 0 24 24" data-v-inspector="pages\index.vue:17:9" data-v-02281a80=""
            >
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                data-v-inspector="pages\index.vue:19:11" data-v-02281a80=""
              />
            </svg>
            <span class="text-red-500">{{ errorMessage }}</span>
          </div>
        </div>
      </ul>
    </div>
    <!-- 输入区 -->
    <div class="fixed-bottom w-full items-center justify-center">
      <div class="wrapper mb-10 w-4/5 flex items-center border-1 border-cool-gray-300 border-rd-2 px-2 py-1">
        <textarea
          ref="textInput" v-model="question"
          class="input h-12 min-w-8/10 w-full border-width-2 border-gray-500 border-rd px-3 py-2 text-lg" rows="1"
          placeholder="请输入您的问题" @keydown.enter.prevent="handlerSend"
        />
        <MyButton min-w-fit @click="handlerSend">
          <Loading v-if="isLoading" />
          {{ isLoading ? '' : '发送' }}
        </MyButton>
        <MyButton @click="clearMessage">
          清空
        </MyButton>
      </div>
    </div>
  </div>

  <ClientOnly>
    <el-dialog v-model="appStore.apiKeyFormStatus" title="请输入您的ApiKey" width="30%" align-center>
      <el-form ref="formRef" :model="formValue" label-width="100px" class="demo-ruleForm">
        <el-form-item
          label="ApiKey" prop="apiKey" :rules="[
            { required: true, message: '请输入apiKey' },
          ]"
        >
          <el-input v-model="formValue.apiKey" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button btn @click="submitForm(formRef)">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </ClientOnly>
</template>

<style lang="postcss" scoped>
.question {
  text-align: right;
}

.el-button:focus,.el-button:hover {
  color: white;
  background-color: black;
}

.fixed-bottom {
  /* 水平居中 */
  position: absolute;
  bottom: 3rem;
  @apply flex justify-center
}

@media(max-width: 600px) {}

.wrapper {
  @apply shadow-2xl
}

.input {
  resize: none;
  border: none;
  outline: none;
}

.myScroller::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.myScroller::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}

.myScroller::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>

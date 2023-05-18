import type { UsageTokens } from '../tokens'

interface delta {
  role: string
  content: string
}

interface questionAndAnswer {
  delta: delta
  question: string
  usageTokens: UsageTokens
}

export interface RecordList {
  items: questionAndAnswer[]
}

export interface Message {
  content: string
  role: 'user' | 'assistant'
}

export interface MessagesStore {
  id: string
  messages: Message[]
}

export interface RecordListStore {
  id: string
  recordList: questionAndAnswer[]
}

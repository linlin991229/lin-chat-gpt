import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isExpanded: false,
    apiKeyFormStatus: false,
  }),
  actions: {
    changeExpandStatus() {
      this.isExpanded = !this.isExpanded
    },
    changeApiKeyFormStatus() {
      this.apiKeyFormStatus = !this.apiKeyFormStatus
    },
  },
  getters: {
    getApiKeyFormStatus: state => state.apiKeyFormStatus,
  },
})

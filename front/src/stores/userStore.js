import { defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userInfo: null,
    isAuthenticated: false
  }),
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      this.isAuthenticated = true
    },

    setUserInfoAndToken(userInfo, token) {
      this.userInfo = userInfo
      this.token = token
      this.isAuthenticated = true
    },

    initializeFromStorage() {
      // 플러그인을 사용하여 로컬 스토리지에서 상태를 초기화합니다.
    },
    logout() {
      this.userInfo = null
      this.isAuthenticated = false
    }
  }
  // 플러그인을 사용하여 상태를 로컬 스토리지에 지속적으로 저장합니다.
})

import 'bootstrap/dist/css/bootstrap.css' // 부트스트랩 CSS 임포트
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // 부트스트랩 JavaScript 및 Popper.js 임포트

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // pinia-plugin-persistedstate 임포트
import { createPersistedState } from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
window.Kakao.init('4694d89b3f677d67b98101e233a06e16')

const app = createApp(App)

// Pinia를 생성하고 piniaPluginPersistedstate를 플러그인으로 추가합니다.
const pinia = createPinia()
pinia.use(
  createPersistedState({
    storage: localStorage,
    auto: true
  })
)
// 앱에 Pinia와 라우터를 추가합니다.
app.use(pinia)
app.use(router)

app.mount('#app')

<!-- 해당 컴포넌트의 템플릿 부분 -->
<template>
  <main v-if="userStore.isAuthenticated">
    <div>
      <div class="row">
        <div class="box">사용자 정보: {{ userStore.userInfo }}</div>
      </div>
      <div class="row">
        <button @click="logout">로그아웃</button>
      </div>
    </div>
  </main>
  <template v-else>
    <router-link to="/login">로그인</router-link>
  </template>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const logout = () => {
  userStore.logout()
  router.push('/') // 로그아웃 후 로그인 페이지로 이동
}
</script>

<style>
.box {
  border: 1px solid black;
  height: 100px;
}
</style>

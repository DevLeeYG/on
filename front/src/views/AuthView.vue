<template>
  <button @click="loginWithKakao">카카오</button>
</template>

<script setup>
const loginWithKakao = () => {
  const params = {
    redirectUri: `http://127.0.0.1:5173/kakao/callback`
  }
  window.Kakao.Auth.authorize(params)

  // 코드 추출 및 서버로 전송
}
</script>

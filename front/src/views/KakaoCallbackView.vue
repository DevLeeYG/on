<template>
  <div>카카오 로그인 중...</div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import { apiRootUrl } from '../api/_base'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

window.addEventListener('load', () => {
  const currentUrl = window.location.href
  const urlParams = new URLSearchParams(new URL(currentUrl).search)
  const code = urlParams.get('code')

  if (code) {
    sendDataToServer(code)
  }
})

const sendDataToServer = async (code) => {
  try {
    const response = await fetch(`${apiRootUrl}/auth/kakao/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    })

    if (!response.ok) {
      throw new Error('서버 응답 오류')
    }

    const data = await response.json()

    // user 정보가 제대로 포함되어 있는지 확인
    if (!data.user || !data.token) {
      throw new Error('받아온 데이터에 사용자 정보 또는 토큰이 없습니다.')
    }

    // user 정보와 토큰이 제대로 포함되어 있다면 userInfo와 token 설정
    userStore.setUserInfoAndToken(data.user, data.token)

    // 사용자 정보 저장 후 메인 페이지로 이동
    router.push('/') // 메인 페이지 URL로 이동
  } catch (error) {
    console.error(error)
    // 에러 발생 시 메인 페이지로 이동
    router.push('/') // 메인 페이지 URL로 이동
  }
}
</script>

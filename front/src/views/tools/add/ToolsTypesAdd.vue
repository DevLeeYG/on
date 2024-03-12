<template>
  <NavBar />
  <ToolNavBar />
  <div class="container p-3">
    <button class="btn btn-secondary mr-2" @click="$router.go(-1)">◀</button>
    <h3>🖊 공구 타입 추가</h3>
    <hr />
    <div>
      <form id="toolTypeItemForm" @submit.prevent="onSubmit">
        <div class="mt-3">
          <label for="name">타입</label>
          <input type="text" class="form-control w-50" id="name" v-model="item.name" required />
        </div>
        <hr />

        <button class="btn btn-primary btn-lg" type="submit">OK</button>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

import { useRouter } from 'vue-router'

import { postToolType } from '../../../api/postApi'
import NavBar from '../../../components/NavigationBar.vue'
import ToolNavBar from '../../../components/ToolNavBar.vue'

const token = localStorage.getItem('tokens')
const router = useRouter()
const item = ref({
  name: ''
})

const onSubmit = async () => {
  const res = await postToolType(token, JSON.stringify(item.value))

  if (res) {
    router.push('/tools/tools_types')
  }
}
</script>

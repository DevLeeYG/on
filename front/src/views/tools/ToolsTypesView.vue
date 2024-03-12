<template>
  <Navbar />
  <ToolNavBar />
  <div class="container p-3">
    <div class="d-flex justify-content-between mb-3">
      <h4>공구 타입</h4>
      <button @click="navigateToAddToolType" class="btn btn-primary">공구타입 추가</button>
    </div>
    <table class="table">
      <thead class="bg-dark text-white">
        <tr class="table-dark">
          <th>타입</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(type, typeIndex) in toolTypes" :key="typeIndex">
          <td>{{ type.name }}</td>
        </tr>
      </tbody>
    </table>

    <PaginationBar :pages="pages" :currentPage="currentPage" :fetchData="fetchToolTypes" />
  </div>
</template>
<script setup>
import { ref } from 'vue'

import { useRouter } from 'vue-router'

import { getToolTypes } from '../../api/getApi'
import Navbar from '../../components/NavigationBar.vue'
import PaginationBar from '../../components/PaginationBar.vue'
import ToolNavBar from '../../components/ToolNavBar.vue'

const token = localStorage.getItem('tokens')
const router = useRouter()
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const search = ref('')
const pages = ref(1)
const toolTypes = ref([])
const fetchGetToolTypes = async () => {
  const res = await getToolTypes(token, currentPage.value, pageSize.value, 'name', search.value)
  if (res) {
    toolTypes.value = res.rows
    totalCount.value = res.count
    pages.value = Math.ceil(totalCount.value / pageSize.value)
  }
}
const fetchToolTypes = async (page) => {
  currentPage.value = page
  const res = await getToolTypes(token, page, pageSize.value, 'name', search.value)
  toolTypes.value = res.rows
}

const navigateToAddToolType = () => {
  router.push({ name: 'AddToolType' })
}
fetchGetToolTypes()
</script>

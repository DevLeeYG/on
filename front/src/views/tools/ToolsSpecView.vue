<template>
  <!-- 네비게이션 바 -->
  <Navbar />
  <ToolNavBar />

  <!-- 메인 콘텐츠 컨테이너 -->
  <div class="container p-3">
    <h4>공구 상세</h4>

    <!-- 필터 및 추가 버튼 섹션 -->
    <div class="d-flex justify-content-between mb-3">
      <!-- 툴 타입을 선택하는 드롭다운 -->
      <select v-model="selectedTypeId" class="form-select w-50" aria-label="Default select example">
        <option v-for="(type, index) in typeList" :key="index" :value="type.name">
          {{ type.name }}
        </option>
      </select>

      <!-- AddToolSpec 페이지로 이동하는 버튼 -->
      <DetailSpecButton />
    </div>

    <!-- 툴 상세 정보를 표시하는 테이블 -->
    <table class="table">
      <thead class="bg-dark text-white">
        <tr class="table-dark">
          <th>타입</th>
          <th>직경</th>
          <th>팁반경</th>
          <th>각도(드릴)</th>
          <th>날수</th>
        </tr>
      </thead>
      <tbody>
        <!-- 툴 상세 정보를 루프를 통해 테이블 행에 표시 -->
        <tr v-for="(type, typeIndex) in rowList" :key="typeIndex">
          <td>{{ type.toolType.name }}</td>
          <td>{{ type.diameter }}</td>
          <td>{{ type.tipRadius }}</td>
          <td>{{ type.pointAngle }}</td>
          <td>{{ type.numberOfFlutes }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 페이지 탐색을 처리하는 PaginationBar 컴포넌트 -->
    <PaginationBar :pages="pages" :currentPage="currentPage" :fetchData="fetchDataForPage" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import { getTools, getToolTypeNameList } from '../../api/getApi'
import DetailSpecButton from '../../components/common/DetailSpecButton.vue'
import Navbar from '../../components/NavigationBar.vue'
import PaginationBar from '../../components/PaginationBar.vue'
import ToolNavBar from '../../components/ToolNavBar.vue'

// 토큰 및 라우터 초기화
const token = localStorage.getItem('tokens')

// 반응형 변수들
const typeList = ref([{ id: '', name: 'All' }])
const selectedTypeId = ref('All')
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(15)
const rowList = ref([])
const pages = ref(1)
const ordering = ref('tool_type_id,diameter,tip_radius,point_angle,number_of_flutes')

// 툴 정보를 가져오는 함수
const fetchData = async (page, typeId) => {
  const data = await getTools(token, page, pageSize.value, ordering.value, typeId)
  rowList.value = data.rows
  totalCount.value = data.count
  pages.value = Math.ceil(totalCount.value / pageSize.value)
}

// 툴 타입을 가져오는 함수
const fetchToolTypes = async () => {
  const res = await getToolTypeNameList(token)
  if (res) {
    typeList.value = typeList.value.concat(res.rows)
    await fetchData(currentPage.value)
  }
}

// 특정 페이지의 데이터를 가져오는 함수
const fetchDataForPage = (page) => {
  currentPage.value = page
  const typeId =
    selectedTypeId.value === 'All'
      ? ''
      : typeList.value.find((el) => el.name === selectedTypeId.value)?.id
  fetchData(page, typeId)
}

// selectedTypeId 변경 감시 및 데이터 가져오기 트리거
watch(selectedTypeId, () => {
  currentPage.value = 1
  fetchDataForPage(1)
})

// 컴포넌트 마운트 시 초기 데이터 가져오기
fetchToolTypes()
</script>

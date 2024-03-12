<template>
  <NavigationBar />
  <ToolNavBar />
  <div class="container mt-3 p-3">
    <h3 class="mb-3">
      <button class="btn btn-secondary mr-2" @click="$router.back()">◀</button>

      🖊공구 등록
    </h3>
    <div>
      <div class="d-flex justify-content-between">
        <h5>공구 유형 선택</h5>
        <router-link to="/tools/tools_spec/add">
          <button class="btn btn-primary">공구상세 추가</button></router-link
        >
      </div>
      <div class="container mt-3">
        <table class="table">
          <thead>
            <tr>
              <th style="background-color: black; color: white">
                <label for="tooltype" class="col-form-label">공구 타입</label>
                <select
                  v-model="selectedTypeId"
                  class="form-select"
                  aria-label="Default select example"
                >
                  <option v-for="(type, index) in typeList" :key="index" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
              </th>
              <th style="background-color: black; color: white">
                <label for="tooldia" class="col-form-label">직경</label>
                <input type="number" class="form-control" id="tooldia" v-model="form.diameter" />
              </th>
              <th style="background-color: black; color: white">
                <label for="toolrad" class="col-form-label">팁반경</label>
                <input type="number" class="form-control" id="toolrad" v-model="form.tipRadius" />
              </th>
              <th style="background-color: black; color: white">
                <label for="toolnumofflat" class="col-form-label">날수</label>
                <input
                  type="number"
                  class="form-control"
                  id="toolnumofflat"
                  v-model="form.numberOfFlutes"
                />
              </th>
              <th style="background-color: black; color: white">
                <label for="toolangle" class="col-form-label">각도 (드릴)</label>
                <input
                  type="number"
                  class="form-control"
                  id="toolangle"
                  v-model="form.pointAngle"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(tool, toolIndex) in toolList"
              :key="toolIndex"
              @click="rowSelect(tool)"
              :class="{ selected: tool.selected }"
              class="text-center"
            >
              <td :style="{ backgroundColor: tool.selected ? 'yellow' : 'white' }">
                {{ tool.toolType.name }}
              </td>
              <td :style="{ backgroundColor: tool.selected ? 'yellow' : 'white' }">
                {{ tool.diameter }}
              </td>
              <td :style="{ backgroundColor: tool.selected ? 'yellow' : 'white' }">
                {{ tool.tipRadius }}
              </td>
              <td :style="{ backgroundColor: tool.selected ? 'yellow' : 'white' }">
                {{ tool.numberOfFlutes }}
              </td>
              <td :style="{ backgroundColor: tool.selected ? 'yellow' : 'white' }">
                {{ tool.pointAngle }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="col-md-2 mb-3 d-flex align-items-end">
          <button class="btn btn-primary" @click="searchTools">검색</button>
        </div>
      </div>
    </div>

    <hr />

    <div>
      <h5>공구 등록 정보</h5>
      <form>
        <div class="container mt-3">
          <div class="row mb-3">
            <label for="name" class="col-md-2 col-form-label">공구 이름</label>
            <div class="col-md-4">
              <input
                type="text"
                class="form-control"
                id="name"
                placeholder="이름"
                v-model="info.name"
              />
            </div>
            <label for="alias" class="col-md-2 col-form-label">별칭</label>
            <div class="col-md-4">
              <input
                type="text"
                class="form-control"
                id="alias"
                placeholder="별칭"
                v-model="info.alias"
              />
            </div>
          </div>
          <div class="row mb-3">
            <label for="group" class="col-md-2 col-form-label">그룹</label>
            <div class="col-md-4">
              <input
                type="text"
                class="form-control"
                id="group"
                placeholder="그룹"
                v-model="info.group"
              />
            </div>
            <label for="safetyStockCount" class="col-md-2 col-form-label">안전재고</label>
            <div class="col-md-4">
              <input
                type="text"
                class="form-control"
                id="safetyStockCount"
                placeholder="안전재고"
                v-model="info.safetyStockCount"
              />
            </div>
          </div>
          <hr class="mb-4" />
          <button
            @click="fetchSpareTools"
            type="submit"
            class="btn btn-primary btn-lg"
            :disabled="!selectedRow"
          >
            OK
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

import { getToolsList, getToolTypeNameList } from '../../../api/getApi'
import { postSpareTools } from '../../../api/postApi'
import NavigationBar from '../../../components/NavigationBar.vue'
import ToolNavBar from '../../../components/ToolNavBar.vue'

const token = localStorage.getItem('tokens')
const selectedTypeId = ref('')

const form = ref({
  toolTypeId: '',
  diameter: 0,
  tipRadius: 0,
  pointAngle: 0,
  numberOfFlutes: 0
})

const info = ref({
  alias: '',
  group: '',
  name: '',
  safetyStockCount: '',
  toolId: ''
})

const typeList = ref([])
const toolList = ref([])
const selectedRow = ref(null)

const rowSelect = (item) => {
  if (selectedRow.value === item) {
    // 이미 선택된 행을 다시 클릭하면 선택 해제
    selectedRow.value.selected = false
    selectedRow.value = null
  } else {
    // 이전에 선택한 행이 있으면 선택 해제
    if (selectedRow.value) {
      selectedRow.value.selected = false
    }

    // 선택한 행 업데이트
    selectedRow.value = item
    item.selected = true
    info.value.toolId = item.id
  }
}

const fetchSpareTools = async () => {
  console.log(info.value)
  await postSpareTools(token, JSON.stringify(info.value))
}

const fetchToolTypes = async () => {
  const res = await getToolTypeNameList(token)
  if (res) {
    typeList.value = typeList.value.concat(res.rows)
  }
}

const searchTools = async () => {
  const data = await getToolsList(token, form.value)
  toolList.value = data.rows
}

const findId = () => {
  const found = typeList.value.find((row) => row.id === selectedTypeId.value)
  form.value.toolTypeId = found.id
}

watch(selectedTypeId, () => {
  findId()
})
fetchToolTypes()
</script>

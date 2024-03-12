<template>
  <NavigationBar />
  <ToolNavBar />
  <div class="container p-3">
    <div class="col">
      <h3 class="mb-3">
        <button class="btn btn-secondary mr-2" @click.prevent="$router.back()">◀</button>
        <h3>{{ type === 'tool' ? '🖊공구' : '💠공구 팁' }} 정보</h3>
      </h3>
      <div class="border p-3 mb-3">
        <div class="row">
          <div class="d-flex col-6">
            <h5 class="form-group m-1">기본 정보</h5>

            <button v-if="modify === false" @click="onClickModify" class="m-1">수정</button>
            <button v-else @click="onClickModify" class="m-1">취소</button>
          </div>
        </div>

        <div class="row">
          <div class="col-3">
            <div class="form-group">
              <label for="name">공구 이름</label>
              <input
                v-model="form.name"
                :disabled="!modify"
                type="text"
                class="form-control"
                id="name"
              />
            </div>
          </div>
          <div class="col-3">
            <div class="form-group">
              <label for="alias">별칭</label>
              <input
                v-model="form.alias"
                :disabled="!modify"
                type="text"
                class="form-control"
                id="alias"
              />
            </div>
          </div>
          <div class="col-3">
            <div class="form-group">
              <label for="group">그룹</label>
              <input
                v-model="form.group"
                :disabled="!modify"
                type="text"
                class="form-control"
                id="group"
              />
            </div>
          </div>
          <div class="col-3">
            <div class="form-group">
              <label for="safetyOfCount">안전재고</label>
              <input
                :disabled="!modify"
                v-model="form.safetyOfCount"
                type="number"
                class="form-control"
                id="safetyOfCount"
                step="0.1"
              />
            </div>
          </div>
        </div>
        <div>
          <hr class="mb-4" />

          <button
            v-if="modify === true"
            @click="onClickModifyInfo"
            class="btn btn-primary btn-lg"
            type="submit"
            style="width: 100%"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- -->
    <div class="container p-3 border">
      <div class="d-flex">
        <h5 class="mb-3">#태그</h5>
        <button v-if="modifyTag === false" @click="onClickModifyTag" class="m-1">수정</button>
        <button v-else @click="onClickModifyTag" class="m-1">취소</button>
      </div>
      <div>
        <span
          v-for="(tag, tagIndex) in toolData.tags"
          :key="tagIndex"
          class="badge bg-secondary m-1"
          >{{ tag.name }}
        </span>

        <div v-if="modifyTag === true" class="w-100 h-100">
          <span>#태그사용 #예시 #이렇게 #쓰고 #태그변경</span>
          <div class="d-flex">
            <div class="col-10">
              <input v-model="modifiedTags" class="form-control h-100" />
            </div>
            <div class="btn btn-primary btn-lg col-2">
              <button
                @click="onModifyOkClick"
                class="btn btn-primary btn-lg w-100 h-100"
                type="submit"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- -->
    <div class="container p-3 border">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h5>입출고 내역</h5>
        <select
          v-model="selectedEvent"
          style="width: 200px"
          class="form-select"
          aria-label="Default select example"
        >
          <option value="all">All</option>
          <option value="fix">수정</option>
          <option value="withdrawal">출고</option>
          <option value="filling">입고</option>
        </select>
      </div>
      <table class="table">
        <thead class="table-dark">
          <tr>
            <th>입/출고</th>
            <th>수량</th>
            <th>재고</th>
            <th>시간</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(log, logIndex) in logData" :key="logIndex">
            <td :class="getRowClass(log)">
              {{
                log.isFix
                  ? '수정'
                  : log.amountOfChange > 0
                    ? '입고'
                    : log.amountOfChange < 0 && '출고'
              }}
            </td>
            <td :class="getRowClass(log)">{{ log.amountOfChange }}</td>
            <td :class="getRowClass(log)">{{ log.resultCount }}</td>
            <td :class="getRowClass(log)">
              {{ new Date(log.createdAt).toLocaleString() }}
            </td>
            <td :class="getRowClass(log)">{{ log.remark }}</td>
          </tr>
        </tbody>
      </table>
      <PaginationBar :pages="pages" :currentPage="currentPage" :fetchData="getPagination" />
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'

import { useRoute } from 'vue-router'

import { getSpareLogs, getSpareToolTags, getToolData } from '../../../api/getApi'
import { patchAddTags, patchModifyInfo, patchRemoveTags } from '../../../api/patchApi'
import { postSpareToolTags } from '../../../api/postApi'
import NavigationBar from '../../../components/NavigationBar.vue'
import PaginationBar from '../../../components/PaginationBar.vue'
import ToolNavBar from '../../../components/ToolNavBar.vue'

const route = useRoute()
const type = ref(route.params.type)
const currentPage = ref(1)
const pageSize = ref(15)
const token = localStorage.getItem('tokens')
const toolData = ref({})
const logData = ref([])
const modify = ref(false)
const selectedEvent = ref('all')
const totalCount = ref(0)
const pages = ref(1)
const modifyTag = ref(false)
const modifiedTags = ref([])
const existingTags = ref([])
const originalModifiedTags = ref([])

const form = ref({
  name: '',
  alias: '',
  group: '',
  safetyOfCount: ''
})

const getSpareLogsList = async () => {
  const ordering = '-createdAt'

  if (type.value === 'tools') {
    type.value = 'tool'
  } else {
    type.value = 'tool_tip'
  }

  const data = await getSpareLogs(
    token,
    currentPage.value,
    pageSize.value,
    ordering,
    route.params.id,
    type.value,
    selectedEvent.value
  )

  logData.value = data.rows
  totalCount.value = data.count
  pages.value = Math.ceil(totalCount.value / pageSize.value)
}
const getRowClass = (log) => {
  if (log.isFix === true) return 'text-warning'
  if (log.amountOfChange > 0) return 'text-primary'
  if (log.amountOfChange < 0) return 'text-danger'
}
const getTool = async () => {
  const data = await getToolData(token, route.params.id, type.value)

  toolData.value = data
  form.value.name = toolData.value.name
  form.value.alias = toolData.value.alias
  form.value.group = toolData.value.group
  form.value.safetyOfCount = toolData.value.safetyStockCount

  modifiedTags.value = `${toolData.value.tags.map((tag) => `#${tag.name}`).join(' ')}`
}

const onClickModify = () => {
  modify.value = !modify.value
}
const onModifyOkClick = async () => {
  // 수정된 태그 배열 추출

  const originalTagArray = originalModifiedTags.value //비교대상임
    .split('#')
    .map((tag) => tag.trim())
    .filter((tag) => tag !== '')

  const modifiedTagArray = modifiedTags.value
    .split('#')
    .map((tag) => tag.trim())
    .filter((tag) => tag !== '')

  // 서버에서 현재 태그 목록 가져오기

  // 중복이 아닌 태그 필터링하여 서버에 추가
  const notDuplicateTags = modifiedTagArray.filter((tag) => !existingTags.value.includes(tag))

  for (const element of notDuplicateTags) {
    await postSpareToolTags(token, JSON.stringify({ name: element }))
  }

  // 서버에서 현재 태그 목록 다시 가져오기
  const reExistingTags = (await getSpareToolTags(token)).rows.map((tag) => ({
    id: tag.id,
    name: tag.name
  }))

  // 중복된 태그의 ID 목록 추출
  const duplicateTagIds = reExistingTags
    .filter((existingTag) => modifiedTagArray.includes(existingTag.name))
    .map((duplicateTag) => duplicateTag.id)

  // 도구에 중복된 태그 ID 목록 추가
  await patchAddTags(token, route.params.id, JSON.stringify({ tagIds: duplicateTagIds }))

  const removeItem = originalTagArray.filter((tag) => !modifiedTagArray.includes(tag))

  //removeItem을 목록에서 찾아야한다.

  const removeDuplicateTagIds = reExistingTags
    .filter((tag) => removeItem.includes(tag.name))
    .map((duplicateTag) => duplicateTag.id)

  if (removeItem.length > 0) {
    await patchRemoveTags(
      token,
      route.params.id,
      JSON.stringify({ tagIds: [...removeDuplicateTagIds] })
    )
  }
  originalModifiedTags.value = modifiedTags.value
  // 도구 정보 업데이트
  await getTool()
}

const onClickModifyTag = () => {
  modifyTag.value = !modifyTag.value
}

const onClickModifyInfo = async () => {
  const response = await patchModifyInfo(
    token,
    route.params.id,
    type.value,
    JSON.stringify(form.value)
  )

  if (response) {
    modify.value = !modify.value
  }
}

const getPagination = async (page) => {
  currentPage.value = page
  const ordering = '-createdAt'
  const data = await getSpareLogs(
    token,
    currentPage.value,
    pageSize.value,
    ordering,
    route.params.id,
    type.value,
    selectedEvent.value
  )
  logData.value = data.rows
  totalCount.value = data.count
  pages.value = Math.ceil(totalCount.value / pageSize.value)
}
watch(selectedEvent, () => {
  currentPage.value = 1
  type.value = route.params.type
  getSpareLogsList()
})

onMounted(async () => {
  getSpareLogsList()
  getTool()
  existingTags.value = (await getSpareToolTags(token)).rows.map((tag) => tag.name)
  originalModifiedTags.value = modifiedTags.value
})
</script>

<template>
  <!-- 네비게이션 바 컴포넌트를 추가합니다. -->
  <NavigationBar />

  <!-- 툴 네비게이션 바 컴포넌트를 추가합니다. -->
  <ToolNavBar />

  <!-- 컨테이너를 감싸는 div 요소를 생성합니다. -->
  <div class="container p-3">
    <!-- 탭을 나타내는 nav-pills를 생성합니다. -->
    <ul class="nav nav-pills w-100 m-3" id="pills-tab" role="tablist">
      <!-- 공구 탭 버튼을 나타내는 li 요소를 생성합니다. -->
      <li class="nav-item w-50" role="presentation">
        <button
          class="nav-link active w-100"
          data-bs-toggle="pill"
          type="button"
          role="tab"
          @click="toolsTypeTab"
        >
          <!-- 공구 탭 버튼 텍스트를 추가합니다. -->
          공구
        </button>
      </li>

      <!-- 공구 팁 탭 버튼을 나타내는 li 요소를 생성합니다. -->
      <li class="nav-item w-50" role="presentation">
        <button
          class="nav-link w-100 pl-3 pr-3"
          data-bs-toggle="pill"
          type="button"
          role="tab"
          @click="toolsTipsTypeTab"
        >
          <!-- 공구 팁 탭 버튼 텍스트를 추가합니다. -->
          공구 팁
        </button>
      </li>
    </ul>

    <!-- 탭 내용을 나타내는 영역을 생성합니다. -->
    <div
      class="tab-pane fade show active"
      id="home-tab-pane"
      role="tabpanel"
      aria-labelledby="home-tab"
      tabindex="0"
    >
      <!-- 내용을 감싸는 컨테이너를 생성합니다. -->
      <div class="container p-3 border">
        <!-- 입출고 내역 관련 정보를 나타내는 영역을 생성합니다. -->
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h5>입출고 내역</h5>

          <!-- 이벤트 선택을 위한 셀렉트 박스를 생성합니다. -->
          <select
            v-model="selectedEvent"
            style="width: 200px"
            class="form-select"
            aria-label="Default select example"
          >
            <option value="all">전체</option>
            <option value="fix">수정</option>
            <option value="withdrawal">출고</option>
            <option value="filling">입고</option>
          </select>
        </div>

        <!-- 조회 기간을 설정하는 영역을 생성합니다. -->
        <div class="mb-3 border d-flex">
          <div style="width: 20%" class="d-flex align-items-center justify-content-center">
            <div>조회기간</div>
          </div>
          <div class="d-flex flex-column justify-content-between border w-100">
            <div class="d-flex border-bottom p-2">
              <!-- 당일 조회 버튼을 생성합니다. -->
              <div class="m-1">
                <button @click="setDateRange('day')" class="btn btn-secondary">당일</button>
              </div>

              <!-- 1주일 조회 버튼을 생성합니다. -->
              <div class="m-1">
                <button @click="setDateRange('week')" class="btn btn-secondary">1주일</button>
              </div>

              <!-- 1개월 조회 버튼을 생성합니다. -->
              <div class="m-1">
                <button @click="setDateRange('month')" class="btn btn-secondary">1개월</button>
              </div>

              <!-- 3개월 조회 버튼을 생성합니다. -->
              <div class="m-1">
                <button @click="setDateRange('threeMonths')" class="btn btn-secondary">
                  3개월
                </button>
              </div>

              <!-- 6개월 조회 버튼을 생성합니다. -->
              <div class="m-1 h-100">
                <button @click="setDateRange('sixMonths')" class="btn btn-secondary">6개월</button>
              </div>

              <!-- 1년 조회 버튼을 생성합니다. -->
              <div class="m-1">
                <button @click="setDateRange('year')" class="btn btn-secondary">1년</button>
              </div>
            </div>

            <!-- 날짜 선택을 위한 date picker를 생성합니다. -->
            <div class="d-flex w-100 p-2">
              <div class="m-1">
                <DatePicker
                  style="height: 35px"
                  v-model="startDate"
                  id="start-date"
                  placeholder="시작일 선택"
                />
              </div>
              <div class="m-1">
                <DatePicker
                  style="height: 35px"
                  v-model="endDate"
                  id="end-date"
                  placeholder="종료일 선택"
                />
              </div>

              <!-- 조회 버튼을 생성합니다. -->
              <div class="d-flex justify-content-center align-items-center">
                <button
                  style="height: 35px; line-height:"
                  @click="getSpareLogsListWithDateRange"
                  class="btn btn-primary"
                >
                  조회
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 입출고 내역을 표시하는 테이블을 생성합니다. -->
        <table class="table">
          <!-- 테이블 헤더를 생성합니다. -->
          <thead class="table-dark">
            <tr>
              <th>이름</th>
              <th>입/출고</th>
              <th>수량</th>
              <th>재고</th>
              <th>시간</th>
              <th>비고</th>
            </tr>
          </thead>

          <!-- 테이블 바디를 생성합니다. -->
          <tbody>
            <!-- 로그 데이터를 반복하면서 각 행을 생성합니다. -->
            <tr @click="onClickRow(log)" v-for="(log, logIndex) in logData" :key="logIndex">
              <!-- 타입에 따라 이름을 표시합니다. -->
              <td v-if="type === 'tool'">
                {{ log.spareTool?.name || log.spareTool?.alias }}
              </td>
              <td v-else-if="type === 'tool_tip'">
                {{ log.spareToolTip?.name || log.spareToolTip?.alias }}
              </td>

              <!-- 입출고 유형을 표시합니다. -->
              <td :class="getRowClass(log)">
                {{
                  log.isFix
                    ? '수정'
                    : log.amountOfChange > 0
                      ? '입고'
                      : log.amountOfChange < 0 && '출고'
                }}
              </td>

              <!-- 수량을 표시합니다. -->
              <td :class="getRowClass(log)">{{ log.amountOfChange }}</td>

              <!-- 재고를 표시합니다. -->
              <td :class="getRowClass(log)">{{ log.resultCount }}</td>

              <!-- 시간을 표시합니다. -->
              <td :class="getRowClass(log)">
                {{ new Date(log.createdAt).toLocaleString() }}
              </td>

              <!-- 비고를 표시합니다. -->
              <td :class="getRowClass(log)">{{ log.remark }}</td>
            </tr>
          </tbody>
        </table>

        <!-- 페이지네이션 바 컴포넌트를 추가합니다. -->
        <Paginationbar
          :pages="pages"
          :currentPage="currentPage"
          :fetchData="getPaginationWithDateRange"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

// 필요한 모듈들을 import 합니다.
import { format, sub } from 'date-fns'
import { useRouter } from 'vue-router'
import DatePicker from 'vue3-datepicker'

// API 호출을 위한 함수를 import 합니다.
import { getSpareLogs } from '../../api/getApi'
// 사용자 정의 컴포넌트들을 import 합니다.
import NavigationBar from '../../components/NavigationBar.vue'
import Paginationbar from '../../components/PaginationBar.vue'
import ToolNavBar from '../../components/ToolNavBar.vue'

// Vue Router를 사용하기 위해 router 객체를 생성합니다.
const router = useRouter()

// 상태 변수들을 정의합니다.
const currentPage = ref(1)
const pages = ref(1)
const pageSize = ref(15)
const token = localStorage.getItem('tokens')
const selectedEvent = ref('all')
const setTab = ref('tools')
const type = ref('')
const totalCount = ref(0)
const logData = ref([])

// 시작일과 종료일을 설정하는 변수들을 생성하고 초기화합니다.
const startDate = ref(sub(new Date(), { months: 1 }))
const endDate = ref(new Date())
endDate.value.setDate(endDate.value.getDate() + 1)
// 날짜 범위에 따라 로그를 가져오는 함수를 정의합니다.
const getSpareLogsListWithDateRange = async () => {
  // 페이지 초기화
  currentPage.value = 1

  // 탭에 따른 로그 유형 설정
  if (setTab.value === 'tools') {
    type.value = 'tool'
  } else {
    type.value = 'tool_tip'
  }

  // 정렬 기준 설정
  const ordering = '-createdAt'

  // API 호출
  const data = await getSpareLogs(
    token,
    currentPage.value,
    pageSize.value,
    ordering,
    undefined,
    type.value,
    selectedEvent.value,
    format(startDate.value, 'yyyy-MM-dd'),
    format(endDate.value, 'yyyy-MM-dd')
  )

  // 로그 데이터 갱신
  logData.value = data.rows
  totalCount.value = data.count
  pages.value = Math.ceil(totalCount.value / pageSize.value)
}

// 페이지 변경 시 데이터를 가져오는 함수를 정의합니다.
const getPaginationWithDateRange = async (page) => {
  // 현재 페이지 갱신
  currentPage.value = page

  // 탭에 따른 로그 유형 설정
  if (setTab.value === 'tools') {
    type.value = 'tool'
  } else {
    type.value = 'tool_tip'
  }

  // 정렬 기준 설정
  const ordering = '-createdAt'

  // API 호출
  const data = await getSpareLogs(
    token,
    currentPage.value,
    pageSize.value,
    ordering,
    undefined,
    type.value,
    selectedEvent.value,
    format(startDate.value, 'yyyy-MM-dd'),
    format(endDate.value, 'yyyy-MM-dd')
  )

  // 로그 데이터 갱신
  logData.value = data.rows
  totalCount.value = data.count
  pages.value = Math.ceil(totalCount.value / pageSize.value)
}

// 날짜 범위를 설정하는 함수를 정의합니다.
const setDateRange = (range) => {
  const today = new Date()
  switch (range) {
    case 'day':
      startDate.value = sub(today, { days: 0 })
      break

    case 'week':
      startDate.value = sub(today, { weeks: 1 })
      break
    case 'month':
      startDate.value = sub(today, { months: 1 })
      break
    case 'threeMonths':
      startDate.value = sub(today, { months: 3 })
      break
    case 'sixMonths':
      startDate.value = sub(today, { months: 6 })
      break
    case 'year':
      startDate.value = sub(today, { years: 1 })
      break
    default:
      break
  }
}

// 로그 행을 클릭할 때의 동작을 정의하는 함수를 생성합니다.
const onClickRow = (row) => {
  // 클릭된 로그에 따라 탭과 ID를 설정하고 페이지를 이동합니다.
  if ('spareTool' in row) {
    type.value = 'tools'
    router.push(`/tools/sparelist/${type.value}/${row.spareToolId}`)
  } else if ('spareToolTip' in row) {
    type.value = 'tool_tips'
    router.push(`/tools/sparelist/${type.value}/${row.spareToolTipId}`)
  }
}

// 공구 탭을 선택했을 때의 동작을 정의하는 함수를 생성합니다.
const toolsTypeTab = () => {
  // 페이지 초기화
  currentPage.value = 1

  // 탭 설정
  setTab.value = 'tools'

  // 날짜 범위에 따라 로그를 가져옵니다.
  getSpareLogsListWithDateRange()
}

// 공구 팁 탭을 선택했을 때의 동작을 정의하는 함수를 생성합니다.
const toolsTipsTypeTab = () => {
  // 페이지 초기화
  currentPage.value = 1

  // 탭 설정
  setTab.value = 'tools_tips'

  // 날짜 범위에 따라 로그를 가져옵니다.
  getSpareLogsListWithDateRange()
}

// 선택된 이벤트가 변경될 때의 동작을 정의합니다.
watch(selectedEvent, () => {
  // 페이지 초기화
  currentPage.value = 1

  // 탭 설정
  type.value = setTab.value

  // 날짜 범위에 따라 로그를 가져옵니다.
  getSpareLogsListWithDateRange()
})

// 로그 행의 클래스를 동적으로 설정하는 함수를 정의합니다.
const getRowClass = (log) => {
  if (log.isFix === true) return 'text-warning'
  if (log.amountOfChange > 0) return 'text-primary'
  if (log.amountOfChange < 0) return 'text-danger'
}

// 컴포넌트가 마운트될 때 초기 데이터를 가져옵니다.
getSpareLogsListWithDateRange()
</script>

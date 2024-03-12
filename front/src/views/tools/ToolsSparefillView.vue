<template>
  <NavigationBar />
  <ToolNavBar />

  <div class="container">
    <ul class="nav nav-pills w-100 m-3" id="pills-tab" role="tablist">
      <li class="nav-item w-50" role="presentation">
        <button
          class="nav-link active w-100"
          id="pills-home-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-home"
          type="button"
          role="tab"
          aria-controls="pills-home"
          aria-selected="true"
          @click="toolsTypeTab"
        >
          공구
        </button>
      </li>
      <li class="nav-item w-50" role="presentation">
        <button
          class="nav-link w-100 pl-3 pr-3"
          id="pills-profile-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-profile"
          type="button"
          role="tab"
          aria-controls="pills-profile"
          aria-selected="false"
          @click="toolsTipsTypeTab"
        >
          공구 팁
        </button>
      </li>
    </ul>

    <div class="tab-content" id="pills-tabContent ">
      <div
        class="tab-pane fade show active p-3"
        id="pills-home"
        role="tabpanel"
        aria-labelledby="pills-home-tab"
        tabindex="0"
      >
        <div class="container mt-4">
          <div class="border bg-light">
            <div class="d-flex justify-content-between align-items-center row p-2">
              <div class="col-auto mr-auto">
                <h5>🖊 공구 목록</h5>
              </div>

              <div class="col-4">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    v-model="searchText"
                    placeholder="이름, 별칭, 그룹"
                  />
                  <div class="input-group-append">
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="onClickSearchText"
                    >
                      조회
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container mt-4">
          <table class="table w-100">
            <thead class="bg-dark text-white">
              <tr class="p-5 table-dark">
                <th>Name</th>
                <th>Alias</th>
                <th>Group</th>
                <th>Count</th>
                <th>안전재고</th>
                <th>Tag</th>
                <th>기능</th>
              </tr>
            </thead>
            <tbody>
              <tr @click="onClickRow(row)" v-for="(row, rowIndex) in rowList" :key="rowIndex">
                <td>{{ row.name }}</td>
                <td>{{ row.alias }}</td>
                <td>{{ row.group }}</td>
                <td>{{ row.count }}</td>
                <td>{{ row.safetyStockCount }}</td>
                <td>
                  <span
                    v-for="(tag, tagIndex) in row.tags"
                    :key="tagIndex"
                    class="badge bg-secondary m-1"
                    >{{ tag.name }}</span
                  >
                </td>
                <td>
                  <button
                    @click.stop="onClickModifyStock(row)"
                    type="button"
                    class="btn btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#stockModal"
                  >
                    입고
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="modal fade"
        id="stockModal"
        tabindex="-1"
        aria-labelledby="stockModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-primary">
              <h1 class="modal-title fs-5" id="stockModalLabel">입고</h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body border m-3">
              <div class="d-flex align-items-center p-3">
                <div class="m-1">
                  {{ rowModalInfo.name ? rowModalInfo.name : rowModalInfo.alias }}
                </div>
                <span class="badge text-bg-secondary m-1">{{ rowModalInfo.count }}</span>
              </div>
              <div class="d-flex">
                <div class="form-group m-2 mb-3">
                  <label for="group" class="form-label">수량</label>
                  <input v-model="count" type="text" class="form-control" id="group" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                @click="fatchToolsCount"
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 분리선-->
      <div
        class="tab-pane fade p-3"
        id="pills-profile"
        role="tabpanel"
        aria-labelledby="pills-profile-tab"
        tabindex="0"
      >
        <div class="container mt-4">
          <div class="border w-100 bg-light">
            <div class="d-flex w-100 justify-content-between align-items-center row p-2">
              <div class="col-auto mr-auto">
                <h5>💠 공구팁 목록</h5>
              </div>

              <div class="col-4">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    v-model="searchText"
                    placeholder="이름, 별칭, 그룹"
                  />
                  <div class="input-group-append">
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="onClickSearchText"
                    >
                      조회
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container mt-4">
          <table class="table w-100">
            <thead class="bg-dark text-white">
              <tr class="p-5 table-dark">
                <th>Name</th>
                <th>Alias</th>
                <th>Group</th>
                <th>Count</th>
                <th>안전재고</th>
                <th>Tag</th>
                <th>기능</th>
              </tr>
            </thead>
            <tbody>
              <tr @click="onClickRow(row)" v-for="(row, rowIndex) in rowList" :key="rowIndex">
                <td>{{ row.name }}</td>
                <td>{{ row.alias }}</td>
                <td>{{ row.group }}</td>
                <td>{{ row.count }}</td>
                <td>{{ row.safetyStockCount }}</td>
                <td>
                  <span
                    v-for="(tag, tagIndex) in row.tags"
                    :key="tagIndex"
                    class="badge bg-secondary m-1"
                    >{{ tag.name }}</span
                  >
                </td>
                <td>
                  <button
                    @click.stop="onClickModifyStock(row)"
                    type="button"
                    class="btn btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#stockModal2"
                    style="z-index: 9999"
                  >
                    입고
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="stockModal2"
      tabindex="-1"
      aria-labelledby="stockModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary">
            <h1 class="modal-title fs-5" id="stockModalLabel">입고</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body border m-3">
            <div class="d-flex align-items-center p-3">
              <div class="m-1">
                {{ rowModalInfo.name ? rowModalInfo.name : rowModalInfo.alias }}
              </div>
              <span class="badge text-bg-secondary m-1">{{ rowModalInfo.count }}</span>
            </div>
            <div class="d-flex">
              <div class="form-group m-2 mb-3">
                <label for="group" class="form-label">수량</label>
                <input v-model="count" type="text" class="form-control" id="group" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              @click="fatchToolTipsCount"
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <PaginationBar :pages="pageNums" :currentPage="currentPage" :fetchData="fetchSpareList" />
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'

import { useRouter } from 'vue-router'

import { getSpareToolsList, getSpareToolTipsList } from '../../api/getApi'
import { patchChangeToolsStockCount, patchChangeToolTipsStockCount } from '../../api/patchApi'
import NavigationBar from '../../components/NavigationBar.vue'
import PaginationBar from '../../components/PaginationBar.vue'
import ToolNavBar from '../../components/ToolNavBar.vue'

const token = localStorage.getItem('tokens')
const pageNums = ref(1)
const currentPage = ref(1)
const pageSize = ref(15)
const ordering = ref('group,name,alias')
const isUnsafe = ref(false)
const searchText = ref('')
const rowList = ref([])
const setTab = ref('tools')
const searchTextResult = ref('')
const rowModalInfo = ref({})
const router = useRouter()
const count = ref(0)
const type = ref('')
const toolsTypeTab = () => {
  currentPage.value = 1
  setTab.value = 'tools'
  fetchData()
}

const toolsTipsTypeTab = () => {
  currentPage.value = 1
  setTab.value = 'tools_tips'
  fetchData()
}

const fetchData = async (search) => {
  const data = await (setTab.value === 'tools'
    ? getSpareToolsList(
        token,
        currentPage.value,
        pageSize.value,
        ordering.value,
        isUnsafe.value,
        search
      )
    : getSpareToolTipsList(
        token,
        currentPage.value,
        pageSize.value,
        ordering.value,
        isUnsafe.value,
        search
      ))

  pageNums.value = Math.ceil(data.count / pageSize.value)
  rowList.value = data.rows
}
const onClickRow = (row) => {
  if ('toolId' in row) {
    type.value = 'tools'
  } else if ('toolTipId' in row) {
    type.value = 'tool_tips'
  }

  router.push(`/tools/sparelist/${type.value}/${row.id}`)
}

const onClickModifyStock = (row) => {
  count.value = 0

  rowModalInfo.value = row
}

const fetchSpareList = async (page) => {
  currentPage.value = page
  if (searchTextResult.value) fetchData(searchTextResult.value)
  else fetchData()
}

const fatchToolsCount = async () => {
  const body = {
    amountOfChange: Number(count.value),
    isFix: false,
    remark: ''
  }

  await patchChangeToolsStockCount(token, rowModalInfo.value, undefined, JSON.stringify(body))
  fetchData()
}

const fatchToolTipsCount = async () => {
  const body = {
    amountOfChange: Number(count.value),
    isFix: false,
    remark: ''
  }

  await patchChangeToolTipsStockCount(token, rowModalInfo.value, undefined, JSON.stringify(body))
  fetchData()
}

const onClickSearchText = () => {
  currentPage.value = 1
  searchTextResult.value = searchText.value
  fetchData(searchTextResult.value)
}

watch(setTab, () => {
  searchText.value = ''
})

onMounted(() => {
  fetchData()
})
</script>

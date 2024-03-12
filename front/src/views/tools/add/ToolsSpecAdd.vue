<template>
  <NavBar />
  <ToolNavBar />
  <div class="container p-3">
    <div>
      <form id="toolTypeItemForm" @submit.prevent="onSubmit">
        <div class="mt-4">
          <div class="col">
            <h3 class="mb-3">
              <button class="btn btn-secondary mr-2" @click.prevent="$router.back()">◀</button>
              <h3>🖊 공구 상세 추가</h3>
            </h3>
            <hr />
            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label for="tooltype">공구 타입</label>
                  <select
                    v-model="selectedTypeId"
                    class="form-select w-50"
                    aria-label="Default select example"
                  >
                    <option v-for="(type, index) in typeList" :key="index" :value="type.name">
                      {{ type.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-3">
                <div class="form-group">
                  <label for="tooldia">직경</label>
                  <input
                    type="number"
                    class="form-control"
                    id="tooldia"
                    step="0.1"
                    v-model="form.diameter"
                  />
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label for="toolrad">팁반경</label>
                  <input
                    type="number"
                    class="form-control"
                    id="toolrad"
                    step="0.1"
                    v-model="form.tipRadius"
                  />
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label for="toolnumofflat">날수</label>
                  <input
                    type="number"
                    class="form-control"
                    id="toolnumofflat"
                    v-model="form.pointAngle"
                  />
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label for="toolangle">각도(드릴)</label>
                  <input
                    type="number"
                    class="form-control"
                    id="toolangle"
                    step="0.1"
                    v-model="form.numberOfFlutes"
                  />
                </div>
              </div>
            </div>
            <hr class="mb-4" />
            <button class="btn btn-primary btn-lg" type="submit" style="width: 100%">OK</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import { useRouter } from 'vue-router'

import { getToolTypeNameList } from '../../../api/getApi'
import { postTools } from '../../../api/postApi'
import NavBar from '../../../components/NavigationBar.vue'
import ToolNavBar from '../../../components/ToolNavBar.vue'

const token = localStorage.getItem('tokens')
const router = useRouter()

const typeList = ref([])
const selectedTypeId = ref('')
const form = ref({
  toolTypeId: '',
  isUnused: false,
  diameter: 0,
  tipRadius: 0,
  pointAngle: 0,
  numberOfFlutes: 0
})

const fetchGetToolTypes = async () => {
  const res = await getToolTypeNameList(token)
  typeList.value = res.rows
}

const findId = () => {
  const found = typeList.value.find((row) => row.name === selectedTypeId.value)
  form.value.toolTypeId = found.id
}

const onSubmit = async () => {
  const res = await postTools(token, JSON.stringify(form.value))

  if (res) {
    router.push('/tools/tools_spec/')
  }
}

watch(selectedTypeId, () => {
  findId()
})

fetchGetToolTypes()
</script>

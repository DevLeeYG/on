<template>
  <Navbar />
  <ToolNavBar />
  <div class="container p-3">
    <div>
      <h4>Tag관리</h4>
    </div>
    <div>
      <span
        class="badge m-1"
        v-for="(tag, tagIndex) in toolTags"
        :class="{ selected: tag.selected }"
        :style="{ backgroundColor: tag.selected ? '#495057' : '#6c757d' }"
        :key="tagIndex"
        @click="toggleTagSelection(tag)"
        >{{ tag.name }}</span
      >
    </div>
    <hr />
    <div>
      <span
        class="badge m-1"
        v-for="(tag, tagIndex) in selectedTags"
        :class="{ selected: tag.selected }"
        :style="{ backgroundColor: tag.selected ? '#495057' : '#6c757d' }"
        :key="tagIndex"
      >
        {{ tag.name }}
      </span>
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in toolArray" :key="rowIndex">
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
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'

import { getSpareToolTagId, getSpareToolTags, getToolsdata } from '../../api/getApi'
import Navbar from '../../components/NavigationBar.vue'
import ToolNavBar from '../../components/ToolNavBar.vue'

const toolTags = ref([])
const token = localStorage.getItem('tokens')
const toolArray = ref(new Set())

const fetchSpareToolTags = async () => {
  const data = await getSpareToolTags(token)
  toolTags.value = data.rows
}

const toggleTagSelection = async (tag) => {
  tag.selected = !tag.selected

  const selectedTags = toolTags.value.filter((t) => t.selected)

  if (selectedTags.length > 0) {
    const toolPromises = selectedTags.map(async (selectedTag) => {
      const data = await getSpareToolTagId(token, selectedTag.id)
      let array = []

      if (data.spareTools.length > 0) {
        const type = 'tool'
        for (const id of data.spareTools) {
          const tooldata = await getToolsdata(token, type, id.id)

          array.push(tooldata)
        }
      } else if (data.spareToolTips) {
        const type = 'tool_tip'
        for (const id of data.spareToolTips) {
          const tooldata = await getToolsdata(token, type, id.id)
          array.push(tooldata)
        }
      }

      return array
    })

    const toolArrays = await Promise.all(toolPromises)

    const matchingTools = toolArrays.reduce((result, currentArray) =>
      result.filter((tool) => currentArray.some((currentTool) => tool.id === currentTool.id))
    )

    toolArray.value = new Set([...matchingTools])
  } else {
    toolArray.value = new Set([])
  }
}
const selectedTags = computed(() => toolTags.value.filter((tag) => tag.selected))
fetchSpareToolTags()
</script>

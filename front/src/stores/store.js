import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: null
  }),
  actions: {
    setUser(user) {
      this.user = user
    }
  }
})

export const useNamesStore = defineStore({
  id: 'names',
  state: () => {
    const names = ref('')

    const loadFromLocalStorage = () => {
      const storedNames = localStorage.getItem('name')
      if (storedNames) {
        names.value = storedNames
      }
    }

    const saveToLocalStorage = () => {
      localStorage.setItem('name', names.value)
    }

    const actions = {
      addName(name) {
        names.value = name
        saveToLocalStorage()
      },
      loadFromLocalStorage
    }

    loadFromLocalStorage()

    return { names, ...actions }
  }
})

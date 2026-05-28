import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore('main', () => {
  const user = ref({
    id: 0,
    token: '',
    classId: 0,
    questionId: 0,
    unitId: 0,
    subjectId: 0
  })

  const event = ref<unknown>(null)

  const page = ref({
    type: 0
  })

  return {
    user,
    event,
    page
  }
})

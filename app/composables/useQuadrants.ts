import { ref } from 'vue'
import type { Task,TimePeriod } from '~/services/types/task'

export type QuadrantKey =
  | 'urgent_important'
  | 'not_urgent_important'
  | 'urgent_not_important'
  | 'not_urgent_not_important'

export function useQuadrants() {
  const newTask = ref('')
  const activeQuadrant = ref<QuadrantKey | null>(null)

  const quadrants = ref([
    {
      id: 'urgent_important',
      title: 'Urgente e Importante',
      subtitle: 'Hacer ahora',
      color: 'from-rose-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-rose-50 to-pink-50',
      borderColor: 'border-rose-200',
      textColor: 'text-rose-700',
      hoverColor: 'hover:from-rose-600 hover:to-pink-600'
    },
    {
      id: 'not_urgent_important',
      title: 'No Urgente pero Importante',
      subtitle: 'Planificar',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      hoverColor: 'hover:from-blue-600 hover:to-indigo-600'
    },
    {
      id: 'urgent_not_important',
      title: 'Urgente pero No Importante',
      subtitle: 'Delegar',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      hoverColor: 'hover:from-amber-600 hover:to-orange-600'
    },
    {
      id: 'not_urgent_not_important',
      title: 'No Urgente ni Importante',
      subtitle: 'Eliminar',
      color: 'from-gray-500 to-slate-500',
      bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-700',
      hoverColor: 'hover:from-gray-600 hover:to-slate-600'
    }
  ])

  const tasks = ref<Record<QuadrantKey, Task[]>>({
    urgent_important: [],
    not_urgent_important: [],
    urgent_not_important: [],
    not_urgent_not_important: []
  })

  function setTask(newTasks: Task[]) {
    const grouped: Record<QuadrantKey, Task[]> = {
      urgent_important: [],
      not_urgent_important: [],
      urgent_not_important: [],
      not_urgent_not_important: []
    }

    newTasks.forEach(task => {
      grouped[task.type_task].push(task)
    })
    tasks.value = grouped
  }

  function addLocalTask(quadrantId: QuadrantKey, timePeriodid: TimePeriod) {
    if (newTask.value.trim()) {

      const data = {
        id: Date.now(),
        owner: 1,
        title: newTask.value,
        date: new Date().toISOString(),
        type_task: quadrantId,
        period: timePeriodid,
      }

      tasks.value[quadrantId].push(data)
      newTask.value = ''
      activeQuadrant.value = null

      return data;
    }
  }
    function deleteLocalTask(quadrantId: QuadrantKey, taskId: number) {
        const index = tasks.value[quadrantId].findIndex(t => t.id === taskId);
        if (index > -1) {
            tasks.value[quadrantId].splice(index, 1);
        }
        return index
    }
  return {
    quadrants,
    tasks,
    newTask,
    activeQuadrant,

    addLocalTask,
    setTask,
    deleteLocalTask,
  }
}
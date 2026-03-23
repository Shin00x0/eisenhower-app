import { ref } from "vue"
import type { Task } from "~/services/types/task"

export function useTask() {
    const taskStore = useTaskStore()
    const initialized = ref(false)

    onMounted(async () => {
        if(!initialized.value) {
            console.log("Se ha inicializado")
            await taskStore.fetchTasks()
            initialized.value = true
        }
    })

    // exponer datos reactivos
    const tasks_data = computed(() => taskStore.task)
    const loading = computed(() => taskStore.loading)
    const error = computed(() => taskStore.error)


    async function addTask(new_task: Task) {
        await taskStore.createTask(new_task)
    }
    async function deleteTask(id: number) {
        await taskStore.deleteTask(id)
    }
    async function updateTask(id_task: number, updatedData: Partial<Task>) {
        await taskStore.updateTask(id_task, updatedData)
    }

    return {
        tasks_data,
        loading,
        error,

        addTask,
        deleteTask,
        updateTask,

        taskStore
    }

}
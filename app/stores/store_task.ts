import { defineStore } from 'pinia'
import { getAllTask,createTask,deleteTask,updateTask } from '~/services/data/task_repo'
import type { Task } from '~/services/types/task'

export const useTaskStore = defineStore('taskStore', {
    state: () => ({
        user: {},
        task: [] as Task[],
        loading: false,
        error: null as string | null
    }),
    actions: {
        async fetchTasks() {
            this.loading = true
            try {
                const data = await getAllTask()
                this.task = data
                console.log(this.task)
            } catch (e: any) {
                this.error = e.message || 'Error al obtener tareas'
                console.error(e)
            } finally {
                this.loading = false
            }
        },
        async createTask(newTask: Task) {
            this.loading = true
            this.error = null
            try {
                await createTask(newTask)
                this.task.push(newTask)
            } catch (e: any) {
                this.error = e.message || 'Error al crear tarea'
                console.error(e)
            } finally {
                this.loading = false
            }
        },
        /*
        async updateTask(id_task: number, updatedTask: Partial<Task>) {
            this.loading = true
            this.error = null
            try {
                await updateTask(updatedTask as Task, id_task)
                const index = this.task.findIndex(t => t.id === id_task)
                if (index !== -1) {
                this.task[index] = { ...this.task[index], ...updatedTask }
                }
            } catch (e: any) {
                this.error = e.message || 'Error al actualizar tarea'
                console.error(e)
            } finally {
                this.loading = false
            }
        },
        */
        async deleteTask(id_task: number) {
            this.loading = true
            this.error = null
            try {
                await deleteTask(id_task)
                this.task = this.task.filter(t => t.id !== id_task)
            } catch (e: any) {
                this.error = e.message || 'Error al eliminar tarea'
                console.error(e)
            } finally {
                this.loading = false
            }
        }
    },

})
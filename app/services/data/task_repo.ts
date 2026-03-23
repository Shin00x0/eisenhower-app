
import supabase from '../supabase_services'
import type { Task }  from '../types/task'


export const getAllTask = async () => {
    try {
        const { data, error} = await supabase.from('task').select()
        if (error) throw error 
        return data as Task[]
    } catch (e) {
        console.error(e)
    }
    return [] as Task[]
}
export const createTask = async (new_taks: Task) => {
    try {
        const { data, error} = await supabase.from('task').insert([new_taks])
        if (error) throw error 
    } catch (e) {
        console.error(e)
    }
}
export const updateTaskRepo = async (task: Task, id_task: number) => {
    try {
        const { data, error} = await supabase.from('task').update(task).match({'id': id_task})
        if (error) throw error 
    } catch (e) {
        console.error(e)
    }
}
export const deleteTaskRepo = async (id_task: number) => {
    try {
        const { data, error} = await supabase.from('task').delete().match( {id: id_task})
        if (error) throw error 
        console.log(`Tarea con id ${id_task} eliminada en la base de datos`)
    } catch (e) {
        console.error(e)
    }
}


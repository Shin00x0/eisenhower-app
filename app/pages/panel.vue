<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { watch } from 'vue'
import { useTask } from '../composables/useTask';
import { useQuadrants } from '../composables/useQuadrants';
import type { Task, TimePeriod } from '~/services/types/task';


const isEditing = ref(false)

// componenet:
const selectedPeriod = ref<String>('day')
const taskCounts = ref({
    day: 5,
    week: 12,
    month: 28
})
const currentPeriodId = 'day'

const taskInput = ref(null)
const editingTaskId = ref<number | null>(null)
const editingQuadrantId = ref<QuadrantKey | null>(null)

function resetEditingState() {
    activeQuadrant.value = null
    editingTaskId.value = null
    editingQuadrantId.value = null
    newTask.value = ''
}

function openInput(quadrantId : QuadrantKey) {
    activeQuadrant.value = quadrantId
    nextTick(() => {
        const inputs = taskInput;
        if (inputs) {
            const input = Array.isArray(inputs) ? inputs[0] : inputs;
            // input is not a function error, entonces verifico si es un array o no, y luego le hago focus
            input?.value.focus();
        }
    });
}

function editInputTask(quadrantId: QuadrantKey, taskId: number) {
    activeQuadrant.value = quadrantId
    editingQuadrantId.value = quadrantId
    editingTaskId.value = taskId

    // no existe task, existe task_data, entonces busco en task_data
    const task = tasks_data.value.find(t => t.id === taskId)
    if (task) {
        newTask.value = task.title
    }
    nextTick(() => {
        const inputs = taskInput;
        if (inputs) {
            const input = Array.isArray(inputs) ? inputs[0] : inputs;
            input?.focus();
        }
    });
}

async function handleSaveTask(quadrantId: QuadrantKey) {
    if (editingTaskId.value !== null) {
        await handleUpdate(editingTaskId.value, { title: newTask.value })
        resetEditingState()
    } else {
        await handleAdd(quadrantId, currentPeriodId)
        resetEditingState()
    }
}


// llamando composables:
const { quadrants,newTask,tasks,activeQuadrant,addLocalTask,deleteLocalTask,setTask  } = useQuadrants()
const { tasks_data, loading, addTask, deleteTask,updateTask } = useTask()

watch(
  tasks_data,
  (newTasks) => {
    setTask(newTasks)
  },
  { immediate: true } // para que también se ejecute al montar
)
async function handleAdd(quadrantId: QuadrantKey, timePeriodid: TimePeriod) {
    const data = addLocalTask(quadrantId,timePeriodid) as Task
    await addTask(data)
}
async function handleUpdate(taskId: number, updatedData: Partial<Task>) {
    // Aquí podrías actualizar la tarea localmente si es necesario
    // Luego llamas a la función del store para actualizar en la base de datos
    await updateTask(taskId, updatedData)
}
async function handleDelete(quadrantId: QuadrantKey, taskId: number) {
    console.log(`Eliminando tarea con id ${taskId} del cuadrante ${quadrantId}`)
    const index_task = deleteLocalTask(quadrantId,taskId) as number
    console.log(index_task);
    await deleteTask(taskId)
}

</script>

<template>
        <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
            <!-- Animated Background Elements -->
            <div class="fixed inset-0 overflow-hidden pointer-events-none">
                <div class="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div class="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

  

            <div class="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
                <!-- Header -->
                <div class="text-center mb-12 animate-fade-in-down">
                    <div class="flex items-center justify-center gap-3 mb-3">
                        <svg class="w-8 h-8 text-purple-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                        </svg>
                        <h1 class="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Matriz de Eisenhower
                        </h1>
                        <svg class="w-8 h-8 text-purple-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                        </svg>
                    </div>
                    <p class="text-slate-500 text-lg animate-fade-in">Organiza tus tareas por prioridad y urgencia de Hoy</p>
                </div>

            <time-period-select 
                v-model="selectedPeriod"
                :task-counts="taskCounts">
            </time-period-select>

                <!-- Matrix Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div v-for="(quadrant, index) in quadrants" 
                         :key="quadrant.id"
                         :class="[quadrant.bgColor, quadrant.borderColor]"
                         class="rounded-2xl border-2 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] animate-slide-in-up"
                         :style="{ animationDelay: `${index * 100}ms` }">
                        
                        <!-- Quadrant Header -->
                        <div class="mb-4">
                            <div :class="['inline-block px-4 py-2 rounded-full bg-gradient-to-r', quadrant.color, 'text-white text-sm font-semibold mb-2 hover:scale-105 transition-transform duration-300']">
                                {{ quadrant.subtitle }}
                            </div>
                            <h2 :class="['text-xl font-bold', quadrant.textColor]">
                                {{ quadrant.title }}
                            </h2>
                        </div>

                        <!-- Tasks List -->
                        <div class="space-y-2 mb-4 min-h-[200px]">
                            <transition-group name="task">
                                <div v-for="task in tasks[quadrant.id as QuadrantKey]" 
                                     :key="task.id"
                                     class="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center justify-between group hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                                    <div class="flex items-center gap-3 flex-1">
                                        <svg class="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h4m0 0V4m0 4l-4-4m16 0l-4 4m0 0V4m0 4h4"></path>
                                        </svg>
                                        <span class="text-slate-700">{{ task.title }}</span>
                                    </div>
                                    <!-- Button edit task-->
                                    <button @click="editInputTask(quadrant.id as QuadrantKey, task.id)"
                                            class="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 hover:bg-blue-50 rounded-lg hover:scale-110 mr-2">
                                        <svg class="w-4 h-4 text-slate-400 hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                    </button>

                                    <button @click="handleDelete(quadrant.id as QuadrantKey, task.id)"
                                            class="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 hover:bg-red-50 rounded-lg hover:scale-110">
                                        <svg class="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </transition-group>
                        </div>

                        <!-- Add Task Input -->
                        <transition name="fade">
                            <div v-if="activeQuadrant === quadrant.id" class="flex gap-2">
                                <input type="text"
                                       v-model="newTask"
                                       @keyup.enter="handleSaveTask(quadrant.id)"
                                       @keyup.esc="resetEditingState()"
                                       :placeholder="editingTaskId ? 'Editar tarea...' : 'Nueva tarea...'"
                                       class="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-slate-400 focus:outline-none bg-white focus:ring-2 focus:ring-slate-200 transition-all duration-200"
                                       ref="taskInput">
                                <button @click="handleSaveTask(quadrant.id)"
                                        :class="['px-6 py-3 rounded-xl bg-gradient-to-r', quadrant.color, quadrant.hoverColor, 'text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95']">
                                    {{ editingTaskId ? 'Editar' : 'Añadir' }}
                                </button>
                            </div>

                            <button v-else
                                    @click="openInput(quadrant.id as QuadrantKey)"
                                    class="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-600 hover:bg-white transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                <span>Añadir tarea</span>
                            </button>
                        </transition>
                    </div>
                </div>

                <!-- Footer Info -->
                <div class="mt-12 text-center animate-fade-in">
                    <div class="inline-block bg-white rounded-2xl shadow-sm border border-slate-200 px-6 py-4 hover:shadow-md hover:scale-105 transition-all duration-300">
                        <p class="text-slate-500 text-sm">
                            <span class="font-semibold text-slate-700">💡 Tip:</span> Enfócate primero en las tareas urgentes e importantes
                        </p>
                    </div>
                </div>
            </div>
        </div>

</template>







<style>
    @keyframes blob {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(20px, -50px) scale(1.1); }
        50% { transform: translate(-20px, 20px) scale(0.9); }
        75% { transform: translate(50px, 50px) scale(1.05); }
    }
    @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    .animate-blob {
        animation: blob 7s infinite;
    }
    .animation-delay-2000 {
        animation-delay: 2s;
    }
    .animation-delay-4000 {
        animation-delay: 4s;
    }
    .animate-fade-in-down {
        animation: fadeInDown 0.6s ease-out;
    }
    .animate-fade-in {
        animation: fadeIn 0.8s ease-out 0.3s both;
    }
    .animate-slide-in-up {
        animation: slideInUp 0.5s ease-out;
    }
    .animate-scale-in {
        animation: scaleIn 0.3s ease-out;
    }
    .animate-shake {
        animation: shake 0.3s ease-in-out;
    }
    .task-enter-active {
        animation: scaleIn 0.4s ease-out;
    }
    .task-leave-active {
        animation: shake 0.3s ease-in-out;
        opacity: 0;
    }
    .fade-enter-active, .fade-leave-active {
        transition: all 0.3s ease;
    }
    .fade-enter-from {
        opacity: 0;
        transform: translateY(-10px);
    }
    .fade-leave-to {
        opacity: 0;
        transform: scale(0.8);
    }
</style>
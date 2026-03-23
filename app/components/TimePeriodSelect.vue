<script setup lang="ts">
import { ref } from 'vue';
//const emit = defineEmits(['inFocus', 'submit'])

const periods = ref([
        {
            value: 'day',
            label: 'Día',
            color: 'from-rose-500 to-pink-500',
            icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
        },
        {
            value: 'week',
            label: 'Semana',
            color: 'from-blue-500 to-indigo-500',
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
        },
        {
            value: 'month',
            label: 'Mes',
            color: 'from-purple-500 to-violet-500',
            icon: 'M8 7V3m8 4V3m-9 4h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm4-10h6m-6 4h3'
        }
])

interface TaskCounts {
  day: number
  week: number
  month: number
}

const props = defineProps<{
  modelValue: string
  taskCounts: TaskCounts
}>()

const emit = defineEmits(['update:modelValue', 'change'])

function selectPeriod(value : string) {
  emit('update:modelValue', value)
  emit('change', value)
}

</script>

<template>
    <div class="flex justify-center animate-fade-in mb-6">
        <div class="inline-flex bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-2 gap-2 hover:shadow-xl transition-shadow duration-300">
            <button v-for="period in periods" 
                    :key="period.value"
                    @click="selectPeriod(period.value)"
                    :class="[
                        'px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 relative overflow-hidden ',
                        modelValue === period.value 
                            ? 'bg-gradient-to-r ' + period.color + ' text-white shadow-md scale-105' 
                            : 'text-slate-600 hover:bg-slate-50 hover:scale-105 active:scale-95'
                    ]">
                <!-- Icono -->
                <svg class="w-5 h-5 relative z-10" :class="modelValue === period.value ? 'animate-pulse' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="period.icon"></path>
                </svg>
                
                <!-- Label -->
                <span class="relative z-10">{{ period.label }}</span>
                
                <!-- Badge de contador -->
                <transition name="fade">
                    <span v-if="modelValue === period.value && taskCounts[period.value as keyof TaskCounts] > 0" 
                            class="ml-1 px-2 py-0.5 bg-white bg-opacity-30 rounded-full text-xs font-bold relative z-10 animate-scale-in">
                        {{ taskCounts[period.value as keyof TaskCounts] }}
                    </span>
                </transition>
                
                <!-- Efecto de brillo al hover -->
                <div v-if="modelValue !== period.value" 
                        class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transition-opacity duration-300 transform -skew-x-12"></div>
            </button>
        </div>
    </div>
</template>
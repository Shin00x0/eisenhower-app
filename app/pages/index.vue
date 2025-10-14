<script setup lang="ts">
import {
  GoogleSignInButton,
  type CredentialResponse,
} from "vue3-google-signin"

const isLoading = ref(false)

// handle success event
const handleLoginSuccess = async (response: CredentialResponse) => {
  const { credential } = response;
  console.log("Access Token", credential);
  await logged();
};

// handle an error event
const handleLoginError = () => {
  console.error("Login failed");
};
const { isReady, login } = useTokenClient({
  onSuccess: handleLoginSuccess,
  onError: handleLoginError,
  // other options
});
const logged = async () => {
  await navigateTo('panel')
}

</script>

<template>
  <div>

       <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden flex items-center justify-center p-4">
            <!-- Animated Background Elements -->
            <div class="fixed inset-0 overflow-hidden pointer-events-none">
                <div class="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div class="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <!-- Login Container -->
            <div class="relative z-10 w-full max-w-md">
                <!-- Logo/Icon -->
                <div class="text-center mb-8 animate-fade-in-down">
                    <div class="inline-block p-4 bg-white rounded-3xl shadow-lg border-2 border-slate-200 mb-4 animate-float">
                        <svg class="w-16 h-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                        </svg>
                    </div>
                    <h1 class="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                        Bienvenido
                    </h1>
                    <p class="text-slate-500 text-lg">Organiza tus tareas con la Matriz de Eisenhower</p>
                </div>

                <!-- Login Card -->
                <div class="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 p-8 md:p-10 animate-scale-in">
                    <!-- Header -->
                    <div class="text-center mb-8">
                        <h2 class="text-2xl font-bold text-slate-800 mb-2">Iniciar Sesión</h2>
                        <p class="text-slate-500">Accede con tu cuenta de Google</p>
                    </div>

                    <!-- Google Login Button -->
                    <button @click="() => login()"
                            :disabled="isLoading"
                            :class="[
                                'w-full py-4 px-6 rounded-xl font-semibold text-slate-700 bg-white border-2 border-slate-300 transition-all duration-300 flex items-center justify-center gap-3 group',
                                isLoading 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'hover:shadow-lg hover:scale-[1.02] hover:border-slate-400 active:scale-95'
                            ]">
                        <!-- Google Icon -->
                        <svg class="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        
                        <span v-if="!isLoading">Continuar con Google</span>
                        <span v-else class="flex items-center gap-2">
                            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cargando...
                        </span>
                    </button>

                    <!-- Divider -->
                    <div class="relative my-8">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-slate-200"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-4 bg-white text-slate-500">Inicio de sesión seguro</span>
                        </div>
                    </div>

  
                </div>

                <!-- Footer -->
                <div class="mt-8 text-center animate-fade-in-up">
                    <p class="text-sm text-slate-500">
                        Al continuar, aceptas nuestros 
                        <a href="#" class="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors">Términos de Servicio</a>
                        y 
                        <a href="#" class="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors">Política de Privacidad</a>
                    </p>
                </div>
            </div>
        </div>



  </div>
</template>
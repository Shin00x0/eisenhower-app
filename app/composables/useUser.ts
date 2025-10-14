import { ref } from "vue"
import { useUserStore } from '../stores/store_user'

export function useUser(userid: string) {
    const userStore = useUserStore()
    const initialized = ref(false)

    onMounted(async () => {
        if(!initialized.value) {
            await userStore.fetchUser(userid)
            initialized.value = true
        }
    })

    const user_info = computed(() => userStore.user)

    return {
        user_info
    }

}
import supabase from "~/services/supabase_services"
import type { User } from "~/services/types/user"
export const useUserStore = defineStore('userStore', {
    state: () => ({
        currentIdGoogle: '',
        user: {},
        error_user: '',
        active_error: false
    }),
    actions: {
        async saveUserIdGoogle() {
            // guardar en local storage aqui
        },
        async fetchUser(userid: string) {
            if(userid == '') {
                this.error_user = 'Usuario no se ha logueado correctamente'
                this.active_error = true
            }
            if(!this.active_error) {
                try {
                    const { data, error} = await supabase.from('user').select().eq('id', userid)
                    if(error) throw error
                    this.user = data
                } catch(e) {
                    this.error_user = 'Error al devolver informacion de usuario'
                }   
            }
        }
    }
})

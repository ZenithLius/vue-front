import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase' // Assumes alias @/ points to src/
import type { User } from '@supabase/supabase-js'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null)

    const fetchUser = async () => {
        const { data } = await supabase.auth.getUser()
        user.value = data.user
    }

    const logout = async () => {
        await supabase.auth.signOut()
        user.value = null
    }

    const isAdmin = computed(() => user.value?.email === 'liuze717@gmail.com')

    return {
        user,
        isAdmin,
        fetchUser,
        logout
    }
})

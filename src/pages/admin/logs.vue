<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'
import { Activity, ShieldAlert } from 'lucide-vue-next'

const logs = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const userStore = useUserStore()

onMounted(async () => {
    // Double check on client side, though RLS protects data
    if (!userStore.isAdmin) {
        error.value = 'Access Denied'
        loading.value = false
        return
    }
    fetchLogs()
})

const fetchLogs = async () => {
    loading.value = true
    const { data, error: err } = await supabase
        .from('login_logs')
        .select('*')
        .order('login_time', { ascending: false })
        .limit(50)
    
    if (err) {
        error.value = err.message
    } else {
        logs.value = data
    }
    loading.value = false
}
</script>

<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Activity class="w-6 h-6 text-indigo-600" />
                    Admin Access Logs
                </h1>
                <p class="text-gray-500 mt-1">Viewing recent login activity (Protected: liuze717@gmail.com)</p>
            </div>
            <button @click="fetchLogs" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                Refresh
            </button>
        </div>

        <div v-if="loading" class="text-center py-12">
            <div class="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
            <p class="mt-4 text-gray-400">Loading security logs...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 p-6 rounded-xl border border-red-100 text-center">
            <ShieldAlert class="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 class="text-lg font-medium text-red-800">Access Restricted</h3>
            <p class="text-red-600 mt-1">{{ error }}</p>
        </div>

        <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th class="px-6 py-4 font-semibold text-gray-700">Time</th>
                            <th class="px-6 py-4 font-semibold text-gray-700">User Email</th>
                            <th class="px-6 py-4 font-semibold text-gray-700">User Agent</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50/50 transition-colors">
                            <td class="px-6 py-4 text-gray-500 font-mono whitespace-nowrap">
                                {{ new Date(log.login_time).toLocaleString() }}
                            </td>
                            <td class="px-6 py-4 font-medium text-gray-900">
                                {{ log.email }}
                            </td>
                            <td class="px-6 py-4 text-gray-400 max-w-xs truncate" :title="log.user_agent">
                                {{ log.user_agent }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="logs.length === 0" class="text-center py-12 text-gray-400">
                No login records found.
            </div>
        </div>
    </div>
</template>

<route lang="yaml">
meta:
  layout: dashboard
</route>

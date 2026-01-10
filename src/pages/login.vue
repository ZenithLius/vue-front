<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/lib/supabase'
import { Code, ArrowRight, Lock, Mail, Github, MessageCircle, Smartphone, Hash } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const phoneNumber = ref('')
const otpCode = ref('')
const authMethod = ref<'email' | 'phone'>('email')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const isSignUp = ref(false)

const router = useRouter()
const { t } = useI18n()

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  errorMsg.value = ''
  successMsg.value = ''
}

const handleAuth = async () => {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  
  try {
    if (isSignUp.value) {
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
      if (error) throw error
      successMsg.value = t('auth.success_signup')
      isSignUp.value = false
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
      const { data: { user } } = await supabase.auth.getUser()
      if (user) await logLogin(user)
      router.push('/dashboard')
    }
  } catch (error: any) {
    console.error('Auth error:', error)

    errorMsg.value = error.message || t('auth.default_error')
  } finally {
    loading.value = false
  }
}

const handleSendCode = async () => {
  if (!phoneNumber.value) {
    errorMsg.value = t('auth.phone_label') + ' ' + t('common.required') 
    return
  }
  
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber.value,
    })
    if (error) throw error
    successMsg.value = t('auth.code_sent')
  } catch (error: any) {
    console.error('OTP error:', error)
    errorMsg.value = error.message || t('auth.default_error')
  } finally {
    loading.value = false
  }
}

const handleSocialLogin = async (provider: 'google' | 'github' | 'phone') => {
  if (provider === 'phone') {
    authMethod.value = 'phone'
    errorMsg.value = ''
    return
  }

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    })
    if (error) throw error
  } catch (error: any) {
    console.error('Social auth error:', error)
    errorMsg.value = error.message || t('auth.default_error')
  }
}

const logLogin = async (user: any) => {
  try {
    await supabase.from('login_logs').insert({
      user_id: user.id,
      email: user.email,
      user_agent: navigator.userAgent
    })
  } catch (e) {
    console.error('Failed to log login:', e)
  }
}
</script>

<template>
  <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_10px_40px_-5px_rgba(0,0,0,0.05)] border border-gray-100">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-xl mb-4 text-indigo-600">
        <Code v-if="authMethod === 'email'" class="w-8 h-8" />
        <Smartphone v-else class="w-8 h-8" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 tracking-tight">{{ t('auth.welcome_title') }}</h2>
      <p class="text-gray-500 text-sm mt-1">{{ t('auth.welcome_subtitle') }}</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleAuth" class="space-y-5">
      <!-- Email/Password Form -->
      <div v-if="authMethod === 'email'" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ t('auth.email_label') }}</label>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              v-model="email" 
              type="email" 
              required
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-gray-900 placeholder-gray-400"
              :placeholder="t('auth.email_placeholder')"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ t('auth.password_label') }}</label>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              v-model="password" 
              type="password" 
              required
              minlength="6"
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      <!-- Phone Login Form -->
      <div v-else class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ t('auth.phone_label') }}</label>
          <div class="relative">
            <Smartphone class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              v-model="phoneNumber" 
              type="tel" 
              required
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-gray-900 placeholder-gray-400"
              :placeholder="t('auth.phone_placeholder')"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ t('auth.otp_label') }}</label>
          <div class="flex gap-2">
             <div class="relative flex-1">
                <Hash class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  v-model="otpCode" 
                  type="text" 
                  class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-gray-900 placeholder-gray-400"
                  :placeholder="t('auth.otp_placeholder')"
                />
             </div>
             <button 
                type="button" 
                @click="handleSendCode"
                class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
             >
                {{ t('auth.send_code') }}
             </button>
          </div>
        </div>
      </div>

      <div v-if="errorMsg" class="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
        {{ errorMsg }}
      </div>
      
      <div v-if="successMsg" class="p-3 rounded-lg bg-green-50 text-green-600 text-sm flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        {{ successMsg }}
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-lg shadow-sm shadow-indigo-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span v-if="!loading">
           <template v-if="authMethod === 'email'">{{ isSignUp ? t('auth.signup_btn') : t('auth.signin_btn') }}</template>
           <template v-else>{{ t('auth.verify_login') }}</template>
        </span>
        <span v-else>{{ t('auth.processing') }}</span>
        <ArrowRight v-if="!loading" class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>

      <div class="text-center" v-if="authMethod === 'email'">
        <button 
          type="button"
          @click="toggleMode"
          class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {{ isSignUp ? t('auth.toggle_signin') : t('auth.toggle_signup') }}
        </button>
      </div>
      <div class="text-center" v-else>
         <button 
          type="button"
          @click="authMethod = 'email'"
          class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {{ t('common.back') }}
        </button>
      </div>
      
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">{{ t('auth.or_continue_with') }}</span>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <button 
          type="button" 
          @click="handleSocialLogin('google')"
          class="flex items-center justify-center py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </button>
        <button 
          type="button" 
          @click="handleSocialLogin('github')"
          class="flex items-center justify-center py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Github class="w-5 h-5 text-gray-900" />
        </button>
        <button 
          type="button" 
          @click="handleSocialLogin('phone')"
          class="flex items-center justify-center py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          :class="{ 'ring-2 ring-indigo-500 border-indigo-500': authMethod === 'phone' }"
        >
          <Smartphone class="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </form>
    
    <div class="mt-8 text-center text-xs text-gray-400">
      &copy; 2026 TechNest Inc.
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: guest
</route>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0c0a]/80 backdrop-blur-sm p-6 transition-all">
    <div class="solarpunk-chassis w-full max-w-2xl max-h-[90vh] rounded-3xl p-6 flex flex-col relative border-2 border-[#8d6b48]/50 shadow-[0_0_50px_rgba(26,20,15,0.9)] overflow-hidden">
      
      <!-- Close Button -->
      <button @click="$emit('close')" 
        class="absolute top-5 right-5 bg-[#1a140f] border border-[#e05320]/70 text-[#e05320] hover:bg-[#e05320] hover:text-[#1a140f] px-4 py-2 rounded-xl text-[10px] font-mono font-bold tracking-[0.2em] transition-all duration-150 shadow-md active:scale-95 active:translate-y-0.5 hover:shadow-[0_0_15px_rgba(224,83,32,0.5)] z-20 cursor-pointer">
        [ X ] CLOSE
      </button>

      <!-- Modal Header -->
      <div class="mb-5 flex items-center gap-3 border-b border-[#4a3424] pb-4">
        <span class="bulb bulb-amber animate-pulse"></span>
        <div>
          <h2 class="text-xl font-display font-black tracking-[0.2em] text-[#1a140f] dark:text-[#f4ede2] uppercase">
            SYS_USER_PROFILE
          </h2>
          <p class="text-[8px] text-[#8d6b48] font-bold tracking-[0.3em] uppercase font-mono mt-0.5">
            // Otorisasi Pengguna & Pengaturan Keamanan Akun
          </p>
        </div>
      </div>

      <!-- Scrollable Body Container -->
      <div class="flex-1 overflow-y-auto industrial-scroll space-y-5 pr-1">
        
        <!-- Section 1: Account Information -->
        <div class="bg-[#130f0c] border border-[#4a3424] rounded-2xl p-4 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
          <p class="text-[9px] font-display font-black tracking-[0.2em] text-[#f0a929] uppercase mb-3 border-b border-[#4a3424]/60 pb-1">
            ◆ USER ACCOUNT IDENTITY
          </p>
          <div class="grid grid-cols-2 gap-4 font-mono text-[10px]">
            <div>
              <span class="block text-[8px] text-[#cca37a] uppercase font-bold tracking-wider">NIP / Operator ID</span>
              <span class="font-bold text-[#f0a929] text-[11px]">{{ user?.nip || 'N/A' }}</span>
            </div>
            <div>
              <span class="block text-[8px] text-[#cca37a] uppercase font-bold tracking-wider">Full Name</span>
              <span class="font-bold text-[#f4ede2]">{{ user?.username || 'User' }}</span>
            </div>
            <div>
              <span class="block text-[8px] text-[#cca37a] uppercase font-bold tracking-wider">Internal Email</span>
              <span class="text-[#cca37a] break-all">{{ user?.email || 'N/A' }}</span>
            </div>
            <div>
              <span class="block text-[8px] text-[#cca37a] uppercase font-bold tracking-wider">Divisi Access (RBAC)</span>
              <span class="inline-block px-2 py-0.5 mt-0.5 rounded text-[8px] font-bold tracking-widest uppercase bg-[#f0a929]/15 text-[#f0a929] border border-[#f0a929]/30">
                {{ user?.divisi?.toUpperCase() || 'UNIVERSAL' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Section 2: Change Password Form -->
        <div class="bg-[#130f0c] border border-[#4a3424] rounded-2xl p-4 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
          <p class="text-[9px] font-display font-black tracking-[0.2em] text-[#f0a929] uppercase mb-3 border-b border-[#4a3424]/60 pb-1">
            ◆ SECURITY :: CHANGE PASSWORD
          </p>

          <form @submit.prevent="handleChangePassword" class="space-y-3 font-mono">
            <div>
              <label class="block text-[8px] font-display font-black uppercase tracking-[0.2em] text-[#cca37a] mb-1">
                Kata Sandi Lama (Old Password)
              </label>
              <input v-model="form.oldPassword" type="password" required placeholder="••••••••"
                class="w-full bg-[#080605] border border-[#4d3725] px-3 py-2 rounded text-[10px] text-[#f4ede2] focus:outline-none focus:border-[#f0a929]" />
            </div>

            <div>
              <label class="block text-[8px] font-display font-black uppercase tracking-[0.2em] text-[#cca37a] mb-1">
                Kata Sandi Baru (New Password - Min 6 Karakter)
              </label>
              <input v-model="form.newPassword" type="password" required placeholder="••••••••"
                class="w-full bg-[#080605] border border-[#4d3725] px-3 py-2 rounded text-[10px] text-[#f4ede2] focus:outline-none focus:border-[#f0a929]" />
            </div>

            <div>
              <label class="block text-[8px] font-display font-black uppercase tracking-[0.2em] text-[#cca37a] mb-1">
                Konfirmasi Kata Sandi Baru (Confirm New Password)
              </label>
              <input v-model="form.confirmPassword" type="password" required placeholder="••••••••"
                class="w-full bg-[#080605] border border-[#4d3725] px-3 py-2 rounded text-[10px] text-[#f4ede2] focus:outline-none focus:border-[#f0a929]" />
            </div>

            <div v-if="pwdMessage" class="text-[9px] font-mono p-2.5 rounded font-bold text-center tracking-wider"
                 :class="isPwdError ? 'bg-[#e05320]/20 text-[#e05320] border border-[#e05320]/40' : 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40'">
              {{ pwdMessage }}
            </div>

            <button type="submit" :disabled="isSubmitting"
              class="w-full py-2.5 bg-gradient-to-r from-[#8d6b48] to-[#f0a929] hover:from-[#a8825c] hover:to-[#f5b84d] text-[#1a140f] font-mono font-bold text-[9px] tracking-[0.25em] uppercase rounded-xl transition-all duration-150 active:scale-95 shadow-md hover:shadow-[0_0_15px_rgba(240,169,41,0.4)] cursor-pointer">
              {{ isSubmitting ? 'PROCESSING...' : '[ SAVE NEW PASSWORD ]' }}
            </button>
          </form>
        </div>

        <!-- Section 3: Theme Controller -->
        <div class="bg-[#130f0c] border border-[#4a3424] rounded-2xl p-4 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
          <p class="text-[9px] font-display font-black tracking-[0.2em] text-[#f0a929] uppercase mb-3 border-b border-[#4a3424]/60 pb-1">
            ◆ DISPLAY TACTICAL THEME
          </p>

          <div class="grid grid-cols-3 gap-2 font-mono text-[9px]">
            <button @click="setTheme('dark')"
              class="py-2.5 px-2 rounded-xl border text-center font-bold tracking-wider transition-all duration-150 active:scale-95 cursor-pointer"
              :class="currentTheme === 'dark' ? 'bg-[#f0a929] text-[#1a140f] border-[#f0a929] shadow-[0_0_10px_rgba(240,169,41,0.5)]' : 'bg-[#080605] text-[#cca37a] border-[#4d3725] hover:border-[#f0a929]'">
              [ DARK SOLARPUNK ]
            </button>
            <button @click="setTheme('light')"
              class="py-2.5 px-2 rounded-xl border text-center font-bold tracking-wider transition-all duration-150 active:scale-95 cursor-pointer"
              :class="currentTheme === 'light' ? 'bg-[#f0a929] text-[#1a140f] border-[#f0a929] shadow-[0_0_10px_rgba(240,169,41,0.5)]' : 'bg-[#080605] text-[#cca37a] border-[#4d3725] hover:border-[#f0a929]'">
              [ LIGHT DAYLIGHT ]
            </button>
            <button @click="setTheme('system')"
              class="py-2.5 px-2 rounded-xl border text-center font-bold tracking-wider transition-all duration-150 active:scale-95 cursor-pointer"
              :class="currentTheme === 'system' ? 'bg-[#f0a929] text-[#1a140f] border-[#f0a929] shadow-[0_0_10px_rgba(240,169,41,0.5)]' : 'bg-[#080605] text-[#cca37a] border-[#4d3725] hover:border-[#f0a929]'">
              [ SYSTEM DEFAULT ]
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useTheme } from '../composables/useTheme'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['close'])

const { currentTheme, setTheme } = useTheme()

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isSubmitting = ref(false)
const pwdMessage = ref('')
const isPwdError = ref(false)

const handleChangePassword = async () => {
  pwdMessage.value = ''
  isPwdError.value = false

  if (form.value.newPassword !== form.value.confirmPassword) {
    pwdMessage.value = 'Konfirmasi kata sandi baru tidak cocok!'
    isPwdError.value = true
    return
  }

  if (form.value.newPassword.length < 6) {
    pwdMessage.value = 'Kata sandi baru minimal 6 karakter!'
    isPwdError.value = true
    return
  }

  isSubmitting.value = true
  try {
    const token = localStorage.getItem('orion_token')
    const res = await axios.post('http://localhost:8084/api/user/change-password', {
      old_password: form.value.oldPassword,
      new_password: form.value.newPassword,
      confirm_password: form.value.confirmPassword
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    pwdMessage.value = res.data.message || 'Kata sandi berhasil diperbarui!'
    isPwdError.value = false
    form.value.oldPassword = ''
    form.value.newPassword = ''
    form.value.confirmPassword = ''
  } catch (err) {
    pwdMessage.value = err.response?.data?.messages?.error || err.response?.data?.error || err.response?.data?.message || 'Gagal memperbarui kata sandi.'
    isPwdError.value = true
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.industrial-scroll::-webkit-scrollbar { width: 5px; }
.industrial-scroll::-webkit-scrollbar-track { background: rgba(74, 52, 36, 0.2); border-radius: 4px; }
.industrial-scroll::-webkit-scrollbar-thumb { background: rgba(141, 107, 72, 0.7); border-radius: 4px; }
.industrial-scroll::-webkit-scrollbar-thumb:hover { background: rgba(240, 169, 41, 1); }
</style>

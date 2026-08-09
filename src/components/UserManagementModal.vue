<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0c0a]/80 backdrop-blur-sm p-6 transition-all">
    <div class="solarpunk-chassis w-full max-w-6xl h-[85vh] rounded-3xl p-6 flex flex-col relative border-2 border-[#8d6b48]/50 shadow-[0_0_50px_rgba(26,20,15,0.9)]">
      
      <button @click="$emit('close')" 
        class="absolute top-5 right-5 bg-[#1a140f] border border-[#e05320]/70 text-[#e05320] hover:bg-[#e05320] hover:text-[#1a140f] px-4 py-2 rounded-xl text-[10px] font-mono font-bold tracking-[0.2em] transition-all duration-150 shadow-md active:scale-95 active:translate-y-0.5 hover:shadow-[0_0_15px_rgba(224,83,32,0.5)] z-20 cursor-pointer">
        [ X ] TERMINATE
      </button>

      <div class="mb-6 flex items-center gap-3">
        <span class="bulb bulb-amber animate-pulse"></span>
        <div>
          <h2 class="text-2xl font-display font-black tracking-[0.2em] text-[#1a140f] uppercase">
            SYS_ACCESS_CONTROL
          </h2>
          <p class="text-[8px] text-[#4a3424] font-bold tracking-[0.3em] uppercase font-mono">
            // Manajemen Kredensial & Otorisasi Dokumen RAG
          </p>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-6 h-full overflow-hidden">
        
        <!-- KIRI: FORM CRUD -->
        <div class="w-full md:w-1/3 bg-[#130f0c] rounded-2xl p-5 flex flex-col relative border-2 border-[#4a3424] shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] overflow-y-auto industrial-scroll">
          <p class="text-[10px] font-display font-black tracking-[0.2em] uppercase mb-4 border-b border-[#4a3424] pb-2"
             :class="isEditing ? 'text-[#e05320]' : 'text-[#f0a929]'">
            ◆ {{ isEditing ? 'UPDATE OPERATOR DATA' : 'DEPLOY NEW OPERATOR' }}
          </p>
          
          <form @submit.prevent="submitUser" class="space-y-4 flex-1 mt-2">
            
            <!-- Divisi -->
            <div>
              <label class="block text-[8px] font-display font-black uppercase tracking-[0.2em] text-[#cca37a] mb-1">Divisi (RAG Filter)</label>
              <select v-model="form.divisi" required
                class="w-full bg-[#080605] border border-[#4d3725] px-3 py-2 rounded text-[10px] text-[#f0a929] focus:outline-none focus:border-[#f0a929] font-mono appearance-none">
                <option value="teknisi">TEKNISI LAPANGAN</option>
                <option value="finance">FINANCE / KEUANGAN</option>
                <option value="hr">HR / MANAGEMENT</option>
                <option value="general">GENERAL / UMUM</option>
              </select>
            </div>

            <!-- Jika lagi mode Edit, kita tampilkan NIP sebagai text info saja -->
            <div v-if="isEditing" class="bg-[#1a140f] p-3 border border-[#4a3424] rounded border-l-4 border-l-[#e05320]">
              <label class="block text-[7px] font-display font-black uppercase tracking-[0.2em] text-[#cca37a] mb-1">TARGET NIP (LOCKED)</label>
              <p class="text-[11px] text-[#f0a929] font-mono font-bold">{{ form.nip }}</p>
            </div>

            <div>
              <label class="block text-[8px] font-display font-black uppercase tracking-[0.2em] text-[#cca37a] mb-1">Full Name</label>
              <input v-model="form.username" type="text" required placeholder="Nama Karyawan"
                class="w-full bg-[#080605] border border-[#4d3725] px-3 py-2 rounded text-[10px] text-[#f4ede2] focus:outline-none focus:border-[#f0a929] font-mono" />
            </div>

            <div>
              <label class="block text-[8px] font-display font-black uppercase tracking-[0.2em] text-[#cca37a] mb-1">Internal Email</label>
              <input v-model="form.email" type="email" required placeholder="nama@orion.com"
                class="w-full bg-[#080605] border border-[#4d3725] px-3 py-2 rounded text-[10px] text-[#f4ede2] focus:outline-none focus:border-[#f0a929] font-mono" />
            </div>

            <div>
              <label class="block text-[8px] font-display font-black uppercase tracking-[0.2em] text-[#cca37a] mb-1">Contact (Opsional)</label>
              <input v-model="form.no_hp" type="text" placeholder="08..."
                class="w-full bg-[#080605] border border-[#4d3725] px-3 py-2 rounded text-[10px] text-[#f4ede2] focus:outline-none focus:border-[#f0a929] font-mono" />
            </div>
            
            <div class="h-px bg-[#4a3424] my-4"></div>

            <div>
              <label class="block text-[8px] font-display font-black uppercase tracking-[0.2em] text-[#cca37a] mb-1">Role (UI Access)</label>
              <select v-model="form.role" required
                class="w-full bg-[#080605] border border-[#4d3725] px-3 py-2 rounded text-[10px] text-[#f0a929] focus:outline-none focus:border-[#f0a929] font-mono appearance-none">
                <option value="user">OPERATOR (USER)</option>
                <option value="admin">ADMINISTRATOR</option>
              </select>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 mt-4">
              <button v-if="isEditing" type="button" @click="cancelEdit"
                class="w-1/3 py-3 border border-[#4a3424] text-[#cca37a] hover:bg-[#4a3424] hover:text-white rounded-xl text-[8px] font-mono tracking-widest uppercase transition-all duration-150 active:scale-95 active:translate-y-0.5">
                CANCEL
              </button>
              <button type="submit" :disabled="isLoading"
                class="tactile-btn flex-1 py-3 text-[9px] tracking-[0.3em] uppercase transition-all duration-150 active:scale-95 active:translate-y-0.5 hover:shadow-[0_0_15px_rgba(240,169,41,0.5)]">
                {{ isLoading ? 'PROCESSING...' : (isEditing ? 'SAVE CHANGES' : 'EXECUTE NEW USER') }}
              </button>
            </div>
            
            <div v-if="message" class="text-[9px] font-mono mt-3 p-3 rounded font-bold text-center tracking-wider break-words" :class="isError ? 'bg-[#e05320] text-[#1a140f]' : 'bg-[#22c55e] text-[#1a140f]'">
              {{ message }}
            </div>
          </form>
        </div>

        <!-- KANAN: TABEL LIST USER -->
        <div class="w-full md:w-2/3 bg-[#130f0c] rounded-2xl p-5 flex flex-col relative border-2 border-[#4a3424] shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] overflow-hidden">
          <p class="text-[10px] text-[#f0a929] font-display font-black tracking-[0.2em] uppercase mb-4 border-b border-[#4a3424] pb-2">
            ◆ REGISTERED OPERATORS INDEX
          </p>
          
          <div class="flex-1 overflow-y-auto industrial-scroll mt-2">
            <table class="w-full text-left border-collapse">
              <thead class="sticky top-0 bg-[#080605] z-10 shadow-md">
                <tr class="border-b-2 border-[#4d3725] text-[8px] text-[#cca37a] font-mono tracking-widest uppercase">
                  <th class="p-3">NIP</th>
                  <th class="p-3">Operator Name</th>
                  <th class="p-3">Divisi</th>
                  <th class="p-3">Role</th>
                  <th class="p-3 text-right">Sys_Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id" 
                    class="border-b border-[#4a3424]/50 hover:bg-[#1a140f] transition-colors font-mono text-[9px] text-[#f4ede2]">
                  <td class="p-3 text-[#f0a929] font-bold">{{ user.nip }}</td>
                  <td class="p-3">
                    <div class="text-[10px] font-bold tracking-wide">{{ user.username }}</div>
                    <div class="text-[8px] text-[#cca37a] mt-1">{{ user.email }}</div>
                  </td>
                  <td class="p-3 uppercase">
                    <span :class="getDivisiBadgeStyle(user.divisi)" class="px-2 py-1 rounded text-[7px] font-bold tracking-widest uppercase shadow-sm">
                      {{ user.divisi || 'GENERAL' }}
                    </span>
                  </td>
                  <td class="p-3 uppercase">
                    <span :class="user.role === 'admin' ? 'bg-[#f0a929] text-[#1a140f]' : 'bg-[#4a3424] text-[#cca37a]'" class="px-2 py-1 rounded text-[7px] font-bold tracking-widest shadow-sm">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="p-3 text-right space-x-2 text-[8px] tracking-widest">
                    <button @click="editUser(user)" class="px-2 py-1 bg-[#f0a929]/10 border border-[#f0a929]/40 text-[#f0a929] hover:bg-[#f0a929] hover:text-[#1a140f] rounded-lg transition-all duration-150 active:scale-95 active:translate-y-0.5 font-bold">[EDIT]</button>
                    <button @click="promptResetPassword(user)" class="px-2 py-1 bg-[#3b82f6]/10 border border-[#3b82f6]/40 text-[#60a5fa] hover:bg-[#3b82f6] hover:text-white rounded-lg transition-all duration-150 active:scale-95 active:translate-y-0.5 font-bold">[RESET PASS]</button>
                    <button @click="promptDeleteUser(user)" class="px-2 py-1 bg-[#e05320]/10 border border-[#e05320]/40 text-[#e05320] hover:bg-[#e05320] hover:text-white rounded-lg transition-all duration-150 active:scale-95 active:translate-y-0.5 font-bold">[DEL]</button>
                  </td>
                </tr>
                <tr v-if="isFetching">
                  <td colspan="5" class="p-6 text-center text-[#cca37a] text-[10px] font-mono tracking-widest animate-pulse">
                    Scanning Database Directory...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>

    <!-- CUSTOM ANIMATED SOLARPUNK CONFIRM DIALOG FOR USER DELETION -->
    <Transition name="solarpunk-pop">
      <div v-if="confirmDialog.isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div class="w-full max-w-md bg-[#120d09] border-2 border-[#ef4444] rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative text-left outline outline-1 outline-[#ef4444]/30">
          
          <!-- Top Warning Header -->
          <div class="flex items-center gap-3 mb-4 pb-3 border-b border-[#ef4444]/30">
            <span class="w-3.5 h-3.5 rounded-full bg-[#ef4444] shadow-[0_0_14px_#ef4444] animate-pulse"></span>
            <div>
              <h3 class="text-sm font-display font-black text-[#ef4444] uppercase tracking-[0.25em] drop-shadow-sm">
                // SYS::TERMINATE_OPERATOR
              </h3>
              <p class="text-[9px] text-[#d4b996] font-mono tracking-widest uppercase font-bold">REVOKE OPERATOR ACCESS</p>
            </div>
          </div>

          <!-- Message Body -->
          <div class="bg-[#080503] border border-[#ef4444]/30 rounded-2xl p-4 mb-6 font-mono">
            <p class="text-[11px] text-[#fef3c7] leading-relaxed">
              Apakah Anda yakin ingin mencabut & menghapus data operator ini?
            </p>
            <div class="mt-2.5 bg-[#1f130b] border border-[#ef4444]/40 rounded-xl p-3 flex items-center gap-2">
              <span class="text-lg">👤</span>
              <div>
                <p class="text-[11px] font-bold text-[#fef08a] leading-snug">
                  {{ confirmDialog.username }} (NIP: {{ confirmDialog.nip }})
                </p>
                <p class="text-[9px] text-[#cca37a] mt-0.5">{{ confirmDialog.email }}</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 font-mono">
            <button @click="confirmDialog.isOpen = false" 
              class="px-5 py-2.5 bg-[#26180f] hover:bg-[#382417] text-[#e5e7eb] text-[10px] font-bold tracking-wider rounded-xl border border-[#78350f] transition-all active:scale-95 shadow-md">
              [ CANCEL ]
            </button>
            <button @click="executeDeleteUser" 
              class="px-5 py-2.5 bg-gradient-to-r from-[#dc2626] to-[#ea580c] hover:from-[#ef4444] hover:to-[#f97316] text-white text-[10px] font-extrabold tracking-wider rounded-xl border border-[#fca5a5]/30 shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all active:scale-95 flex items-center gap-2">
              <span>🔥</span> [ TERMINATE ACCESS ]
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <!-- CUSTOM ANIMATED SOLARPUNK CONFIRM DIALOG FOR RESET PASSWORD -->
    <Transition name="solarpunk-pop">
      <div v-if="resetDialog.isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div class="w-full max-w-md bg-[#120d09] border-2 border-[#3b82f6] rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative text-left outline outline-1 outline-[#3b82f6]/30">
          
          <!-- Top Header -->
          <div class="flex items-center gap-3 mb-4 pb-3 border-b border-[#3b82f6]/30">
            <span class="w-3.5 h-3.5 rounded-full bg-[#3b82f6] shadow-[0_0_14px_#3b82f6] animate-pulse"></span>
            <div>
              <h3 class="text-sm font-display font-black text-[#60a5fa] uppercase tracking-[0.25em] drop-shadow-sm">
                // SYS::RESET_PASSWORD
              </h3>
              <p class="text-[9px] text-[#d4b996] font-mono tracking-widest uppercase font-bold">RESET CREDENTIALS TO DEFAULT</p>
            </div>
          </div>

          <!-- Message Body -->
          <div class="bg-[#080503] border border-[#3b82f6]/30 rounded-2xl p-4 mb-6 font-mono">
            <p class="text-[11px] text-[#fef3c7] leading-relaxed">
              Apakah Anda yakin ingin me-reset kata sandi operator ini kembali ke default (orion123)?
            </p>
            <div class="mt-2.5 bg-[#1f130b] border border-[#3b82f6]/40 rounded-xl p-3 flex items-center gap-2">
              <div>
                <p class="text-[11px] font-bold text-[#60a5fa] leading-snug">
                  {{ resetDialog.username }} (NIP: {{ resetDialog.nip }})
                </p>
                <p class="text-[9px] text-[#cca37a] mt-0.5">{{ resetDialog.email }}</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 font-mono">
            <button @click="resetDialog.isOpen = false" 
              class="px-5 py-2.5 bg-[#26180f] hover:bg-[#382417] text-[#e5e7eb] text-[10px] font-bold tracking-wider rounded-xl border border-[#78350f] transition-all active:scale-95 shadow-md cursor-pointer">
              [ CANCEL ]
            </button>
            <button @click="executeResetPassword" 
              class="px-5 py-2.5 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#3b82f6] hover:to-[#60a5fa] text-white text-[10px] font-extrabold tracking-wider rounded-xl border border-[#93c5fd]/30 shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all active:scale-95 cursor-pointer">
              [ RESET PASSWORD ]
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <!-- CUSTOM ANIMATED SOLARPUNK NOTIFICATION DIALOG -->
    <Transition name="solarpunk-pop">
      <div v-if="notifyDialog.isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div class="w-full max-w-md rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative text-left transition-all border-2"
             :class="notifyDialog.type === 'error' ? 'bg-[#180b0b] border-[#ef4444] outline outline-1 outline-[#ef4444]/30' : 'bg-[#0a180e] border-[#10b981] outline outline-1 outline-[#10b981]/30'">
          
          <!-- Notification Header -->
          <div class="flex items-center gap-3 mb-4 pb-3 border-b"
               :class="notifyDialog.type === 'error' ? 'border-[#ef4444]/30' : 'border-[#10b981]/30'">
            <span class="w-3.5 h-3.5 rounded-full shadow-md"
                  :class="notifyDialog.type === 'error' ? 'bg-[#ef4444] shadow-[0_0_14px_#ef4444] animate-pulse' : 'bg-[#10b981] shadow-[0_0_14px_#10b981] animate-pulse'"></span>
            <div>
              <h3 class="text-sm font-display font-black uppercase tracking-[0.25em]"
                  :class="notifyDialog.type === 'error' ? 'text-[#ef4444]' : 'text-[#34d399]'">
                // SYS::LOG_NOTIFICATION
              </h3>
              <p class="text-[9px] text-[#d4b996] font-mono tracking-widest uppercase font-bold">TELEMETRY ACKNOWLEDGEMENT</p>
            </div>
          </div>

          <!-- Notification Body -->
          <div class="rounded-2xl p-4 mb-6 font-mono border"
               :class="notifyDialog.type === 'error' ? 'bg-[#0d0505] border-[#ef4444]/20' : 'bg-[#040e07] border-[#10b981]/20'">
            <p class="text-[11px] text-[#fef3c7] leading-relaxed font-bold">
              {{ notifyDialog.message }}
            </p>
          </div>

          <!-- Action Button -->
          <div class="flex justify-end font-mono">
            <button @click="notifyDialog.isOpen = false" 
              class="px-6 py-2.5 text-[10px] font-extrabold tracking-wider rounded-xl transition-all active:scale-95 border cursor-pointer"
              :class="notifyDialog.type === 'error' ? 'bg-gradient-to-r from-[#dc2626] to-[#ea580c] hover:from-[#ef4444] hover:to-[#f97316] text-white border-[#fca5a5]/30 shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'bg-gradient-to-r from-[#059669] to-[#0d9488] hover:from-[#10b981] hover:to-[#14b8a6] text-white border-[#a7f3d0]/30 shadow-[0_0_20px_rgba(16,185,129,0.4)]'">
              [ ACKNOWLEDGE ]
            </button>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['close'])

const users = ref([])
const isFetching = ref(false)
const isLoading = ref(false)
const message = ref('')
const isError = ref(false)

const getDivisiBadgeStyle = (divisi) => {
  const d = (divisi || '').toLowerCase()
  if (d === 'finance') return 'bg-[#d97706] text-white'
  if (d === 'teknisi') return 'bg-[#059669] text-white'
  if (d === 'hr') return 'bg-[#7c3aed] text-white'
  return 'bg-[#2d5e35] text-white'
}

const confirmDialog = ref({
  isOpen: false,
  id: null,
  username: '',
  nip: '',
  email: ''
})

const resetDialog = ref({
  isOpen: false,
  id: null,
  username: '',
  nip: '',
  email: ''
})

const notifyDialog = ref({
  isOpen: false,
  message: '',
  type: 'success'
})

// State untuk Edit/Update
const isEditing = ref(false)
const editId = ref(null)

const form = ref({
  nip: '',
  username: '',
  email: '',
  no_hp: '',
  divisi: 'finance',
  role: 'user'
})

const getToken = () => localStorage.getItem('orion_token')

const fetchUsers = async () => {
  isFetching.value = true
  try {
    const res = await fetch('http://localhost:8084/api/users', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    const data = await res.json()
    if (data.status === 'success') {
      users.value = data.data
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    isFetching.value = false
  }
}

// Fungsi Submit
const submitUser = async () => {
  isLoading.value = true
  message.value = ''
  
  const url = isEditing.value 
    ? `http://localhost:8084/api/users/${editId.value}` 
    : 'http://localhost:8084/api/users'
  const method = isEditing.value ? 'PUT' : 'POST'
  
  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(form.value)
    })
    
    const data = await res.json()
    
    if (res.ok) {
      isError.value = false
      message.value = isEditing.value 
        ? 'DATA OPERATOR BERHASIL DIUPDATE!' 
        : data.message
      
      cancelEdit()
      fetchUsers()
    } else {
      isError.value = true
      if (typeof data.messages === 'object') {
        message.value = Object.values(data.messages).join(' | ')
      } else {
        message.value = data.message || 'Gagal eksekusi user.'
      }
    }
  } catch (error) {
    isError.value = true
    message.value = 'SYS_ERROR: Connection Failed.'
  } finally {
    isLoading.value = false
  }
}

const editUser = (user) => {
  isEditing.value = true
  editId.value = user.id
  message.value = ''
  form.value = { 
    nip: user.nip,
    username: user.username, 
    email: user.email, 
    no_hp: user.no_hp || '', 
    divisi: user.divisi, 
    role: user.role 
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editId.value = null
  message.value = ''
  form.value = { nip: '', username: '', email: '', no_hp: '', divisi: 'finance', role: 'user' }
}

const promptDeleteUser = (user) => {
  confirmDialog.value = {
    isOpen: true,
    id: user.id,
    username: user.username,
    nip: user.nip,
    email: user.email
  }
}

const promptResetPassword = (user) => {
  resetDialog.value = {
    isOpen: true,
    id: user.id,
    username: user.username,
    nip: user.nip,
    email: user.email
  }
}

const executeResetPassword = async () => {
  const userId = resetDialog.value.id
  resetDialog.value.isOpen = false

  try {
    const res = await fetch(`http://localhost:8084/api/users/${userId}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    })
    const data = await res.json()
    if (res.ok) {
      notifyDialog.value = {
        isOpen: true,
        message: data.message || `Kata sandi operator '${resetDialog.value.username}' berhasil di-reset ke default (orion123).`,
        type: 'success'
      }
    } else {
      notifyDialog.value = {
        isOpen: true,
        message: data.message || 'Gagal me-reset kata sandi operator.',
        type: 'error'
      }
    }
  } catch (err) {
    notifyDialog.value = {
      isOpen: true,
      message: 'Gagal me-reset kata sandi operator. Terjadi kesalahan koneksi.',
      type: 'error'
    }
  }
}

const executeDeleteUser = async () => {
  const id = confirmDialog.value.id
  confirmDialog.value.isOpen = false
  
  try {
    const res = await fetch(`http://localhost:8084/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (res.ok) {
      notifyDialog.value = {
        isOpen: true,
        message: 'Akses Operator berhasil dicabut!',
        type: 'success'
      }
      fetchUsers()
      if (editId.value === id) cancelEdit()
    } else {
      notifyDialog.value = {
        isOpen: true,
        message: 'Gagal menghapus operator.',
        type: 'error'
      }
    }
  } catch (error) {
    notifyDialog.value = {
      isOpen: true,
      message: 'Gagal menghapus operator. Terjadi kesalahan koneksi.',
      type: 'error'
    }
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.industrial-scroll::-webkit-scrollbar { width: 6px; }
.industrial-scroll::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.5); border-radius: 4px; }
.industrial-scroll::-webkit-scrollbar-thumb { background: rgba(141, 107, 72, 0.8); border-radius: 4px; }
.industrial-scroll::-webkit-scrollbar-thumb:hover { background: rgba(240, 169, 41, 1); }

/* Solarpunk Pop Animation */
.solarpunk-pop-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.solarpunk-pop-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.solarpunk-pop-enter-from {
  opacity: 0;
  transform: scale(0.85) translateY(-20px);
}
.solarpunk-pop-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}
</style>
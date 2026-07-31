<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0c0a]/80 backdrop-blur-sm p-6 transition-all">
    <div class="solarpunk-chassis w-full max-w-6xl h-[85vh] rounded-3xl p-6 flex flex-col relative border-2 border-[#8d6b48]/50 shadow-[0_0_50px_rgba(26,20,15,0.9)]">
      
      <button @click="$emit('close')" 
        class="absolute top-5 right-5 bg-[#1a140f] border border-[#e05320]/70 text-[#e05320] hover:bg-[#e05320] hover:text-[#1a140f] px-4 py-2 rounded text-[10px] font-mono font-bold tracking-[0.2em] transition-all shadow-[2px_2px_5px_rgba(0,0,0,0.5)] z-20">
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
                <option value="cs">CUSTOMER SERVICE</option>
                <option value="hr">HR / MANAGEMENT</option>
                <option value="general">GENERAL / UMUM</option>
              </select>
            </div>

            <!-- Jika lagi mode Edit, kita tampilkan NIP sebagai text info saja (tidak bisa diedit) -->
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
                class="w-1/3 py-3 border border-[#4a3424] text-[#cca37a] hover:bg-[#4a3424] hover:text-white rounded text-[8px] font-mono tracking-widest uppercase transition-colors">
                CANCEL
              </button>
              <button type="submit" :disabled="isLoading"
                class="tactile-btn flex-1 py-3 text-[9px] tracking-[0.3em] uppercase">
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
                    <span class="bg-[#2d5e35] text-white px-2 py-1 rounded text-[7px] font-bold tracking-widest">
                      {{ user.divisi }}
                    </span>
                  </td>
                  <td class="p-3 uppercase">
                    <span :class="user.role === 'admin' ? 'bg-[#f0a929] text-[#1a140f]' : 'bg-[#4a3424] text-[#cca37a]'" class="px-2 py-1 rounded text-[7px] font-bold tracking-widest shadow-sm">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="p-3 text-right space-x-3 text-[8px] tracking-widest">
                    <button @click="editUser(user)" class="text-[#f0a929] hover:text-white transition-colors">[EDIT]</button>
                    <button @click="deleteUser(user.id)" class="text-[#e05320] hover:text-white transition-colors">[DEL]</button>
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

// State untuk Edit/Update
const isEditing = ref(false)
const editId = ref(null)

const form = ref({
  nip: '', // NIP tetep ada di form state buat nyimpen data pas lagi Edit
  username: '',
  email: '',
  no_hp: '',
  divisi: 'general',
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
        : data.message // Nampilin pesan + default password dari backend
      
      cancelEdit() // Reset form ke kosong
      fetchUsers() // Refresh tabel
    } else {
      isError.value = true
      // Kalau error berupa objek (dari validasi CI4), kita gabungin
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

// Persiapan form buat Edit User
const editUser = (user) => {
  isEditing.value = true
  editId.value = user.id
  message.value = ''
  form.value = { 
    nip: user.nip, // Disimpan buat ditampilin doang di UI
    username: user.username, 
    email: user.email, 
    no_hp: user.no_hp || '', 
    divisi: user.divisi, 
    role: user.role 
  }
}

// Batal Edit / Reset form
const cancelEdit = () => {
  isEditing.value = false
  editId.value = null
  message.value = ''
  form.value = { nip: '', username: '', email: '', no_hp: '', divisi: 'general', role: 'user' }
}

// Fungsi Delete User
const deleteUser = async (id) => {
  if (!confirm('Peringatan: Apakah Anda yakin ingin menghapus data operator (Terminate) ini?')) return
  
  try {
    const res = await fetch(`http://localhost:8084/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (res.ok) {
      alert('Operator berhasil dihapus!')
      fetchUsers()
      if (editId.value === id) cancelEdit()
    }
  } catch (error) {
    alert('Gagal menghapus operator.')
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
</style>
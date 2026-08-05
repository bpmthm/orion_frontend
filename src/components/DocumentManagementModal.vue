<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 transition-all">
    
    <!-- Outer Solarpunk Frame (Sesuai tema Konsol Utama) -->
    <div class="solarpunk-chassis w-full max-w-4xl h-[75vh] rounded-3xl p-6 flex flex-col relative border-4 border-[#8d6b48] shadow-2xl bg-[#dccbb0]">
      
      <!-- Close Button (Model Tombol Retro/Execute) -->
      <button @click="$emit('close')" 
        class="absolute top-5 right-5 bg-[#2c1a0e] border border-[#8d6b48] text-[#f0a929] hover:bg-[#e05320] hover:text-white px-4 py-1.5 rounded-xl text-[10px] font-mono font-bold tracking-[0.2em] transition-all duration-150 shadow-md active:scale-95 active:translate-y-0.5 hover:shadow-[0_0_15px_rgba(224,83,32,0.5)] cursor-pointer z-20">
        [ X ] CLOSE
      </button>

      <!-- Header -->
      <div class="mb-4 flex items-center gap-3 border-b-2 border-[#b8a38a] pb-3">
        <span class="w-3 h-3 rounded-full bg-[#f0a929] shadow-[0_0_10px_#f0a929] animate-pulse"></span>
        <div>
          <h2 class="text-xl font-display font-black tracking-[0.2em] text-[#2c1a0e] uppercase">
            KNOWLEDGE_BASE_INDEX
          </h2>
          <p class="text-[9px] text-[#5c422d] font-bold tracking-[0.2em] uppercase font-mono mt-0.5">
            // DIREKTORI DOKUMEN VECTOR STORAGE (CHROMADB)
          </p>
        </div>
      </div>

      <!-- Container Tabel & Grid Pas Dalam -->
      <div class="flex-1 overflow-y-auto industrial-scroll bg-[#e8dbbf]/70 rounded-2xl p-3 border border-[#b8a38a]">
        <table class="w-full text-left border-separate border-spacing-y-2 font-mono text-[11px]">
          
          <!-- Table Header (Gelap Cokelat Tua + Teks Emas) -->
          <thead class="sticky top-0 bg-[#2c1a0e] text-[#f0a929] uppercase tracking-widest text-[9px] rounded-lg z-10 shadow-md">
            <tr>
              <th class="p-3.5 rounded-l-lg">FILE NAME (SOURCE)</th>
              <th class="p-3.5">TARGET DIVISI (RBAC)</th>
              <th class="p-3.5">TOTAL CHUNKS</th>
              <th class="p-3.5 text-right rounded-r-lg">ACTION</th>
            </tr>
          </thead>

          <tbody>
            <!-- Document Item -->
            <tr v-for="doc in documents" :key="doc.source" 
                class="bg-white/95 hover:bg-white text-[#221710] shadow-sm rounded-xl transition-all border border-[#d2c1a7]">
              
              <td class="p-3.5 font-bold text-[#2c1a0e] rounded-l-xl flex items-center gap-2">
                <span class="text-[#f0a929]">📄</span> {{ doc.source }}
              </td>

              <td class="p-3.5 uppercase">
                <span :class="getBadgeStyle(doc.divisi)" class="px-2.5 py-1 rounded-md text-[8px] font-bold tracking-wider uppercase border shadow-sm">
                  ● {{ doc.divisi }}
                </span>
              </td>

              <td class="p-3.5 text-[#5c422d] font-bold">{{ doc.chunks }} Chunks</td>

              <td class="p-3.5 text-right rounded-r-xl">
                <button @click="promptDelete(doc.source)" 
                  class="bg-[#e05320]/10 border border-[#e05320]/40 text-[#c2410c] hover:bg-[#e05320] hover:text-white px-3.5 py-1.5 rounded-lg text-[9px] font-bold transition-all duration-150 shadow-sm active:scale-95 active:translate-y-0.5 hover:shadow-[0_0_12px_rgba(224,83,32,0.5)] cursor-pointer">
                  [DELETE PDF]
                </button>
              </td>

            </tr>

            <!-- Empty State -->
            <tr v-if="documents.length === 0">
              <td colspan="4" class="p-10 text-center bg-white/80 rounded-2xl border border-[#d2c1a7]">
                <p class="text-[#2c1a0e] font-bold text-[12px] tracking-widest uppercase">
                  ⚠️ TIDAK ADA DOKUMEN TERINDEKS DI CHROMADB
                </p>
                <p class="text-[9px] text-[#7a5c43] font-bold mt-1.5">
                  Silakan unggah file PDF melalui panel "BIO_DATABASE_INGEST" untuk mengisi memori AI ORION.
                </p>
              </td>
            </tr>
          </tbody>

        </table>
      </div>

      <!-- Footer Info -->
      <div class="mt-3 flex justify-between items-center text-[9px] font-mono text-[#5c422d] px-1 font-bold">
        <span>TOTAL DOKUMEN: <strong class="text-[#2c1a0e]">{{ documents.length }} FILE</strong></span>
        <span>ORION SYS CORE // VECTOR ACCESS CONTROL</span>
      </div>

    </div>

    <!-- CUSTOM ANIMATED SOLARPUNK CONFIRM DIALOG -->
    <Transition name="solarpunk-pop">
      <div v-if="confirmDialog.isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div class="w-full max-w-md bg-[#120d09] border-2 border-[#f59e0b] rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative text-left outline outline-1 outline-[#f59e0b]/30">
          
          <!-- Top Warning Header -->
          <div class="flex items-center gap-3 mb-4 pb-3 border-b border-[#f59e0b]/30">
            <span class="w-3.5 h-3.5 rounded-full bg-[#ef4444] shadow-[0_0_14px_#ef4444] animate-pulse"></span>
            <div>
              <h3 class="text-sm font-display font-black text-[#f59e0b] uppercase tracking-[0.25em] drop-shadow-sm">
                // SYS::PURGE_CONFIRMATION
              </h3>
              <p class="text-[9px] text-[#d4b996] font-mono tracking-widest uppercase font-bold">ACTION IS IRREVERSIBLE</p>
            </div>
          </div>

          <!-- Message Body -->
          <div class="bg-[#080503] border border-[#f59e0b]/30 rounded-2xl p-4 mb-6 font-mono">
            <p class="text-[11px] text-[#fef3c7] leading-relaxed">
              Hapus semua kepingan memori AI untuk file:
            </p>
            <div class="mt-2.5 bg-[#1f130b] border border-[#f59e0b]/40 rounded-xl p-3 flex items-center gap-2">
              <span class="text-lg">📄</span>
              <p class="text-[11px] font-bold text-[#fef08a] break-all leading-snug">
                {{ confirmDialog.filename }}
              </p>
            </div>
            <p class="text-[10px] text-[#f97316] mt-3 font-bold flex items-start gap-1.5 leading-tight bg-[#ef4444]/10 p-2 rounded-lg border border-[#ef4444]/20">
              <span>⚠️</span> <span>Dokumen ini tidak akan dapat digunakan lagi oleh AI ORION untuk pencarian kueri.</span>
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 font-mono">
            <button @click="confirmDialog.isOpen = false" 
              class="px-5 py-2.5 bg-[#26180f] hover:bg-[#382417] text-[#e5e7eb] text-[10px] font-bold tracking-wider rounded-xl border border-[#78350f] transition-all active:scale-95 shadow-md">
              [ CANCEL ]
            </button>
            <button @click="executeDelete" 
              class="px-5 py-2.5 bg-gradient-to-r from-[#dc2626] to-[#ea580c] hover:from-[#ef4444] hover:to-[#f97316] text-white text-[10px] font-extrabold tracking-wider rounded-xl border border-[#fca5a5]/30 shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all active:scale-95 flex items-center gap-2">
              <span>🔥</span> [ PURGE MEMORY ]
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
              class="px-6 py-2.5 text-[10px] font-extrabold tracking-wider rounded-xl transition-all active:scale-95 border"
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
const documents = ref([])

const confirmDialog = ref({
  isOpen: false,
  filename: ''
})

const notifyDialog = ref({
  isOpen: false,
  message: '',
  type: 'success'
})

const fetchDocuments = async () => {
  try {
    const token = localStorage.getItem('orion_token')
    const res = await fetch('http://localhost:8000/documents', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Orion-Secret': 'ORION_Super_Secret_Key_Token_123'
      }
    })
    const data = await res.json()
    if (data.status === 'success') {
      documents.value = data.documents
    }
  } catch (err) {
    console.error("Gagal mengambil daftar dokumen:", err)
  }
}

const promptDelete = (filename) => {
  confirmDialog.value = {
    isOpen: true,
    filename: filename
  }
}

const executeDelete = async () => {
  const filename = confirmDialog.value.filename
  confirmDialog.value.isOpen = false

  try {
    const token = localStorage.getItem('orion_token')
    const res = await fetch(`http://localhost:8000/documents/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Orion-Secret': 'ORION_Super_Secret_Key_Token_123'
      }
    })
    const data = await res.json()
    if (res.ok) {
      notifyDialog.value = {
        isOpen: true,
        message: data.message || `Dokumen '${filename}' berhasil dihapus dari ChromaDB!`,
        type: 'success'
      }
      fetchDocuments()
    } else {
      notifyDialog.value = {
        isOpen: true,
        message: data.detail || "Gagal menghapus dokumen.",
        type: 'error'
      }
    }
  } catch (err) {
    notifyDialog.value = {
      isOpen: true,
      message: "Gagal menghapus dokumen. Terjadi kesalahan jaringan.",
      type: 'error'
    }
  }
}

// Style Badge Divisi
const getBadgeStyle = (divisi) => {
  switch (divisi?.toLowerCase()) {
    case 'teknisi':
      return 'bg-[#e05320]/15 text-[#c2410c] border-[#e05320]/30'
    case 'finance':
      return 'bg-[#0284c7]/15 text-[#0369a1] border-[#0284c7]/30'
    case 'hr':
      return 'bg-[#a855f7]/15 text-[#7e22ce] border-[#a855f7]/30'
    default: // universal
      return 'bg-[#15803d]/15 text-[#15803d] border-[#15803d]/30'
  }
}

onMounted(() => {
  fetchDocuments()
})
</script>

<style scoped>
.industrial-scroll::-webkit-scrollbar { width: 6px; }
.industrial-scroll::-webkit-scrollbar-track { background: rgba(184, 163, 138, 0.3); border-radius: 4px; }
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
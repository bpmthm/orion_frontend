<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 transition-all">
    
    <!-- Outer Solarpunk Frame (Sesuai tema Konsol Utama) -->
    <div class="solarpunk-chassis w-full max-w-4xl h-[75vh] rounded-3xl p-6 flex flex-col relative border-4 border-[#8d6b48] shadow-2xl bg-[#dccbb0]">
      
      <!-- Close Button (Model Tombol Retro/Execute) -->
      <button @click="$emit('close')" 
        class="absolute top-5 right-5 bg-[#2c1a0e] border border-[#8d6b48] text-[#f0a929] hover:bg-[#e05320] hover:text-white px-4 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-[0.2em] transition-all shadow-md">
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
            <!-- Document Item (Berbentuk Kartu Putih Bersih seperti Chat Bubble) -->
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
                <button @click="deleteDoc(doc.source)" 
                  class="bg-[#e05320]/10 border border-[#e05320]/40 text-[#c2410c] hover:bg-[#e05320] hover:text-white px-3 py-1 rounded-md text-[9px] font-bold transition-all shadow-sm">
                  [DELETE PDF]
                </button>
              </td>

            </tr>

            <!-- Empty State (Kartu Peringatan Jelas) -->
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['close'])
const documents = ref([])

const fetchDocuments = async () => {
  try {
    const token = localStorage.getItem('orion_token') // 🟢 Ambil JWT Token
    const res = await fetch('http://localhost:8000/documents', {
      headers: {
        'Authorization': `Bearer ${token}` // 🟢 Sisipkan Token Header
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

const deleteDoc = async (filename) => {
  if (!confirm(`Hapus semua memori AI untuk file "${filename}" dari ChromaDB?`)) return

  try {
    const token = localStorage.getItem('orion_token') // 🟢 Ambil JWT Token
    const res = await fetch(`http://localhost:8000/documents/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` // 🟢 Sisipkan Token Header
      }
    })
    const data = await res.json()
    if (res.ok) {
      alert(data.message)
      fetchDocuments()
    }
  } catch (err) {
    alert("Gagal menghapus dokumen.")
  }
}

// Style Badge Divisi
const getBadgeStyle = (divisi) => {
  switch (divisi?.toLowerCase()) {
    case 'teknisi':
      return 'bg-[#e05320]/15 text-[#c2410c] border-[#e05320]/30'
    case 'cs':
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
</style>
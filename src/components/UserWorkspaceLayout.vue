<template>
  <div class="flex-1 flex gap-4 overflow-hidden relative">
    
    <!-- LEFT PANEL: SOP DIRECTORY, CHAT HISTORY & HR ESCALATIONS -->
    <aside class="w-80 bg-[#140e0a]/90 border-2 border-[#8d6b48]/40 rounded-3xl p-5 flex flex-col shadow-2xl backdrop-blur-md">
      
      <!-- Operator Info Badge -->
      <div class="bg-[#1f150f] border border-[#f0a929]/30 rounded-2xl p-4 mb-4 relative overflow-hidden group">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 overflow-hidden">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f0a929] to-[#e05320] flex items-center justify-center font-bold text-[#140e0a] text-sm shadow-md">
              {{ currentUser?.username ? currentUser.username.substring(0, 2).toUpperCase() : 'OP' }}
            </div>
            <div class="overflow-hidden">
              <h3 class="text-xs font-display font-black text-[#f4ede2] truncate uppercase tracking-wider">
                {{ currentUser?.username || 'Operator' }}
              </h3>
              <p class="text-[9px] text-[#f0a929] font-mono font-bold uppercase tracking-widest mt-0.5">
                DIVISI: {{ currentUser?.divisi ? currentUser.divisi.toUpperCase() : 'UNIVERSAL' }}
              </p>
            </div>
          </div>
          <button @click="$emit('open-profile')" 
            class="px-2.5 py-1.5 bg-[#f0a929]/15 border border-[#f0a929]/50 hover:bg-[#f0a929] hover:text-[#1a140f] text-[#f0a929] text-[8px] font-mono font-bold tracking-widest uppercase rounded-lg transition-all active:scale-95 shadow-sm cursor-pointer whitespace-nowrap">
            [ PROFILE ]
          </button>
        </div>
      </div>

      <!-- TABS: CHAT HISTORY vs HR ESCALATION INBOX -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="flex border-b border-[#4a3424] mb-3">
          <button @click="activeTab = 'history'"
            class="flex-1 pb-2 text-[8px] font-display font-black tracking-wider uppercase transition-all border-b-2"
            :class="activeTab === 'history' ? 'border-[#f0a929] text-[#f0a929]' : 'border-transparent text-[#cca37a]/60 hover:text-[#cca37a]'">
            HISTORY
          </button>
          <button @click="activeTab = 'escalations'"
            class="flex-1 pb-2 text-[8px] font-display font-black tracking-wider uppercase transition-all border-b-2 relative"
            :class="activeTab === 'escalations' ? 'border-[#e05320] text-[#e05320]' : 'border-transparent text-[#cca37a]/60 hover:text-[#cca37a]'">
            BALASAN HR
            <span v-if="resolvedEscalationsCount > 0" class="ml-1 bg-[#10b981] text-black px-1.5 py-0.2 text-[7px] rounded-full font-extrabold animate-pulse">
              {{ resolvedEscalationsCount }}
            </span>
          </button>
        </div>

        <!-- TAB 1: Chat History -->
        <div v-if="activeTab === 'history'" class="flex-1 flex flex-col overflow-hidden">
          <div class="flex items-center justify-between mb-2">
            <p class="text-[7px] text-[#cca37a] font-mono uppercase">// RIWAYAT QUERI</p>
            <button @click="$emit('fetch-history')" class="text-[7px] text-[#f0a929] hover:underline font-mono">REFRSH</button>
          </div>
          
          <div class="flex-1 overflow-y-auto industrial-scroll space-y-2 pr-1 font-mono text-[9px]">
            <div v-for="item in chatHistory" :key="item.id" @click="loadHistoryQuery(item.message)"
                 class="bg-[#1a120c] border border-[#4a3424]/60 hover:border-[#f0a929] p-2.5 rounded-xl transition-all cursor-pointer group">
              <p class="text-[#f4ede2] font-bold truncate group-hover:text-[#f0a929]">[ QUERY ] {{ item.message }}</p>
              <p class="text-[7px] text-[#cca37a]/70 mt-1 truncate">{{ item.created_at || 'Terbaru' }}</p>
            </div>
            <div v-if="!chatHistory.length" class="text-[9px] text-[#cca37a]/50 text-center py-6 italic">
              Belum ada riwayat kueri.
            </div>
          </div>
        </div>

        <!-- TAB 2: HR Escalation Inbox -->
        <div v-else class="flex-1 flex flex-col overflow-hidden">
          <div class="flex items-center justify-between mb-2">
            <p class="text-[7px] text-[#cca37a] font-mono uppercase">// TIKET ESKALASI SAYA</p>
            <button @click="$emit('fetch-user-escalations')" class="text-[7px] text-[#f0a929] hover:underline font-mono">REFRESH</button>
          </div>

          <div class="flex-1 overflow-y-auto industrial-scroll space-y-2.5 pr-1 font-mono text-[9px]">
            <div v-for="esc in userEscalations" :key="esc.id" 
                 class="bg-[#1a120c] border rounded-xl p-3 shadow-md transition-all"
                 :class="esc.status === 'resolved' ? 'border-[#10b981]/60 bg-[#0d1c12]' : 'border-[#e05320]/40'">
              
              <div class="flex items-center justify-between mb-1.5">
                <span class="px-1.5 py-0.5 rounded text-[7px] font-bold uppercase"
                      :class="esc.status === 'resolved' ? 'bg-[#10b981] text-black font-extrabold' : 'bg-[#e05320] text-white animate-pulse'">
                  {{ esc.status === 'resolved' ? 'DIBALAS HR' : 'PENDING' }}
                </span>
                <span class="text-[7px] text-[#cca37a]">{{ esc.created_at || 'Baru' }}</span>
              </div>

              <p class="text-[#f4ede2] font-bold truncate mb-1">PERTANYAAN: {{ esc.question }}</p>

              <!-- Answer box if resolved -->
              <div v-if="esc.status === 'resolved'" class="mt-2 pt-2 border-t border-[#10b981]/30">
                <p class="text-[7px] text-[#34d399] font-bold mb-1">BALASAN HR ({{ esc.resolved_by || 'Admin' }}):</p>
                <p class="text-[9px] text-[#f4ede2] bg-[#06150b] p-2 rounded-lg leading-relaxed mb-2 font-mono">
                  {{ esc.hr_response }}
                </p>
              </div>
            </div>
            <div v-if="!userEscalations || !userEscalations.length" class="text-[9px] text-[#cca37a]/50 text-center py-6 italic">
              Belum ada tiket eskalasi.
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Action: AI Executive Summary -->
      <div class="mt-3 pt-3 border-t border-[#4a3424]">
        <button @click="$emit('open-summary')" 
                class="w-full py-2.5 bg-[#f0a929]/10 border border-[#f0a929]/50 hover:bg-[#f0a929] hover:text-[#140e0a] text-[#f0a929] rounded-xl text-[9px] font-display font-black tracking-widest uppercase transition-all duration-150 active:scale-95 flex items-center justify-center gap-2">
          <span>[ AI EXECUTIVE SUMMARY ]</span>
        </button>
      </div>

      <!-- Logout button -->
      <button @click="$emit('logout')" 
        class="mt-4 w-full bg-[#e05320]/10 border border-[#e05320]/50 hover:bg-[#e05320] text-[#e05320] hover:text-white py-2.5 rounded-xl text-[9px] font-mono font-bold tracking-widest uppercase transition-all active:scale-95 shadow-md">
        [ TERMINATE SESSION ]
      </button>
    </aside>

    <!-- CENTER COCKPIT: CHAT STREAM & INPUT -->
    <main class="flex-1 bg-[#140e0a]/90 border-2 border-[#8d6b48]/40 rounded-3xl p-5 flex flex-col shadow-2xl backdrop-blur-md relative overflow-hidden">
      
      <!-- Top Bar Indicator -->
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-[#4a3424]/60 font-mono text-[9px]">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span class="text-[#f4ede2] font-bold uppercase tracking-wider">SYSTEM ACTIVE // HYBRID PARALLEL SEARCH ENGINE</span>
        </div>
        <span class="text-[#cca37a]">ROUTING: LLM GROQ / LLAMA-3.3-70B</span>
      </div>

      <!-- Chat Stream -->
      <div id="chat-flow" class="flex-1 overflow-y-auto industrial-scroll space-y-4 pr-2 font-mono text-[11px]">
        <div v-for="msg in messages" :key="msg.id" class="flex flex-col">
          
          <!-- USER BUBBLE -->
          <div v-if="msg.role === 'user'" class="self-end max-w-[80%] bg-gradient-to-r from-[#2c1a0e] to-[#3a2313] border border-[#f0a929]/40 text-[#f4ede2] p-4 rounded-2xl shadow-lg rounded-tr-none mb-2">
            <p class="text-[9px] text-[#f0a929] font-bold tracking-widest uppercase mb-1">OPERATOR QUERY</p>
            <p class="leading-relaxed">{{ msg.text }}</p>
          </div>

          <!-- HR ESCALATION DIRECT ANSWER BUBBLE -->
          <div v-else-if="msg.role === 'hr_admin'" class="self-start max-w-[85%] bg-[#06150b] border-2 border-[#10b981] text-[#f4ede2] p-4 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-tl-none mb-2 relative">
            <div class="flex items-center justify-between mb-2 pb-1 border-b border-[#10b981]/40">
              <span class="text-[9px] text-[#34d399] font-black tracking-widest uppercase flex items-center gap-1.5">
                BALASAN RESMI HR / ADMIN ({{ msg.resolved_by || 'Administrator' }})
              </span>
              <span class="text-[7px] bg-[#10b981]/20 text-[#34d399] px-2 py-0.5 rounded font-mono font-bold">
                HUMAN-IN-THE-LOOP RESOLVED
              </span>
            </div>
            <p class="text-[9px] text-[#cca37a] mb-1 font-bold">Pertanyaan Asli: "{{ msg.question }}"</p>
            <div class="prose text-[#f4ede2] leading-relaxed whitespace-pre-wrap font-mono font-bold text-[11px] bg-[#0c2013] p-3 rounded-xl border border-[#10b981]/30">
              {{ msg.text }}
            </div>
          </div>

          <!-- AI ORION BUBBLE -->
          <div v-else class="self-start max-w-[85%] bg-[#1a130c] border border-[#4a3424] text-[#f4ede2] p-4 rounded-2xl shadow-lg rounded-tl-none mb-2 border-l-4 border-l-[#f0a929] relative">
            <div class="flex items-center justify-between mb-2 pb-1 border-b border-[#4a3424]/50">
              <span class="text-[9px] text-[#f0a929] font-bold tracking-widest uppercase">
                ORION RAG RESPONSE
              </span>
              <span v-if="msg.retrieval_mode" class="text-[7px] bg-[#f0a929]/10 text-[#f0a929] px-2 py-0.5 rounded font-mono font-bold">
                {{ msg.retrieval_mode }}
              </span>
            </div>

            <!-- Message Text -->
            <div class="prose text-[#f4ede2] leading-relaxed whitespace-pre-wrap">
              {{ msg.text }}
            </div>

            <!-- Citations Badges & Bookmark -->
            <div v-if="msg.citations && msg.citations.length" class="mt-3 pt-2 border-t border-[#4a3424]/60 flex flex-wrap items-center gap-2">
              <span class="text-[8px] text-[#cca37a] font-bold tracking-widest uppercase">SUMBER REFERENSI PDF:</span>
              <div v-for="(cit, ci) in msg.citations" :key="ci" 
                   @click="openPdfViewer(cit)"
                   class="bg-[#2a1d13] border border-[#f0a929]/40 hover:border-[#f0a929] px-2.5 py-1 rounded-lg text-[8px] text-[#f0a929] font-bold flex items-center gap-1.5 shadow-sm cursor-pointer hover:scale-105 transition-all active:scale-95">
                <span>[ PDF ] {{ cit.file }} (Hal. {{ cit.page }})</span>
                <button @click.stop="$emit('toggle-bookmark', cit)" title="Simpan Referensi di Panel Kanan"
                        class="hover:text-white transition-colors text-[9px] text-[#f0a929] font-bold ml-1">
                  [ PIN ]
                </button>
              </div>
            </div>

            <!-- Action Toolbar (Rating & Escalation) -->
            <div v-if="msg.id !== 1" class="mt-3 pt-2 border-t border-[#4a3424]/40 flex items-center justify-between">
              
              <!-- RLHF Rating Buttons -->
              <div class="flex items-center gap-2">
                <span class="text-[8px] text-[#cca37a]">Evaluasi Jawaban:</span>
                <button @click="rateAnswer(msg.text, 'positive')" 
                        class="px-2.5 py-1 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e] hover:text-black rounded-lg text-[9px] font-bold transition-all active:scale-95">
                  [ ACCURATE ]
                </button>
                <button @click="rateAnswer(msg.text, 'negative')" 
                        class="px-2.5 py-1 bg-[#e05320]/10 border border-[#e05320]/30 text-[#e05320] hover:bg-[#e05320] hover:text-white rounded-lg text-[9px] font-bold transition-all active:scale-95">
                  [ IRRELEVANT ]
                </button>
              </div>

              <!-- Human Escalation Button if fallback detected -->
              <button v-if="isFallbackResponse(msg.text)" 
                      @click="triggerEscalation(msg)"
                      class="px-3 py-1.5 bg-gradient-to-r from-[#e05320] to-[#f0a929] text-[#140e0a] rounded-xl text-[9px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(224,83,32,0.5)] hover:scale-105 transition-all active:scale-95 flex items-center gap-1.5">
                <span>[ ESKALASI KE ADMIN / HR ]</span>
              </button>

            </div>

          </div>

        </div>

        <div v-if="isTyping" class="self-start bg-[#1a130c] border border-[#4a3424] p-3 rounded-2xl text-[#f0a929] animate-pulse font-mono text-[10px]">
          [ ORION IS RETRIEVING CHUNKS & SYNTHESIZING RESPONSE... ]
        </div>
      </div>

      <!-- Input Area -->
      <form @submit.prevent="$emit('send-message')" class="mt-4 flex gap-3">
        <input v-model="inputMsg" type="text" placeholder="Ketik pertanyaan terkait SOP, Keuangan, HRD, teknis, atau regulasi perusahaan..."
          class="flex-1 bg-[#0c0806] border-2 border-[#4a3424] focus:border-[#f0a929] text-[#f4ede2] px-5 py-3.5 rounded-2xl text-[11px] font-mono outline-none shadow-inner tracking-wide" />
        <button type="submit" :disabled="isTyping"
          class="tactile-btn px-7 py-3.5 text-[10px] font-display font-black tracking-[0.25em] uppercase transition-all duration-150 active:scale-95 active:translate-y-0.5 hover:shadow-[0_0_20px_rgba(240,169,41,0.5)]">
          EXECUTE
        </button>
      </form>

    </main>

    <!-- RIGHT PANEL: PINNED CITATIONS & QUICK ACCESSS -->
    <aside class="w-80 bg-[#140e0a]/90 border-2 border-[#8d6b48]/40 rounded-3xl p-5 flex flex-col shadow-2xl backdrop-blur-md">
      
      <div class="mb-4 pb-3 border-b border-[#4a3424]">
        <p class="text-[8px] text-[#f0a929] font-display font-black tracking-[0.25em] uppercase">
          PINNED CITATIONS (REFERENSI FAVORIT)
        </p>
        <p class="text-[8px] text-[#cca37a] mt-0.5 font-mono">
          Bookmark sitasi PDF penting untuk akses cepat tanpa bertanya ulang.
        </p>
      </div>

      <!-- Bookmark List -->
      <div class="flex-1 overflow-y-auto industrial-scroll space-y-2.5 pr-1 font-mono text-[9px]">
        <div v-for="(bm, bmi) in pinnedCitations" :key="bmi" 
             @click="openPdfViewer(bm)"
             class="bg-[#1f150f] border border-[#f0a929]/40 rounded-2xl p-3 shadow-md relative group hover:border-[#f0a929] cursor-pointer transition-all hover:translate-x-1">
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-[#f0a929] truncate max-w-[170px]">[ PDF ] {{ bm.file }}</span>
            <button @click.stop="$emit('toggle-bookmark', bm)" class="text-[#e05320] hover:text-white text-[10px] font-bold" title="Hapus Bookmark">✕</button>
          </div>
          <p class="text-[8px] text-[#f4ede2] font-bold mb-2">Halaman Target: Hal. {{ bm.page }}</p>
          <div class="pt-2 border-t border-[#4a3424]/50 flex justify-between items-center text-[7px] text-[#cca37a]">
            <span class="bg-[#f0a929]/20 text-[#f0a929] px-2 py-0.5 rounded font-bold uppercase hover:bg-[#f0a929] hover:text-[#120d09] transition-all">
              [ BACA DOKUMEN PDF ]
            </span>
            <span class="bg-[#f0a929]/20 text-[#f0a929] px-1.5 py-0.5 rounded font-bold uppercase">PINNED</span>
          </div>
        </div>

        <div v-if="!pinnedCitations || !pinnedCitations.length" class="text-[9px] text-[#cca37a]/50 text-center py-8 italic border-2 border-dashed border-[#4a3424] rounded-2xl p-4">
          Klik tombol [ PIN ] di bawah jawaban AI untuk menyimpannya di sini.
        </div>
      </div>

      <!-- Quick Help Callout -->
      <div class="mt-4 bg-[#1a120c] border border-[#4a3424] rounded-2xl p-3.5 text-center font-mono">
        <p class="text-[8px] text-[#f0a929] font-bold tracking-widest uppercase mb-1">TIPS NAVIGASI ORION</p>
        <p class="text-[8px] text-[#cca37a] leading-normal">
          Jawaban AI didasarkan pada file PDF yang di-upload oleh Tim HR/Admin. Klik sitasi untuk membaca dokumen PDF asli.
        </p>
      </div>

    </aside>

    <!-- PDF VIEWER MODAL -->
    <Transition name="solarpunk-pop">
      <div v-if="selectedPdfModal.isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6">
        <div class="w-full max-w-5xl h-[88vh] bg-[#120d09] border-2 border-[#f0a929] rounded-3xl p-6 shadow-2xl flex flex-col relative text-left font-mono">
          
          <div class="flex items-center justify-between pb-3 border-b border-[#4a3424] mb-3">
            <div class="flex items-center gap-3 overflow-hidden">
              <span class="w-3 h-3 rounded-full bg-[#f0a929] shadow-[0_0_10px_#f0a929]"></span>
              <div class="overflow-hidden">
                <h3 class="text-xs font-display font-black text-[#f0a929] uppercase tracking-widest truncate">
                  DOCUMENT VIEWER // {{ selectedPdfModal.file }}
                </h3>
                <p class="text-[9px] text-[#cca37a] font-mono mt-0.5">Target Halaman: Hal. {{ selectedPdfModal.page }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <a :href="selectedPdfModal.url" target="_blank" class="px-3.5 py-2 bg-[#f0a929]/20 border border-[#f0a929] text-[#f0a929] hover:bg-[#f0a929] hover:text-[#120d09] rounded-xl text-[9px] font-mono font-bold transition-all">
                [ BUKA DI TAB BARU ]
              </a>
              <button @click="selectedPdfModal.isOpen = false" class="px-3.5 py-2 bg-[#26180f] text-[#cca37a] hover:text-white rounded-xl text-[9px] font-mono font-bold border border-[#4a3424] transition-all">
                [ X CLOSE ]
              </button>
            </div>
          </div>

          <div class="flex-1 bg-[#080503] border border-[#4a3424] rounded-2xl overflow-hidden relative shadow-inner">
            <iframe :src="selectedPdfModal.url" class="w-full h-full border-none"></iframe>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  currentUser: Object,
  messages: Array,
  inputMessage: String,
  isTyping: Boolean,
  pinnedCitations: Array,
  chatHistory: Array,
  userEscalations: Array
})

const emit = defineEmits([
  'update:inputMessage', 'send-message', 'logout', 
  'toggle-bookmark', 'rate-answer', 'escalate-query', 
  'fetch-history', 'fetch-user-escalations', 'load-history', 'open-summary', 'inject-hr-message'
])

const activeTab = ref('history')

const selectedPdfModal = ref({
  isOpen: false,
  file: '',
  page: 1,
  url: ''
})

const openPdfViewer = (cit) => {
  if (!cit || !cit.file) return
  const filename = cit.file
  const page = cit.page || 1
  const pdfUrl = `http://localhost:8000/static/pdfs/${encodeURIComponent(filename)}#page=${page}`
  selectedPdfModal.value = {
    isOpen: true,
    file: filename,
    page: page,
    url: pdfUrl
  }
}

const inputMsg = computed({
  get: () => props.inputMessage,
  set: (val) => emit('update:inputMessage', val)
})

const resolvedEscalationsCount = computed(() => {
  if (!props.userEscalations) return 0
  return props.userEscalations.filter(e => e.status === 'resolved').length
})

const activeDivisionSops = computed(() => {
  const div = props.currentUser?.divisi?.toLowerCase() || 'general'
  if (div === 'teknisi') {
    return [
      { name: 'GitLab_Eng_Corporate_IT.pdf', type: 'TEKNISI' },
      { name: 'GitLab_Eng_Infrastructure_Platforms.pdf', type: 'TEKNISI' },
      { name: 'GitLab_Eng_Security_Risk_Management.pdf', type: 'TEKNISI' },
      { name: 'GitLab_HR_People_Policies.pdf', type: 'HR (UNIVERSAL)' }
    ]
  } else if (div === 'finance') {
    return [
      { name: 'GitLab_Finance_Travel_Expense_Policy.pdf', type: 'FINANCE' },
      { name: 'GitLab_Finance_Planning_Analysis.pdf', type: 'FINANCE' },
      { name: 'GitLab_Finance_Procurement_Team.pdf', type: 'FINANCE' },
      { name: 'GitLab_HR_People_Policies.pdf', type: 'HR (UNIVERSAL)' }
    ]
  } else {
    return [
      { name: 'GitLab_HR_People_Policies.pdf', type: 'HR' },
      { name: 'GitLab_HR_Leave_of_Absence_Policies.pdf', type: 'HR' }
    ]
  }
})

const isFallbackResponse = (text) => {
  if (!text) return false
  return text.includes('tidak ada di dalam buku panduan') || text.includes('Mohon maaf')
}

const rateAnswer = (msgText, rating) => {
  emit('rate-answer', { msgText, rating })
}

const triggerEscalation = (msg) => {
  const lastUserMsg = props.messages.filter(m => m.role === 'user').pop()
  const question = lastUserMsg ? lastUserMsg.text : 'Kueri informasi tidak ditemukan'
  emit('escalate-query', question)
}

const loadHistoryQuery = (q) => {
  emit('load-history', q)
}

const injectAnswerToChat = (esc) => {
  emit('inject-hr-message', esc)
}

onMounted(() => {
  emit('fetch-user-escalations')
})
</script>

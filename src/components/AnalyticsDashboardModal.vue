<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0c0a]/85 backdrop-blur-md p-6 transition-all">
    <div class="solarpunk-chassis w-full max-w-6xl h-[88vh] rounded-3xl p-6 flex flex-col relative border-2 border-[#8d6b48]/60 shadow-[0_0_60px_rgba(26,20,15,0.95)]">
      
      <!-- Close Button -->
      <button @click="$emit('close')" 
        class="absolute top-5 right-5 bg-[#1a140f] border border-[#e05320]/70 text-[#e05320] hover:bg-[#e05320] hover:text-[#1a140f] px-4 py-2 rounded-xl text-[10px] font-mono font-bold tracking-[0.2em] transition-all duration-150 shadow-md active:scale-95 active:translate-y-0.5 hover:shadow-[0_0_15px_rgba(224,83,32,0.5)] z-20 cursor-pointer">
        [ X ] CLOSE CONTROL
      </button>

      <!-- Modal Header -->
      <div class="mb-5 flex items-center gap-3 border-b border-[#4a3424] pb-4">
        <span class="w-3.5 h-3.5 rounded-full bg-[#f0a929] shadow-[0_0_15px_#f0a929] animate-pulse"></span>
        <div>
          <h2 class="text-2xl font-display font-black tracking-[0.2em] text-[#1a140f] uppercase">
            SYS_TELEMETRY_ANALYTICS & ESCALATION DESK
          </h2>
          <p class="text-[8px] text-[#4a3424] font-bold tracking-[0.3em] uppercase font-mono">
            // METRIK PENGGUNAAN ORION RAG & PENANGANAN ESKALASI KARYAWAN
          </p>
        </div>
      </div>

      <!-- Main Grid Body -->
      <div class="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        
        <!-- LEFT COLUMN: COUNTER METRICS & TELEMETRY CHARTS -->
        <div class="w-full md:w-5/12 flex flex-col gap-4 overflow-y-auto industrial-scroll pr-1">
          
          <!-- Metric Counters Grid -->
          <div class="grid grid-cols-2 gap-3 font-mono">
            
            <div class="bg-[#130f0c] border-2 border-[#4a3424] p-4 rounded-2xl shadow-inner relative overflow-hidden">
              <span class="text-[8px] text-[#cca37a] font-bold uppercase tracking-widest block mb-1">TOTAL QUERIES</span>
              <p class="text-3xl font-black text-[#f0a929]">{{ analyticsData?.total_queries || 0 }}</p>
              <p class="text-[7px] text-[#cca37a]/60 mt-1">▲ RAG Search Invocations</p>
            </div>

            <div class="bg-[#130f0c] border-2 border-[#4a3424] p-4 rounded-2xl shadow-inner relative overflow-hidden">
              <span class="text-[8px] text-[#cca37a] font-bold uppercase tracking-widest block mb-1">OPERATORS INDEX</span>
              <p class="text-3xl font-black text-[#34d399]">{{ analyticsData?.total_operators || 0 }}</p>
              <p class="text-[7px] text-[#cca37a]/60 mt-1">● Active User Accounts</p>
            </div>

            <div class="bg-[#130f0c] border-2 border-[#4a3424] p-4 rounded-2xl shadow-inner relative overflow-hidden">
              <span class="text-[8px] text-[#cca37a] font-bold uppercase tracking-widest block mb-1">PENDING ESCALATIONS</span>
              <p class="text-3xl font-black text-[#ef4444] animate-pulse">{{ analyticsData?.pending_escalations || 0 }}</p>
              <p class="text-[7px] text-[#ef4444]/80 mt-1">🚨 Requires HR Response</p>
            </div>

            <div class="bg-[#130f0c] border-2 border-[#4a3424] p-4 rounded-2xl shadow-inner relative overflow-hidden">
              <span class="text-[8px] text-[#cca37a] font-bold uppercase tracking-widest block mb-1">RLHF ACCURACY SCORE</span>
              <div class="flex items-center gap-2">
                <span class="text-xl font-bold text-[#22c55e]">👍 {{ analyticsData?.positive_feedback || 0 }}</span>
                <span class="text-xl font-bold text-[#e05320]">👎 {{ analyticsData?.negative_feedback || 0 }}</span>
              </div>
              <p class="text-[7px] text-[#cca37a]/60 mt-1">User RLHF Rating Ratio</p>
            </div>

          </div>

          <!-- Division Distribution Visualizer -->
          <div class="bg-[#130f0c] border-2 border-[#4a3424] p-5 rounded-2xl shadow-inner font-mono">
            <p class="text-[9px] text-[#f0a929] font-display font-black tracking-[0.2em] uppercase mb-3 pb-2 border-b border-[#4a3424]">
              ◆ DISTRIBUSI HAK AKSES DIVISI (RBAC)
            </p>
            <div class="space-y-3">
              <div v-for="div in (analyticsData?.divisions || [])" :key="div.divisi" class="space-y-1">
                <div class="flex justify-between text-[9px] text-[#f4ede2] uppercase font-bold">
                  <span>{{ div.divisi }}</span>
                  <span class="text-[#f0a929]">{{ div.total }} Users</span>
                </div>
                <div class="w-full bg-[#080605] h-2 rounded-full overflow-hidden border border-[#4d3725]">
                  <div class="bg-gradient-to-r from-[#f0a929] to-[#e05320] h-full rounded-full transition-all duration-500"
                       :style="{ width: `${Math.min(100, (div.total / (analyticsData?.total_operators || 1)) * 100)}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Vector Index Health Gauge -->
          <div class="bg-[#130f0c] border-2 border-[#4a3424] p-5 rounded-2xl shadow-inner font-mono text-center relative overflow-hidden">
            <p class="text-[9px] text-[#f0a929] font-display font-black tracking-[0.2em] uppercase mb-2">
              ⚡ HYBRID RETRIEVAL PIPELINE HEALTH
            </p>
            <div class="flex items-center justify-center gap-4 my-2">
              <div class="p-3 bg-[#1a140f] border border-[#f0a929]/40 rounded-xl">
                <span class="block text-[8px] text-[#cca37a]">DENSE RETRIEVAL</span>
                <span class="text-xs text-[#10b981] font-bold">COSINE SIMILARITY ✓</span>
              </div>
              <div class="p-3 bg-[#1a140f] border border-[#f0a929]/40 rounded-xl">
                <span class="block text-[8px] text-[#cca37a]">SPARSE RETRIEVAL</span>
                <span class="text-xs text-[#10b981] font-bold">BM25 RANKING ✓</span>
              </div>
            </div>
            <span class="text-[8px] text-[#cca37a]/70 uppercase tracking-widest block mt-1">RECIPROCAL RANK FUSION (RRF) ACTIVE (k=60)</span>
          </div>

        </div>

        <!-- RIGHT COLUMN: ESCALATION RESOLUTION DESK -->
        <div class="w-full md:w-7/12 bg-[#130f0c] border-2 border-[#4a3424] rounded-2xl p-5 flex flex-col shadow-inner overflow-hidden">
          
          <div class="flex items-center justify-between mb-4 pb-2 border-b border-[#4a3424]">
            <p class="text-[10px] text-[#f0a929] font-display font-black tracking-[0.2em] uppercase">
              🚨 ESCALATION INBOX (PERTANYAAN UNRESOLVED KARYAWAN)
            </p>
            <button @click="loadEscalations" class="text-[8px] text-[#f0a929] hover:underline font-mono">↻ REFRESH</button>
          </div>

          <!-- Escalations List -->
          <div class="flex-1 overflow-y-auto industrial-scroll space-y-3 pr-2 font-mono text-[9px]">
            <div v-for="esc in escalationsList" :key="esc.id" 
                 class="bg-[#1a140f] border rounded-2xl p-4 transition-all shadow-md"
                 :class="esc.status === 'pending' ? 'border-[#ef4444]/60 bg-[#1f110d]' : 'border-[#10b981]/40 bg-[#0d1c12]'">
              
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[7px] font-bold uppercase"
                        :class="esc.status === 'pending' ? 'bg-[#ef4444] text-white animate-pulse' : 'bg-[#10b981] text-black'">
                    {{ esc.status }}
                  </span>
                  <span class="text-[#f0a929] font-bold">👤 {{ esc.username || 'Operator' }} (Divisi: {{ esc.user_divisi || 'Universal' }})</span>
                </div>
                <span class="text-[7px] text-[#cca37a]">{{ esc.created_at }}</span>
              </div>

              <!-- Question Body -->
              <div class="bg-[#080605] border border-[#4d3725] p-3 rounded-xl mb-3 text-[#f4ede2] font-bold">
                ❓ "{{ esc.question }}"
              </div>

              <!-- If resolved, show answer -->
              <div v-if="esc.status === 'resolved'" class="bg-[#06150b] border border-[#10b981]/40 p-3 rounded-xl text-[#34d399]">
                <p class="text-[7px] text-[#cca37a] mb-1 font-bold">BALASAN DIKIRIM OLEH: {{ esc.resolved_by }}</p>
                <p class="leading-relaxed">💬 {{ esc.answer }}</p>
              </div>

              <!-- Reply Form if pending -->
              <div v-else class="space-y-2">
                <textarea v-model="replyTexts[esc.id]" placeholder="Ketik balasan resmi HR / Upload SOP baru jika diperlukan..."
                  class="w-full bg-[#080605] border border-[#4d3725] focus:border-[#f0a929] p-2.5 rounded-xl text-[10px] text-[#f4ede2] outline-none font-mono resize-none h-16"></textarea>
                <div class="flex justify-end">
                  <button @click="submitReply(esc.id)" :disabled="isSubmittingReply[esc.id]"
                    class="px-4 py-2 bg-gradient-to-r from-[#059669] to-[#0d9488] hover:from-[#10b981] hover:to-[#14b8a6] text-white rounded-xl text-[8px] font-extrabold tracking-wider uppercase transition-all active:scale-95 shadow-md">
                    {{ isSubmittingReply[esc.id] ? 'SENDING...' : '✓ BALAS & RESOLVE' }}
                  </button>
                </div>
              </div>

            </div>

            <div v-if="!escalationsList.length" class="text-[10px] text-[#cca37a]/50 text-center py-12 italic">
              Tidak ada eskalasi pending. Semua kueri teratasi oleh RAG Engine.
            </div>

          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  analyticsData: Object,
  escalationsList: Array
})

const emit = defineEmits(['close', 'refresh-analytics', 'reply-escalation'])

const replyTexts = ref({})
const isSubmittingReply = ref({})

const loadEscalations = () => {
  emit('refresh-analytics')
}

const submitReply = async (id) => {
  const answer = replyTexts.value[id]
  if (!answer || !answer.trim()) return
  
  isSubmittingReply.value[id] = true
  try {
    await emit('reply-escalation', { id, answer })
    replyTexts.value[id] = ''
  } finally {
    isSubmittingReply.value[id] = false
  }
}

onMounted(() => {
  loadEscalations()
})
</script>

<style scoped>
.industrial-scroll::-webkit-scrollbar { width: 6px; }
.industrial-scroll::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.5); border-radius: 4px; }
.industrial-scroll::-webkit-scrollbar-thumb { background: rgba(141, 107, 72, 0.8); border-radius: 4px; }
.industrial-scroll::-webkit-scrollbar-thumb:hover { background: rgba(240, 169, 41, 1); }
</style>

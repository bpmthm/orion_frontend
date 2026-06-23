<script setup>
import { onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'
import { useOrion } from './composables/useOrion.js'

const {
  isLoggedIn, email, password, authError, authLoading, currentUser,
  messages, inputMessage, isTyping,
  currentTime, formattedUptime, systemMetrics,
  isDragOver, uploadStatus, uploadFileName, systemLogs,
  initSystem, destroySystem,
  handleLogin, handleLogout, sendMessage,
  handleDragOver, handleDragLeave, handleDrop, handleFileInput
} = useOrion()

onMounted(() => { initSystem() })
onUnmounted(() => { destroySystem() })
</script>

<template>
  <!-- Transition Overlay Panels (Industrial Gate) -->
  <div id="transition-gate" class="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between">
    <div class="shutter-top w-full h-[50vh] bg-[#050505] border-b border-[#e05320]/20 transform -translate-y-full flex items-end justify-center pb-8">
      <div class="text-[8px] tracking-[0.5em] text-[#e05320] uppercase font-mono mb-2 text-flicker">ACCESSING SECURE DATA SYSTEMS...</div>
    </div>
    <div class="shutter-bottom w-full h-[50vh] bg-[#050505] border-t border-[#e05320]/20 transform translate-y-full flex items-start justify-center pt-8">
      <div class="text-[8px] tracking-[0.5em] text-[#ffb800] uppercase font-mono mt-2 text-flicker">DECRYPTING CLOUD METRIC INDEXES...</div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════
       LOGIN VIEW — SPLIT INDUSTRIAL AUTH GATE
       ═══════════════════════════════════════════════ -->
  <div v-if="!isLoggedIn" id="login-view"
    class="h-screen w-screen flex tech-grid scanline-overlay overflow-hidden"
    style="background-color: #050505;">

    <!-- LEFT: IDENTITY BRANDING -->
    <div class="login-left hidden md:flex w-[55%] flex-col justify-between p-10 relative">
      <div>
        <p class="text-[9px] tracking-[0.5em] text-[#e05320] font-bold uppercase mb-6">
          // RESTRICTED_AREA
        </p>
        <div class="h-px w-16 bg-[#e05320]/40 mb-10"></div>
      </div>

      <div class="mb-8">
        <div class="flex items-end gap-4 mb-6">
          <h1 class="text-[11vw] font-extrabold tracking-[-0.06em] leading-[0.85] text-[#f4ede2]">
            ORION<span class="text-[#e05320]">.</span>
          </h1>
          <span class="text-[4vw] text-[#e05320]/30 font-light leading-[0.85] mb-1">オリオン</span>
        </div>

        <div class="cyber-panel inline-block px-5 py-4 mt-2 max-w-md">
          <p class="text-[11px] text-[#8e8a82] leading-relaxed">
            Sistem Retrieval-Augmented Generation internal perusahaan.
            Diproteksi oleh enkripsi gerbang JWT.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-[9px] text-[#8e8a82]/60 uppercase tracking-[0.3em]">
        <div class="flex items-center gap-2">
          <span class="status-dot status-dot-online"></span>
          SYS: RAG ENGINE V1.0
        </div>
        <div class="flex items-center gap-2">
          <span class="status-dot status-dot-online"></span>
          LOC: INTERNAL SERVER
        </div>
        <div class="flex items-center gap-2">
          <span class="status-dot status-dot-warning"></span>
          ENC: JSON WEB TOKEN
        </div>
        <div class="flex items-center gap-2">
          <span class="status-dot status-dot-offline"></span>
          STATUS: AWAITING AUTH
        </div>
      </div>
    </div>

    <!-- RIGHT: AUTH FORM -->
    <div class="login-right w-full md:w-[45%] flex items-center justify-center p-8 md:p-12
                bg-[#0a0a08]/90 border-l border-[#e05320]/10">
      <div class="w-full max-w-sm">
        <div class="cyber-panel px-8 py-10 tech-grid-dense">
          <h2 class="text-xl font-bold tracking-[0.15em] text-[#f4ede2] mb-1 uppercase">
            Authenticate
          </h2>
          <p class="text-[9px] text-[#8e8a82] tracking-[0.2em] uppercase mb-10">
            // Masukkan kredensial sistem
          </p>

          <form @submit.prevent="handleLogin" class="space-y-7">
            <div>
              <label class="block text-[8px] uppercase tracking-[0.4em] text-[#8e8a82]/60 mb-2">
                Internal Email
              </label>
              <input v-model="email" type="email" placeholder="user@orion.internal" required
                class="w-full bg-transparent border border-[#27272a] px-4 py-3 text-xs text-[#f4ede2]
                       placeholder-[#27272a] focus:outline-none focus:border-[#e05320]
                       transition-colors" />
            </div>

            <div>
              <label class="block text-[8px] uppercase tracking-[0.4em] text-[#8e8a82]/60 mb-2">
                Access Password
              </label>
              <input v-model="password" type="password" placeholder="••••••••••" required
                class="w-full bg-transparent border border-[#27272a] px-4 py-3 text-xs text-[#f4ede2]
                       placeholder-[#27272a] focus:outline-none focus:border-[#e05320]
                       transition-colors" />
            </div>

            <div v-if="authError"
              class="text-[9px] text-[#050505] bg-[#e05320] px-3 py-2 font-bold tracking-wider">
              ⚠ {{ authError }}
            </div>

            <button type="submit" :disabled="authLoading"
              class="w-full border border-[#e05320] text-[#f4ede2] text-[10px] font-bold
                     tracking-[0.3em] uppercase py-4 mt-2 hover:bg-[#e05320] hover:text-[#050505]
                     transition-all duration-300 disabled:opacity-30 relative group">
              <span class="relative z-10">
                {{ authLoading ? 'DECRYPTING...' : 'DECRYPT & ENTER' }}
              </span>
              <div class="absolute bottom-0 left-0 h-[2px] w-0 bg-[#ffb800]
                          group-hover:w-full transition-all duration-500"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════
       DASHBOARD VIEW — BENTO GRID COMMAND CENTER
       ═══════════════════════════════════════════════ -->
  <div v-else id="dashboard-view"
    class="h-screen w-screen grid tech-grid scanline-overlay overflow-hidden"
    style="grid-template-columns: 1fr 2fr 1fr; background-color: #050505; gap: 1px;">

    <!-- ── LEFT PANEL: IDENTITY & TERMINAL STATE ── -->
    <aside class="panel-left flex flex-col bg-[#0a0a08] border-r border-[#e05320]/8 overflow-hidden">

      <!-- Branding -->
      <div class="px-5 pt-5 pb-4 border-b border-[#ffffff]/5">
        <p class="text-[8px] tracking-[0.5em] text-[#e05320] font-bold uppercase mb-3 text-flicker">
          // CORE_ENGINE v1.0
        </p>
        <h1 class="text-4xl font-extrabold tracking-[-0.04em] text-[#f4ede2] leading-none">
          ORION<span class="text-[#ffb800]">.</span>
        </h1>
        <p class="text-[8px] text-[#8e8a82]/50 mt-2 tracking-[0.2em] uppercase">
          RAG Intelligence Network
        </p>
      </div>

      <!-- Clock & Uptime -->
      <div class="px-5 py-4 border-b border-[#ffffff]/5">
        <div class="flex justify-between items-baseline">
          <span class="text-[8px] text-[#8e8a82]/40 tracking-[0.3em] uppercase">SYS_TIME</span>
          <span class="text-lg text-[#f4ede2] font-bold tracking-wider">{{ currentTime }}</span>
        </div>
        <div class="flex justify-between items-baseline mt-2">
          <span class="text-[8px] text-[#8e8a82]/40 tracking-[0.3em] uppercase">UPTIME</span>
          <span class="text-xs text-[#ffb800]">{{ formattedUptime }}</span>
        </div>
      </div>

      <!-- System Metrics -->
      <div class="px-5 py-4 border-b border-[#ffffff]/5 flex-1 space-y-4 overflow-y-auto industrial-scroll">
        <p class="text-[8px] text-[#8e8a82]/40 tracking-[0.3em] uppercase mb-3">DIAGNOSTICS</p>

        <div>
          <div class="flex justify-between text-[9px] mb-1">
            <span class="text-[#8e8a82]">RAG_ENGINE</span>
            <span class="text-[#22c55e]">ONLINE</span>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-[9px] mb-1">
            <span class="text-[#8e8a82]">VECTOR_DB</span>
            <span class="text-[#f4ede2]">{{ systemMetrics.vectorCount }} CHUNKS</span>
          </div>
          <div class="metric-bar"><div class="metric-bar-fill" :style="{width: Math.min(systemMetrics.vectorCount/5, 100)+'%'}"></div></div>
        </div>
        <div>
          <div class="flex justify-between text-[9px] mb-1">
            <span class="text-[#8e8a82]">AVG_LATENCY</span>
            <span class="text-[#ffb800]">{{ systemMetrics.avgLatency }}ms</span>
          </div>
          <div class="metric-bar"><div class="metric-bar-fill" :style="{width: systemMetrics.avgLatency/3+'%'}"></div></div>
        </div>
        <div>
          <div class="flex justify-between text-[9px] mb-1">
            <span class="text-[#8e8a82]">MEM_USAGE</span>
            <span class="text-[#f4ede2]">{{ systemMetrics.memUsage }}%</span>
          </div>
          <div class="metric-bar"><div class="metric-bar-fill" :style="{width: systemMetrics.memUsage+'%'}"></div></div>
        </div>
        <div>
          <div class="flex justify-between text-[9px] mb-1">
            <span class="text-[#8e8a82]">CPU_LOAD</span>
            <span class="text-[#f4ede2]">{{ systemMetrics.cpuLoad }}%</span>
          </div>
          <div class="metric-bar"><div class="metric-bar-fill" :style="{width: systemMetrics.cpuLoad+'%'}"></div></div>
        </div>
        <div>
          <div class="flex justify-between text-[9px] mb-1">
            <span class="text-[#8e8a82]">LLM_MODEL</span>
            <span class="text-[#f4ede2]">LLAMA-3.1-8B</span>
          </div>
        </div>

        <!-- User Info -->
        <div v-if="currentUser" class="pt-3 border-t border-[#ffffff]/5">
          <p class="text-[8px] text-[#8e8a82]/40 tracking-[0.3em] uppercase mb-2">OPERATOR</p>
          <p class="text-[10px] text-[#f4ede2]">{{ currentUser.username || currentUser.email }}</p>
        </div>
      </div>

      <!-- Session Control -->
      <div class="px-5 py-4 border-t border-[#ffffff]/5">
        <div class="flex items-center gap-2 mb-3">
          <span class="status-dot status-dot-online"></span>
          <span class="text-[8px] text-[#8e8a82] tracking-[0.2em] uppercase">SESSION: SECURED</span>
        </div>
        <button @click="handleLogout"
          class="text-[9px] text-[#e05320] tracking-[0.2em] uppercase hover:text-[#ffb800]
                 transition-colors flex items-center gap-2">
          <span>⏻</span> [TERMINATE_SESSION]
        </button>
      </div>
    </aside>

    <!-- ── CENTER PANEL: CORE OPERATIONS ── -->
    <div class="panel-center flex flex-col overflow-hidden bg-[#080808]">

      <!-- Top Diagnostic Row -->
      <div class="grid grid-cols-2 gap-px border-b border-[#ffffff]/5" style="height: 100px;">
        <!-- Node Telemetry -->
        <div class="cyber-panel-muted cyber-panel px-4 py-3 tech-grid-dense overflow-hidden">
          <p class="text-[7px] text-[#e05320] tracking-[0.4em] uppercase mb-2">NODE_TELEMETRY</p>
          <div class="flex items-end gap-1 h-10">
            <div v-for="i in 20" :key="'bar-'+i"
              class="flex-1 bg-[#e05320]/20 relative"
              :style="{height: (15 + Math.random()*85) + '%'}">
              <div class="absolute inset-x-0 bottom-0 bg-[#e05320]"
                :style="{height: (30 + Math.random()*70) + '%', opacity: 0.4 + Math.random()*0.6}"></div>
            </div>
          </div>
          <div class="flex justify-between mt-2 text-[7px] text-[#8e8a82]/40">
            <span>3 ACTIVE NODES</span>
            <span>THROUGHPUT: NOMINAL</span>
          </div>
        </div>

        <!-- RAG Index Health -->
        <div class="cyber-panel-muted cyber-panel px-4 py-3 tech-grid-dense overflow-hidden">
          <p class="text-[7px] text-[#ffb800] tracking-[0.4em] uppercase mb-2">RAG_INDEX_HEALTH</p>
          <div class="grid grid-cols-3 gap-3 mt-1">
            <div>
              <p class="text-lg font-bold text-[#f4ede2] leading-none">{{ systemMetrics.vectorCount }}</p>
              <p class="text-[7px] text-[#8e8a82]/40 mt-1">VECTORS</p>
            </div>
            <div>
              <p class="text-lg font-bold text-[#22c55e] leading-none">5</p>
              <p class="text-[7px] text-[#8e8a82]/40 mt-1">K-SEARCH</p>
            </div>
            <div>
              <p class="text-lg font-bold text-[#ffb800] leading-none">{{ systemMetrics.avgLatency }}<span class="text-[9px] font-normal">ms</span></p>
              <p class="text-[7px] text-[#8e8a82]/40 mt-1">LATENCY</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Flow -->
      <div id="chat-flow" class="flex-1 overflow-y-auto px-6 py-5 space-y-4 industrial-scroll">
        <div v-for="msg in messages" :key="msg.id"
          class="max-w-2xl"
          :class="msg.role === 'user' ? 'ml-auto' : ''">

          <!-- Label -->
          <div class="flex items-center gap-2 mb-1"
            :class="msg.role === 'user' ? 'justify-end' : ''">
            <span class="status-dot"
              :class="msg.role === 'user' ? 'status-dot-warning' : 'status-dot-online'"></span>
            <span class="text-[8px] tracking-[0.3em] uppercase"
              :class="msg.role === 'user' ? 'text-[#8e8a82]/50' : 'text-[#e05320]/70'">
              {{ msg.role === 'user' ? (currentUser?.username || 'OPERATOR') : 'ORION::RESP' }}
            </span>
          </div>

          <!-- Message Block -->
          <div class="px-4 py-3 text-[11px] leading-relaxed break-words"
            :class="msg.role === 'user'
              ? 'bg-[#0f0f0d] border-r-2 border-[#e05320]/40 text-[#f4ede2]'
              : 'bg-[#0a0a08] border-l-2 border-[#ffb800]/30 text-[#8e8a82]'"
            v-html="msg.role === 'orion' ? marked.parse(msg.text || '') : msg.text">
          </div>

          <!-- Citations -->
          <div v-if="msg.citations && msg.citations.length" class="flex flex-wrap gap-1.5 mt-2"
            :class="msg.role === 'user' ? 'justify-end' : ''">
            <a v-for="(cite, ci) in msg.citations" :key="ci"
              :href="`http://localhost:8000/static/pdfs/${cite.file}#page=${cite.page}`"
              target="_blank"
              class="text-[8px] bg-[#0f0f0d] text-[#ffb800] px-2.5 py-1 border border-[#ffb800]/15
                     hover:border-[#ffb800]/50 hover:text-[#f4ede2] transition-all tracking-wider uppercase">
              ◆ {{ cite.file }} [P.{{ cite.page }}]
            </a>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex items-center gap-2">
          <div class="w-3 h-3 border border-[#e05320] border-t-transparent animate-spin"></div>
          <span class="text-[9px] text-[#e05320] tracking-[0.3em] uppercase text-flicker">
            PROCESSING_QUERY...
          </span>
        </div>
      </div>

      <!-- Input Bar -->
      <div class="px-5 py-4 border-t border-[#ffffff]/5 bg-[#070707]">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <div class="flex-1 relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-[#e05320]/40">›</span>
            <input v-model="inputMessage" type="text"
              placeholder="ENTER_QUERY..."
              class="w-full bg-[#0a0a08] border border-[#27272a] pl-7 pr-4 py-3 text-[11px]
                     text-[#f4ede2] placeholder-[#27272a] focus:outline-none focus:border-[#e05320]/40
                     transition-colors tracking-wider" />
          </div>
          <button type="submit"
            class="border border-[#e05320] px-6 py-3 text-[9px] text-[#e05320] font-bold
                   tracking-[0.3em] uppercase hover:bg-[#e05320] hover:text-[#050505]
                   transition-all duration-200">
            EXECUTE
          </button>
        </form>
      </div>
    </div>

    <!-- ── RIGHT PANEL: KNOWLEDGE INGESTION & LOGS ── -->
    <aside class="panel-right flex flex-col bg-[#0a0a08] border-l border-[#e05320]/8 overflow-hidden">

      <!-- Upload Zone -->
      <div class="px-4 pt-4 pb-3 border-b border-[#ffffff]/5">
        <p class="text-[8px] text-[#e05320] tracking-[0.4em] uppercase mb-3">KNOWLEDGE_INGEST</p>
        <div
          class="drop-zone p-5 flex flex-col items-center justify-center text-center min-h-[100px]"
          :class="{ 'drag-active': isDragOver }"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop">
          <p class="text-[10px] text-[#8e8a82]/40 mb-2">DROP .PDF HERE</p>
          <p class="text-[8px] text-[#27272a]">OR</p>
          <label class="mt-2 text-[8px] text-[#e05320] tracking-[0.2em] uppercase
                        border border-[#e05320]/20 px-3 py-1.5 hover:bg-[#e05320]/10
                        transition-colors inline-block">
            SELECT_FILE
            <input type="file" accept=".pdf" class="hidden" @change="handleFileInput" />
          </label>
        </div>
        <div v-if="uploadStatus !== 'IDLE'" class="mt-2">
          <p class="text-[8px] tracking-[0.2em]"
            :class="uploadStatus.startsWith('ERR') ? 'text-[#e05320]' :
                    uploadStatus.startsWith('INDEXED') ? 'text-[#22c55e]' : 'text-[#ffb800]'">
            {{ uploadStatus }}
          </p>
          <p v-if="uploadFileName" class="text-[7px] text-[#8e8a82]/30 mt-0.5 truncate">
            {{ uploadFileName }}
          </p>
        </div>
      </div>

      <!-- System Logs -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="px-4 pt-3 pb-2">
          <p class="text-[8px] text-[#ffb800] tracking-[0.4em] uppercase">SYSTEM_LOG</p>
        </div>
        <div class="flex-1 overflow-y-auto px-4 pb-4 industrial-scroll">
          <div v-for="(log, li) in systemLogs" :key="li"
            class="py-1.5 border-b border-[#ffffff]/3 last:border-0">
            <div class="flex gap-2">
              <span class="text-[7px] text-[#27272a] shrink-0">{{ log.t }}</span>
              <span class="text-[8px] text-[#8e8a82]/60 leading-tight break-all">{{ log.msg }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 border-t border-[#ffffff]/5 text-center">
        <p class="text-[7px] text-[#27272a] tracking-[0.3em] uppercase">
          ORION v1.0 — ULBI CAPSTONE
        </p>
      </div>
    </aside>
  </div>
</template>

<style scoped>
/* Additional scoped overrides */
#chat-flow .prose { max-width: none; }
#chat-flow p { margin: 0.3em 0; }
#chat-flow ul, #chat-flow ol { padding-left: 1.2em; margin: 0.3em 0; }
#chat-flow code {
  background: rgba(224, 83, 32, 0.08);
  padding: 1px 4px;
  font-size: 10px;
  color: #ffb800;
}
#chat-flow pre {
  background: rgba(0,0,0,0.4);
  padding: 8px 10px;
  border-left: 2px solid #e05320;
  margin: 6px 0;
  overflow-x: auto;
  font-size: 10px;
}
#chat-flow a { color: #ffb800; text-decoration: underline; }
#chat-flow strong { color: #f4ede2; }
</style>

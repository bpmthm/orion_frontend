<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { marked } from 'marked'
import { gsap } from 'gsap'
import { useOrion } from './composables/useOrion.js'
import UserManagementModal from './components/UserManagementModal.vue'
import DocumentManagementModal from './components/DocumentManagementModal.vue'

const {
  isLoggedIn, email, password, authError, authLoading, currentUser,
  messages, inputMessage, isTyping,
  currentTime, formattedUptime, systemMetrics,
  isDragOver, uploadStatus, uploadFileName, systemLogs,
  targetDivisi, uploadFile,
  initSystem, destroySystem,
  handleLogin, handleLogout, sendMessage,
  handleDragOver, handleDragLeave, handleDrop, handleFileInput
} = useOrion()

const showUserManagement = ref(false)
const showDocModal = ref(false)

const handleBackgroundParallax = (e) => {
  const bg = document.querySelector('.login-bg-illustration')
  const chassis = document.querySelector('.solarpunk-chassis')
  const { clientX, clientY } = e
  const xPercent = (clientX / window.innerWidth - 0.5)
  const yPercent = (clientY / window.innerHeight - 0.5)

  if (bg) {
    gsap.to(bg, {
      x: xPercent * -30,
      y: yPercent * -30,
      duration: 0.8,
      ease: 'power2.out'
    })
  }

  if (chassis) {
    gsap.to(chassis, {
      rotateX: yPercent * 8,
      rotateY: xPercent * -8,
      transformPerspective: 1000,
      x: xPercent * 12,
      y: yPercent * 12,
      duration: 0.8,
      ease: 'power2.out'
    })
  }

  const leaves = document.querySelectorAll('.leaf-sway, .planter-box')
  leaves.forEach(leaf => {
    gsap.to(leaf, {
      x: xPercent * 25,
      y: yPercent * 25,
      duration: 1.0,
      ease: 'power2.out'
    })
  })
}

const selectSuggestion = (text) => {
  inputMessage.value = ''
  let i = 0
  const speed = 20
  
  const typeInterval = setInterval(() => {
    if (i < text.length) {
      inputMessage.value += text.charAt(i)
      i++
    } else {
      clearInterval(typeInterval)
      const inputEl = document.querySelector('input[placeholder*="TULIS"]')
      if (inputEl) inputEl.focus()
      
      gsap.to('.execute-btn', {
        scale: 1.08,
        duration: 0.15,
        yoyo: true,
        repeat: 3,
        ease: 'power2.out'
      })
    }
  }, speed)
}

onMounted(() => { initSystem() })
onUnmounted(() => { destroySystem() })
</script>

<template>
  <!-- Mechanical Industrial Gate Shutter -->
  <div id="transition-gate" class="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between">
    <div class="shutter-top w-full h-[50vh] bg-[#1a140f] border-b-8 border-[#8c6742] transform -translate-y-full flex items-end justify-center pb-12 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div class="flex items-center gap-3 mb-2">
        <span class="bulb bulb-amber animate-pulse"></span>
        <span class="text-[10px] tracking-[0.6em] text-[#d8b792] uppercase font-display font-black text-flicker">HYDRAULIC ACCESS SHUTTER ACTIVE</span>
      </div>
    </div>
    <div class="shutter-bottom w-full h-[50vh] bg-[#1a140f] border-t-8 border-[#8c6742] transform translate-y-full flex items-start justify-center pt-12 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      <div class="flex items-center gap-3 mt-2">
        <span class="text-[10px] tracking-[0.6em] text-[#f0a929] uppercase font-display font-black text-flicker">ENGAGING BIO-INDEX SYNAPSE</span>
        <span class="bulb bulb-gold animate-pulse"></span>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════
       LOGIN VIEW — 3D SKEUOMORPHIC CONSOLE
       ═══════════════════════════════════════════════ -->
  <div v-if="!isLoggedIn" id="login-view" @mousemove="handleBackgroundParallax"
    class="h-screen w-screen flex items-center justify-center p-8 bg-[#1a140f] overflow-hidden relative">
    
    <!-- Watercolor Solarpunk Tokyo Background Illustration -->
    <img src="./assets/solpunk.jpg" 
      class="login-bg-illustration absolute inset-0 w-full h-full object-cover scale-106 opacity-100 pointer-events-none transition-opacity duration-1000" />
    
    <!-- Soft Warm Vignette Overlay to blend the chassis with the wallpaper -->
    <div class="absolute inset-0 bg-gradient-to-tr from-[#1a140f]/80 via-[#1a140f]/20 to-[#1a140f]/70 mix-blend-multiply pointer-events-none"></div>

    <!-- Background foliage overlays for organic solarpunk environment -->
    <div class="absolute top-0 left-0 w-48 h-48 opacity-40 pointer-events-none leaf-sway z-10">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0 C40 10, 80 50, 100 100 C70 80, 20 40, 0 0 Z" fill="#2d5e35"/>
        <path d="M0 0 C30 20, 60 60, 80 100 C50 70, 15 30, 0 0 Z" fill="#3e7a46"/>
      </svg>
    </div>
    <div class="absolute bottom-0 right-0 w-64 h-64 opacity-30 pointer-events-none leaf-sway z-10" style="animation-delay: -2s;">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 100 C60 90, 20 50, 0 0 C30 20, 80 60, 100 100 Z" fill="#204526"/>
        <path d="M100 100 C70 80, 40 40, 20 0 C50 30, 85 70, 100 100 Z" fill="#2d5e35"/>
      </svg>
    </div>

    <!-- Main 3D Bronze Chassis -->
    <div class="solarpunk-chassis w-full max-w-5xl rounded-3xl p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden z-10" style="min-height: 520px;">
      
      <!-- Planter Box integrated inside chassis top-left margin -->
      <div class="absolute -top-4 -left-4 w-32 h-10 planter-box z-10 flex items-center justify-around px-2">
        <span class="bulb bulb-green"></span>
        <span class="bulb bulb-off"></span>
        <span class="bulb bulb-off"></span>
      </div>
      
      <!-- Foliage spilling over margins -->
      <div class="absolute top-2 left-6 w-24 h-16 pointer-events-none leaf-sway z-20">
        <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0 C25 15, 35 45, 15 60 C5 45, 0 20, 10 0 Z" fill="#3e7a46" opacity="0.95"/>
          <path d="M30 5 C45 20, 50 45, 35 55 C25 45, 20 25, 30 5 Z" fill="#4d9456" opacity="0.9"/>
          <path d="M50 15 C60 25, 65 45, 55 50 C45 45, 40 30, 50 15 Z" fill="#34663b" opacity="0.95"/>
        </svg>
      </div>

      <!-- LEFT: ORION IDENTITY PAPER SIGN & GIANT BRANDING -->
      <div class="login-left flex-1 flex flex-col justify-between relative">
        <div class="recessed-slot-paper flex-1 p-8 flex flex-col justify-between min-h-[300px]">
          <div>
            <div class="flex items-center justify-between mb-4">
              <p class="text-[8px] tracking-[0.4em] text-[#8d6b48] font-display font-black uppercase">
                // DECENTRALIZED DATA NODE
              </p>
              <div class="flex items-center gap-2">
                <span class="bulb bulb-amber"></span>
                <span class="text-[7px] text-[#e05320] font-mono tracking-widest uppercase">CATHODE_SYS</span>
              </div>
            </div>
            <div class="h-px bg-[#4a3424]/10 mb-6"></div>
          </div>

          <div class="my-auto py-2">
            <div class="flex flex-col gap-1 mb-6">
              <div class="flex items-baseline gap-4">
                <h1 class="text-7xl font-display font-black tracking-[-0.05em] text-[#1a140f] leading-none select-none">
                  ORION
                </h1>
                <span class="bulb bulb-gold animate-pulse"></span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-[10px] tracking-[0.5em] text-[#8d6b48] font-display font-bold uppercase">FUTURE CORE</span>
                <span class="text-[#8d6b48]/35 font-display font-black tracking-[0.1em] text-xl select-none">// オリオン</span>
              </div>
            </div>
            <p class="text-xs text-[#554433] font-body font-light leading-relaxed max-w-md border-l-2 border-[#f0a929]/40 pl-4">
              Sistem Retrieval-Augmented Generation internal perusahaan. 
              Dokumen SOP, regulasi, dan basis pengetahuan HR terenkripsi aman di dalam gerbang penjelajah data JWT.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-[#4a3424]/10 text-[8px] text-[#8d6b48] tracking-widest uppercase font-mono">
            <div class="flex items-center gap-2">
              <span class="bulb bulb-green"></span>
              RAG ENGINE: NOMINAL
            </div>
            <div class="flex items-center gap-2">
              <span class="bulb bulb-green"></span>
              VECTOR INDEX: 247 ACTIVE
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT: AUTHENTICATE INTERACTIVE COMPARTMENT -->
      <div class="login-right w-full md:w-[42%] flex flex-col justify-between">
        <div class="solarpunk-side-chassis rounded-2xl p-6 flex flex-col justify-between flex-1 relative">
          
          <!-- Outer border corner rivets -->
          <span class="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#4a3424] opacity-40 shadow-inner"></span>
          <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#4a3424] opacity-40 shadow-inner"></span>
          <span class="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#4a3424] opacity-40 shadow-inner"></span>
          <span class="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#4a3424] opacity-40 shadow-inner"></span>

          <div class="mb-6">
            <h2 class="text-lg font-display font-black tracking-[0.1em] text-[#f4ede2] uppercase">
              AUTHENTICATE
            </h2>
            <p class="text-[8px] text-[#cca37a] tracking-[0.2em] uppercase font-mono">
              // Masukkan kredensial akses
            </p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6 flex-1 flex flex-col justify-center">
            
            <!-- Email Recessed Input -->
            <div>
              <label class="block text-[8px] font-display font-black uppercase tracking-[0.3em] text-[#cca37a] mb-1.5">
                INTERNAL EMAIL
              </label>
              <div class="relative">
                <input v-model="email" type="email" placeholder="lutfi@orion.com" required
                  class="w-full bg-[#0c0c0a] border-2 border-[#4d3725] px-4 py-3 rounded-lg text-xs text-[#f4ede2]
                         placeholder-[#4d3725] focus:outline-none focus:border-[#f0a929] transition-all font-mono
                         box-shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)]" />
              </div>
            </div>

            <!-- Password Recessed Input -->
            <div>
              <label class="block text-[8px] font-display font-black uppercase tracking-[0.3em] text-[#cca37a] mb-1.5">
                ACCESS PASSWORD
              </label>
              <div class="relative">
                <input v-model="password" type="password" placeholder="••••••••••••" required
                  class="w-full bg-[#0c0c0a] border-2 border-[#4d3725] px-4 py-3 rounded-lg text-xs text-[#f4ede2]
                         placeholder-[#4d3725] focus:outline-none focus:border-[#f0a929] transition-all font-mono
                         box-shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)]" />
              </div>
            </div>

            <div v-if="authError"
              class="text-[9px] text-[#1a140f] bg-[#e05320] px-3 py-2 font-bold tracking-wider font-mono">
              ⚠ {{ authError }}
            </div>

            <!-- Physical Tactile Button -->
            <button type="submit" :disabled="authLoading"
              class="tactile-btn w-full py-4 text-xs tracking-[0.3em] uppercase mt-2">
              {{ authLoading ? 'DECRYPTING...' : 'DECRYPT & ENTER' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════
       DASHBOARD VIEW — BENTO GRID CONSOLE
       ═══════════════════════════════════════════════ -->
  <div v-else id="dashboard-view" class="h-screen w-screen overflow-hidden relative bg-[#1a140f]">

    <!-- Watercolor Solarpunk Tokyo Background Illustration -->
    <img src="./assets/solpunk.jpg" 
      class="dashboard-bg-illustration" />
    
    <!-- Soft Warm Vignette Overlay to blend the chassis with the wallpaper -->
    <div class="absolute inset-0 bg-gradient-to-tr from-[#1a140f]/95 via-[#1a140f]/60 to-[#1a140f]/85 mix-blend-multiply pointer-events-none z-0"></div>

    <!-- Main Grid Content -->
    <div class="w-full h-full grid p-6 relative z-10"
      style="grid-template-columns: 24% 51% 25%; gap: 16px;">

      <!-- ── LEFT COMPARTMENT: IDENTITY & ANALOGUE STATS ── -->
      <aside class="panel-left solarpunk-side-chassis rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden z-10">
      <!-- Outer rivets -->
      <span class="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#4a3424] opacity-40 shadow-inner"></span>
      <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#4a3424] opacity-40 shadow-inner"></span>
      
      <!-- Compartment Branding -->
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="bulb bulb-green animate-pulse"></span>
          <span class="text-[8px] tracking-[0.4em] text-[#cca37a] font-display font-black uppercase text-flicker">
            // ORION SYS CORE
          </span>
        </div>
        <h1 class="text-6xl font-display font-black tracking-[-0.04em] text-[#f4ede2] leading-none orion-logo-glow select-none">
          ORION<span class="text-[#f0a929]">.</span>
        </h1>
        <p class="text-[7.5px] text-[#f4ede2]/60 mt-2 tracking-[0.25em] uppercase font-mono">
          RAG SEARCH CONSOLE
        </p>
        <div class="h-px bg-[#ffffff]/5 my-4"></div>
      </div>

      <!-- Analogue Status meters -->
      <div class="space-y-4 my-auto overflow-y-auto pr-1 industrial-scroll">
        <div>
          <div class="flex justify-between text-[8px] text-[#cca37a] tracking-wider font-mono mb-1">
            <span>SYS_TIME</span>
            <span class="text-[#f4ede2] font-semibold">{{ currentTime }}</span>
          </div>
        </div>

        <div>
          <div class="flex justify-between text-[8px] text-[#cca37a] tracking-wider font-mono mb-1">
            <span>UPTIME</span>
            <span class="text-[#f0a929] font-semibold">{{ formattedUptime }}</span>
          </div>
        </div>

        <div class="h-px bg-[#ffffff]/5 my-2"></div>

        <div>
          <div class="flex justify-between text-[8px] text-[#cca37a] tracking-wider font-mono mb-1">
            <span>VECTOR CHUNKS</span>
            <span class="text-[#f4ede2] font-semibold">{{ systemMetrics.vectorCount }}</span>
          </div>
          <div class="metric-bar"><div class="metric-bar-fill" :style="{width: Math.min(systemMetrics.vectorCount/5, 100)+'%'}"></div></div>
        </div>

        <div>
          <div class="flex justify-between text-[8px] text-[#cca37a] tracking-wider font-mono mb-1">
            <span>RAG LATENCY</span>
            <span class="text-[#f0a929] font-semibold">{{ systemMetrics.avgLatency }}ms</span>
          </div>
          <div class="metric-bar"><div class="metric-bar-fill" :style="{width: systemMetrics.avgLatency/3+'%'}"></div></div>
        </div>

        <div>
          <div class="flex justify-between text-[8px] text-[#cca37a] tracking-wider font-mono mb-1">
            <span>MEMORY LOAD</span>
            <span class="text-[#f4ede2] font-semibold">{{ systemMetrics.memUsage }}%</span>
          </div>
          <div class="metric-bar"><div class="metric-bar-fill" :style="{width: systemMetrics.memUsage+'%'}"></div></div>
        </div>

        <div>
          <div class="flex justify-between text-[8px] text-[#cca37a] tracking-wider font-mono mb-1">
            <span>SYS CPU CORE</span>
            <span class="text-[#f4ede2] font-semibold">{{ systemMetrics.cpuLoad }}%</span>
          </div>
          <div class="metric-bar"><div class="metric-bar-fill" :style="{width: systemMetrics.cpuLoad+'%'}"></div></div>
        </div>

        <!-- Operator Badge -->
        <div v-if="currentUser" class="pt-3 border-t border-[#ffffff]/5">
          <p class="text-[7px] text-[#cca37a] tracking-[0.3em] uppercase font-display font-black mb-1">ACTIVE OPERATOR</p>
          <p class="text-[9px] text-[#f4ede2] font-mono truncate">{{ currentUser.username || currentUser.email }}</p>
          <button 
            v-if="currentUser.role === 'admin'" 
            @click="showUserManagement = true"
            class="w-full mt-2 py-2 bg-[#f0a929]/10 border border-[#f0a929]/30 text-[#f0a929] hover:bg-[#f0a929] hover:text-[#1a140f] text-[8px] tracking-[0.2em] uppercase font-mono transition-colors">
            [ ACCESS CONTROL ]
          </button>
        </div>
      </div>

      <!-- Mechanical Logoff Switch -->
      <div class="pt-4 border-t border-[#ffffff]/5">
        <div class="flex items-center gap-2 mb-3">
          <span class="bulb bulb-amber"></span>
          <span class="text-[8px] text-[#cca37a] tracking-[0.15em] uppercase font-mono">CONNECTION SECURE</span>
        </div>
        <button @click="handleLogout"
          class="tactile-btn tactile-btn-red w-full py-3 text-[8px] tracking-[0.2em] uppercase">
          [TERMINATE SESSION]
        </button>
      </div>
    </aside>

    <!-- ── CENTER COMPARTMENT: OPERATIONAL SCOPES & CHAT FLOW ── -->
    <div class="panel-center flex flex-col overflow-hidden gap-4 z-10">

      <!-- Top Row: Mechanical Telemetry Scopes -->
      <div class="grid grid-cols-2 gap-4" style="height: 110px;">
        
        <!-- Oscilloscope Panel -->
        <div class="recessed-slot-crt p-4 flex flex-col justify-between crt-reflection">
          <p class="text-[7px] text-[#f0a929] font-display font-black tracking-[0.3em] uppercase">NODE_STREAM</p>
          <div class="flex items-end gap-1.5 h-10 mb-1">
            <div v-for="i in 18" :key="'scope-'+i"
              class="flex-1 bg-[#f0a929]/10 relative rounded-t-sm"
              :style="{height: (25 + Math.sin(i)*15) + '%'}">
              <div class="absolute inset-x-0 bottom-0 bg-[#f0a929] rounded-t-sm oscilloscope-bar"
                :class="{ 'stream-active': isTyping || inputMessage.length > 0 }"
                :style="{
                  height: '100%',
                  animationDelay: (i * 0.05) + 's',
                  animationDuration: (isTyping || inputMessage.length > 0 ? 0.35 + (i % 3) * 0.1 : 1.2 + (i % 3) * 0.3) + 's',
                  opacity: 0.6 + (i % 4) * 0.1
                }"></div>
            </div>
          </div>
          <div class="flex justify-between text-[6px] text-[#cca37a] font-mono tracking-wider">
            <span>SYNAPSE: NOMINAL</span>
            <span>FREQ: 44.1 KHZ</span>
          </div>
        </div>

        <!-- System Stats Screen -->
        <div class="recessed-slot-crt p-4 flex flex-col justify-between crt-reflection">
          <p class="text-[7px] text-[#e05320] font-display font-black tracking-[0.3em] uppercase">RAG_HEALTH_INDEX</p>
          <div class="grid grid-cols-3 gap-2 mt-1 crt-glow text-[#e05320]">
            <div>
              <p class="text-xl font-bold leading-none">{{ systemMetrics.vectorCount }}</p>
              <p class="text-[6px] text-[#cca37a] mt-1 font-mono uppercase">VECTORS</p>
            </div>
            <div>
              <p class="text-xl font-bold leading-none">5</p>
              <p class="text-[6px] text-[#cca37a] mt-1 font-mono uppercase">RETRIEVE</p>
            </div>
            <div>
              <p class="text-xl font-bold leading-none">{{ systemMetrics.avgLatency }}<span class="text-[8px] font-normal font-mono">ms</span></p>
              <p class="text-[6px] text-[#cca37a] mt-1 font-mono uppercase">LATENCY</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Chat Compartment: Recessed Paper Track -->
      <div class="flex-1 flex flex-col overflow-hidden solarpunk-chassis rounded-3xl p-5">
        <div id="chat-flow" class="recessed-slot-paper flex-1 overflow-y-auto px-6 py-5 space-y-5 industrial-scroll relative">
          
          <!-- Engraved Watermark -->
          <div class="engraved-watermark absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0 opacity-[0.035]">
            <svg viewBox="0 0 100 100" fill="currentColor" class="w-64 h-64 text-[#4a3424]">
              <!-- Solarpunk Bio-Gear leaf shape -->
              <path d="M50 10 C25 25, 10 50, 50 90 C90 50, 75 25, 50 10 Z" />
              <path d="M50 10 C35 30, 30 50, 50 80 C70 50, 65 30, 50 10 Z" opacity="0.6" />
            </svg>
            <h1 class="text-6xl font-display font-black tracking-[-0.04em] text-[#4a3424] mt-2 uppercase">ORION</h1>
          </div>

          <!-- Tactical Corner Crosshairs -->
          <div class="absolute top-3 left-3 text-[#8d6b48]/25 font-mono text-[9px] select-none pointer-events-none z-10">⌖</div>
          <div class="absolute top-3 right-3 text-[#8d6b48]/25 font-mono text-[9px] select-none pointer-events-none z-10">⌖</div>
          <div class="absolute bottom-3 left-3 text-[#8d6b48]/25 font-mono text-[9px] select-none pointer-events-none z-10">⌖</div>
          <div class="absolute bottom-3 right-3 text-[#8d6b48]/25 font-mono text-[9px] select-none pointer-events-none z-10">⌖</div>

          <TransitionGroup name="chat-bubble" tag="div" class="space-y-5 relative z-10">
            <div v-for="msg in messages" :key="msg.id"
              class="max-w-2xl transition-all"
              :class="msg.role === 'user' ? 'ml-auto' : ''">

              <!-- Message Owner Tag -->
              <div class="flex items-center gap-1.5 mb-1"
                :class="msg.role === 'user' ? 'justify-end' : ''">
                <span class="bulb"
                  :class="msg.role === 'user' ? 'bulb-gold' : 'bulb-green'"></span>
                <span class="text-[8px] font-display font-black tracking-[0.25em] uppercase"
                  :class="msg.role === 'user' ? 'text-[#8d6b48]/70' : 'text-[#2d5e35]'">
                  {{ msg.role === 'user' ? 'OPERATOR' : 'ORION RESPONSE' }}
                </span>
              </div>

              <!-- Paper Chat Bubble -->
              <div class="px-5 py-4 text-xs font-body font-light leading-relaxed border border-[#4a3424]/10 rounded-xl"
                :class="msg.role === 'user'
                  ? 'bg-[#f5ebd6]/60 text-[#1a140f] rounded-tr-none shadow-[2px_2px_5px_rgba(28,21,14,0.05)]'
                  : 'bg-white text-[#4a3424] rounded-tl-none shadow-[2px_2px_5px_rgba(28,21,14,0.05)]'"
                v-html="msg.role === 'orion' ? marked.parse(msg.text || '') : msg.text">
              </div>

              <!-- Citation Badges -->
              <div v-if="msg.citations && msg.citations.length" class="flex flex-wrap gap-1.5 mt-2"
                :class="msg.role === 'user' ? 'justify-end' : ''">
                <a v-for="(cite, ci) in msg.citations" :key="ci"
                  :href="`http://localhost:8000/static/pdfs/${cite.file}#page=${cite.page}`"
                  target="_blank"
                  class="text-[7.5px] bg-white text-[#8d6b48] px-2.5 py-1.5 border border-[#8d6b48]/25 rounded-md
                         hover:border-[#ffb800] hover:text-[#1a140f] transition-all font-mono tracking-widest uppercase">
                  ◆ {{ cite.file }} [HAL. {{ cite.page }}]
                </a>
              </div>
            </div>
          </TransitionGroup>

          <!-- Interactive suggestions for empty state / welcome guide -->
          <div v-if="messages.length === 1" class="pt-6 border-t border-[#4a3424]/10 mt-8 relative z-10 text-center">
            <p class="text-[8px] font-display font-black tracking-[0.3em] text-[#8d6b48]/70 uppercase mb-4">
              ◆ PILIH QUERY DATA CONSOLE ◆
            </p>
            <div class="suggestion-grid">
              <div @click="selectSuggestion('Bagaimana prosedur pengajuan cuti tahunan karyawan?')" class="suggestion-card">
                <div class="suggestion-title">◆ SOP CUTI</div>
                <div class="suggestion-desc">Prosedur pengajuan cuti tahunan & izin sakit.</div>
              </div>
              <div @click="selectSuggestion('Berapa skema perhitungan uang insentif lembur internal?')" class="suggestion-card">
                <div class="suggestion-title">◆ UANG LEMBUR</div>
                <div class="suggestion-desc">Detail skema & perhitungan lembur capstone.</div>
              </div>
              <div @click="selectSuggestion('Bagaimana cara klaim reimburse BPJS Kesehatan?')" class="suggestion-card">
                <div class="suggestion-title">◆ BPJS REIMBURSE</div>
                <div class="suggestion-desc">Alur klaim asuransi kesehatan & medis.</div>
              </div>
            </div>

            <!-- Instruction Plaque -->
            <div class="instruction-plaque mt-6 max-w-sm mx-auto p-3.5 rounded-lg border border-[#8d6b48]/25 relative overflow-hidden">
              <!-- Bolted metal rivets in corners -->
              <span class="absolute top-1 left-1 w-1 h-1 rounded-full bg-[#8d6b48]/45 shadow-inner"></span>
              <span class="absolute top-1 right-1 w-1 h-1 rounded-full bg-[#8d6b48]/45 shadow-inner"></span>
              <span class="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-[#8d6b48]/45 shadow-inner"></span>
              <span class="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-[#8d6b48]/45 shadow-inner"></span>
              
              <div class="flex items-start gap-2.5 text-left">
                <span class="text-[9px] text-[#f0a929] leading-none mt-0.5">ℹ</span>
                <div>
                  <p class="text-[7.5px] font-mono font-bold tracking-wider text-[#1a140f] uppercase mb-0.5">SYS_ACCESS_HINT</p>
                  <p class="text-[7px] font-body text-[#554433] leading-relaxed">
                    Sistem RAG mendeteksi basis data SOP aktif. Klik kartu saran untuk mengisi form secara otomatis, atau tekan tombol <span class="font-bold text-[#e05320]">EXECUTE</span> untuk memproses kueri dokumen kustom Anda.
                  </p>
                </div>
              </div>
            </div>

            <!-- Idle Core: standby pulse bio-resonance orb -->
            <div class="mt-8 flex flex-col items-center justify-center gap-2 select-none">
              <div class="flex items-center gap-3">
                <span class="core-wave-bar"></span>
                <span class="core-wave-bar" style="animation-delay: 0.15s"></span>
                <!-- Standby Bio-Resonance Orb -->
                <div class="relative w-7 h-7 flex items-center justify-center">
                  <div class="absolute inset-0 rounded-full bg-[#f0a929]/20 animate-ping opacity-60"></div>
                  <div class="absolute w-5 h-5 rounded-full bg-gradient-to-tr from-[#e05320] to-[#f0a929] shadow-[0_0_10px_rgba(240,169,41,0.6)] animate-pulse"></div>
                  <div class="absolute w-1.5 h-1.5 rounded-full bg-white opacity-85"></div>
                </div>
                <span class="core-wave-bar" style="animation-delay: 0.3s"></span>
                <span class="core-wave-bar" style="animation-delay: 0.45s"></span>
              </div>
              <p class="text-[6.5px] font-mono tracking-[0.4em] text-[#cca37a] uppercase animate-pulse mt-1">
                // SYSTEM_CORE_STANDBY //
              </p>
            </div>
          </div>

          <!-- Typing screen diagnostic loader -->
          <div v-if="isTyping" class="flex items-center gap-2 relative z-10">
            <div class="w-3.5 h-3.5 border-2 border-[#8d6b48] border-t-transparent animate-spin rounded-full"></div>
            <span class="text-[9px] text-[#8d6b48] tracking-[0.3em] font-display font-black uppercase text-flicker">
              DECIPHERING DATABASE INDEX...
            </span>
          </div>
        </div>
      </div>

      <!-- Bottom Chat Entry Tray -->
      <div class="solarpunk-side-chassis rounded-2xl p-4">
        <form @submit.prevent="sendMessage" class="flex gap-3">
          <div class="flex-1 relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#cca37a]">›</span>
            <input v-model="inputMessage" type="text"
              placeholder="TULIS QUERY DOKUMEN SOP INTERNAL..."
              class="w-full bg-[#0c0c0a] border-2 border-[#4d3725] pl-8 pr-4 py-3.5 rounded-xl text-xs
                     text-[#f4ede2] placeholder-[#4d3725] focus:outline-none focus:border-[#f0a929]
                     transition-all font-mono box-shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8)]" />
          </div>
          <button type="submit" class="tactile-btn execute-btn px-8 py-3.5 text-[10px] tracking-[0.2em]">
            EXECUTE
          </button>
        </form>
      </div>
    </div>

    <!-- ── RIGHT COMPARTMENT: BIO PLANTER & LOG CONSOLE ── -->
    <aside class="panel-right flex flex-col gap-4 overflow-hidden z-10">
      
      <!-- Bio Planter Box & Upload Tray -->
      <div class="solarpunk-side-chassis rounded-3xl p-5 flex flex-col relative overflow-hidden">
        <!-- Corner Rivets -->
        <span class="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#4a3424] opacity-40 shadow-inner"></span>
        <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#4a3424] opacity-40 shadow-inner"></span>
        
        <p class="text-[8px] text-[#cca37a] font-display font-black tracking-[0.3em] uppercase mb-3">
          // BIO_DATABASE_INGEST
        </p>

        <div class="mb-3">
          <label class="block text-[8px] font-display font-black uppercase tracking-[0.2em] text-[#ffffff] mb-1">Target Divisi (RBAC)</label>
          <select v-model="targetDivisi" class="w-full bg-[#080605] border border-[#4d3725] px-3 py-2 rounded text-[10px] text-[#f0a929] focus:outline-none focus:border-[#f0a929] font-mono appearance-none uppercase">
            <option value="universal">UNIVERSAL (SEMUA)</option>
            <option value="teknisi">TEKNISI LAPANGAN</option>
            <option value="cs">CUSTOMER SERVICE</option>
            <option value="hr">HR & MANAGEMENT</option>
          </select>
        </div>


        <!-- CSS 3D planter box container -->
        <div class="planter-box h-28 flex flex-col items-center justify-center p-4 relative overflow-hidden"
          :class="{ 'drag-active': isDragOver }"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop">
          
          <!-- Green Ivy SVG branches overflowing planter box edges -->
          <div class="absolute -top-1 left-2 w-14 h-10 pointer-events-none leaf-sway z-20">
            <svg viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 0 C15 10, 25 35, 10 45 C0 35, -5 15, 5 0 Z" fill="#2d5e35"/>
              <path d="M20 5 C30 15, 35 35, 25 40 C15 35, 10 20, 20 5 Z" fill="#3e7a46"/>
            </svg>
          </div>
          <div class="absolute -top-2 right-3 w-16 h-12 pointer-events-none leaf-sway z-20" style="animation-delay: -1.5s;">
            <svg viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0 C40 10, 30 35, 45 45 C55 35, 60 15, 50 0 Z" fill="#34663b"/>
              <path d="M30 5 C20 15, 15 35, 25 40 C35 35, 40 20, 30 5 Z" fill="#4d9456"/>
            </svg>
          </div>

          <p class="text-[9px] text-[#cca37a] font-mono tracking-wider mb-2 z-10">DROP FILE .PDF</p>
          <p class="text-[7px] text-[#4d3725] mb-2 z-10">— ATAU —</p>
          <label class="tactile-btn px-4 py-2 text-[8px] tracking-[0.15em] z-10 cursor-pointer">
            UPLOAD
            <input type="file" accept=".pdf" class="hidden" @change="handleFileInput" />
          </label>
        </div>

        <div v-if="uploadStatus !== 'IDLE'" class="mt-3">
          <p class="text-[8px] font-mono tracking-widest uppercase font-semibold"
            :class="uploadStatus.startsWith('ERR') ? 'text-[#e05320]' :
                    uploadStatus.startsWith('INDEXED') ? 'text-[#22c55e]' : 'text-[#ffb800]'">
            STATUS::{{ uploadStatus }}
          </p>
          <p v-if="uploadFileName" class="text-[7px] text-[#cca37a] font-mono truncate mt-1">
            » {{ uploadFileName }}
          </p>
        </div>

      <button @click="showDocModal = true" 
    class="mt-3 w-full border border-[#f0a929]/50 text-[#f0a929] hover:bg-[#f0a929] hover:text-[#1a140f] py-2 rounded text-[8px] font-mono font-bold tracking-widest uppercase transition-all">
    [ VIEW CHROMADB DIRECTORY ]
  </button>

      </div>

      <!-- Recessed CRT System Logs -->
      <div class="flex-1 solarpunk-side-chassis rounded-3xl p-5 flex flex-col relative overflow-hidden">
  <!-- Corner Rivets -->
  <span class="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#4a3424] opacity-40 shadow-inner"></span>
  <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#4a3424] opacity-40 shadow-inner"></span>
  
  <p class="text-[8px] text-[#f0a929] font-display font-black tracking-[0.3em] uppercase mb-3">
    // SYS_TELEMETRY_LOG
  </p>

  <!-- Layar Gelap Bersih tanpa efek CRT buram -->
  <div class="flex-1 bg-[#130f0c] rounded-xl border-2 border-[#4a3424] shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] relative overflow-hidden">
    <div class="absolute inset-0 overflow-y-auto p-4 space-y-2.5 industrial-scroll font-mono text-[9px]">
      <div v-for="(log, li) in systemLogs" :key="li"
        class="border-b border-[#4a3424]/40 pb-2 last:border-0 leading-normal">
        <div class="flex gap-2">
          <!-- Waktu warna orange, pesan warna putih krem biar kontras -->
          <span class="text-[#e05320] font-bold shrink-0">[{{ log.t }}]</span>
          <span class="text-[#f4ede2] break-all tracking-wide">{{ log.msg }}</span>
        </div>
      </div>
    </div>
  </div>
</div>

      <!-- Footer compartment info -->
      <div class="solarpunk-side-chassis rounded-2xl py-3 px-4 text-center">
        <p class="text-[7px] text-[#cca37a]/60 tracking-[0.4em] font-display font-black uppercase">
          ORION-v1.0 // CAPSTONE ULBI
        </p>
      </div>
    </aside>
    </div>
    <UserManagementModal 
      v-if="showUserManagement" 
      @close="showUserManagement = false" 
    />
    <DocumentManagementModal v-if="showDocModal && currentUser?.role === 'admin'" @close="showDocModal = false" />
  </div>
</template>

<style scoped>
/* Scoped adjustments for markdown typography on paper slots */
#chat-flow .prose { max-width: none; }
#chat-flow p { margin: 0.25em 0; }
#chat-flow ul, #chat-flow ol { padding-left: 1.2em; margin: 0.25em 0; }
#chat-flow code {
  background: #f0e6d2;
  padding: 2px 5px;
  font-size: 10px;
  color: #a05020;
  border-radius: 4px;
}
#chat-flow pre {
  background: #fbf9f5;
  padding: 10px 12px;
  border-left: 3px solid #f0a929;
  border-radius: 4px;
  margin: 8px 0;
  overflow-x: auto;
  font-size: 10px;
}
#chat-flow a { color: #f0a929; text-decoration: underline; font-weight: 600; }
#chat-flow strong { color: #1a140f; font-weight: 800; }
</style>

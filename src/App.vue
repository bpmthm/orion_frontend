<script setup>
import { marked } from 'marked'
import { ref, onMounted, nextTick } from 'vue'
import { Motion } from '@oku-ui/motion'
import { gsap } from 'gsap'
import axios from 'axios'

// State Alur Autentikasi
const isLoggedIn = ref(false)
const isRegisterMode = ref(false)

// State Form Login/Register
const email = ref('')
const password = ref('')
const authError = ref('')
const authLoading = ref(false)

// State Chat Interface
const messages = ref([
  { id: 1, role: 'orion', text: 'SISTEM ONLINE. Saya ORION, asisten AI HR Anda. Ada dokumen atau SOP internal yang ingin Anda tanyakan, Pi?', citations: [] }
])
const inputMessage = ref('')
const isTyping = ref(false)

// Cek status login pas halaman pertama dimuat
onMounted(() => {
  const savedToken = localStorage.getItem('orion_token')
  if (savedToken) {
    isLoggedIn.value = true
    triggerChatIntroAnimation()
  } else {
    triggerLoginIntroAnimation()
  }
})

// Animasi Intro buat Halaman Login (Slide turun dari atas)
const triggerLoginIntroAnimation = () => {
  setTimeout(() => {
    gsap.from('#login-view', { y: '-100vh', opacity: 0, duration: 0.8, ease: 'power3.out' })

    if (document.querySelector('.auth-card')) {
      gsap.from('.auth-card', { duration: 1, y: 40, opacity: 0, skewY: 2, ease: 'power4.out', delay: 0.3 })
    }
  }, 50)
}

// Animasi Intro buat Chat Dashboard (Slide naik dari bawah)
const triggerChatIntroAnimation = () => {
  setTimeout(() => {
    const tl = gsap.timeline()

    tl.from('#dashboard-view', { y: '100vh', opacity: 0, duration: 0.8, ease: 'power3.out' })

    if (document.querySelector('.editorial-header')) {
      tl.from('.editorial-header', { duration: 1, y: -40, opacity: 0, skewX: -8, ease: 'power4.out' }, '-=0.4')
    }
    if (document.querySelector('.input-bar')) {
      tl.from('.input-bar', { duration: 0.8, y: 50, opacity: 0, ease: 'power3.out' }, '-=0.6')
    }
  }, 50)
}

// FUNGSI: Eksekusi Login dengan Transisi Page Slide
const handleLogin = async () => {
  if (!email.value || !password.value) return
  authLoading.value = true
  authError.value = ''

  try {
    const response = await axios.post('http://localhost:8084/auth/login', {
      email: email.value,
      password: password.value
    })

    if (response.data && response.data.token) {
      localStorage.setItem('orion_token', response.data.token)

      // Halaman Login ditarik ke atas sampai hilang
      gsap.to('#login-view', {
        y: '-100vh',
        scale: 0.95, // Sedikit mengecil biar ada efek kedalaman
        opacity: 0,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          isLoggedIn.value = true
          triggerChatIntroAnimation() // Panggil dashboard buat naik
        }
      })
    }
  } catch (error) {
    authError.value = error.response?.data?.message || 'Gagal masuk. Periksa kembali email & password lo, Pi.'
  } finally {
    authLoading.value = false
  }
}

// FUNGSI: Kirim Pesan Menggunakan Token Segar LocalStorage
const sendMessage = async () => {
  if (!inputMessage.value.trim()) return

  const userQuery = inputMessage.value
  messages.value.push({ id: Date.now(), role: 'user', text: userQuery })
  inputMessage.value = ''
  isTyping.value = true

  await nextTick()
  const container = document.getElementById('chat-flow')
  if (container) container.scrollTop = container.scrollHeight

  try {
    const token = localStorage.getItem('orion_token')

    const response = await axios.post('http://localhost:8080/chat/send', {
      user_id: 1,
      question: userQuery
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.data) {
      const aiMessageId = Date.now();
      messages.value.push({
        id: aiMessageId,
        role: 'orion',
        text: '',
        citations: response.data.citations || []
      })

      const messageIndex = messages.value.findIndex(m => m.id === aiMessageId);
      const fullText = response.data.answer;
      let i = 0;
      isTyping.value = false;

      const typingInterval = setInterval(async () => {
        if (i < fullText.length) {
          messages.value[messageIndex].text += fullText.charAt(i);
          i++;

          const container = document.getElementById('chat-flow');
          if (container) container.scrollTop = container.scrollHeight;
        } else {
          clearInterval(typingInterval);
        }
      }, 19);
    }
  } catch (error) {
    console.error("Gagal terkoneksi:", error)
    if (error.response?.status === 401) {
      messages.value.push({ id: Date.now(), role: 'orion', text: 'TOKEN EXPIRED: Sesi lo habis, Pi. Silakan refresh halaman buat login ulang.', citations: [] })
    } else {
      messages.value.push({ id: Date.now(), role: 'orion', text: 'ERROR: Gagal mengambil data dari server internal.', citations: [] })
    }
  } finally {
    isTyping.value = false
    await nextTick()
    if (container) container.scrollTop = container.scrollHeight
  }
}

// Fungsi Logout dengan Transisi Balik
const handleLogout = () => {
  localStorage.removeItem('orion_token')

  // Halaman dashboard ditarik ke bawah
  gsap.to('#dashboard-view', {
    y: '100vh',
    opacity: 0,
    duration: 0.8,
    ease: 'power3.inOut',
    onComplete: () => {
      isLoggedIn.value = false
      triggerLoginIntroAnimation() // Panggil halaman login buat turun
    }
  })
}

// Konfigurasi Partikel Cyberpunk (Impeccable Style)
const particlesConfig = {
  background: { color: { value: "transparent" } },
  fpsLimit: 140,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "grab" },
      resize: true,
    },
    modes: {
      grab: { distance: 280, links: { opacity: 1.0, color: "#ffb800" } }
    },
  },
  particles: {
    color: { value: ["#e05320", "#ffb800", "#f4ede2"] },
    links: { color: "#8e8a82", distance: 130, enable: true, opacity: 0.5, width: 1.5 },
    move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: true, speed: 1.2, straight: false },
    number: { density: { enable: true, area: 800 }, value: 150 },
    opacity: { value: 0.9 },
    shape: { type: "triangle" },
    size: { value: { min: 1.5, max: 4 } },
  },
  detectRetina: true,
}
</script>

<template>
  <div id="login-view" v-if="!isLoggedIn" class="relative min-h-screen bg-[#0c0c0a] text-[#f4ede2] flex flex-col md:flex-row antialiased font-sans overflow-hidden">

      <vue-particles id="tsparticles" :options="particlesConfig" class="absolute inset-0 z-0" />

      <div class="hidden md:flex w-[55%] flex-col justify-between p-12 relative z-10 bg-transparent pointer-events-none">
        <div>
          <p class="font-mono text-xs tracking-[0.4em] text-[#e05320] font-bold uppercase mb-4 pointer-events-auto">// RESTRICTED AREA</p>
          <div class="h-[1px] w-24 bg-[#ffb800] mb-8"></div>
        </div>

        <div class="mt-auto mb-8 pointer-events-auto">
          <h1 class="text-[12vw] font-bold tracking-tighter leading-none text-[#f4ede2] drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-4">
            ORION<span class="text-[#e05320]">.</span>
          </h1>
          <p class="text-[#8e8a82] text-sm max-w-md leading-relaxed border-l-2 border-[#e05320] pl-4">
            Sistem Retrieval-Augmented Generation internal perusahaan. Diproteksi oleh enkripsi gerbang JWT.
          </p>
        </div>

        <div class="font-mono text-[10px] text-[#8e8a82] uppercase tracking-widest grid grid-cols-2 gap-4 pointer-events-auto mt-12">
          <p>SYS: RAG ENGINE V1.0</p>
          <p>LOC: INTERNAL SECURE SERVER</p>
          <p>ENC: JSON WEB TOKEN</p>
          <p>STATUS: AWAITING CREDENTIALS</p>
        </div>
      </div>

      <div class="w-full md:w-[45%] p-8 md:p-16 flex items-center justify-center relative z-10 bg-[#0e0e0c]/80 backdrop-blur-lg auth-card">
        <div class="w-full max-w-sm">
          <h2 class="text-3xl font-bold tracking-tighter mb-2 border-b-4 border-[#e05320] pb-4 inline-block">AUTHENTICATE</h2>
          <p class="text-sm text-[#8e8a82] mb-12 mt-4 font-mono">// Masukkan kredensial sistem</p>

          <form @submit.prevent="handleLogin" class="space-y-8">
            <div class="relative group">
              <label class="block font-mono text-[10px] uppercase tracking-widest text-[#8e8a82] mb-2">Internal Email</label>
              <input v-model="email" type="email" placeholder="lutfi@orion.com" required
                class="w-full bg-transparent border-b-2 border-[#8e8a82]/30 px-0 py-3 text-lg text-[#f4ede2] placeholder-[#8e8a82]/40 focus:outline-none focus:border-[#ffb800] transition-colors rounded-none" />
            </div>

            <div class="relative group">
              <label class="block font-mono text-[10px] uppercase tracking-widest text-[#8e8a82] mb-2">Access Password</label>
              <input v-model="password" type="password" placeholder="••••••••" required
                class="w-full bg-transparent border-b-2 border-[#8e8a82]/30 px-0 py-3 text-lg text-[#f4ede2] placeholder-[#8e8a82]/40 focus:outline-none focus:border-[#ffb800] transition-colors rounded-none" />
            </div>

            <div v-if="authError" class="text-xs text-[#0c0c0a] font-mono p-3 bg-[#e05320] font-bold">
              ⚠ {{ authError }}
            </div>

            <button type="submit" :disabled="authLoading"
              class="w-full bg-[#f4ede2] text-[#0c0c0a] text-sm font-bold tracking-[0.2em] uppercase py-5 mt-4 hover:bg-[#ffb800] transition-all duration-300 disabled:opacity-50 relative overflow-hidden group cursor-pointer">
              <span class="relative z-10">{{ authLoading ? 'SCANNING...' : 'DECRYPT & ENTER' }}</span>
              <div class="absolute inset-0 h-full w-0 bg-[#e05320] group-hover:w-full transition-all duration-500 ease-out z-0"></div>
            </button>
          </form>
        </div>
      </div>
  </div>

  <div id="dashboard-view" v-else class="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed text-[#f4ede2] flex flex-col md:flex-row antialiased selection:bg-[#e05320] selection:text-white overflow-hidden font-sans relative" style="background-image: url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop');">

      <div class="absolute inset-0 bg-[#0c0c0a]/75 backdrop-blur-[4px] z-0 pointer-events-none"></div>

      <aside class="w-full md:w-[25%] p-8 md:p-12 flex flex-col justify-between bg-[#0e0e0c]/50 backdrop-blur-xl border-r border-[#e05320]/20 relative z-10 shadow-[15px_0_40px_rgba(0,0,0,0.8)] transition-all duration-500 hover:bg-[#0e0e0c]/60">
        <div class="editorial-header">
          <p class="font-mono text-[10px] tracking-[0.3em] text-[#e05320] font-bold uppercase mb-4 drop-shadow-[0_0_8px_rgba(224,83,32,0.8)] animate-pulse">// CORE ENGINE v1.0</p>
          <h1 class="text-[clamp(5rem,6vw,10rem)] font-bold tracking-tighter leading-none mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] break-words break-all">
            ORION<span class="text-[#ffb800] drop-shadow-[0_0_10px_rgba(255,184,0,0.8)]">.</span>
          </h1>
          <p class="text-[#8e8a82] text-sm max-w-xs leading-relaxed backdrop-blur-sm bg-[#000000]/20 p-4 rounded-lg border border-[#ffffff]/5">
            Sistem Retrieval-Augmented Generation internal perusahaan. Diproteksi oleh enkripsi gerbang JWT.
          </p>
        </div>

        <div class="mt-12 md:mt-0 pt-8 border-t border-[#ffffff]/10">
          <div class="flex items-center gap-3 mb-4">
            <span class="w-2 h-2 rounded-full bg-[#ffb800] shadow-[0_0_10px_#ffb800] animate-ping absolute"></span>
            <span class="w-2 h-2 rounded-full bg-[#ffb800] shadow-[0_0_10px_#ffb800] relative"></span>
            <p class="text-xs uppercase tracking-wider text-[#f4ede2] drop-shadow-[0_0_5px_rgba(244,237,226,0.5)]">SYSTEM STATUS: SECURED</p>
          </div>
          <button @click="handleLogout" class="text-left font-mono text-[10px] uppercase text-[#e05320] hover:text-[#ffb800] hover:drop-shadow-[0_0_8px_rgba(255,184,0,0.8)] transition-all duration-300 cursor-pointer flex items-center gap-2">
            <span class="text-lg">⏻</span> [TERMINATE SESSION]
          </button>
        </div>
      </aside>

      <main class="flex-1 flex flex-col h-[calc(100vh-200px)] md:h-screen relative z-10">
        <div id="chat-flow" class="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 scroll-smooth pb-32">

          <Motion
            v-for="msg in messages"
            :key="msg.id"
            :initial="{ opacity: 0, y: 35, scale: 0.98 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :transition="{ duration: 0.5, ease: 'easeOut' }"
            class="max-w-3xl flex flex-col"
            :class="msg.role === 'user' ? 'items-end ml-auto' : 'items-start'"
          >
            <span class="text-[10px] uppercase tracking-[0.2em] mb-2 drop-shadow-[0_0_5px_currentColor]" :class="msg.role === 'user' ? 'text-[#8e8a82]' : 'text-[#e05320]'">
              {{ msg.role === 'user' ? 'Lutfi Candaka' : 'ORION Intelligence' }}
            </span>

            <div class="p-5 text-base leading-relaxed break-words smooth-interaction prose prose-invert max-w-none backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
              :class="msg.role === 'user'
                ? 'bg-[#161613]/70 border-r-2 border-[#e05320] text-[#f4ede2] rounded-l-xl hover:border-[#ffb800] hover:shadow-[0_5px_20px_rgba(224,83,32,0.25)]'
                : 'bg-[#000000]/40 border-l-2 border-[#f4ede2] text-[#f4ede2] rounded-r-xl hover:border-[#e05320] hover:shadow-[0_5px_20px_rgba(255,255,255,0.1)]'"
              v-html="msg.role === 'orion' ? marked.parse(msg.text) : msg.text">
            </div>

            <div v-if="msg.citations && msg.citations.length > 0" class="flex flex-wrap gap-2 mt-3">
              <Motion v-for="(cite, idx) in msg.citations" :key="idx" :initial="{ opacity: 0, scale: 0.8 }" :animate="{ opacity: 1, scale: 1 }" :transition="{ duration: 0.3, delay: idx * 0.1 }"
                class="text-[11px] bg-[#161613]/80 backdrop-blur-sm text-[#ffb800] px-3 py-1 border border-[#ffb800]/30 hover:border-[#ffb800] hover:text-[#f4ede2] hover:shadow-[0_0_15px_rgba(255,184,0,0.4)] hover:-translate-y-1 transition-all duration-300 cursor-help rounded-md">
                🛰 {{ cite.file }} [Hal. {{ cite.page }}]
              </Motion>
            </div>
          </Motion>

          <div v-if="isTyping" class="flex items-center gap-3">
            <div class="w-4 h-4 border-2 border-[#e05320] border-t-transparent rounded-full animate-spin"></div>
            <div class="text-[#e05320] font-mono text-xs uppercase tracking-widest drop-shadow-[0_0_5px_#e05320]">
              ORION IS PROCESSING DATA...
            </div>
          </div>
        </div>

        <div class="input-bar absolute bottom-0 left-0 right-0 p-8 md:p-12 border-t border-[#ffffff]/10 bg-[#0e0e0c]/60 backdrop-blur-2xl z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.8)]">
          <form @submit.prevent="sendMessage" class="max-w-4xl mx-auto flex gap-4 relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-[#e05320] to-[#ffb800] rounded-lg blur opacity-10 group-hover:opacity-30 transition duration-500"></div>

            <input v-model="inputMessage" type="text" placeholder="Tanyakan dokumen aturan atau SOP perusahaan..."
              class="relative flex-1 bg-[#0c0c0a]/80 backdrop-blur-sm border border-[#ffffff]/10 px-6 py-4 text-[#f4ede2] placeholder-[#8e8a82] focus:outline-none focus:border-[#ffb800] focus:shadow-[0_0_20px_rgba(255,184,0,0.2)] transition-all duration-300 text-sm rounded-lg" />

            <button type="submit" class="relative bg-gradient-to-r from-[#e05320] to-[#ffb800] text-[#0c0c0a] text-xs font-bold tracking-widest uppercase px-8 py-4 hover:shadow-[0_0_25px_rgba(255,184,0,0.6)] hover:scale-105 transition-all duration-300 cursor-pointer rounded-lg">
              EXECUTE
            </button>
          </form>
        </div>
      </main>
  </div>

</template>

<style scoped>
#chat-flow::-webkit-scrollbar { width: 4px; }
#chat-flow::-webkit-scrollbar-track { background: transparent; }
#chat-flow::-webkit-scrollbar-thumb { background: rgba(224, 83, 32, 0.2); border-radius: 4px; }
#chat-flow::-webkit-scrollbar-thumb:hover { background: rgba(255, 184, 0, 0.5); }
</style>

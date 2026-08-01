import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import axios from 'axios'

export function useOrion() {
  // ── Auth State ──
  const isLoggedIn = ref(false)
  const isRegisterMode = ref(false)
  const email = ref('')
  const password = ref('')
  const authError = ref('')
  const authLoading = ref(false)
  const currentUser = ref(null)

  // ── Chat State ──
  const messages = ref([
    { id: 1, role: 'orion', text: 'SYS::INIT — ORION RAG Engine operational. Awaiting query input. All document indices loaded.', citations: [] }
  ])
  const inputMessage = ref('')
  const isTyping = ref(false)

  // ── Dashboard State ──
  const currentTime = ref('--:--:--')
  const uptimeSeconds = ref(0)
  const systemMetrics = ref({
    vectorCount: 247, avgLatency: 142, memUsage: 64, cpuLoad: 23
  })

  // ── Upload State ──
  const isDragOver = ref(false)
  const uploadStatus = ref('IDLE')
  const uploadFileName = ref('')
  const targetDivisi = ref('universal') // Tambahin variabel ini di area state useOrion

  // ── System Logs ──
  const systemLogs = ref([
    { t: '00:00:01', msg: 'CHROMADB_CONN ESTABLISHED' },
    { t: '00:00:02', msg: 'JWT_GATEWAY SECURED' },
    { t: '00:00:03', msg: 'VECTOR_INDEX LOADED: 247 CHUNKS' },
  ])

  const formattedUptime = computed(() => {
    const h = String(Math.floor(uptimeSeconds.value / 3600)).padStart(2, '0')
    const m = String(Math.floor((uptimeSeconds.value % 3600) / 60)).padStart(2, '0')
    const s = String(uptimeSeconds.value % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
  })

  let clockInterval = null
  let metricsInterval = null

  // ── Lifecycle ──
  const initSystem = () => {
    const savedToken = localStorage.getItem('orion_token')
    const savedUser = localStorage.getItem('orion_user')
    if (savedToken) {
      isLoggedIn.value = true
      if (savedUser) currentUser.value = JSON.parse(savedUser)
      setTimeout(() => {
        triggerDashboardIntro()
      }, 100)
    } else {
      setTimeout(() => {
        triggerLoginIntro()
      }, 100)
    }

    clockInterval = setInterval(() => {
      currentTime.value = new Date().toLocaleTimeString('en-GB', { hour12: false })
      uptimeSeconds.value++
    }, 1000)

    metricsInterval = setInterval(() => {
      systemMetrics.value.avgLatency = 100 + Math.floor(Math.random() * 80)
      systemMetrics.value.memUsage = 55 + Math.floor(Math.random() * 25)
      systemMetrics.value.cpuLoad = 15 + Math.floor(Math.random() * 30)
    }, 3000)
  }

  const destroySystem = () => {
    clearInterval(clockInterval)
    clearInterval(metricsInterval)
  }

  // ── GSAP Transitions ──
  const triggerLoginIntro = () => {
    const tl = gsap.timeline()
    tl.to('.shutter-top', { y: '-100%', duration: 0.6, ease: 'power4.inOut' })
      .to('.shutter-bottom', { y: '100%', duration: 0.6, ease: 'power4.inOut' }, '<')
      .from('#login-view', { opacity: 0, duration: 0.4 }, '<')
      .from('.login-left', { x: -60, opacity: 0, duration: 0.8, ease: 'power4.out', clearProps: 'all' }, '-=0.3')
      .from('.login-right', { x: 60, opacity: 0, duration: 0.8, ease: 'power4.out', clearProps: 'all' }, '<')
  }

  const triggerDashboardIntro = () => {
    const tl = gsap.timeline()
    tl.to('.shutter-top', { y: '-100%', duration: 0.6, ease: 'power4.inOut' })
      .to('.shutter-bottom', { y: '100%', duration: 0.6, ease: 'power4.inOut' }, '<')
      .from('.panel-left', { x: -80, opacity: 0, duration: 0.8, ease: 'power3.out', clearProps: 'all' }, '-=0.4')
      .from('.panel-right', { x: 80, opacity: 0, duration: 0.8, ease: 'power3.out', clearProps: 'all' }, '<')
      .from('.panel-center', { scale: 0.96, opacity: 0, duration: 0.8, ease: 'power3.out', clearProps: 'all' }, '-=0.6')
      .from('.panel-left > *', { opacity: 0, y: 15, duration: 0.4, stagger: 0.08, ease: 'power2.out', clearProps: 'all' }, '-=0.4')
      .from('.panel-right > *', { opacity: 0, y: 15, duration: 0.4, stagger: 0.08, ease: 'power2.out', clearProps: 'all' }, '<')
      .from('.panel-center > *', { opacity: 0, y: 15, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }, '-=0.3')
  }

  // ── Auth ──
  const handleLogin = async () => {
    if (!email.value || !password.value) return
    authLoading.value = true
    authError.value = ''
    try {
      const response = await axios.post('http://localhost:8084/auth/login', {
        email: email.value, password: password.value
      })
      if (response.data && response.data.token) {
        localStorage.setItem('orion_token', response.data.token)
        if (response.data.user) {
          currentUser.value = response.data.user
          localStorage.setItem('orion_user', JSON.stringify(response.data.user))
        }

        const tl = gsap.timeline({
          onComplete: () => {
            isLoggedIn.value = true
            setTimeout(() => {
              triggerDashboardIntro()
            }, 100)
          }
        })
        tl.to('.shutter-top', { y: '0%', duration: 0.5, ease: 'power4.inOut' })
          .to('.shutter-bottom', { y: '0%', duration: 0.5, ease: 'power4.inOut' }, '<')
          .to('.login-left', { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in' }, '<')
          .to('.login-right', { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in' }, '<')
      }
    } catch (error) {
      authError.value = error.response?.data?.message || 'AUTH_FAIL: Invalid credentials.'
    } finally {
      authLoading.value = false
    }
  }

  const handleLogout = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        localStorage.removeItem('orion_token')
        localStorage.removeItem('orion_user')
        currentUser.value = null
        isLoggedIn.value = false
        setTimeout(() => {
          triggerLoginIntro()
        }, 100)
      }
    })
    tl.to('.shutter-top', { y: '0%', duration: 0.5, ease: 'power4.inOut' })
      .to('.shutter-bottom', { y: '0%', duration: 0.5, ease: 'power4.inOut' }, '<')
  }

  // ── Chat ──
  const sendMessage = async () => {
    if (!inputMessage.value.trim()) return
    const userQuery = inputMessage.value
    messages.value.push({ id: Date.now(), role: 'user', text: userQuery, citations: [] })
    inputMessage.value = ''
    isTyping.value = true

    await nextTick()
    scrollChat()

    addLog(`QUERY_TX: "${userQuery.substring(0, 40)}..."`)

    try {
      const token = localStorage.getItem('orion_token')
      const uid = currentUser.value?.id || 1
      const response = await axios.post('http://localhost:8084/api/chat/send', {
        user_id: uid, question: userQuery
      }, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      })

      if (response.data) {
        const aiId = Date.now()
        messages.value.push({ id: aiId, role: 'orion', text: '', citations: response.data.citations || [] })
        const idx = messages.value.findIndex(m => m.id === aiId)
        const fullText = response.data.answer
        let i = 0
        isTyping.value = false

        const typeInterval = setInterval(() => {
          if (i < fullText.length) {
            messages.value[idx].text = fullText.substring(0, i + 1) + '█'
            i++
            scrollChat()
          } else {
            messages.value[idx].text = fullText
            clearInterval(typeInterval)
          }
        }, 16)

        addLog(`RESP_RX: ${fullText.length} chars, ${(response.data.citations || []).length} citations`)
      }
    } catch (error) {
      console.error('Connection failed:', error)
      isTyping.value = false
      if (error.response?.status === 401) {
        messages.value.push({ id: Date.now(), role: 'orion', text: 'ERR::TOKEN_EXPIRED — Session invalidated. Re-authenticate required.', citations: [] })
      } else {
        messages.value.push({ id: Date.now(), role: 'orion', text: 'ERR::CONN_FAIL — Backend bridge unreachable. Check gateway status.', citations: [] })
      }
      addLog('ERR: RESPONSE FAILURE')
    } finally {
      isTyping.value = false
      await nextTick()
      scrollChat()
    }
  }

  const scrollChat = () => {
    const el = document.getElementById('chat-flow')
    if (el) el.scrollTop = el.scrollHeight
  }

  // ── Upload ──
  const handleDragOver = (e) => { e.preventDefault(); isDragOver.value = true }
  const handleDragLeave = () => { isDragOver.value = false }

  const handleDrop = async (e) => {
    e.preventDefault()
    isDragOver.value = false
    const files = e.dataTransfer.files
    if (files.length && files[0].name.endsWith('.pdf')) {
      await uploadFile(files[0])
    } else {
      uploadStatus.value = 'ERR: PDF ONLY'
    }
  }

  const handleFileInput = async (e) => {
    const file = e.target.files[0]
    if (file) await uploadFile(file)
  }

  const uploadFile = async (file) => {
  uploadStatus.value = 'TRANSMITTING...'
  const formData = new FormData()
  formData.append('file', file)
  formData.append('divisi', targetDivisi.value)

  try {
    const token = localStorage.getItem('orion_token')
    const res = await axios.post('http://localhost:8000/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Orion-Secret': 'ORION_Super_Secret_Key_Token_123',
        'Content-Type': 'multipart/form-data'
      }
    })
    uploadStatus.value = `INDEXED: ${res.data.total_chunks_added} CHUNKS`
    addLog(`INGEST: "${file.name}" [${targetDivisi.value.toUpperCase()}] → ${res.data.total_chunks_added} chunks`)
  } catch (err) {
    uploadStatus.value = 'INGEST_FAIL'
    addLog(`ERR: INGEST FAILED — ${file.name}`)
    console.error("Ingestion Failed:", err)
  }
  }



  // ── Logs ──
  const addLog = (msg) => {
    systemLogs.value.unshift({ t: currentTime.value, msg })
    if (systemLogs.value.length > 50) systemLogs.value.pop()
  }

  return {
    isLoggedIn, isRegisterMode, email, password, authError, authLoading, currentUser,
    messages, inputMessage, isTyping,
    currentTime, uptimeSeconds, formattedUptime, systemMetrics,
    isDragOver, uploadStatus, uploadFileName, systemLogs,
    targetDivisi,
    initSystem, destroySystem,
    handleLogin, handleLogout, sendMessage,
    handleDragOver, handleDragLeave, handleDrop, handleFileInput
  }
}

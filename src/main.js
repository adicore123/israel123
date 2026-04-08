import './style.css'

const testimonials = [
  { text: "לאחר חודשי טיפול הרגשתי שהחיים חוזרים אליי. הכלים שלמדתי משנים את הדרך שבה אני מתמודד עם חרדה.", author: "מטופל א'" },
  { text: "מרחב בטוח ומקצועי שאפשר לי לפתוח על דברים שלא העזתי לדבר עליהם בשום מקום אחר.", author: "מטופלת ב'" },
  { text: "הטיפול עזר לי להבין את עצמי טוב יותר ולתת כלים פרקטיים שמלווים אותי יום יום.", author: "מטופל ג'" },
  { text: "לא חשבתי שאפשר להרגיש כל כך הרבה יותר טוב. תודה על הליווי המסור והמקצועי.", author: "מטופלת ד'" },
  { text: "גיליתי שאפשר להתמודד עם המחשבות השליליות בצורה אחרת. זה שינה את הכל בשבילי.", author: "מטופל ה'" },
]

const faqs = [
  { q: "מה זה טיפול CBT?", a: "CBT (Cognitive Behavioral Therapy) היא שיטת טיפול מבוססת ראיות המתמקדת בזיהוי ושינוי דפוסי חשיבה שליליים והתנהגויות מזיקות." },
  { q: "כמה זמן נמשך טיפול?", a: "משך הטיפול משתנה בהתאם לצרכי המטופל. בדרך כלל מדובר ב-12-20 פגישות שבועיות, כאשר לעיתים ניתן לראות שיפור משמעותי כבר אחרי מספר פגישות." },
  { q: "האם הטיפול מתאים לי?", a: "טיפול CBT יעיל במגוון רחב של קשיים כמו חרדה, דיכאון, פוביות, הפרעות אכילה ועוד. בפגישת ההערכה נבדק האם השיטה מתאימה לצרכים שלך." },
  { q: "איך מתבצעת פגישה?", a: "הפגישות מתקיידשות בזום או פרונטלית, באורך של 45-50 דקות. במהלך הפגישה נעבוד יחד על זיהוי דפוסי חשיבה, תרגול כלים והתנהגויות חדשות." },
]

const features = [
  { icon: "🛠️", title: "כלים פרקטיים", desc: "לומדים טכניקות קונקרטיות שניתן ליישם מיד בחיי היום יום" },
  { icon: "🛡️", title: "מרחב בטוח", desc: "סביבה טיפולית תומכת ומכבדת שמאפשרת להיפתח ולהתפתח" },
  { icon: "🤝", title: "ליווי אישי", desc: "מעקב והתאמה אישית של הטיפול לצרכים ולקצב שלך" },
]

let scrolled = false
let openFaq = null

function render() {
  const app = document.querySelector('#app')
  
  app.innerHTML = `
    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}" dir="rtl">
      <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="text-2xl font-bold ${scrolled ? 'text-teal-900' : 'text-white'}">שקט<span class="text-emerald-500">פנימי</span></span>
        </div>
        <div class="hidden md:flex items-center gap-8">
          <a href="#features" class="${scrolled ? 'text-slate-600' : 'text-white/80'} hover:text-emerald-500 transition">למה לבחור בנו</a>
          <a href="#testimonials" class="${scrolled ? 'text-slate-600' : 'text-white/80'} hover:text-emerald-500 transition">המלצות</a>
          <a href="#faq" class="${scrolled ? 'text-slate-600' : 'text-white/80'} hover:text-emerald-500 transition">שאלות נפוצות</a>
          <a href="#contact" class="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg shadow-emerald-500/25">
            לתיאום פגישה
          </a>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="min-h-screen flex items-center justify-center relative overflow-hidden" style="background: linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #115e59 100%);">
      <div class="absolute inset-0 opacity-20" style="background-image: url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      <div class="max-w-4xl mx-auto px-6 text-center relative z-10 pt-20">
        <div class="fade-in">
          <span class="inline-block bg-white/10 backdrop-blur-sm text-emerald-100 px-5 py-2 rounded-full text-sm font-medium mb-8 border border-white/20">
            טיפול מבוסס ראיות • מקצועי ואמפתי
          </span>
        </div>
        <h1 class="fade-in text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" style="animation-delay: 0.1s;">
          למצוא את השקט<span class="text-emerald-400 block">הפנימי מחדש</span>
        </h1>
        <p class="fade-in text-xl md:text-2xl text-emerald-100/90 max-w-2xl mx-auto mb-10 leading-relaxed" style="animation-delay: 0.2s;">
          בואו נגלה יחד את הכלים שיעזרו לכם להתמודד עם חרדה, דיכאון ואתגרי החיים. טיפול CBT בגישה חמה ומקצועית.
        </p>
        <div class="fade-in flex flex-col sm:flex-row gap-4 justify-center" style="animation-delay: 0.3s;">
          <a href="#contact" class="bg-white text-teal-900 hover:bg-emerald-50 text-lg font-semibold px-10 py-4 rounded-full transition shadow-xl">
            לתיאום פגישה
          </a>
          <a href="#features" class="bg-white/10 hover:bg-white/20 text-white text-lg font-semibold px-10 py-4 rounded-full backdrop-blur-sm transition border border-white/20">
            ללמוד עוד
          </a>
        </div>
      </div>
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg class="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-24 bg-slate-50" dir="rtl">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-4xl md:text-5xl font-bold text-teal-900 text-center mb-16">למה לבחור בתהליך שלנו</h2>
        <div class="grid md:grid-cols-3 gap-8">
          ${features.map((f, i) => `
            <div class="fade-in bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100" style="animation-delay: ${i * 0.1}s;">
              <div class="text-5xl mb-6">${f.icon}</div>
              <h3 class="text-2xl font-bold text-teal-900 mb-4">${f.title}</h3>
              <p class="text-slate-600 leading-relaxed text-lg">${f.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="py-24 bg-teal-900 text-white" dir="rtl">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-4xl md:text-5xl font-bold text-center mb-16">מה המטופלים אומרים</h2>
        <div class="flex gap-6 overflow-x-auto pb-4 scroll-snap-x hide-scrollbar">
          ${testimonials.map(t => `
            <div class="scroll-snap-center flex-shrink-0 w-80 md:w-96 bg-teal-800/50 p-8 rounded-3xl border border-teal-700/50">
              <div class="flex gap-1 mb-4">
                ${[1,2,3,4,5].map(() => `<svg class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`).join('')}
              </div>
              <p class="text-lg text-emerald-100 mb-6 leading-relaxed">"${t.text}"</p>
              <p class="text-teal-300 font-medium">${t.author}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="py-24 bg-white" dir="rtl">
      <div class="max-w-3xl mx-auto px-6">
        <h2 class="text-4xl md:text-5xl font-bold text-teal-900 text-center mb-16">שאלות נפוצות</h2>
        <div class="space-y-4">
          ${faqs.map((faq, i) => `
            <div class="border border-slate-200 rounded-2xl overflow-hidden">
              <button class="w-full p-6 flex justify-between items-center text-right hover:bg-slate-50 transition" onclick="toggleFaq(${i})">
                <span class="text-lg font-semibold text-teal-900">${faq.q}</span>
                <svg class="w-6 h-6 text-teal-600 transition-transform ${openFaq === i ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div class="overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40' : 'max-h-0'}">
                <p class="px-6 pb-6 text-slate-600 leading-relaxed">${faq.a}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="py-24 bg-slate-50" dir="rtl">
      <div class="max-w-5xl mx-auto px-6">
        <div class="bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div class="md:w-2/5 bg-gradient-to-br from-teal-600 to-teal-800 p-12 text-white flex flex-col justify-between">
            <div>
              <h3 class="text-3xl font-bold mb-6">בואו נתחיל את הדרך יחד</h3>
              <p class="text-teal-100 mb-10 text-lg">צרו קשר לתיאום פגישת הערכה ללא עלות.</p>
            </div>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <span class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </span>
                <span class="font-medium text-lg">050-123-4567</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </span>
                <span class="font-medium text-lg">זמינים א'-ה' 9:00-18:00</span>
              </div>
            </div>
          </div>
          <div class="md:w-3/5 p-12">
            <form id="leadForm" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-2">שם מלא</label>
                <input type="text" id="nameInput" required class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition" placeholder="שם מלא">
                <p id="nameError" class="hidden text-red-500 text-sm mt-2">שם חייב להכיל לפחות 2 תווים</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-2">טלפון</label>
                <input type="tel" id="phoneInput" required class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition" placeholder="05X-XXX-XXXX">
                <p id="phoneError" class="hidden text-red-500 text-sm mt-2">מספר טלפון חייב להכיל 10 ספרות</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-2">נושא פנייה</label>
                <select class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition appearance-none">
                  <option>חרדה</option>
                  <option>דיכאון</option>
                  <option>מערכות יחסים</option>
                  <option>התמודדות בעבודה</option>
                  <option>אחר</option>
                </select>
              </div>
              <button type="submit" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-5 rounded-xl transition shadow-lg shadow-teal-600/25 text-lg">
                שלח פנייה
              </button>
            </form>
            <div id="successMessage" class="hidden mt-6 p-6 bg-emerald-50 text-emerald-800 rounded-xl text-center border border-emerald-200">
              <svg class="w-16 h-16 text-emerald-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <p class="text-xl font-bold">תודה רבה!</p>
              <p class="text-emerald-700 mt-2">נחזור אליך בקרוב לתיאום פגישה.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400 py-12" dir="rtl">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <div class="flex items-center justify-center gap-2 mb-6">
          <span class="text-2xl font-bold text-white">שקט<span class="text-emerald-500">פנימי</span></span>
        </div>
        <p class="mb-6 text-lg">טיפול CBT מקצועי ואמפתי</p>
        <div class="flex justify-center gap-6 mb-8">
          <a href="#" class="hover:text-emerald-400 transition">תנאי שימוש</a>
          <a href="#" class="hover:text-emerald-400 transition">מדיניות פרטיות</a>
        </div>
        <p class="text-sm text-slate-500">© 2026 כל הזכויות שמורות</p>
      </div>
    </footer>
  `

  setupScrollEffects()
  setupForm()
  setupFadeIn()
}

window.toggleFaq = (i) => {
  openFaq = openFaq === i ? null : i
  render()
}

function setupScrollEffects() {
  window.addEventListener('scroll', () => {
    scrolled = window.scrollY > 50
    const nav = document.querySelector('nav')
    if (nav) {
      if (scrolled) {
        nav.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm')
        nav.classList.remove('bg-transparent')
      } else {
        nav.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm')
        nav.classList.add('bg-transparent')
      }
    }
  })
}

function setupForm() {
  const form = document.getElementById('leadForm')
  if (!form) return

  const nameInput = document.getElementById('nameInput')
  const phoneInput = document.getElementById('phoneInput')
  const nameError = document.getElementById('nameError')
  const phoneError = document.getElementById('phoneError')

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const nameValid = nameInput.value.trim().length >= 2
    const phoneValid = /^05\d{8}$/.test(phoneInput.value.replace(/-/g, ''))

    nameError.classList.toggle('hidden', nameValid)
    phoneError.classList.toggle('hidden', phoneValid)

    if (nameValid && phoneValid) {
      const btn = form.querySelector('button')
      btn.innerHTML = '<svg class="animate-spin h-6 w-6 mx-auto" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'
      btn.disabled = true

      setTimeout(() => {
        form.classList.add('hidden')
        document.getElementById('successMessage').classList.remove('hidden')
      }, 1500)
    }
  })
}

function setupFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el))
}

render()
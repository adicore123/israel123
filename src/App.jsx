import { useState, useEffect } from 'react';
import React from 'react';
import { Icons } from './components/Icons.jsx';
import AnimatedSection from './components/AnimatedSection.jsx';
import ContactForm from './components/ContactForm.jsx';

const servicesList = [
  'אבחון תקלות מקצועי ומדויק',
  'תיקוני חשמל ותקלות מורכבות',
  'חילוץ ברגים תקועים / שבורים',
  'הלחמות מקצועיות',
  'החלפת צמות ראשיות',
  'החלפת צמות מנוע',
  'תיקוני מנוע וחיווט',
  'הרכבות ותיקונים כלליים',
  'הרכבת כל סוגי הצמיגים',
  'תחזוקה שוטפת וטיפולים מקצועיים',
];

const whyUsList = [
  'ניסיון וידע מקצועי בתחום הכלים החשמליים',
  'התמחות בתקלות מורכבות ותיקוני חשמל',
  'שירות מקצועי לקורקינטים, אופניים חשמליים, טרקטורונים וקלנועיות',
  'התמחות באופניים חשמליים מכל הסוגים',
  'עבודה יסודית, מדויקת ואמינה',
  'שירות מהיר, מקצועי ואישי',
  'פתרונות ללקוחות פרטיים ולעסקים',
];

const specializations = [
  { title: 'קורקינטים חשמליים', icon: Icons.Scooter },
  { title: 'אופניים חשמליים מכל הסוגים', icon: Icons.Bike },
  { title: 'טרקטורונים חשמליים', icon: Icons.ATV },
  { title: 'קלנועיות', icon: Icons.Mobility },
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.style.scrollBehavior = 'smooth';
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setIsMobileMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#002C3E] font-sans selection:bg-[#78BCC4]/30 overflow-x-hidden">

      {/* --- כפתורים צפים --- */}
      <a
        href="https://wa.me/972501234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 left-5 z-[100] bg-[#06d6a0] text-white p-3.5 rounded-full shadow-lg flex items-center justify-center hover:bg-[#05b88a] transition-colors"
        title="שלחו הודעת וואטסאפ"
      >
        <Icons.WhatsApp className="w-7 h-7" />
      </a>

      <a
        href="tel:0501234567"
        className="fixed bottom-5 right-5 z-[100] bg-[#F7444E] text-white p-3.5 rounded-full shadow-lg coral-glow flex items-center justify-center transition-colors"
        title="חייגו עכשיו"
      >
        <Icons.Phone className="w-6 h-6" />
      </a>

      {/* --- Header --- */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isMobileMenuOpen
            ? 'bg-white shadow-md py-3'
            : isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-5 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#002C3E] rounded-xl flex items-center justify-center text-[#78BCC4] shadow-sm">
              <Icons.Electric className="w-6 h-6" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl md:text-2xl font-black text-[#002C3E] tracking-tight">
                E-TECH<span className="text-[#F7444E]">.</span>
              </span>
              <span className="text-[10px] md:text-xs font-bold text-[#78BCC4] uppercase tracking-widest">
                טכנאי מקצועי
              </span>
            </div>
          </div>
          <nav className="hidden lg:flex gap-8 font-semibold text-[#002C3E]/70">
            <a href="#specializations" className="hover:text-[#002C3E] transition-colors">תחומי התמחות</a>
            <a href="#services" className="hover:text-[#002C3E] transition-colors">השירותים שלנו</a>
            <a href="#audiences" className="hover:text-[#002C3E] transition-colors">פרטיים ועסקים</a>
            <a href="#why-us" className="hover:text-[#002C3E] transition-colors">למה לבחור בנו?</a>
          </nav>
          <a
            href="#contact"
            className="bg-[#002C3E] text-white px-6 py-2 rounded-full font-bold transition-all hover:bg-[#F7444E] hover:text-white shadow-sm text-sm hidden lg:block"
          >
            הזמנת שירות
          </a>
          <button
            className="lg:hidden p-2 rounded-xl text-[#002C3E] hover:bg-[#F7F8F3] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="תפריט ניווט"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-5 pb-5 pt-3 flex flex-col gap-1 border-t-2 border-[#78BCC4]/40">
            {[
              { href: '#specializations', label: 'תחומי התמחות' },
              { href: '#services', label: 'השירותים שלנו' },
              { href: '#audiences', label: 'פרטיים ועסקים' },
              { href: '#why-us', label: 'למה לבחור בנו?' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-4 rounded-xl font-semibold text-[#002C3E]/70 hover:text-[#002C3E] hover:bg-[#F7F8F3] transition-colors text-right"
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-2 bg-[#002C3E] text-white px-6 py-3 rounded-xl font-bold text-center transition-all hover:bg-[#F7444E]"
            >
              הזמנת שירות
            </a>
          </div>
        </div>
      </header>

      {/* --- Hero --- */}
      <section className="relative pt-36 pb-16 md:pt-48 md:pb-32 overflow-hidden min-h-[600px]">
        {/* Video background */}
        <video
          src="/יצירת_סרטון_ללא_מוזיקה.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-[#002C3E]/60 z-[1]" />

        <div className="container mx-auto px-5 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs md:text-sm mb-8">
              <Icons.Electric className="w-4 h-4 text-[#F7444E]" />
              טכנאי מקצועי לכלים חשמליים
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.15] mb-6 md:mb-8 tracking-tight">
              תיקון, אבחון ותחזוקה <br className="hidden md:block" />
              <span className="wow-underline inline-block mt-2 md:mt-3">לכל סוגי הכלים החשמליים</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-normal">
              עם התמחות בתקלות מורכבות, מערכות חשמל, מנועים, צמות, הלחמות והרכבות מקצועיות.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a
                href="#contact"
                className="w-full sm:w-auto bg-[#F7444E] text-white px-8 py-4 rounded-xl font-bold text-lg coral-glow flex items-center justify-center gap-3"
              >
                <Icons.Phone className="w-5 h-5" />
                חייגו עכשיו
              </a>
              <a
                href="#services"
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-[#002C3E] px-8 py-4 rounded-xl font-bold text-lg transition-all text-center"
              >
                השירותים שלנו
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-3 text-xs md:text-sm font-bold">
              {['קורקינטים', 'אופניים חשמליים', 'טרקטורונים', 'קלנועיות'].map((tag, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-5 py-2 rounded-full">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Marquee --- */}
      <div className="bg-[#78BCC4] text-[#002C3E] py-4 overflow-hidden border-y border-[#002C3E]/10">
        <div className="animate-marquee whitespace-nowrap flex items-center w-max">
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-2xl md:text-3xl font-black tracking-widest mx-8 md:mx-16">TEVERUN</span>
              <span className="text-lg text-white">✦</span>
              <span className="text-2xl md:text-3xl font-black tracking-widest mx-8 md:mx-16">NAMI</span>
              <span className="text-lg text-white">✦</span>
              <span className="text-2xl md:text-3xl font-black tracking-widest mx-8 md:mx-16">INOKIM</span>
              <span className="text-lg text-white">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* --- תחומי התמחות --- */}
      <AnimatedSection id="specializations" className="bg-[#F7F8F3]">
        <div className="container mx-auto px-5 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#002C3E] mb-4 md:mb-6">תחומי התמחות</h2>
            <div className="w-16 h-1 bg-[#F7444E] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {specializations.map((spec, i) => (
              <div
                key={i}
                className="bg-white p-8 md:p-10 rounded-2xl flex flex-col items-center text-center group cursor-pointer transition-all duration-300 hover:shadow-md border border-[#002C3E]/5 hover:border-[#F7444E]/20"
              >
                <div className="w-16 h-16 bg-[#F7F8F3] text-[#002C3E] rounded-xl flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-[#78BCC4] group-hover:text-white">
                  <spec.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-bold leading-tight text-[#002C3E]">{spec.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* --- שירותים --- */}
      <AnimatedSection id="services" className="bg-[#002C3E] text-white">
        <div className="container mx-auto px-5 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-4 border-b border-white/10 pb-6 md:pb-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-3">השירותים שלנו</h2>
              <p className="text-[#78BCC4] text-lg md:text-xl font-medium">מעטפת תיקונים מושלמת לכל כלי</p>
            </div>
            <Icons.Settings className="w-10 h-10 text-white/10 hidden md:block" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicesList.map((service, i) => (
              <div
                key={i}
                className={`bg-white/5 border border-white/5 p-5 md:p-6 rounded-xl hover:bg-[#78BCC4]/5 hover:border-[#F7444E]/30 transition-all duration-300 flex items-start gap-4 ${
                  i === 0 || i === 6 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-md bg-[#78BCC4] flex items-center justify-center text-[#002C3E] shrink-0 mt-0.5">
                  <Icons.Check className="w-5 h-5" />
                </div>
                <h3 className="text-base md:text-lg font-semibold leading-snug">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* --- קהלים --- */}
      <AnimatedSection id="audiences" className="bg-white">
        <div className="container mx-auto px-5 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#002C3E] mb-6">שירות לפרטיים ולעסקים</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-[#F7F8F3] p-8 md:p-12 rounded-2xl border border-[#002C3E]/5 flex flex-col justify-center">
              <div className="w-14 h-14 bg-[#78BCC4] text-[#002C3E] rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Icons.Shield className="w-7 h-7" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-[#002C3E] mb-3">
                שירות עד הבית<br />
                <span className="text-[#78BCC4] text-xl md:text-2xl">ללקוחות פרטיים</span>
              </h3>
              <p className="text-base md:text-lg text-[#002C3E]/70 font-medium leading-relaxed">
                פתרון נוח, מהיר ומקצועי – בלי צורך לשנע את הכלי. הטכנאי מגיע עד אליכם.
              </p>
            </div>
            <div className="bg-[#002C3E] p-8 md:p-12 rounded-2xl flex flex-col justify-center shadow-lg relative overflow-hidden">
              <div className="w-14 h-14 bg-[#F7444E] text-white rounded-xl flex items-center justify-center mb-6 shadow-md coral-glow relative z-10">
                <Icons.Wrench className="w-7 h-7" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3 relative z-10">
                שירות מקצועי<br />
                <span className="text-[#F7444E] text-xl md:text-2xl">לחנויות ועסקים</span>
              </h3>
              <p className="text-base md:text-lg text-white/70 font-medium leading-relaxed relative z-10">
                שירות מקצועי לחנויות, משווקים ובתי עסק בתחום הכלים החשמליים – כולל תיקונים, תחזוקה, הרכבות וטיפול בתקלות מורכבות.
              </p>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#F7444E] opacity-5 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* --- למה אנחנו --- */}
      <AnimatedSection id="why-us" className="bg-[#F7F8F3]">
        <div className="container mx-auto px-5 md:px-6">
          <div className="bg-[#002C3E] rounded-2xl md:rounded-3xl p-8 md:p-16 shadow-lg relative overflow-hidden">
            <Icons.Electric className="absolute -left-10 -bottom-10 w-64 h-64 text-[#78BCC4] opacity-5 rotate-12 pointer-events-none" />
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8 md:mb-10">למה לבחור בנו?</h2>
              <div className="space-y-4 md:space-y-5">
                {whyUsList.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 md:gap-4">
                    <div className="bg-white/10 text-[#78BCC4] p-1 rounded shrink-0 mt-1">
                      <Icons.Check className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <p className="text-base md:text-lg font-medium text-white/90 leading-snug">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* --- יצירת קשר --- */}
      <AnimatedSection id="contact" className="bg-white">
        <div className="container mx-auto px-5 md:px-6 max-w-3xl text-center">
          <h2 className="text-4xl md:text-6xl font-black text-[#002C3E] mb-4 md:mb-6">צריכים תיקון?</h2>
          <p className="text-lg md:text-xl text-[#002C3E]/80 font-semibold mb-8">
            שירות מקצועי, אמין ומהיר לכל סוגי הכלים החשמליים
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-10 text-[#002C3E]/60 font-medium text-sm md:text-base">
            <span>קורקינטים</span><span className="text-[#002C3E]/20">|</span>
            <span>אופניים חשמליים</span><span className="text-[#002C3E]/20">|</span>
            <span>טרקטורונים</span><span className="text-[#002C3E]/20">|</span>
            <span>קלנועיות</span>
          </div>
          <div className="bg-[#F7F8F3] p-6 md:p-10 rounded-2xl border border-[#002C3E]/5 shadow-sm inline-block w-full text-center">
            <p className="text-lg md:text-xl font-bold text-[#002C3E] mb-1 md:mb-2">נשמח לעמוד לשירותכם</p>
            <p className="text-sm md:text-base text-[#002C3E]/60 mb-6 md:mb-8">השאירו פרטים ונחזור אליכם בהקדם</p>
            <ContactForm />
          </div>
        </div>
      </AnimatedSection>

      {/* --- Footer --- */}
      <footer className="bg-white text-[#002C3E]/50 py-8 border-t border-[#002C3E]/5">
        <div className="container mx-auto px-5 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#002C3E] rounded-md flex items-center justify-center text-[#78BCC4]">
              <Icons.Electric className="w-4 h-4" />
            </div>
            <span className="text-lg font-black tracking-tight text-[#002C3E]">
              E-TECH<span className="text-[#F7444E]">.</span>
            </span>
          </div>
          <div className="text-center md:text-right font-medium text-xs md:text-sm">
            © {new Date().getFullYear()} טכנאי מקצועי לכלים חשמליים. כל הזכויות שמורות.
          </div>
        </div>
      </footer>
    </div>
  );
}

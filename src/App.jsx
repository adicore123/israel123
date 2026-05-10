import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from './components/Icons.jsx';
import AnimatedSection from './components/AnimatedSection.jsx';
import ContactForm from './components/ContactForm.jsx';
import AccessibilityMenu from './components/AccessibilityMenu.jsx';
import SeoHead from './components/SeoHead.jsx';
const serviceToneClass = {
  teal: 'bg-[#78BCC4] text-[#002C3E]',
  coral: 'bg-[#F7444E] text-white',
  muted: 'bg-white/10 text-[#78BCC4]',
};

const servicesList = [
  { title: 'אבחון תקלות מקצועי ומדויק', icon: Icons.ServiceSearch, tone: 'teal' },
  { title: 'תיקוני חשמל ותקלות מורכבות', icon: Icons.Electric, tone: 'coral' },
  { title: 'חילוץ ברגים תקועים / שבורים', icon: Icons.ServiceScrewdriver, tone: 'muted' },
  { title: 'הלחמות מקצועיות', icon: Icons.ServiceFlame, tone: 'coral' },
  { title: 'החלפת צמות ראשיות', icon: Icons.ServiceChain, tone: 'teal' },
  { title: 'החלפת צמות מנוע', icon: Icons.ServiceGear, tone: 'muted' },
  { title: 'תיקוני מנוע וחיווט', icon: Icons.ServiceEngineWire, tone: 'coral' },
  { title: 'הרכבות ותיקונים כלליים', icon: Icons.ServiceHammer, tone: 'teal' },
  { title: 'הרכבת כל סוגי הצמיגים', icon: Icons.ServiceTire, tone: 'muted' },
  { title: 'תחזוקה שוטפת וטיפולים מקצועיים', icon: Icons.ServiceMaintenance, tone: 'teal' },
];

const aboutCards = [
  {
    title: '10 שנות נסיון',
    body: 'שמי ישראל. לאורך עשור של עשייה מקצועית בתחום המיקרו-מוביליטי, התמחיתי במתן שירותי מעבדה, תיקון ותחזוקה לאופניים וקורקינטים חשמליים. אני מביא איתי היכרות מעמיקה עם מערכות החשמל והמכניקה של כלים אלו, תוך הקפדה על סטנדרט מקצועי ללא פשרות.',
    icon: Icons.WhyUsAward,
    iconVariant: 'teal',
  },
  {
    title: 'מומחיות במערכות וחשמל',
    body: 'ב-10 השנים האחרונות צברתי ניסיון מעשי עשיר בכל סוגי המערכות, המנועים והבקרים הקיימים בשוק, תוך התמחות בפתרון תקלות החשמל המורכבות ביותר שלרוב נשארות ללא מענה.',
    icon: Icons.ServiceEngineWire,
    iconVariant: 'coral',
  },
  {
    title: 'שירות מקצועי ומסור',
    body: 'במשך שנים ארוכות הענקתי שירות מקצועי לקהל לקוחות מצומצם ולחברות המובילות בשוק.',
    icon: Icons.WhyUsUsers,
    iconVariant: 'teal',
  },
  {
    title: 'פתיחה לעסקים וללקוחות',
    body: 'עם הזמן, זיהיתי את המצוקה ההולכת וגוברת בשוק: בעלי חנויות שקורסים תחת העומס במעבדה, ולקוחות שמחפשים ידיים מקצועיות באמת. לכן, החלטתי להרחיב את הפעילות, לפתוח את הדלתות, ולהעמיד את השירות, הידע והסטנדרטים המחמירים שלי לרשות כלל העסקים והלקוחות הפרטיים הזקוקים לפתרון אמיתי, אמין ומהיר.',
    icon: Icons.Wrench,
    iconVariant: 'coral',
  },
];

const whyUsItems = [
  { text: 'ניסיון וידע מקצועי בתחום הכלים החשמליים', Icon: Icons.WhyUsAward, accent: 'teal' },
  { text: 'התמחות בתקלות מורכבות ותיקוני חשמל', Icon: Icons.ServiceEngineWire, accent: 'coral' },
  { text: 'שירות מקצועי לקורקינטים, אופניים חשמליים, טרקטורונים וקלנועיות', kind: 'fleet', accent: 'teal' },
  { text: 'התמחות באופניים חשמליים מכל הסוגים', Icon: Icons.Bike, accent: 'coral' },
  { text: 'עבודה יסודית, מדויקת ואמינה', Icon: Icons.ServiceGear, accent: 'teal' },
  { text: 'שירות מהיר, מקצועי ואישי', Icon: Icons.WhyUsTimer, accent: 'coral' },
  { text: 'פתרונות ללקוחות פרטיים ולעסקים', Icon: Icons.WhyUsUsers, accent: 'teal' },
];

const accentWhyUsIcon = {
  teal: 'bg-gradient-to-br from-[#78BCC4] to-[#4a9aa3] text-[#002C3E] shadow-lg shadow-[#78BCC4]/20',
  coral: 'bg-gradient-to-br from-[#F7444E] to-[#c9363f] text-white shadow-lg shadow-[#F7444E]/25',
};

function WhyUsFleetGlyph({ className }) {
  return (
    <div className={`grid grid-cols-2 gap-0.5 place-items-center text-current ${className || ''}`}>
      <Icons.Scooter className="w-[17px] h-[17px] md:w-[19px] md:h-[19px]" />
      <Icons.Bike className="w-[17px] h-[17px] md:w-[19px] md:h-[19px]" />
      <Icons.ATV className="w-[17px] h-[17px] md:w-[19px] md:h-[19px]" />
      <Icons.Mobility className="w-[17px] h-[17px] md:w-[19px] md:h-[19px]" />
    </div>
  );
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const whyUsRef = useRef(null);
  const [whyUsInView, setWhyUsInView] = useState(false);

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

  useEffect(() => {
    const el = whyUsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWhyUsInView(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -4% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const brandMarqueeItems = [
    { kind: 'brand', label: 'TEVERUN' },
    { kind: 'sep' },
    { kind: 'brand', label: 'NAMI' },
    { kind: 'sep' },
    { kind: 'brand', label: 'INOKIM' },
    { kind: 'sep' },
  ];
  const doubledBrandMarqueeItems = [...brandMarqueeItems, ...brandMarqueeItems];

  return (
    <>
      <SeoHead />

      {/* --- כפתורים צפים (מחוץ ל־#site-content) --- */}
      <a
        href="https://wa.me/972545050609?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%A9%D7%A8%D7%95%D7%AA%20%D7%AA%D7%99%D7%A7%D7%95%D7%A0%D7%99%D7%9D%20%D7%9B%D7%9C%D7%99%20%D7%AA%D7%97%D7%91%D7%95%D7%A8%D7%94%20%D7%97%D7%A9%D7%9E%D7%9C%D7%99%D7%99%D7%9D"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 left-5 z-[100] bg-[#06d6a0] text-white p-3.5 rounded-full shadow-lg flex items-center justify-center hover:bg-[#05b88a] transition-colors"
        title="שלחו הודעת וואטסאפ"
      >
        <Icons.WhatsApp className="w-7 h-7" />
      </a>

      <a
        href="tel:0545050609"
        className="fixed bottom-5 right-5 z-[100] bg-[#F7444E] hover:bg-[#de3d46] text-white p-3.5 rounded-full shadow-lg coral-glow flex items-center justify-center transition-colors"
        title="חייגו עכשיו"
      >
        <Icons.Phone className="w-6 h-6" />
      </a>

      <AccessibilityMenu stackAboveWhatsApp />

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
              <span className="text-[10px] md:text-xs font-bold text-[#4a9aa3] uppercase tracking-widest">
                טכנאי מקצועי
              </span>
            </div>
          </div>
          <nav className="hidden lg:flex gap-8 font-semibold text-[#002C3E]/70" aria-label="ניווט ראשי">
            <a href="#about" className="hover:text-[#002C3E] transition-colors">נעים להכיר</a>
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
              { href: '#about', label: 'נעים להכיר' },
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

      <main
        id="site-content"
        className="min-h-screen bg-white text-[#002C3E] font-sans selection:bg-[#78BCC4]/30 overflow-x-hidden"
      >
      {/* --- Hero --- */}
      <section
        className="relative pt-36 pb-16 md:pt-48 md:pb-32 overflow-hidden min-h-[600px] bg-[#002C3E]"
        aria-labelledby="hero-title"
      >
        {/* Video background */}
        <video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover z-0"
          aria-hidden="true"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-[#002C3E]/60 z-[1]" />

        <div className="container mx-auto px-5 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs md:text-sm mb-8">
              <Icons.Electric className="w-4 h-4 text-[#F7444E]" />
              טכנאי מקצועי לכלים חשמליים
            </div>

            <h1
              id="hero-title"
              className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.15] mb-6 md:mb-8 tracking-tight"
            >
              תיקון, אבחון ותחזוקה <br className="hidden md:block" />
              <span className="wow-underline inline-block mt-2 md:mt-3">לכל סוגי הכלים החשמליים</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-normal">
              טכנאי קורקינטים ואופניים חשמליים בישראל — אבחון מקצועי, תיקון סוללות ומנועים, צמות, חשמל
              והרכבות. שירות לפרטיים ולעסקים.
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

      {/* --- Marquee: סטטי במובייל, גולל בדסקטופ --- */}
      <section
        className="bg-[#78BCC4] text-[#002C3E] border-y border-[#002C3E]/10"
        aria-label="מותגי ציוד נתמכים"
      >
        {/* מובייל — כל המותגים מוצגים סטטית */}
        <div className="md:hidden py-4 px-4 flex flex-wrap justify-center items-center gap-x-5 gap-y-2">
          {brandMarqueeItems.map((item, i) =>
            item.kind === 'brand' ? (
              <span key={`m-${i}`} className="text-xl font-black tracking-widest">
                {item.label}
              </span>
            ) : (
              <span key={`ms-${i}`} className="text-white text-base" aria-hidden>✦</span>
            )
          )}
        </div>

        {/* דסקטופ — מרקיז גולל */}
        <div className="hidden md:block py-4 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex flex-nowrap items-center w-max" dir="ltr">
            {doubledBrandMarqueeItems.map((item, i) =>
              item.kind === 'brand' ? (
                <span
                  key={`brand-${i}`}
                  className="text-3xl font-black tracking-widest mx-16 shrink-0"
                >
                  {item.label}
                </span>
              ) : (
                <span key={`sep-${i}`} className="text-lg text-white shrink-0" aria-hidden>
                  ✦
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* --- נעים להכיר --- */}
      <AnimatedSection id="about" className="bg-[#F7F8F3]">
        <div className="container mx-auto px-5 md:px-6">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-[#002C3E] mb-4 md:mb-6">נעים להכיר, ישראל</h2>
            <div className="w-16 h-1 bg-[#F7444E] mx-auto rounded-full" />
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {aboutCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#002C3E]/5 p-6 md:p-8 shadow-sm flex items-start gap-4 text-right"
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${serviceToneClass[card.iconVariant]}`}
                  >
                    <Icon className="w-7 h-7" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-[#002C3E] mb-2 leading-snug">{card.title}</h3>
                    <p className="text-base md:text-lg text-[#002C3E]/80 font-medium leading-relaxed">{card.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* --- שירותים --- */}
      <AnimatedSection id="services" className="bg-[#002C3E] text-white" aria-labelledby="services-heading">
        <div className="container mx-auto px-5 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-4 border-b border-white/10 pb-6 md:pb-8">
            <div>
              <h2 id="services-heading" className="text-3xl md:text-5xl font-black mb-3">
                השירותים שלנו
              </h2>
              <p className="text-[#78BCC4] text-lg md:text-xl font-medium">מעטפת תיקונים מושלמת לכל כלי</p>
            </div>
            <Icons.Settings className="w-10 h-10 text-white/10 hidden md:block" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicesList.map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className="bg-white/5 border border-white/5 p-5 md:p-6 rounded-xl hover:bg-[#78BCC4]/5 hover:border-[#F7444E]/30 transition-all duration-300 flex items-start gap-4"
                >
                  <div
                    className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${serviceToneClass[service.tone]}`}
                  >
                    <Icon className="w-5 h-5" aria-hidden />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold leading-snug">{service.title}</h3>
                </div>
              );
            })}
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
          <div
            ref={whyUsRef}
            className="bg-[#002C3E] rounded-2xl md:rounded-3xl p-8 md:p-16 shadow-lg relative overflow-hidden"
          >
            <Icons.Electric className="absolute -left-10 -bottom-10 w-64 h-64 text-[#78BCC4] opacity-[0.06] rotate-12 pointer-events-none why-us-deco-float" />
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#78BCC4]/[0.07] blur-3xl pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(circle_at_70%_20%,#78BCC4,transparent_55%)]" />

            <div className="relative z-10 max-w-3xl">
              <div
                className={`mb-8 md:mb-10 transition-all duration-700 ease-out ${
                  whyUsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">למה לבחור בנו?</h2>
                <div
                  className={`mt-4 h-1.5 rounded-full bg-gradient-to-l from-[#78BCC4] to-transparent origin-right transition-all duration-700 ease-out ${
                    whyUsInView ? 'w-28 md:w-36 opacity-100' : 'w-0 opacity-0'
                  }`}
                  style={{ transitionDelay: whyUsInView ? '120ms' : '0ms' }}
                />
              </div>

              <ul className="flex flex-col gap-3 md:gap-4 list-none p-0 m-0">
                {whyUsItems.map((item, i) => {
                  const rowDelay = 90 + i * 95;
                  const iconDelay = 115 + i * 95;
                  const IconComp = item.Icon;
                  return (
                    <li
                      key={i}
                      className={`group flex items-center gap-4 md:gap-5 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-[8px] px-4 py-3.5 md:px-5 md:py-4 transition-all duration-300 ease-out hover:border-[#78BCC4]/40 hover:bg-white/[0.08] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 ${
                        whyUsInView ? 'why-us-row-animate' : 'opacity-0'
                      }`}
                      style={whyUsInView ? { animationDelay: `${rowDelay}ms` } : undefined}
                    >
                      <div
                        className={`relative shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                          accentWhyUsIcon[item.accent]
                        } ${whyUsInView ? 'why-us-icon-animate' : 'opacity-0'}`}
                        style={whyUsInView ? { animationDelay: `${iconDelay}ms` } : undefined}
                      >
                        <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {item.kind === 'fleet' ? (
                          <WhyUsFleetGlyph className="relative z-[1]" />
                        ) : (
                          <IconComp className="w-7 h-7 md:w-8 md:h-8 relative z-[1]" />
                        )}
                      </div>
                      <p className="text-base md:text-lg font-semibold text-white leading-snug flex-1 min-w-0">
                        {item.text}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* --- יצירת קשר --- */}
      <AnimatedSection id="contact" className="bg-[#002C3E]">
        <div className="container mx-auto px-5 md:px-6 max-w-3xl">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6 md:mb-8">
            <span className="text-3xl md:text-4xl font-black text-white">צריכים תיקון?</span>
            <span className="hidden md:block text-white/20 text-2xl">|</span>
            <span className="inline-flex items-center gap-2 bg-[#78BCC4]/20 text-[#78BCC4] px-5 py-2 rounded-full text-sm md:text-base font-bold">
              <svg className="w-5 h-5 text-[#F7444E]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              1000+ לקוחות מרוצים
            </span>
          </div>
          <p className="text-lg md:text-xl text-[#78BCC4] font-semibold mb-6 text-center">
            ספר/י לנו על הבעיה ואחזור אליך בהקדם
          </p>
          <div className="bg-white/5 p-6 md:p-10 rounded-2xl border border-white/10 shadow-sm">
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
            <span className="font-display text-lg font-black tracking-tight text-[#002C3E]">
              E-TECH<span className="text-[#F7444E]">.</span>
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs md:text-sm font-medium">
            <Link to="/terms" className="hover:text-[#002C3E] transition-colors">תנאי שימוש</Link>
            <Link to="/privacy" className="hover:text-[#002C3E] transition-colors">פרטיות</Link>
            <Link to="/accessibility" className="hover:text-[#002C3E] transition-colors">נגישות</Link>
          </div>
          <div className="text-center md:text-right font-medium text-xs md:text-sm">
            © {new Date().getFullYear()} E-TECH · טכנאי אומן לכלים חשמליים
          </div>
        </div>
      </footer>
      </main>
    </>
  );
}

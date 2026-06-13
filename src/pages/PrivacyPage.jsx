import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../components/Icons.jsx';
import AccessibilityMenu from '../components/AccessibilityMenu.jsx';
import PageSeo from '../components/PageSeo.jsx';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-display text-xl md:text-2xl font-black text-[#002C3E] mb-4 pb-2 border-b border-[#002C3E]/10">
      {title}
    </h2>
    <div className="space-y-3 text-[#002C3E]/75 leading-relaxed text-base md:text-lg font-medium">
      {children}
    </div>
  </div>
);

export default function PrivacyPage() {
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageSeo
        title="מדיניות פרטיות"
        description="מדיניות הפרטיות של אתר E-TECH — איסוף מידע, עוגיות וזכויות המשתמש."
        path="/privacy"
      />
      <AccessibilityMenu stackAboveWhatsApp={false} />
      <div id="site-content" className="min-h-screen bg-[#F7F8F3] text-[#002C3E] font-sans">
      {/* Header */}
      <header className="bg-[#002C3E] py-5">
        <div className="container mx-auto px-5 md:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#78BCC4]/20 border border-[#78BCC4]/40 rounded-xl flex items-center justify-center text-[#78BCC4]">
              <Icons.Electric className="w-5 h-5" />
            </div>
            <span className="font-display text-xl font-black text-white tracking-tight">
              E-TECH<span className="text-[#F7444E]">.</span>
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            חזרה לאתר
          </Link>
        </div>
      </header>

      {/* Hero strip */}
      <div className="bg-[#002C3E] pb-10 pt-2">
        <div className="container mx-auto px-5 md:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#78BCC4]/15 border border-[#78BCC4]/25 text-[#78BCC4] text-xs font-bold mb-4">
            <Icons.Shield className="w-3.5 h-3.5" />
            מסמך משפטי
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black text-white mb-2">מדיניות פרטיות</h1>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-5 md:px-6 py-12 md:py-16 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm border border-[#002C3E]/5 p-8 md:p-12">

          <div className="mb-10">
            <h2 className="font-display text-xl md:text-2xl font-black text-[#002C3E] mb-4">מבוא</h2>
            <div className="space-y-3 text-[#002C3E]/75 leading-relaxed text-base md:text-lg font-medium">
              <p>
                הנהלת אתר [שם האתר] מכבדת את פרטיות המשתמשים באתר. מסמך זה מפרט את מדיניות הפרטיות של האתר, ומהווה
                חלק בלתי נפרד מתנאי השימוש. מטרת המדיניות היא להסביר אילו נתונים אנו אוספים, כיצד אנו משתמשים בהם,
                וכיצד אנו שומרים עליהם.
              </p>
            </div>
          </div>

          <Section title="1. איסוף מידע">
            <p>בעת השימוש באתר, עשוי להיאסף מידע עליך בשתי דרכים עיקריות:</p>
            <p>
              מידע שאתה מוסר מיוזמתך: בעת הרשמה לשירותים, יצירת קשר, ביצוע רכישה או הרשמה לניוזלטר, תידרש למסור מידע
              אישי כגון: שם מלא, כתובת דוא&quot;ל, מספר טלפון, וכתובת [הוסף/הסר פרטים לפי הצורך].
            </p>
            <p>
              מידע הנאסף באופן אוטומטי: בעת הגלישה באתר, אנו עשויים לאסוף מידע טכני וסטטיסטי שאינו מזהה אותך אישית,
              כגון: כתובת ה-IP שלך, סוג הדפדפן, העמודים בהם ביקרת, משך השהייה באתר וכו&apos;.
            </p>
          </Section>

          <Section title="2. השימוש במידע">
            <p>המידע שנאסף ישמש למטרות הבאות:</p>
            <p>כדי לספק לך את השירותים המוצעים באתר (למשל, טיפול בהזמנות).</p>
            <p>כדי ליצור עמך קשר בעת הצורך.</p>
            <p>כדי לשפר ולהעשיר את השירותים והתכנים המוצעים באתר.</p>
            <p>
              לשלוח אליך עדכונים, ניוזלטרים וחומר שיווקי (בכפוף לקבלת הסכמתך המפורשת לפי חוק התקשורת). ניתן לבטל את
              ההסכמה בכל עת.
            </p>
          </Section>

          <Section title="3. עוגיות (Cookies)">
            <p>
              האתר עושה שימוש ב&quot;עוגיות&quot; (Cookies) לצורך תפעולו השוטף והתקין, לרבות כדי לאסוף נתונים
              סטטיסטיים, לאמת פרטים, להתאים את האתר להעדפותיך האישיות ולצורכי אבטחת מידע. דפדפנים מודרניים כוללים
              אפשרות להימנע מקבלת Cookies. אם אינך יודע כיצד לעשות זאת, בדוק בקובץ העזרה של הדפדפן שבו אתה משתמש.
            </p>
          </Section>

          <Section title="4. מסירת מידע לצד שלישי">
            <p>אנו מתחייבים לא למכור, להעביר או להשכיר את המידע האישי שלך לצדדים שלישיים, למעט במקרים הבאים:</p>
            <p>כאשר הדבר נדרש לצורך אספקת השירות (למשל, העברת פרטי משלוח לחברת שליחויות).</p>
            <p>במקרה של דרישה חוקית או צו שיפוטי המורה לנו למסור את המידע.</p>
            <p>במקרה של מחלוקת משפטית בינך לבין הנהלת האתר.</p>
          </Section>

          <Section title="5. אבטחת מידע">
            <p>הנהלת האתר מיישמת מערכות ונהלים עדכניים לאבטחת מידע. בעוד שמערכות אלו מצמצמות את הסיכונים לחדירה בלתי מורשית, הן אינן מעניקות ביטחון מוחלט. לכן, הנהלת האתר אינה מתחייבת שהאתר יהיה חסין לחלוטין מפני גישה בלתי מורשית.</p>
          </Section>

          <Section title="6. זכות עיון במידע">
            <p>
              על פי חוק הגנת הפרטיות, התשמ&quot;א-1981, כל אדם זכאי לעיין במידע שעליו המוחזק במאגר מידע. אם מצאת שהמידע
              אינו נכון, שלם או מעודכן, הנך רשאי לפנות אלינו בבקשה לתקן את המידע או למוחקו בכתובת המייל:{' '}
              [כתובת המייל שלך].
            </p>
          </Section>

        </div>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/terms" className="px-5 py-2.5 rounded-xl border border-[#002C3E]/15 bg-white text-[#002C3E]/70 hover:text-[#002C3E] hover:border-[#78BCC4] font-semibold text-sm transition-all">
            תנאי שימוש
          </Link>
          <Link to="/accessibility" className="px-5 py-2.5 rounded-xl border border-[#002C3E]/15 bg-white text-[#002C3E]/70 hover:text-[#002C3E] hover:border-[#78BCC4] font-semibold text-sm transition-all">
            הצהרת נגישות
          </Link>
          <Link to="/" className="px-5 py-2.5 rounded-xl bg-[#002C3E] text-white hover:bg-[#F7444E] font-semibold text-sm transition-all">
            חזרה לאתר הראשי
          </Link>
        </div>
      </main>

      <footer className="bg-white border-t border-[#002C3E]/5 py-6 text-center text-xs text-[#002C3E]/40 font-medium">
        © {new Date().getFullYear()} E-TECH · טכנאי אומן לכלים חשמליים
      </footer>
      </div>
    </>
  );
}

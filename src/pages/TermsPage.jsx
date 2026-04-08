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

export default function TermsPage() {
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageSeo
        title="תנאי שימוש"
        description="תנאי השימוש באתר E-TECH — טכנאי קורקינטים ואופניים חשמליים בישראל."
        path="/terms"
      />
      <AccessibilityMenu stackAboveWhatsApp={false} />
      <div id="site-content" className="min-h-screen bg-[#F7F8F3] text-[#002C3E] font-sans">
      {/* Header */}
      <header className="bg-[#002C3E] py-5">
        <div className="container mx-auto px-5 md:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
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
          <h1 className="font-display text-3xl md:text-5xl font-black text-white mb-2">תנאי שימוש באתר</h1>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-5 md:px-6 py-12 md:py-16 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm border border-[#002C3E]/5 p-8 md:p-12">

          <div className="mb-10">
            <h2 className="font-display text-xl md:text-2xl font-black text-[#002C3E] mb-4">מבוא</h2>
            <div className="space-y-3 text-[#002C3E]/75 leading-relaxed text-base md:text-lg font-medium">
              <p>
                ברוכים הבאים לאתר [שם האתר] (להלן: &quot;האתר&quot;), המופעל על ידי [שם החברה/העסק] (להלן:
                &quot;הנהלת האתר&quot;).
              </p>
              <p>
                השימוש באתר, בתכנים המוצגים בו ובשירותים השונים שהוא מציע, כפוף לתנאי השימוש המפורטים להלן. גלישה
                באתר ו/או שימוש בשירותיו מהווים את הסכמתך לקבל ולנהוג על פי תנאים אלו. אם אינך מסכים לתנאי מתנאי
                השימוש, הנך מתבקש שלא לעשות כל שימוש באתר.
              </p>
            </div>
          </div>

          <Section title="1. שימוש באתר">
            <p>האתר מיועד לשימוש אישי ופרטי בלבד (או לשימוש עסקי, בהתאם לאופי האתר).</p>
            <p>אין לעשות באתר כל שימוש בלתי חוקי, פוגעני, או שימוש שעלול להזיק, להשבית או לעומס יתר על שרתי האתר.</p>
            <p>הנהלת האתר שומרת לעצמה את הזכות להשעות, לבטל או לסרב להעניק גישה לאתר לכל משתמש, על פי שיקול דעתה הבלעדי וללא הודעה מוקדמת.</p>
          </Section>

          <Section title="2. קניין רוחני">
            <p>כל זכויות היוצרים והקניין הרוחני באתר, לרבות טקסטים, עיצובים, תמונות, קוד, סמלילים (לוגו) וכל חומר אחר הכלול בו, הנם בבעלותה הבלעדית של הנהלת האתר או של צדדים שלישיים שהרשו להנהלת האתר להשתמש בהם.</p>
            <p>אין להעתיק, להפיץ, לשכפל, להציג בפומבי או למסור לצד שלישי כל חלק מן הנ"ל בלא קבלת הסכמתה המפורשת של הנהלת האתר בכתב ומראש.</p>
          </Section>

          <Section title="3. הגבלת אחריות">
            <p>התכנים והשירותים באתר ניתנים כמות שהם (As Is). הנהלת האתר אינה מתחייבת כי שירותי האתר לא יופרעו, יינתנו כסדרם או בלא הפסקות, ויהיו חסינים מפני גישה בלתי מורשית, נזקים, קלקולים, תקלות או כשלים.</p>
            <p>הנהלת האתר לא תישא בכל אחריות לנזק ישיר או עקיף, כספי או אחר, שייגרם למשתמש כתוצאה משימוש באתר או הסתמכות על המידע המופיע בו.</p>
          </Section>

          <Section title="4. שינויים בתנאי השימוש">
            <p>הנהלת האתר רשאית לעדכן את תנאי השימוש מעת לעת. תנאי השימוש המעודכנים יחייבו את המשתמש מרגע פרסומם באתר.</p>
          </Section>

          <Section title="5. סמכות שיפוט">
            <p>
              על תנאי שימוש אלו יחולו דיני מדינת ישראל. סמכות השיפוט הבלעדית בכל סכסוך הנוגע לאתר ולשימוש בו תהיה
              נתונה לבתי המשפט המוסמכים במחוז [הכנס מחוז, למשל: תל אביב / מרכז].
            </p>
          </Section>

        </div>

        {/* Nav between legal pages */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/privacy" className="px-5 py-2.5 rounded-xl border border-[#002C3E]/15 bg-white text-[#002C3E]/70 hover:text-[#002C3E] hover:border-[#78BCC4] font-semibold text-sm transition-all">
            מדיניות פרטיות
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

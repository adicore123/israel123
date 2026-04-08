import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Icons } from './Icons.jsx';
import {
  a11yClasses,
  FONT_SCALE_PERCENTS,
  isClassActive,
  resetAllAccessibility,
  setClassOnContent,
  setRootFontPercent,
} from '../lib/accessibilityMenu.js';

/**
 * FAB + פאנל זכוכית. לוגיקה ב-lib/accessibilityMenu.js.
 * @param {{ stackAboveWhatsApp?: boolean }} props
 */
export default function AccessibilityMenu({ stackAboveWhatsApp = true }) {
  const [open, setOpen] = useState(false);
  const [fontIdx, setFontIdx] = useState(0);
  const [grayscale, setGrayscale] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [readableFont, setReadableFont] = useState(false);
  const [linksHi, setLinksHi] = useState(false);

  const fabRef = useRef(null);
  const panelRef = useRef(null);
  const titleId = useId();

  const fabBottomClass = stackAboveWhatsApp ? 'bottom-24' : 'bottom-5';

  const syncFromDom = useCallback(() => {
    setGrayscale(isClassActive(a11yClasses.grayscale));
    setHighContrast(isClassActive(a11yClasses.highContrast));
    setReadableFont(isClassActive(a11yClasses.readableFont));
    setLinksHi(isClassActive(a11yClasses.linksHighlight));
  }, []);

  useEffect(() => {
    const fs = document.documentElement.style.fontSize;
    if (!fs) {
      setFontIdx(0);
      return;
    }
    const m = fs.match(/^([\d.]+)%$/);
    if (m) {
      const p = parseFloat(m[1]);
      const i = FONT_SCALE_PERCENTS.indexOf(p);
      setFontIdx(i >= 0 ? i : 0);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      const t = e.target;
      if (fabRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer, true);
    return () => document.removeEventListener('pointerdown', onPointer, true);
  }, [open]);

  const bumpFont = (delta) => {
    const next = Math.min(FONT_SCALE_PERCENTS.length - 1, Math.max(0, fontIdx + delta));
    setFontIdx(next);
    setRootFontPercent(FONT_SCALE_PERCENTS[next]);
  };

  const toggleClass = (cls, value, setState) => {
    const next = !value;
    setState(next);
    setClassOnContent(cls, next);
  };

  const onReset = () => {
    resetAllAccessibility();
    setFontIdx(0);
    setGrayscale(false);
    setHighContrast(false);
    setReadableFont(false);
    setLinksHi(false);
  };

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        className={`a11y-fab-button fixed ${fabBottomClass} left-5 z-[110] flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/40 bg-[#002C3E] text-white shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#78BCC4]`}
        aria-expanded={open}
        aria-controls="a11y-settings-panel"
        aria-haspopup="dialog"
        aria-label="פתיחת תפריט נגישות"
        onClick={() => {
          setOpen((v) => !v);
          queueMicrotask(syncFromDom);
        }}
      >
        <Icons.UniversalAccess className="h-7 w-7 shrink-0 pointer-events-none" aria-hidden />
      </button>

      <div
        id="a11y-settings-panel"
        ref={panelRef}
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-hidden={!open}
        aria-labelledby={titleId}
        className={`fixed left-5 z-[110] w-[min(20rem,calc(100vw-2.5rem))] max-h-[min(70vh,24rem)] overflow-y-auto rounded-2xl border border-white/30 bg-white/90 p-4 shadow-2xl backdrop-blur-xl transition-all duration-200 ease-out motion-reduce:transition-none ${
          stackAboveWhatsApp ? 'bottom-[11.25rem]' : 'bottom-[5.5rem]'
        } ${
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-2 scale-95 opacity-0'
        }`}
      >
        <h2 id={titleId} className="mb-3 text-lg font-black text-[#002C3E]">
          נגישות
        </h2>

        <div className="flex flex-col gap-2 text-sm font-semibold text-[#002C3E]">
          <div className="flex items-center justify-between gap-2 rounded-xl bg-[#F7F8F3] px-3 py-2">
            <span>גודל טקסט</span>
            <div className="flex gap-1">
              <button
                type="button"
                className="rounded-lg border border-[#002C3E]/20 p-2 hover:bg-white disabled:opacity-40"
                aria-label="הקטנת טקסט"
                disabled={fontIdx === 0}
                onClick={() => bumpFont(-1)}
              >
                <Icons.Minus className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                className="rounded-lg border border-[#002C3E]/20 p-2 hover:bg-white disabled:opacity-40"
                aria-label="הגדלת טקסט"
                disabled={fontIdx >= FONT_SCALE_PERCENTS.length - 1}
                onClick={() => bumpFont(1)}
              >
                <Icons.Plus className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>

          <button
            type="button"
            className="rounded-xl bg-[#F7F8F3] px-3 py-2.5 text-right hover:bg-[#e8ebe0]"
            aria-pressed={grayscale}
            onClick={() => toggleClass(a11yClasses.grayscale, grayscale, setGrayscale)}
          >
            מצב אפור
          </button>
          <button
            type="button"
            className="rounded-xl bg-[#F7F8F3] px-3 py-2.5 text-right hover:bg-[#e8ebe0]"
            aria-pressed={highContrast}
            onClick={() => toggleClass(a11yClasses.highContrast, highContrast, setHighContrast)}
          >
            ניגודיות גבוהה
          </button>
          <button
            type="button"
            className="rounded-xl bg-[#F7F8F3] px-3 py-2.5 text-right hover:bg-[#e8ebe0]"
            aria-pressed={readableFont}
            onClick={() => toggleClass(a11yClasses.readableFont, readableFont, setReadableFont)}
          >
            גופן קריא
          </button>
          <button
            type="button"
            className="rounded-xl bg-[#F7F8F3] px-3 py-2.5 text-right hover:bg-[#e8ebe0]"
            aria-pressed={linksHi}
            onClick={() => toggleClass(a11yClasses.linksHighlight, linksHi, setLinksHi)}
          >
            הדגשת קישורים
          </button>

          <button
            type="button"
            className="mt-1 rounded-xl border-2 border-[#F7444E] px-3 py-2.5 font-bold text-[#F7444E] hover:bg-[#F7444E]/10"
            onClick={onReset}
          >
            איפוס
          </button>
        </div>
      </div>
    </>
  );
}

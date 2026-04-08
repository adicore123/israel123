import { useCallback, useEffect, useMemo, useState } from 'react';

const MIN_GALLERY = 8;

function buildMarqueeStrip(photos) {
  if (!photos.length) return [];
  let base = photos;
  while (base.length < MIN_GALLERY) base = [...base, ...photos];
  return [...base, ...base];
}

/**
 * מרקיז תמונות: קישור <a> לכל תמונה (אינדוקס Google Images), Lightbox בלחיצה,
 * השהיית אנימציה ב-hover דרך .gallery-marquee-wrap ב-index.css.
 *
 * @param {{ photos: Array<{ src: string; alt: string }>; wrapClassName?: string }} props
 */
export default function WorkGalleryMarquee({ photos, wrapClassName = '' }) {
  const strip = useMemo(() => buildMarqueeStrip(photos), [photos]);
  const [lightbox, setLightbox] = useState(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, closeLightbox]);

  if (!photos.length) return null;

  return (
    <>
      <div
        className={`gallery-marquee-wrap w-full overflow-hidden py-2 md:py-4 border-y border-[#002C3E]/5 bg-[#F7F8F3]/50 ${wrapClassName}`}
        aria-label="גלריית צילומי עבודה נגללת"
      >
        <div
          className="animate-gallery-marquee flex flex-nowrap items-center gap-8 md:gap-12 w-max ps-6 md:ps-8"
          dir="ltr"
        >
          {strip.map((photo, i) => (
            <a
              key={`${photo.src}-${i}`}
              href={photo.src}
              onClick={(e) => {
                e.preventDefault();
                setLightbox({ src: photo.src, alt: photo.alt });
              }}
              className="group shrink-0 block w-[min(72vw,260px)] sm:w-64 md:w-72 aspect-[4/3] rounded-2xl border border-[#002C3E]/10 shadow-md overflow-hidden bg-[#F7F8F3] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#78BCC4]"
              aria-label={photo.alt ? `${photo.alt} — פתיחה בתצוגה מוגדלת` : 'פתיחת תמונה בתצוגה מוגדלת'}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </a>
          ))}
        </div>
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="תצוגת תמונה מוגדלת"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 end-4 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            aria-label="סגירת תצוגה מוגדלת"
          >
            סגירה
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[min(90vh,900px)] max-w-full rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}

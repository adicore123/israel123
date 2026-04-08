import { useCallback, useEffect, useState } from 'react';

/**
 * גלריית תמונות בפורמט כרטיסיות — גריד רספונסיבי.
 * כל תמונה עטופה ב-<a> לצורכי SEO, לחיצה פותחת Lightbox.
 *
 * @param {{ photos: Array<{ src: string; alt: string }>; wrapClassName?: string }} props
 */
export default function WorkGalleryCards({ photos, wrapClassName = '' }) {
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
        className={`w-full px-4 md:px-8 py-4 ${wrapClassName}`}
        aria-label="גלריית צילומי עבודה"
      >
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-6xl mx-auto">
          {photos.map((photo, i) => (
            <a
              key={`${photo.src}-${i}`}
              href={photo.src}
              onClick={(e) => {
                e.preventDefault();
                setLightbox({ src: photo.src, alt: photo.alt });
              }}
              className="group relative block w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(25%-9px)]
                aspect-[4/3] rounded-2xl overflow-hidden
                border border-[#002C3E]/10 shadow-md bg-[#F7F8F3]
                hover:shadow-xl transition-shadow duration-300
                focus-visible:outline focus-visible:outline-4
                focus-visible:outline-offset-2 focus-visible:outline-[#78BCC4]"
              aria-label={photo.alt ? `${photo.alt} — פתיחה בתצוגה מוגדלת` : 'פתיחת תמונה בתצוגה מוגדלת'}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
              {/* Overlay with alt text on hover */}
              <div className="absolute inset-0 bg-[#002C3E]/0 group-hover:bg-[#002C3E]/40 transition-colors duration-300 flex items-end p-3">
                <p className="text-white text-xs leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                  {photo.alt}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Lightbox */}
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
            סגירה ✕
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

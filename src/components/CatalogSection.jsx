import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function PlaceholderIcon() {
  return (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function CatalogSection() {
  const [data, setData] = useState({ enabled: false, products: [] });

  useEffect(() => {
    supabase
      .from('catalog_data')
      .select('enabled, products')
      .eq('id', 1)
      .single()
      .then(({ data: row }) => {
        if (row) setData(row);
      });
  }, []);

  if (!data.enabled || !data.products || data.products.length === 0) return null;

  return (
    <section className="bg-white py-24 md:py-36">
      <div className="container mx-auto px-5 md:px-6 max-w-5xl">

        {/* Header */}
        <div className="text-center mb-20 md:mb-28">
          <h2 className="text-5xl md:text-7xl font-black text-[#002C3E] tracking-tight mb-4 leading-none">
            קטלוג מוצרים
          </h2>
          <p className="text-[#002C3E]/45 text-base md:text-lg font-medium">
            מבחר מוצרים איכותיים במחירים תחרותיים
          </p>
          <div className="w-12 h-0.5 bg-[#F7444E] mx-auto mt-6" />
        </div>

        {/* Grid */}
        <div className={`grid grid-cols-1 gap-x-16 lg:gap-x-24 ${
          data.products.length === 1
            ? 'md:grid-cols-1 max-w-sm mx-auto'
            : 'md:grid-cols-2'
        }`}>
          {data.products.map((product, i) => (
            <div
              key={i}
              className={`flex flex-col gap-5 group mb-20 md:mb-32 ${
                i % 2 === 1 && data.products.length > 1 ? 'md:mt-32' : ''
              }`}
            >
              {/* Image */}
              <div className="relative aspect-[4/5] bg-[#F3F4F6] rounded-2xl overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name || 'מוצר'}
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-90"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#002C3E]/10">
                    <PlaceholderIcon />
                  </div>
                )}
              </div>

              {/* Content — slides up on hover */}
              <div className="flex flex-col gap-2.5 transition-transform duration-500 ease-out translate-y-1 group-hover:translate-y-0">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#002C3E] leading-snug flex-1">
                    {product.name || 'מוצר'}
                  </h3>
                  {product.price && (
                    <span className="text-2xl md:text-3xl font-black text-[#F7444E] whitespace-nowrap leading-snug">
                      {product.price}
                    </span>
                  )}
                </div>

                {product.description && (
                  <p className="text-base text-[#002C3E]/55 leading-relaxed">
                    {product.description}
                  </p>
                )}

                <a
                  href={`https://wa.me/972545050609?text=${encodeURIComponent(`היי ישראל, אני מעוניין במוצר: ${product.name}${product.price ? ` (${product.price})` : ''}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full bg-[#002C3E] hover:bg-[#06d6a0] text-white px-6 py-3.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon />
                  הזמן בוואטסאפ
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

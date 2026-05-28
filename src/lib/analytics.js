import { supabase } from './supabase.js';

export async function trackEvent(eventType) {
  const device = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  await supabase.from('page_events').insert({
    event_type: eventType,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
    device,
  });
}

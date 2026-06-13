import { supabase } from './supabase.js';

export async function trackEvent(eventType, pageUrl) {
  if (typeof window === 'undefined') return;
  const url = pageUrl ?? window.location.pathname;
  try {
    const userAgent = navigator.userAgent;
    const referrer = document.referrer;
    const { error } = await supabase
      .from('site_analytics')
      .insert([{ event_type: eventType, page_url: url, user_agent: userAgent, referrer }]);
    if (error) console.warn('Analytics tracking error:', error.message);
  } catch (err) {
    console.warn('Analytics tracking failed:', err);
  }
}

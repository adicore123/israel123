import { supabase } from './supabase.js';

/**
 * Tracks a site event in Supabase.
 * @param {string} eventType - 'visit', 'whatsapp_click', 'phone_click'
 * @param {string} pageUrl - The current URL path (default: current location)
 */
export async function trackEvent(eventType, pageUrl = window.location.pathname) {
  try {
    const userAgent = navigator.userAgent;
    const referrer = document.referrer;
    
    // Attempt to insert the event into Supabase
    const { error } = await supabase
      .from('site_analytics')
      .insert([
        {
          event_type: eventType,
          page_url: pageUrl,
          user_agent: userAgent,
          referrer: referrer
        }
      ]);
      
    if (error) {
      // Fail silently in production, but log to console
      console.warn('Analytics tracking error:', error.message);
    }
  } catch (err) {
    console.warn('Analytics tracking failed:', err);
  }
}

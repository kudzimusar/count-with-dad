import { useCallback } from 'react';

interface AnalyticsEvent {
  event: string;
  timestamp: string;
  data?: Record<string, any>;
}

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, data?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      event: eventName,
      timestamp: new Date().toISOString(),
      data,
    };

    // Store in localStorage for now
    try {
      const analytics = JSON.parse(localStorage.getItem('app_analytics') || '[]');
      analytics.push(event);
      
      // Keep only last 100 events to avoid storage issues
      if (analytics.length > 100) {
        analytics.shift();
      }
      
      localStorage.setItem('app_analytics', JSON.stringify(analytics));
    } catch (error) {
      console.error('Failed to track analytics:', error);
    }
  }, []);

  const getAnalytics = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('app_analytics') || '[]');
    } catch {
      return [];
    }
  }, []);

  return { trackEvent, getAnalytics };
}

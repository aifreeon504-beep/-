/**
 * TOOLVERSE External Services & Growth Infrastructure Configuration.
 * 
 * Prepared structure for future integration of Google Analytics, Google Search Console,
 * and Google AdSense without cluttering the current launch codebase.
 */

export interface IntegrationsConfig {
  analytics: {
    enabled: boolean;
    googleAnalyticsId?: string; // e.g. 'G-XXXXXXXXXX'
  };
  searchConsole: {
    enabled: boolean;
    verificationToken?: string; // e.g. google-site-verification token
  };
  adsense: {
    enabled: boolean;
    publisherId?: string; // e.g. 'ca-pub-XXXXXXXXXXXXXXXX'
  };
}

export const integrationsConfig: IntegrationsConfig = {
  analytics: {
    enabled: false,
    googleAnalyticsId: ''
  },
  searchConsole: {
    enabled: false,
    verificationToken: ''
  },
  adsense: {
    enabled: false,
    publisherId: ''
  }
};

/**
 * Initializes Google Analytics if configured and enabled.
 * Call this when googleAnalyticsId is provided.
 */
export function initGoogleAnalytics() {
  if (!integrationsConfig.analytics.enabled || !integrationsConfig.analytics.googleAnalyticsId) {
    return;
  }
  // Future implementation hook:
  // Dynamically injects gtag.js
}

/**
 * Tracks page views for future analytics integration.
 */
export function trackPageView(path: string) {
  if (!integrationsConfig.analytics.enabled) return;
  // Future hook: window.gtag?.('event', 'page_view', { page_path: path });
}

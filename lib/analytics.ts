// Safe multi-pixel event tracking helper

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    lintrk?: (action: string, data?: any) => void;
    dataLayer?: any[];
    _linkedin_partner_id?: string;
  }
}

export type ConversionAction =
  | "whatsapp_click"
  | "proposal_submit"
  | "gmail_dispatch"
  | "linkedin_click"
  | "portfolio_launch"
  | "contact_copy";

export function trackEvent(
  eventName: ConversionAction | string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return;

  try {
    // 1. Google Analytics 4 (GA4)
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }

    // 2. Meta Pixel (Facebook)
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", eventName, params);
    }

    // 3. LinkedIn Insight Tag
    if (typeof window.lintrk === "function") {
      window.lintrk("track", { conversion_id: eventName, ...params });
    }

    // Development logger
    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics Event Tracked] ${eventName}:`, params);
    }
  } catch (error) {
    console.warn("[Analytics Error]", error);
  }
}

/**
 * Everything revenue/analytics related is switched on by environment
 * variables set in Netlify (Site configuration → Environment variables).
 * Nothing is loaded — and no empty "Reklam" boxes are shown — until the
 * matching ID exists, so the site is clean before approval and ready after.
 *
 *   PUBLIC_ADSENSE_CLIENT        ca-pub-XXXXXXXXXXXXXXXX
 *   PUBLIC_ADSENSE_SLOT          default display ad unit slot id (responsive)
 *   PUBLIC_ADSENSE_SLOT_INARTICLE / _SIDEBAR / _LEADERBOARD  optional per-placement slots
 *   PUBLIC_GA_ID                 G-XXXXXXXXXX (Google Analytics 4)
 *   PUBLIC_GOOGLE_SITE_VERIFICATION / PUBLIC_BING_SITE_VERIFICATION / PUBLIC_YANDEX_VERIFICATION
 *   PUBLIC_BOOKING_AID           Booking.com affiliate id
 *   PUBLIC_TRAVELPAYOUTS_MARKER  Travelpayouts marker (flights / hotels / car rental)
 *   PUBLIC_OBILET_PARTNER        oBilet partner/affiliate parameter (optional)
 *   PUBLIC_CONSENT_BANNER=off    disable the built-in banner (e.g. when using Google's CMP)
 */
const env = import.meta.env;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export const monetization = {
  adsenseClient: clean(env.PUBLIC_ADSENSE_CLIENT),
  adSlots: {
    default: clean(env.PUBLIC_ADSENSE_SLOT),
    "in-article": clean(env.PUBLIC_ADSENSE_SLOT_INARTICLE),
    sidebar: clean(env.PUBLIC_ADSENSE_SLOT_SIDEBAR),
    leaderboard: clean(env.PUBLIC_ADSENSE_SLOT_LEADERBOARD),
  } as Record<string, string>,
  gaId: clean(env.PUBLIC_GA_ID),
  verification: {
    google: clean(env.PUBLIC_GOOGLE_SITE_VERIFICATION),
    bing: clean(env.PUBLIC_BING_SITE_VERIFICATION),
    yandex: clean(env.PUBLIC_YANDEX_VERIFICATION),
  },
  affiliate: {
    bookingAid: clean(env.PUBLIC_BOOKING_AID),
    travelpayoutsMarker: clean(env.PUBLIC_TRAVELPAYOUTS_MARKER),
    obiletPartner: clean(env.PUBLIC_OBILET_PARTNER),
  },
  consentBanner: clean(env.PUBLIC_CONSENT_BANNER) !== "off",
};

export const adsEnabled = Boolean(monetization.adsenseClient);
export const needsConsent =
  monetization.consentBanner && (adsEnabled || Boolean(monetization.gaId));

/** "ca-pub-123" → "pub-123" for ads.txt */
export function adsensePublisherId(): string {
  return monetization.adsenseClient.replace(/^ca-/, "");
}

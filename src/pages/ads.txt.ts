import type { APIRoute } from "astro";
import { adsEnabled, adsensePublisherId } from "@/config/monetization";

/**
 * ads.txt — authorises Google to sell ad space on this domain. Generated from
 * PUBLIC_ADSENSE_CLIENT so it can never go out of sync with the ad code.
 */
export const GET: APIRoute = () => {
  const body = adsEnabled
    ? `google.com, ${adsensePublisherId()}, DIRECT, f08c47fec0942fa0\n`
    : "# ads.txt — AdSense yayıncı kimliği tanımlandığında otomatik doldurulur.\n";
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

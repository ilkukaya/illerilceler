import type { APIRoute } from "astro";
import { districtRecords } from "@/utils/openData";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(districtRecords(), null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

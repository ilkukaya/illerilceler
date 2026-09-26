import type { APIRoute } from "astro";
import { provinceRecords } from "@/utils/openData";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(provinceRecords(), null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

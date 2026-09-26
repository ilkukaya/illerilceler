import type { APIRoute } from "astro";
import { provinceRecords, toCsv } from "@/utils/openData";

export const GET: APIRoute = () =>
  new Response(toCsv(provinceRecords()), {
    headers: { "Content-Type": "text/csv; charset=utf-8" },
  });

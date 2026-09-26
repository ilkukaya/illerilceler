import type { APIRoute } from "astro";
import { districtRecords, toCsv } from "@/utils/openData";

export const GET: APIRoute = () =>
  new Response(toCsv(districtRecords()), {
    headers: { "Content-Type": "text/csv; charset=utf-8" },
  });

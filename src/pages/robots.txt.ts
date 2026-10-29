import type { APIRoute } from "astro";
import { sitePath } from "../lib/site";

export const GET: APIRoute = ({ site }) => new Response(
  `User-agent: *\nAllow: /\nDisallow: ${sitePath("/update/")}\nSitemap: ${new URL(sitePath("/sitemap-index.xml"), site).href}\n`,
  { headers: { "Content-Type": "text/plain; charset=utf-8" } },
);

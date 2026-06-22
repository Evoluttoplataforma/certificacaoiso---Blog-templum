import { getCollection } from "astro:content";
export async function GET() {
  const posts = (await getCollection("blog")).filter((p) => !p.data.draft)
    .sort((a, b) => +new Date(b.data.pubDate) - +new Date(a.data.pubDate));
  const idx = posts.map((p) => ({
    t: p.data.title, s: p.slug, c: (p.data.categories || [])[0] || "",
    d: p.data.description || "", img: p.data.heroImage || "",
  }));
  return new Response(JSON.stringify(idx), { headers: { "content-type": "application/json" } });
}

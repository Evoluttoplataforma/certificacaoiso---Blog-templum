import rss from "@astrojs/rss";
import { getAllPosts } from "../lib/posts.js";
export async function GET(context) {
  const posts = (await getAllPosts())
    .sort((a, b) => +new Date(b.data.pubDate) - +new Date(a.data.pubDate));
  return rss({
    title: "Certificação ISO",
    description: "Dicas para implementação e certificação nas normas ISO.",
    site: context.site,
    items: posts.slice(0, 50).map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/${p.slug}/`,
      categories: p.data.categories,
      author: p.data.author,
      customData: p.data.heroImage ? `<enclosure url="${p.data.heroImage}" type="image/jpeg" />` : "",
    })),
  });
}

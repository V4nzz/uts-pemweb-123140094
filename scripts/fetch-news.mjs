import "dotenv/config";
import { writeFile } from "fs/promises";

const API_KEY = process.env.NEWS_API_KEY || "4e7e3bac67ca4971aa2d383fc28bdb35";

// 3 kategori utama
const CATEGORIES = [
  { key: "technology", q: "technology OR AI OR software" },
  { key: "sports",     q: "sports OR football OR soccer OR basketball" },
  { key: "business",   q: "business OR economy OR finance" },
];

// bahasa: tambah/kurangi sesuai kebutuhan
const LANGUAGES = ["en", "id"]; 

// NewsAPI free: max 100 hasil TOTAL per kombinasi query+language.
// Jadi kita ambil 1 halaman x 100 per (kategori, bahasa) → cukup 50–100+ artikel gabungan.
const PAGE_SIZE = 100;
const SORT_BY = "publishedAt";   // atau "popularity"

// (opsional) batasi ke 30 hari terakhir agar relevan
const DAYS_BACK = 30;
function isoDaysBack(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 19) + "Z";
}

async function fetchBucket(q, language) {
  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", q);
  url.searchParams.set("language", language);
  url.searchParams.set("pageSize", String(PAGE_SIZE));
  url.searchParams.set("sortBy", SORT_BY);
  if (DAYS_BACK) url.searchParams.set("from", isoDaysBack(DAYS_BACK));

  const res = await fetch(url, { headers: { "X-Api-Key": API_KEY } });
  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ ${language} ${q} ->`, text);
    return [];
  }
  const data = await res.json();
  return data.articles || [];
}

function dedupe(articles) {
  const seen = new Set();
  const out = [];
  for (const a of articles) {
    const key = (a.url || "").toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(a);
    }
  }
  return out;
}

async function main() {
  let all = [];

  for (const { key, q } of CATEGORIES) {
    for (const lang of LANGUAGES) {
      console.log(`▶ Fetching ${key} lang=${lang}`);
      const items = await fetchBucket(q, lang);
      // tag kategori pada setiap artikel
      for (const it of items) it.category = key;
      all = all.concat(items);
      await new Promise(r => setTimeout(r, 800)); // kecilkan spike request
    }
  }

  const merged = dedupe(all).sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  const payload = { status: "ok", totalResults: merged.length, articles: merged };

  await writeFile("./public/news-cache.json", JSON.stringify(payload, null, 2), "utf-8");
  console.log(`💾 Saved ${merged.length} items → public/news-cache.json`);
}

main().catch(e => { console.error(e); process.exit(1); });

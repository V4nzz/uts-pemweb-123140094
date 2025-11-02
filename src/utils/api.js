// src/utils/api.js
// Membaca data statis dari /public/news-cache.json lalu filter & paginate

let __CACHE = null;

// util normalisasi string
const norm = (v) => (v || "").toString().toLowerCase().trim();

// util parse tanggal aman
const toDate = (v) => (v ? new Date(v) : null);

export async function fetchArticles({
  keyword = "",
  category = "all",      // 'all' | 'technology' | 'business' | 'sports'
  from = "",
  to = "",
  page = 1,
  pageSize = 12,
}) {
  // 1) Lazy-load cache sekali
  if (!__CACHE) {
    // BASE_URL = "/" saat production Vite
    const cacheUrl = `${import.meta.env.BASE_URL}news-cache.json?ts=${Date.now()}`;
    const res = await fetch(cacheUrl);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Gagal baca news-cache.json (${res.status}) ${text}`);
    }
    const json = await res.json();
    // Bentuk data bisa array langsung atau {articles: []}
    __CACHE = Array.isArray(json) ? json : (json.articles || []);
  }

  // 2) Clone & sort desc by publishedAt
  let list = [...__CACHE].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  // 3) Filter kategori
  // Jika artikel TIDAK punya field 'category', kita fallback:
  // - kalau category != 'all', kita treat category sebagai keyword tambahan.
  if (category && category !== "all") {
    const c = norm(category);
    list = list.filter((a) => {
      const artCat = norm(a.category);
      if (artCat) return artCat === c;
      // fallback → periksa di title/description/source
      const hay = `${a.title} ${a.description} ${a.source?.name}`.toLowerCase();
      return hay.includes(c);
    });
  }

  // 4) Filter keyword (judul/desc/source)
  if (keyword && norm(keyword)) {
    const q = norm(keyword);
    list = list.filter((a) =>
      norm(a.title).includes(q) ||
      norm(a.description).includes(q) ||
      norm(a.source?.name).includes(q)
    );
  }

  // 5) Filter tanggal (inclusive)
  const dFrom = from ? toDate(from) : null;
  const dTo   = to   ? toDate(to)   : null;

  if (dFrom) list = list.filter((a) => new Date(a.publishedAt) >= dFrom);
  if (dTo)   list = list.filter((a) => new Date(a.publishedAt) <= dTo);

  // 6) Pagination
  const total = list.length;
  const p = Math.max(1, Number(page) || 1);
  const size = Math.max(1, Number(pageSize) || 12);
  const start = (p - 1) * size;
  const end = start + size;

  const articles = list.slice(start, end);

  return { total, articles };
}

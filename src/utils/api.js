// src/utils/api.js

const ENV_USE_MOCK =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_USE_MOCK === "true") ||
  (typeof process !== "undefined" && process.env?.VITE_USE_MOCK === "true");

let STATIC_AVAILABLE = null;     // null = belum dicek; true/false setelah cek
let STATIC_PAYLOAD_P = null;     // promise cache untuk news-cache.json

async function loadStaticOnce() {
  if (!STATIC_PAYLOAD_P) {
    STATIC_PAYLOAD_P = fetch("/news-cache.json").then(async (r) => {
      if (!r.ok) throw new Error(`STATIC_NOT_FOUND:${r.status}`);
      return r.json();
    });
  }
  return STATIC_PAYLOAD_P;
}

function startOfDayUTC(ymd){ const [y,m,d]=ymd.split("-").map(Number); return Date.UTC(y,(m||1)-1,d||1,0,0,0,0); }
function endOfDayUTC(ymd){ const [y,m,d]=ymd.split("-").map(Number); return Date.UTC(y,(m||1)-1,d||1,23,59,59,999); }

function applyFilters(articles, { keyword = "", from = "", to = "", category = "" }) {
    let out = [...articles];
  
    // keyword (tetap seperti sebelumnya)
    if (keyword) {
      const q = keyword.toLowerCase();
      out = out.filter((a) =>
        (a.title || "").toLowerCase().includes(q) ||
        (a.description || "").toLowerCase().includes(q) ||
        (a.content || "").toLowerCase().includes(q) ||
        (a.author || "").toLowerCase().includes(q) ||
        (a.source?.name || "").toLowerCase().includes(q)
      );
    }
  
    // tanggal (UTC) — tetap seperti versi perbaikanmu
  
    // === kategori: sekarang exact match ke a.category yang diset dari fetch script ===
    if (category) {
      out = out.filter((a) => (a.category || "").toLowerCase() === category.toLowerCase());
    }
  
    out.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return out;
  }  

export async function fetchArticles(params = {}) {
  const {
    page = 1,
    pageSize = 12,
    keyword = "",
    category = "",
    from = "",
    to = ""
  } = params;

  // 1) Coba STATIC lebih dulu jika VITE_USE_MOCK=true atau belum pernah dicek
  if (ENV_USE_MOCK || STATIC_AVAILABLE !== false) {
    try {
      const payload = await loadStaticOnce(); // { status, totalResults, articles }
      STATIC_AVAILABLE = true;
      const filtered = applyFilters(payload.articles || [], { keyword, from, to, category });
      const total = filtered.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return { articles: filtered.slice(start, end), total };
    } catch (e) {
      // Jika file tidak ada, tandai tidak tersedia dan lanjut ke live
      if (String(e.message || "").startsWith("STATIC_NOT_FOUND")) {
        STATIC_AVAILABLE = false;
      } else {
        // error baca file statis selain 404 → teruskan
        throw e;
      }
    }
  }

  // 2) Fallback LIVE (gunakan header, bukan query apikey)
  const key = import.meta.env?.VITE_NEWS_API_KEY;
  if (!key) {
    // Beri pesan yang jelas di UI agar tidak terlihat "401" misterius
    throw new Error(
      "NewsAPI LIVE mode membutuhkan VITE_NEWS_API_KEY di .env atau aktifkan VITE_USE_MOCK=true"
    );
  }

  const url = new URL("https://newsapi.org/v2/top-headlines");
  // Sesuaikan negara default
  url.searchParams.set("country", import.meta.env?.VITE_NEWS_COUNTRY || "id");
  if (category) url.searchParams.set("category", category);
  if (keyword) url.searchParams.set("q", keyword);
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(pageSize));

  const res = await fetch(url, { headers: { "X-Api-Key": key } });

  if (!res.ok) {
    // Tampilkan pesan error aslinya agar mudah diagnosa
    let detail = "";
    try { detail = await res.text(); } catch {}
    throw new Error(`NewsAPI HTTP ${res.status}${detail ? ` – ${detail}` : ""}`);
  }

  const data = await res.json();
  return {
    articles: data.articles ?? [],
    total: data.totalResults ?? 0
  };
}

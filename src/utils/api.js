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

// src/utils/api.js
export async function fetchArticles({ keyword, category, from, to, page, pageSize }) {
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (category) params.set("category", category);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (page) params.set("page", page);
    if (pageSize) params.set("pageSize", pageSize);
  
    const r = await fetch(`/api/news?${params.toString()}`);
    if (!r.ok) {
      let errText = "";
      try { errText = await r.text(); } catch {}
      throw new Error(`NewsAPI HTTP ${r.status} – ${errText || r.statusText}`);
    }
    const json = await r.json();
    return {
      total: json.totalResults || 0,
      articles: json.articles || [],
    };
  }  

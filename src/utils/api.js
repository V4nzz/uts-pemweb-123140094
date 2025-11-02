async function loadCache() {
    const res = await fetch('/news-cache.json');
    if (!res.ok) throw new Error('Cache JSON tidak ditemukan.');
    return res.json();
  }
  
  function filterAndPaginate(cache, { q, category='technology', from, to, page=1, pageSize=12 } = {}) {
    const qLower = (q || '').toLowerCase();
    const fromTime = from ? new Date(from).getTime() : null;
    const toTime = to ? new Date(to).getTime() : null;
  
    let data = (cache.articles || []).filter(a => (a.__category || 'technology') === category);
  
    if (qLower) {
      data = data.filter(a => `${a.title} ${a.description ?? ''} ${a.content ?? ''}`.toLowerCase().includes(qLower));
    }
    if (fromTime || toTime) {
      data = data.filter(a => {
        const t = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        if (fromTime && t < fromTime) return false;
        if (toTime && t > toTime) return false;
        return true;
      });
    }
    data.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  
    const totalResults = data.length;
    const start = (page - 1) * pageSize;
    const articles = data.slice(start, start + pageSize);
    return { status: 'ok', totalResults, articles };
  }
  
  export async function fetchArticles(params = {}) {
    const cache = await loadCache();
    return filterAndPaginate(cache, params);
  }
  

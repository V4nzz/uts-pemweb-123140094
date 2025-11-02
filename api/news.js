export default async function handler(req, res) {
    const {
      q = "",
      from = "",
      to = "",
      page = "1",
      pageSize = "12",
      category = "",
      language = "en",
    } = req.query;
  
    const params = new URLSearchParams({
      q: q || "news",
      page,
      pageSize,
      language,
    });
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (category) params.set("q", (q ? `${category} ${q}` : category));
  
    const url = `https://newsapi.org/v2/everything?${params.toString()}`;
  
    try {
      const r = await fetch(url, {
        headers: { "X-Api-Key": process.env.NEWSAPI_KEY }, // <-- API Key aman di env Vercel
      });
  
      const data = await r.json();
      res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
      res.status(r.status).json(data);
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
    }
  }
  
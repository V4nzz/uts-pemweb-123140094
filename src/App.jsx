import { useEffect, useState } from "react";
import Header from "./components/Header";
import SearchForm from "./components/SearchForm";
import DataTable from "./components/DataTable";
import { fetchArticles } from "./utils/api";
import "./App.css";

export default function App() {
  const [category, setCategory] = useState("technology");
  const [keyword, setKeyword]   = useState("");

  // ⬇️ state baru langkah 6
  const [from, setFrom]         = useState("");
  const [to, setTo]             = useState("");
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // ⬇️ ubah: load menerima param pagination & filter
  async function load(reset = false) {
    setLoading(true); setError("");
    try {
      const data = await fetchArticles({ q: keyword, category, from, to, page, pageSize });
      setTotal(data.totalResults || 0);
      setArticles(prev => (reset ? data.articles : [...prev, ...data.articles]));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // ketika kategori berubah → reset page & muat baru
  useEffect(() => { setPage(1); load(true); /* eslint-disable-next-line */ }, [category]);

  // pagination: saat page bertambah, ambil halaman berikutnya
  useEffect(() => { if (page > 1) load(false); /* eslint-disable-next-line */ }, [page]);

  // submit dari SearchForm
  function handleSearch({ q, from, to, size }) {
    setKeyword(q);
    setFrom(from);
    setTo(to);
    setPageSize(size);
    setPage(1);
    load(true);
  }

  const hasMore = articles.length < total;

  return (
    <div className="container">
      <Header active={category} onChange={setCategory} />
      <SearchForm
        defaultQ={keyword}
        defaults={{ from, to, size: pageSize }}
        onSubmit={handleSearch}
      />

      {error && <div style={{ color: "crimson" }}>Error: {error}</div>}
      {loading && articles.length === 0 && <p>Memuat berita…</p>}

      {!loading && <DataTable articles={articles} />}

      {/* tombol Load More */}
      {!loading && hasMore && (
        <p style={{ textAlign: "center" }}>
          <button className="tab" onClick={() => setPage((p) => p + 1)}>Load More</button>
        </p>
      )}
    </div>
  );
}

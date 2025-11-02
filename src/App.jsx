import { useEffect, useState, useCallback } from "react";
import Header from "./components/Header";
import SearchForm from "./components/SearchForm";
import DataTable from "./components/DataTable";
import { fetchArticles } from "./utils/api";
import "./App.css";
import LoadingSkeleton from "./components/LoadingSkeleton";
import ErrorBanner from "./components/ErrorBanner";
import LoadMoreSentinel from "./components/LoadMoreSentinel";

export default function App() {
  // kosongkan kategori default supaya tidak menghabisi hasil dari cache "everything"
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoadMore = useCallback(() => setPage((p) => p + 1), []);

  async function load(reset = false) {
    setLoading(true);
    setError("");
    try {
      const data = await fetchArticles({ keyword, category, from, to, page, pageSize });
      setTotal(data.total || 0);
      setArticles((prev) => (reset ? data.articles : [...prev, ...data.articles]));
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  // Reset nomor halaman saat filter berubah (keyword, tanggal, size, kategori)
  useEffect(() => {
    setPage(1);
  }, [keyword, from, to, pageSize, category]);

  // Muat ulang data ketika filter berubah (pakai nilai state terbaru)
  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, from, to, pageSize, category]);

  // Pagination: ketika page bertambah, ambil halaman berikutnya
  useEffect(() => {
    if (page > 1) load(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Submit dari SearchForm
  function handleSearch({ q, from, to, size }) {
    setKeyword(q);
    setFrom(from);
    setTo(to);
    setPageSize(size);
    // tidak memanggil load() di sini; biarkan useEffect yang menangani
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

      <ErrorBanner message={error} onRetry={() => { setPage(1); load(true); }} />

      {loading && articles.length === 0 ? (
        <LoadingSkeleton />
      ) : (
        <DataTable articles={articles} />
      )}

      {!loading && hasMore && (
        <p style={{ textAlign: "center" }}>
          <button className="tab" disabled={loading || !hasMore} onClick={handleLoadMore}>
            {loading ? "Loading..." : "Load More"}
          </button>
        </p>
      )}

      {!loading && hasMore && (
        <LoadMoreSentinel disabled={!hasMore} onLoadMore={handleLoadMore} />
      )}
    </div>
  );
}

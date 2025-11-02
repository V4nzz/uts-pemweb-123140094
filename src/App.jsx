import { useEffect, useState } from "react";
import Header from "./components/Header";
import SearchForm from "./components/SearchForm";
import DataTable from "./components/DataTable";
import { fetchArticles } from "./utils/api";
import "./App.css";

export default function App() {
  const [category, setCategory] = useState("technology");
  const [keyword, setKeyword] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const data = await fetchArticles({ q: keyword, category, page: 1, pageSize: 12 });
      setArticles(data.articles || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [category]);
  useEffect(() => { /* hanya cari ketika submit */ }, []);

  return (
    <div className="container">
      <Header active={category} onChange={setCategory} />
      <SearchForm defaultQ={keyword} onSubmit={({ q }) => { setKeyword(q); load(); }} />

      {error && <div style={{color:'crimson'}}>Error: {error}</div>}
      {loading && <p>Memuat berita…</p>}
      {!loading && <DataTable articles={articles} />}
    </div>
  );
}

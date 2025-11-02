import { useId, useState } from "react";

export default function SearchForm({ defaultQ = "", onSubmit }) {
  const [q, setQ] = useState(defaultQ);
  const idQ = useId();

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ q });
  }

  return (
    <form onSubmit={handleSubmit} className="search">
      <label htmlFor={idQ}>Keyword</label>
      <input id={idQ} type="text" placeholder="cari berita…" value={q} onChange={e=>setQ(e.target.value)} />
      <button type="submit">Cari</button>
    </form>
  );
}

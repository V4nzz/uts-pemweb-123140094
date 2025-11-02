import { useId, useState } from "react";

export default function SearchForm({ defaultQ = "", defaults = {}, onSubmit }) {
  const [q, setQ] = useState(defaultQ);
  const [from, setFrom] = useState(defaults.from || "");
  const [to, setTo] = useState(defaults.to || "");
  const [size, setSize] = useState(defaults.size || 12);

  const idQ = useId(), idF = useId(), idT = useId(), idS = useId();

  function handleSubmit(e) {
    e.preventDefault();
    if (from && to && new Date(from) > new Date(to)) {
      alert("From harus ≤ To");
      return;
    }
    onSubmit({ q, from, to, size: Number(size) });
  }

  return (
    <form onSubmit={handleSubmit} className="search">
      <label htmlFor={idQ}>Keyword</label>
      <input id={idQ} value={q} placeholder="cari berita…" onChange={(e) => setQ(e.target.value)} />

      <input id={idF} type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
      <input id={idT} type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
      <input id={idS} type="number" min="5" max="50" value={size} onChange={(e) => setSize(e.target.value)} />

      <button type="submit">Cari</button>
    </form>
  );
}

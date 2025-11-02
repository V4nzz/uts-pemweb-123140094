import { useState } from "react";

export default function SearchForm({ defaultQ = "", defaults = {}, onSubmit }) {
  const [q, setQ] = useState(defaultQ || "");
  const [from, setFrom] = useState(defaults.from || "");
  const [to, setTo] = useState(defaults.to || "");
  const [size, setSize] = useState(defaults.size || 12);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.({ q, from, to, size: Number(size) || 12 });
  }
  function handleReset() {
    setQ("");
    setFrom("");
    setTo("");
    setSize(12);
    onSubmit?.({ q: "", from: "", to: "", size: 12 });
  }

  return (
    <div className="search-form-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Cari artikel berdasarkan keyword..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="date-input-group">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div className="date-input-group">
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div className="date-input-group">
          <input
            type="number"
            min="1"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </div>

        <button type="submit">Cari</button>
        <button type="button" className="clear-all-btn" onClick={handleReset}>
          Reset
        </button>
      </form>
    </div>
  );
}

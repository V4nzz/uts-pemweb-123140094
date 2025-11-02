const TABS = [
    { key: 'technology', label: 'Technology' },
    { key: 'business', label: 'Business' },
    { key: 'sports', label: 'Sports' },
  ];
  
  export default function Header({ active, onChange }) {
    return (
      <header className="site-header">
        <h1 className="brand">News Portal</h1>
        <nav className="navbar" aria-label="Kategori berita">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`tab ${active === t.key ? 'active' : ''}`}
              onClick={() => onChange(t.key)}
              aria-pressed={active === t.key}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
    );
  }

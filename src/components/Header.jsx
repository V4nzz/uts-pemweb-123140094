const TABS = [
    { key: 'technology', label: 'Technology' },
    { key: 'business', label: 'Business' },
    { key: 'sports', label: 'Sports' },
  ];
  
  export default function Header({ active = "", onChange }) {
    const tabs = [
      { key: "", label: "All" },
      { key: "technology", label: "Technology" },
      { key: "business", label: "Business" },
      { key: "sports", label: "Sports" },
    ];
  
    return (
      <header className="header">
        <h1>News Portal</h1>
        <nav className="navbar">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`nav-item ${active === t.key ? "active" : ""}`}
              onClick={() => onChange(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
    );
  }          

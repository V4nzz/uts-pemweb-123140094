export default function LoadingSkeleton({ count = 6 }) {
    return (
      <section className="skeleton-list" aria-busy="true" aria-label="Loading">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card" style={{ opacity: 0.6 }}>
            <div style={{ height: 180, background: '#eee' }} />
            <div style={{ padding: '14px 16px 16px' }}>
              <div style={{ height: 12, background: '#e6e6e6', margin: 8 }} />
              <div style={{ height: 12, background: '#e6e6e6', width: '70%', margin: 8 }} />
            </div>
          </div>
        ))}
      </section>
    );
  }  

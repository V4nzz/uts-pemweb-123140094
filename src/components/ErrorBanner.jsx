export default function ErrorBanner({ message, onRetry }) {
    if (!message) return null;
    return (
      <div role="alert" style={{background:'#ffe6e9',border:'1px solid #ffb3be',padding:12,borderRadius:8,margin:'12px 0'}}>
        <span>Terjadi kesalahan: {message}</span>
        {onRetry && <button onClick={onRetry} style={{marginLeft:12}}>Coba lagi</button>}
      </div>
    );
  }  

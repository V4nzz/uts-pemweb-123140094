import DetailCard from "./DetailCard";

export default function DataTable({ articles = [] }) {
  if (!articles.length) {
    return (
      <div className="status-message">
        Tidak ada artikel untuk ditampilkan.
      </div>
    );
  }

  return (
    <section className="articles-list">
      {articles.map((item, i) => (
        <DetailCard key={item.url || i} item={item} />
      ))}
    </section>
  );
}

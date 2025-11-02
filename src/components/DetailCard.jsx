export default function DetailCard({ item = {} }) {
    const {
      title = "Untitled",
      description = "",
      source,
      url,
      urlToImage,
      publishedAt,
    } = item;
  
    const date = publishedAt
      ? new Date(publishedAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";
  
    return (
      <a className="article-card" href={url} target="_blank" rel="noreferrer">
        <div className="card-image-container">
          {urlToImage ? (
            <img
              className="card-image"
              src={urlToImage}
              alt={title}
              onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=No+Image")}
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>
  
        <div className="card-content">
          <h3 title={title}>
            {title.length > 90 ? title.slice(0, 90) + "..." : title}
          </h3>
  
          <div className="card-source-date">
            <strong>{source?.name || "Unknown"}</strong> • {date}
          </div>
  
          <p className="card-description">
            {description
              ? description.length > 140
                ? description.slice(0, 140) + "..."
                : description
              : "Read full story →"}
          </p>
        </div>
      </a>
    );
  }  

export default function EntryCard({
  title,
  description,
  contributor,
  place,
  photo,
  accent = "var(--yellow)",
  variant = "summary", // "summary" = list card, "detail" = opened entry
  status = null, // "pending" | "published" | "returned" (optional)
  statusLabel = null, // the words shown in the pill (optional)
}) {
  const isDetail = variant === "detail";

  const styles = {
    card: {
      padding: 28,
      backgroundColor: "var(--surface)",
      border: "3px solid var(--surface-border)",
      borderRadius: 40,
      boxShadow: `0 8px 0 ${accent}`,
      color: "var(--text)",
    },
    media: {
      display: "block",
      width: "100%",
      aspectRatio: "2 / 1",
      objectFit: "cover",
      borderRadius: 28,
      backgroundColor: "var(--placeholder)",
    },
    label: {
      fontSize: 18,
      fontWeight: 500,
      margin: 0,
    },
    title: {
      fontSize: 26,
      fontWeight: 800,
      lineHeight: 1.2,
      margin: "6px 0 16px",
    },
    value: {
      fontSize: 18,
      fontWeight: 700,
      lineHeight: 1.6,
      margin: "6px 0 24px",
    },
    viewRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: statusLabel ? "space-between" : "flex-end",
    },
  };

  // Real photo if there is one, otherwise the gray placeholder block
  const media = photo ? (
    <img src={photo} alt={title} loading="lazy" style={styles.media} />
  ) : (
    <div style={styles.media} aria-hidden="true" />
  );

  if (!isDetail) {
    return (
      <div style={styles.card}>
        <div style={{ marginBottom: 20 }}>{media}</div>
        <p style={styles.label}>Slang</p>
        <p style={styles.title}>{title}</p>
        <div style={styles.viewRow}>
          <span className="view-detail">view detail</span>
          {statusLabel && (
            <span className={`status-pill status-${status}`}>{statusLabel}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <p style={styles.label}>Slang</p>
      <p style={styles.title}>{title}</p>

      <p style={styles.label}>Description</p>
      <p style={styles.value}>{description}</p>

      <p style={styles.label}>Contributor</p>
      <p style={styles.value}>{contributor}</p>

      <p style={styles.label}>Place</p>
      <p style={styles.value}>{place}</p>

      <div style={{ marginTop: 8 }}>{media}</div>
    </div>
  );
}
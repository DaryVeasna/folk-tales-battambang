export default function EntryCard({ title, description, contributor, place }) {
  const styles = {
    card: {
      marginTop: 32,
      padding: 24,
      backgroundColor: "#1C222C",
      border: "1px solid #2E3644",
      borderRadius: 10,
    },
    label: {
      fontFamily: "'Courier New', monospace",
      fontSize: 12,
      color: "#97A1B3",
      margin: 0,
    },
    value: {
      fontSize: 16,
      margin: "6px 0 0",
    },
    titleValue: {
      fontSize: 20,
      fontWeight: 600,
      margin: "6px 0 12px",
    },
  };

  return (
    <div style={styles.card}>
      <p style={styles.label}>TITLE</p>
      <p style={styles.titleValue}>{title}</p>

      <p style={styles.label}>DESCRIPTION</p>
      <p style={styles.value}>{description}</p>

      <p style={styles.label}>CONTRIBUTOR</p>
      <p style={styles.value}>{contributor}</p>

      <p style={styles.label}>PLACE</p>
      <p style={styles.value}>{place}</p>
    </div>
  );
}

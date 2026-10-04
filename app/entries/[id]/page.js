import Link from "next/link";
import { notFound } from "next/navigation";
import EntryCard from "../../../components/EntryCard";
import entries from "../../../data/entries";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  },
};

export default async function Page({ params }) {
  const { id } = await params;
  const entry = entries.find((e) => e.id === Number(id));

  if (!entry) {
    notFound();
  }

  return (
    <div style={styles.wrap}>
      <Link href="/">
        <span>← Back</span>
      </Link>
      <EntryCard
        title={entry.title}
        description={entry.description}
        contributor={entry.contributor}
        place={entry.place}
      />
    </div>
  );
}
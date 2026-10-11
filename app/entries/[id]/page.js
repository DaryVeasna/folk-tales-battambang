import Link from "next/link";
import { notFound } from "next/navigation";
import EntryCard from "../../../components/EntryCard";
import { createClient } from "../../../lib/supabase/server";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  },
  photo: {
    display: "block",
    maxWidth: "100%",
    height: "auto",
    marginTop: 24,
    borderRadius: 10,
    border: "1px solid #2E3644",
  },
};

export default async function Page({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: entry } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

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
      {entry.photo && (
        <img
          src={entry.photo}
          alt={entry.title}
          style={styles.photo}
        />
      )}
    </div>
  );
}
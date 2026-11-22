import Link from "next/link";
import { notFound } from "next/navigation";
import EntryCard from "../../../components/EntryCard";
import DeleteButton from "../../../components/DeleteButton";
import { createClient } from "../../../lib/supabase/server";

const styles = {
  actions: { display: "flex", gap: 12, alignItems: "center", marginTop: 24 },
  editLink: {
    padding: "8px 18px",
    border: "3px solid var(--accent)",
    borderRadius: 999,
    color: "var(--accent)",
    fontWeight: 700,
    textDecoration: "none",
  },
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  },
  cardGap: { marginTop: 24 },
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

  const { data: userData } = await supabase.auth.getUser();
  const isOwner = userData.user && entry.owner === userData.user.id;

  return (
    <div style={styles.wrap}>
      <Link href="/" className="back-link">
        ← Back
      </Link>
      <div style={styles.cardGap}>
        <EntryCard
          variant="detail"
          title={entry.title}
          description={entry.description}
          contributor={entry.contributor}
          place={entry.place}
          photo={entry.photo}
        />
      </div>
      {isOwner && (
        <div style={styles.actions}>
          <Link href={`/entries/${entry.id}/edit`} style={styles.editLink}>
            Edit
          </Link>
          <DeleteButton id={entry.id} />
        </div>
      )}
    </div>
  );
}
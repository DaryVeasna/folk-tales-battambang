import Link from "next/link";
import { redirect } from "next/navigation";
import EntryCard from "../../components/EntryCard";
import { createClient } from "../../lib/supabase/server";

// Your words for each status. Edit these three lines.
const STATUS_LABELS = {
  pending: "Processing...",
  published: "Done",
  returned: "Returned",
};

const accents = ["var(--yellow)", "var(--orange)", "var(--pink)"];

export default async function MyEntriesPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("owner", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) console.error(error);
  const entries = data ?? [];

  return (
    <div className="my-entries">
      <h1 className="form-title">My entries</h1>

      {entries.length === 0 ? (
        <p className="form-subtitle">
          You haven&apos;t contributed anything yet.{" "}
          <Link href="/contribute" className="text-link">
            Add an entry
          </Link>
        </p>
      ) : (
        <div className="entry-grid">
          {entries.map((entry, i) => (
            <div key={entry.id} className="entry-item">
              <Link href={`/entries/${entry.id}`} className="entry-link">
                <EntryCard
                  title={entry.title}
                  description={entry.description}
                  contributor={entry.contributor}
                  place={entry.place}
                  photo={entry.photo}
                  accent={accents[i % 3]}
                  status={entry.status}
                  statusLabel={STATUS_LABELS[entry.status] ?? entry.status}
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import Link from "next/link";
import { notFound } from "next/navigation";
import EntryForm from "../../../../components/EntryForm";
import { createClient } from "../../../../lib/supabase/server";

export default async function EditPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: entry } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!entry) notFound();

  const { data: userData } = await supabase.auth.getUser();
  const isOwner = userData.user && entry.owner === userData.user.id;

  // politeness only: the real enforcement is the row-level security policy
  if (!isOwner) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
        <p>You can only edit entries you added.</p>
        <Link href={`/entries/${id}`}>← Back to the entry</Link>
      </div>
    );
  }

  return <EntryForm entry={entry} />;
}
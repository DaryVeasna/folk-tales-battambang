import { createClient } from "../../lib/supabase/server";
import ReviewList from "../../components/ReviewList";

// Your words (Part 1, question 5 and question 3). Edit these.
const NOT_REVIEWER_MESSAGE = "Only reviewers can open this page.";
const LOAD_FAILED_MESSAGE = "Oops, technical issue...Try again later";

export default async function ReviewPage() {
  const supabase = await createClient();

  // politeness: the database is the real gate (review_entry refuses non-reviewers)
  const { data: isReviewer } = await supabase.rpc("is_reviewer");

  if (isReviewer !== true) {
    return (
      <main className="form-wrap">
        <p className="form-subtitle">{NOT_REVIEWER_MESSAGE}</p>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true }); // oldest first

  if (error) {
    console.error(error);
    return (
      <main className="form-wrap">
        <p className="form-subtitle">{LOAD_FAILED_MESSAGE}</p>
      </main>
    );
  }

  return (
    <div className="review-wrap">
      <h1 className="form-title">Review queue</h1>
      <ReviewList initialEntries={data ?? []} />
    </div>
  );
}
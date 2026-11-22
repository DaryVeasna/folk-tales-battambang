"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client";

// Your words (Part 1). Edit these.
const PUBLISH_LABEL = "បង្ហោះ";
const RETURN_LABEL = "បញ្ជូនទៅវិញ";
const FAILED_MESSAGE = "Oops, technical issue...Try again later";
const EMPTY_MESSAGE = "No entries waiting for review.";

// fixed locale and time zone so the server and browser print the same text
function formatDate(value) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Phnom_Penh",
  });
}

export default function ReviewList({ initialEntries }) {
  const [entries, setEntries] = useState(initialEntries);
  const [busyId, setBusyId] = useState(null);
  const [failed, setFailed] = useState({}); // { [entryId]: true }

  async function decide(id, decision) {
    if (busyId) return;
    setBusyId(id);
    setFailed((prev) => ({ ...prev, [id]: false }));

    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("review_entry", {
        entry_id: id,
        decision,
      });

      // review_entry returns false (no error) when it refuses, so check data === true
      if (error || data !== true) {
        console.error(error ?? "review_entry returned false");
        setFailed((prev) => ({ ...prev, [id]: true }));
      } else {
        setEntries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error(err);
      setFailed((prev) => ({ ...prev, [id]: true }));
    } finally {
      setBusyId(null);
    }
  }

  if (entries.length === 0) {
    return <p className="form-subtitle">{EMPTY_MESSAGE}</p>;
  }

  return (
    <div className="review-list">
      {entries.map((entry) => (
        <article key={entry.id} className="review-card">
          {entry.photo ? (
            <img src={entry.photo} alt={entry.title} className="review-photo" />
          ) : (
            <div className="review-photo" aria-hidden="true" />
          )}

          <p className="review-label">Title</p>
          <p className="review-title">{entry.title}</p>

          <p className="review-label">Description</p>
          <p className="review-value">{entry.description}</p>

          <div className="review-meta">
            <div>
              <p className="review-label">Contributor</p>
              <p className="review-value">{entry.contributor}</p>
            </div>
            <div>
              <p className="review-label">Place</p>
              <p className="review-value">{entry.place}</p>
            </div>
            <div>
              <p className="review-label">Year</p>
              <p className="review-value">{entry.year}</p>
            </div>
            <div>
              <p className="review-label">Submitted</p>
              <p className="review-value">{formatDate(entry.created_at)}</p>
            </div>
          </div>

          <div className="review-actions">
            <button
              className="btn-primary"
              disabled={busyId !== null}
              onClick={() => decide(entry.id, "published")}
            >
              {PUBLISH_LABEL}
            </button>
            <button
              className="btn-danger"
              disabled={busyId !== null}
              onClick={() => decide(entry.id, "returned")}
            >
              {RETURN_LABEL}
            </button>
          </div>

          {failed[entry.id] && <p className="field-error">{FAILED_MESSAGE}</p>}
        </article>
      ))}
    </div>
  );
}
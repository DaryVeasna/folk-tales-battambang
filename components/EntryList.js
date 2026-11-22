"use client";

import { useRef, useState } from "react";
import EntryCard from "./EntryCard";
import Link from "next/link";

const accents = ["var(--yellow)", "var(--orange)", "var(--pink)"];
const PER_PAGE = 6;

export default function EntryList({ entries }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const topRef = useRef(null);

  const q = query.trim().toLowerCase();

  const filtered =
    q === ""
      ? entries
      : entries.filter(
          (entry) =>
            entry.title.toLowerCase().includes(q) ||
            entry.description.toLowerCase().includes(q)
        );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PER_PAGE;
  const visible = filtered.slice(start, start + PER_PAGE);

  const goTo = (n) => {
    setPage(n);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const styles = {
    searchWrap: {
      marginTop: 48,
      marginBottom: 32,
    },
    empty: {
      color: "var(--muted)",
      fontSize: 18,
      fontWeight: 600,
      marginTop: 32,
    },
  };

  return (
    <div ref={topRef} style={{ scrollMarginTop: 24 }}>
      <div style={styles.searchWrap}>
        <input
          type="text"
          className="search-input"
          placeholder="Search a word"
          aria-label="Search a word"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <p style={styles.empty}>No results found</p>
      ) : (
        <>
          <div className="entry-grid">
            {visible.map((entry, i) => (
              <div key={entry.id} className="entry-item">
                <Link href={`/entries/${entry.id}`} className="entry-link">
                  <EntryCard
                    title={entry.title}
                    description={entry.description}
                    contributor={entry.contributor}
                    place={entry.place}
                    photo={entry.photo}
                    accent={accents[(start + i) % 3]}
                  />
                </Link>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <button
                className="page-btn"
                onClick={() => goTo(current - 1)}
                disabled={current === 1}
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, n) => n + 1).map((n) => (
                <button
                  key={n}
                  className="page-btn"
                  onClick={() => goTo(n)}
                  aria-current={n === current ? "page" : undefined}
                >
                  {n}
                </button>
              ))}

              <button
                className="page-btn"
                onClick={() => goTo(current + 1)}
                disabled={current === totalPages}
              >
                Next →
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
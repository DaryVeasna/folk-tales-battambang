"use client";

import { useState } from "react";
import EntryCard from "./EntryCard";

export default function EntryList({ entries }) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const filtered =
    q === ""
      ? entries
      : entries.filter(
          (entry) =>
            entry.title.toLowerCase().includes(q) ||
            entry.description.toLowerCase().includes(q)
        );

  const styles = {
    searchWrap: {
      marginTop: 48,
      marginBottom: 32,
    },
    searchInput: {
      width: "100%",
      padding: "12px 16px",
      backgroundColor: "#1C222C",
      border: "1px solid #2E3644",
      borderRadius: 10,
      color: "#E8EDF2",
      fontSize: 16,
      outline: "none",
      boxSizing: "border-box",
    },
    empty: {
      color: "#97A1B3",
      fontSize: 16,
      marginTop: 32,
    },
  };

  return (
    <div>
      <div style={styles.searchWrap}>
        <input
          type="text"
          placeholder="[Search a word]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {filtered.length === 0 ? (
        <p style={styles.empty}>[No results found]</p>
      ) : (
        filtered.map((entry) => (
          <EntryCard
            key={entry.id}
            title={entry.title}
            description={entry.description}
            contributor={entry.contributor}
            place={entry.place}
          />
        ))
      )}
    </div>
  );
}
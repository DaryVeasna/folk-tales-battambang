"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function DeleteButton({ id }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Delete this entry? This can't be undone.")) return;

    setBusy(true);
    setMessage("");
    const supabase = createClient();

    // RLS refuses quietly (zero rows, no error), so check a row came back
    const { data: rows, error } = await supabase
      .from("entries")
      .delete()
      .eq("id", id)
      .select("id");

    if (error || !rows || rows.length === 0) {
      console.error(error ?? "Delete removed 0 rows (RLS refused?)");
      setMessage("That change wasn't saved");
      setBusy(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={busy}
        style={{
          padding: "8px 14px",
          backgroundColor: "transparent",
          border: "1px solid #FF6B6B",
          borderRadius: 8,
          color: "#FF6B6B",
          cursor: busy ? "not-allowed" : "pointer",
        }}
      >
        {busy ? "Deleting…" : "Delete"}
      </button>
      {message && <p style={{ color: "#FF6B6B", fontSize: 13 }}>{message}</p>}
    </>
  );
}
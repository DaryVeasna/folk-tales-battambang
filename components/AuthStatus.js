"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";

const styles = {
  bar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 16,
    minHeight: 32,
    fontSize: 14,
    marginBottom: 32,
  },
  email: { color: "#97A1B3" },
  link: { color: "#2EE6A8" },
  button: {
    background: "none",
    border: "1px solid #2E3644",
    borderRadius: 10,
    color: "#E8EDF2",
    padding: "6px 12px",
    fontSize: 14,
    cursor: "pointer",
  },
};

export default function AuthStatus() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  if (!ready) return <div style={styles.bar} />;

  return (
    <div style={styles.bar}>
      {user ? (
        <>
          <span style={styles.email}>{user.email}</span>
          <button onClick={handleLogout} style={styles.button}>
            Log out
          </button>
        </>
      ) : (
        <>
          <Link href="/login" style={styles.link}>
            Log in
          </Link>
          <Link href="/signup" style={styles.link}>
            Sign up
          </Link>
        </>
      )}
    </div>
  );
}
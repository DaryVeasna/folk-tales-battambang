"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

const styles = {
  wrap: { maxWidth: 420, margin: "0 auto", padding: "80px 24px" },
  title: { fontSize: 32, fontWeight: 700, margin: "0 0 24px" },
  input: {
    width: "100%",
    padding: "12px 16px",
    marginBottom: 16,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
    color: "#E8EDF2",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "#2EE6A8",
    border: "none",
    borderRadius: 10,
    color: "#0F141B",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: { color: "#FF6B6B", fontSize: 14, margin: "0 0 16px" },
  hint: { color: "#97A1B3", fontSize: 14, marginTop: 24 },
  link: { color: "#2EE6A8" },
};

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error("signup error:", error.message);
      setError("Could not create account. Try a different email or a longer password.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main style={styles.wrap}>
      <h1 style={styles.title}>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>
          Sign up
        </button>
      </form>
      <p style={styles.hint}>
        Have an account?{" "}
        <Link href="/login" style={styles.link}>
          Log in
        </Link>
      </p>
    </main>
  );
}
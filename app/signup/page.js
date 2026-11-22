"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

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
    <main className="form-wrap">
      <h1 className="form-title">Sign up</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="field-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="field-input"
        />
        {error && <p className="field-error">{error}</p>}
        <button type="submit" className="btn-primary">
          Sign up
        </button>
      </form>
      <p className="form-hint-line">
        Have an account?{" "}
        <Link href="/login" className="text-link">
          Log in
        </Link>
      </p>
    </main>
  );
}
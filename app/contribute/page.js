"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  },
  title: { fontSize: 32, fontWeight: 700, margin: "0 0 8px" },
  subtitle: { color: "#97A1B3", margin: "0 0 32px" },
  form: { display: "flex", flexDirection: "column", gap: 20 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: 0,
  },
  input: {
    padding: "12px 16px",
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
    color: "#E8EDF2",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
  },
  inputError: { borderColor: "#FF6B6B" },
  error: { color: "#FF6B6B", fontSize: 13, margin: 0, minHeight: 18 },
  fileInput: {
    padding: "12px 16px",
    backgroundColor: "#1C222C",
    border: "1px dashed #2E3644",
    borderRadius: 10,
    color: "#E8EDF2",
    fontSize: 16,
    outline: "none",
    width: "100%",
    cursor: "pointer",
  },
  button: {
    width: "100%",
    padding: "14px 16px",
    backgroundColor: "#2EE6A8",
    border: "none",
    borderRadius: 10,
    color: "#0F141B",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#2E3644",
    color: "#5A6373",
    cursor: "not-allowed",
  },
  loginPrompt: {
    textAlign: "center",
    padding: "48px 24px",
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
    color: "#97A1B3",
  },
  loginLink: { color: "#2EE6A8" },
  fileInput: {
    padding: "12px 16px",
    backgroundColor: "#1C222C",
    border: "1px dashed #2E3644",
    borderRadius: 10,
    color: "#E8EDF2",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
    cursor: "pointer",
  },
};

const TEXT_FIELDS = [
  { name: "title", label: "Title", max: 100 },
  { name: "description", label: "Description", max: 500, multiline: true },
  { name: "contributor", label: "Contributor", max: 50 },
  { name: "place", label: "Place", max: 50 },
  { name: "year", label: "Year" },
];

// the extension comes from the checked file type, never from the file's own name
const EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function validateText(field, value) {
  const text = typeof value === "string" ? value.trim() : "";
  if (text === "") return `${field.label} is required`;
  if (field.max && text.length > field.max) {
    return `Must be ${field.max} characters or fewer`;
  }
  if (field.name === "year") {
    if (!/^\d{4}$/.test(text)) return "Year must be exactly 4 digits";
    const num = parseInt(text, 10);
    const thisYear = new Date().getFullYear();
    if (num < 1900 || num > thisYear) {
      return `Year must be between 1900 and ${thisYear}`;
    }
  }
  return null;
}

function validatePhoto(file) {
  if (!file) return "Photo is required";
  if (!EXTENSIONS[file.type]) return "Photo must be JPEG, PNG, or WebP";
  if (file.size > MAX_FILE_SIZE) return "Photo must be 5 MB or smaller";
  return null;
}

export default function ContributePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contributor: "",
    place: "",
    year: "",
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(undefined); // undefined = checking, null = logged out
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] || null : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // 1. validate everything before anything is sent
    const newErrors = {};
    for (const field of TEXT_FIELDS) {
      const message = validateText(field, formData[field.name]);
      if (message) newErrors[field.name] = message;
    }
    const photoMessage = validatePhoto(formData.photo);
    if (photoMessage) newErrors.photo = photoMessage;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setFormError("");
    const supabase = createClient();

    try {
      // 2. owner comes from the session, never from the form
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        console.error(userError);
        setFormError("Your session expired. Please log in again.");
        return;
      }
      const userId = userData.user.id;

      // 3. upload: path is <user id>/<random uuid>.<extension>
      const file = formData.photo;
      const path = `${userId}/${crypto.randomUUID()}.${EXTENSIONS[file.type]}`;
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(path, file, { contentType: file.type });
      if (uploadError) {
        console.error(uploadError);
        setFormError("The photo couldn't be uploaded. Check the file and try again.");
        return;
      }
      const { data: urlData } = supabase.storage.from("photos").getPublicUrl(path);

      // 4. insert: named columns only, no spreading the form
      const { data: row, error: insertError } = await supabase
        .from("entries")
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          contributor: formData.contributor.trim(),
          place: formData.place.trim(),
          year: formData.year.trim(),
          photo: urlData.publicUrl,
          owner: userId,
        })
        .select("id")
        .single();
      if (insertError || !row) {
        console.error(insertError);
        // don't leave an orphaned photo behind
        await supabase.storage.from("photos").remove([path]);
        setFormError("Your entry couldn't be saved. Please try again.");
        return;
      }

      router.push(`/entries/${row.id}`);
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user === undefined) {
    return (
      <main style={styles.wrap}>
        <p style={styles.subtitle}>Loading…</p>
      </main>
    );
  }

  if (user === null) {
    return (
      <main style={styles.wrap}>
        <div style={styles.loginPrompt}>
          <p>You need to be logged in to contribute an entry.</p>
          <Link href="/login" style={styles.loginLink}>
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.wrap}>
      <h1 style={styles.title}>Contribute an entry</h1>
      <p style={styles.subtitle}>Add a Khmer slang entry to the archive.</p>

      <form style={styles.form} onSubmit={handleSubmit} noValidate>
        {TEXT_FIELDS.map((field) => {
          const Tag = field.multiline ? "textarea" : "input";
          return (
            <div key={field.name} style={styles.field}>
              <label htmlFor={field.name} style={styles.label}>
                {field.label}
              </label>
              <Tag
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                rows={field.multiline ? 4 : undefined}
                style={{
                  ...styles.input,
                  ...(errors[field.name] ? styles.inputError : {}),
                }}
              />
              <p style={styles.error}>{errors[field.name] || ""}</p>
            </div>
          );
        })}

        <div style={styles.field}>
          <label htmlFor="photo" style={styles.label}>
            Photo
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
            style={{
              ...styles.fileInput,
              ...(errors.photo ? styles.inputError : {}),
            }}
          />
          <p style={styles.error}>{errors.photo || ""}</p>
        </div>

        {formError && <p style={styles.error}>{formError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.button,
            ...(isSubmitting ? styles.buttonDisabled : {}),
          }}
        >
          {isSubmitting ? "Saving…" : "Submit entry"}
        </button>
      </form>
    </main>
  );
}
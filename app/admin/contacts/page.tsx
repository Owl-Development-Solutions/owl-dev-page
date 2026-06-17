"use client";

import { useEffect, useState } from "react";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

export default function AdminContactsPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("owldev-admin-token");
    if (saved) {
      setToken(saved);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    void loadSubmissions(token);
  }, [token]);

  async function loadSubmissions(authToken: string) {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/admin/contacts", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
        submissions?: Submission[];
      };

      if (!response.ok || !result.success) {
        sessionStorage.removeItem("owldev-admin-token");
        setToken("");
        setStatus("error");
        setMessage(result.message || "Unable to load submissions.");
        return;
      }

      setSubmissions(result.submissions ?? []);
      setStatus("idle");
    } catch {
      setStatus("error");
      setMessage("Network error while loading submissions.");
    }
  }

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sessionStorage.setItem("owldev-admin-token", password);
    setToken(password);
  }

  function handleLogout() {
    sessionStorage.removeItem("owldev-admin-token");
    setToken("");
    setPassword("");
    setSubmissions([]);
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#07090d] px-5 py-16 text-zinc-100">
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-7">
          <p className="text-xs font-semibold tracking-wider text-cyan-200">OWLDEV ADMIN</p>
          <h1 className="mt-2 text-2xl font-semibold">Contact Submissions</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Enter your admin password to view saved contact form messages.
          </p>

          <form className="mt-6 grid gap-3" onSubmit={handleLogin}>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold text-zinc-300">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm outline-none focus:border-cyan-300/30"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-full bg-cyan-300 px-6 text-sm font-semibold text-[#061018]"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090d] px-5 py-10 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-cyan-200">OWLDEV ADMIN</p>
            <h1 className="mt-2 text-3xl font-semibold">Contact Submissions</h1>
            <p className="mt-2 text-sm text-zinc-400">
              {submissions.length} message{submissions.length === 1 ? "" : "s"} saved
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 items-center justify-center rounded-full bg-white/5 px-4 text-sm font-semibold ring-1 ring-white/10"
          >
            Log out
          </button>
        </div>

        {message ? (
          <p className="mt-6 rounded-2xl bg-red-400/10 px-4 py-3 text-sm text-red-200 ring-1 ring-red-300/20">
            {message}
          </p>
        ) : null}

        {status === "loading" ? (
          <p className="mt-8 text-sm text-zinc-400">Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
            No contact form submissions yet.
          </p>
        ) : (
          <div className="mt-8 grid gap-4">
            {submissions.map((submission) => (
              <article
                key={submission.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{submission.name}</h2>
                    <p className="text-sm text-zinc-400">{submission.email}</p>
                    <p className="text-sm text-zinc-400">{submission.phone}</p>
                  </div>
                  <time className="text-xs text-zinc-500">
                    {new Date(submission.createdAt).toLocaleString()}
                  </time>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                  {submission.message}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

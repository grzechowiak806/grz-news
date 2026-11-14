
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Report = {
  id: number;
  message_id: number;
  reporter_id: string;
  reason: string;
  details: string;
  status: string;
  created_at: string;
};

export default function ModeratorDashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reports, setReports] = useState<Report[]>([]);

  async function loadReports() {
    const { data, error } = await supabase
      .from("chat_reports")
      .select(
        "id,message_id,reporter_id,reason,details,status,created_at"
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      setError(error.message);
      return;
    }

    setReports(data ?? []);
  }

  async function checkModerator() {
    setLoading(true);
    setError("");

    const { data: sessionData } =
      await supabase.auth.getSession();

    if (!sessionData.session ||
        sessionData.session.user.is_anonymous) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.rpc(
      "is_chat_moderator"
    );

    if (error || data !== true) {
      setAuthorized(false);
      setError(error?.message ?? "Not authorized as moderator.");
      setLoading(false);
      return;
    }

    setAuthorized(true);
    await loadReports();
    setLoading(false);
  }

  useEffect(() => {
    void checkModerator();
    // Initial authentication check
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");

    // Sign out of the anonymous chat session first.
    await supabase.auth.signOut();

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setPassword("");

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }

    await checkModerator();
    setBusy(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setAuthorized(false);
    setReports([]);
  }

  async function dismissReport(reportId: number) {
    if (!window.confirm("Dismiss this report?")) return;

    setBusy(true);
    setError("");

    const { error } = await supabase.rpc(
      "mod_dismiss_report",
      { target_report_id: reportId }
    );

    if (error) {
      setError(error.message);
    } else {
      await loadReports();
    }

    setBusy(false);
  }

  async function removeMessage(messageId: number) {
    if (!window.confirm("Remove this message from public view?")) {
      return;
    }

    setBusy(true);
    setError("");

    const { error } = await supabase.rpc(
      "mod_remove_message",
      { target_message_id: messageId }
    );

    if (error) {
      setError(error.message);
    } else {
      await loadReports();
    }

    setBusy(false);
  }

  async function blockUser(userId: string) {
    if (!window.confirm("Block this account from posting?")) {
      return;
    }

    setBusy(true);
    setError("");

    const { error } = await supabase.rpc(
      "mod_block_user",
      {
        target_user_id: userId,
        block_reason: "Moderator action",
      }
    );

    if (error) {
      setError(error.message);
    } else {
      await loadReports();
    }

    setBusy(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-white">
        Checking moderator access...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-orange-400">
          ← Back to GRZ News
        </Link>

        <header className="my-10">
          <p className="font-bold text-orange-400">
            GRZ NEWS ADMINISTRATION
          </p>
          <h1 className="mt-2 text-4xl font-extrabold">
            🛡️ Moderator Dashboard
          </h1>
          <p className="mt-2 text-slate-400">
            America for President — Community Moderation
          </p>
        </header>

        {!authorized ? (
          <section className="max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="mb-4 text-xl font-bold">
              Moderator Sign In
            </h2>

            <form onSubmit={signIn} className="space-y-4">
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Moderator email"
                className="w-full rounded-lg bg-slate-800 p-3"
              />

              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg bg-slate-800 p-3"
              />

              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-orange-600 px-6 py-3 font-bold disabled:opacity-50"
              >
                {busy ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {error && (
              <p role="alert" className="mt-4 text-red-400">
                {error}
              </p>
            )}
          </section>
        ) : (
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-emerald-400">
                ✓ Moderator access verified
              </p>

              <button
                onClick={signOut}
                className="rounded-lg border border-slate-600 px-4 py-2"
              >
                Sign Out
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-900 p-5">
                <p className="text-slate-400">Reports loaded</p>
                <p className="text-3xl font-bold">
                  {reports.length}
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 p-5">
                <p className="text-slate-400">Pending in loaded reports</p>
                <p className="text-3xl font-bold">
                  {reports.filter(
                    (r) => r.status === "pending"
                  ).length}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900 p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  🚩 Reported Messages
                </h2>

                <button
                  onClick={loadReports}
                  className="text-orange-400 hover:underline"
                >
                  Refresh
                </button>
              </div>

              {error && (
                <p role="alert" className="mb-4 text-red-400">
                  {error}
                </p>
              )}

              {reports.length === 0 ? (
                <p className="text-slate-400">
                  No reports found.
                </p>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="rounded-lg border border-slate-700 bg-slate-800 p-4"
                    >
                      <p className="font-bold text-orange-400">
                        Report #{report.id}
                      </p>
                      <p>Message ID: {report.message_id}</p>
                      <p>Reason: {report.reason}</p>

<div className="mt-3 flex flex-wrap gap-2">
  <button
    type="button"
    disabled={busy || report.status !== "pending"}
    onClick={() => dismissReport(report.id)}
    className="rounded-lg bg-slate-600 px-3 py-2 text-sm font-bold hover:bg-slate-500 disabled:opacity-40"
  >
    ✓ Dismiss Report
  </button>

  <button
    type="button"
    disabled={busy}
    onClick={() => removeMessage(report.message_id)}
    className="rounded-lg bg-red-700 px-3 py-2 text-sm font-bold hover:bg-red-600 disabled:opacity-40"
  >
    🗑 Remove Message
  </button>
</div>

                      <p>Status: {report.status}</p>
                      {report.details && (
                        <p>Details: {report.details}</p>
                      )}
                      <p className="mt-2 text-xs text-slate-400">
                        {new Date(
                          report.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

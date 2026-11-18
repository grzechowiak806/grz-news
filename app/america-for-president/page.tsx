
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { Turnstile } from "@marsidev/react-turnstile";

type ChatMessage = {
  id: number;
  user_id: string;
  display_name: string;
  message: string;
  created_at: string;
};

export default function AmericaForPresident() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState("Connecting...");
  const [displayName, setDisplayName] = useState("");
  const [draft, setDraft] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

const [captchaToken, setCaptchaToken] = useState("");
  useEffect(() => {
    let active = true;

    async function connectChat() {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (!active) return;

      if (sessionError) {
        setStatus("Sign-in error: " + sessionError.message);
        return;
      }

      let session = sessionData.session;


if (!session) {
  if (!captchaToken) {
    setStatus("Complete the security check to join the chat.");
    return;
  }

  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      captchaToken,
    },
  });

  if (!active) return;

  if (error || !data.session) {
    setStatus(
      "Sign-in failed: " +
        (error?.message ?? "No session returned") +
        ". Refresh the page to try again."
    );
    return;
  }

        session = data.session;

      }

      setUserId(session.user.id);

      
const { data, error } = await supabase
  .from("chat_messages")
  .select("id,user_id,display_name,message,created_at")
  .eq("is_removed", false)
  .order("created_at", { ascending: false })
  .limit(100);


      if (!active) return;

      if (error) {
        setStatus("Database error: " + error.message);
        return;
      }

      setMessages((data ?? []).reverse());
      setStatus("Connected — live chat ready");
    }

async function refreshMessages() {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id,user_id,display_name,message,created_at")
    .eq("is_removed", false)
    .order("created_at", { ascending: false })
    .limit(100);

  if (!active || error) return;

  setMessages((data ?? []).reverse());
}

    const channel = supabase
      .channel("america-for-president")
      
.on(
  "postgres_changes",
  {
    event: "INSERT",
    schema: "public",
    table: "chat_messages",
  },

         (payload) => {
          if (!active) return;

          const incoming = payload.new as ChatMessage;

          setMessages((previous) => {
            if (previous.some((m) => m.id === incoming.id)) {
              return previous;
            }

            return [...previous, incoming].slice(-100);
          });
        }
      )

.on(
  "postgres_changes",
  {
    event: "UPDATE",
    schema: "public",
    table: "chat_messages",
  },
  (payload) => {
    if (!active) return;

    const updated = payload.new as {
      id: number;
      is_removed?: boolean;
    };

    if (updated.is_removed === true) {
      setMessages((previous) =>
        previous.filter((message) => message.id !== updated.id)
      );
    }
  }
)

      .subscribe();

    void connectChat();

const refreshTimer = setInterval(() => {
  if (active) {
    void connectChat();
  }
}, 5000);

    return () => {
      active = false;
      clearInterval(refreshTimer);
      clearInterval(refreshTimer);
      void supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages]);

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const name = displayName.trim();
    const text = draft.trim();

    if (!userId || sending) return;

    if (!name || !text) {
      setErrorMessage("Enter a display name and message.");
      return;
    }

    if (name.length > 30 || text.length > 1000) {
      setErrorMessage("Your name or message is too long.");
      return;
    }

    setSending(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("chat_messages")
      .insert({
        user_id: userId,
        display_name: name,
        message: text,
      });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setDraft("");
    }

    setSending(false);
  }

  async function reportMessage(messageId: number) {
    if (!userId) {
      alert("Please wait until the chat connects.");
      return;
    }

    const reason = window.prompt(
      "Why are you reporting this message?\n\n" +
      "1. Spam\n" +
      "2. Harassment\n" +
      "3. Threats\n" +
      "4. Hate speech\n" +
      "5. Personal information\n" +
      "6. Other\n\n" +
      "Enter a number from 1 to 6:"
    );

    if (reason === null) return;

    const reasons = [
      "Spam",
      "Harassment",
      "Threats",
      "Hate speech",
      "Personal information",
      "Other",
    ];

    const choice = Number(reason.trim());

    if (
      !Number.isInteger(choice) ||
      choice < 1 ||
      choice > 6
    ) {
      alert("Please select a number from 1 to 6.");
      return;
    }

    const selectedReason = reasons[choice - 1];

    const { error } = await supabase
      .from("chat_reports")
      .insert({
        message_id: messageId,
        reporter_id: userId,
        reason: selectedReason,
      });

    if (error) {
      if (error.code === "23505") {
        alert("You've already reported this message.");
      } else {
        alert("Report failed: " + error.message);
      }
      return;
    }

    alert("Report submitted. Thank you!");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-orange-400">
          ← Back to GRZ News
        </Link>

        <header className="my-10 text-center">
          <p className="font-bold text-orange-400">
            GRZ NEWS COMMUNITY
          </p>

          <h1 className="mt-3 text-4xl font-extrabold">
            🇺🇸 America for President
          </h1>

          <p className="mt-3 text-slate-300">
            Your Country. Your Voice. Your Opinion.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <h2 className="mb-2 text-2xl font-bold">
            💬 Live Community Chat
          </h2>

          <p className="mb-5 text-sm text-emerald-400">
            {status}
          </p>

          <div
            aria-live="polite"
            className="mb-5 h-80 overflow-y-auto rounded-xl bg-slate-950 p-4"
          >
            {messages.length === 0 ? (
              <p className="text-slate-400">
                No messages yet. Start the conversation!
              </p>
            ) : (
              messages.map((item) => (
                <div
                  key={item.id}
                  className="mb-3 rounded-lg bg-slate-800 p-3"
                >
                  <strong className="text-orange-400">
                    {item.display_name}
                  </strong>

                  <p className="mt-1 whitespace-pre-wrap break-words">
                    {item.message}
                  </p>

                  <time className="mt-2 block text-xs text-slate-400">
                    {new Date(item.created_at).toLocaleString()}
                  </time>
{userId && item.user_id !== userId && (
  <button
    type="button"
    onClick={() => reportMessage(item.id)}
    className="mt-2 block text-xs text-red-400 hover:text-red-300"
  >
    🚩 Report Message
  </button>
)}
                </div>
              ))
            )}

            <div ref={bottomRef} />
          </div>
<div className="mb-5">
  {!userId && (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <p className="mb-3 text-sm text-slate-300">
        🔒 Complete this security check to join the chat.
      </p>

      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
        options={{ theme: "dark" }}
        onSuccess={(token) => setCaptchaToken(token)}
        onExpire={() => setCaptchaToken("")}
        onError={() => setCaptchaToken("")}
      />
    </div>
  )}
</div>
          <form onSubmit={sendMessage} className="space-y-3">
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={30}
              placeholder="Choose a display name"
              aria-label="Display name"
              required
              className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            />

            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={1000}
              placeholder="What's on your mind?"
              aria-label="Message"
              required
              className="min-h-24 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            />

            {errorMessage && (
              <p role="alert" className="text-sm text-red-400">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={!userId || sending}
              className="rounded-lg bg-orange-600 px-6 py-3 font-bold hover:bg-orange-500 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Post Message"}
            </button>
          </form>
        </section>

        <p className="mt-6 text-center text-sm text-slate-400">
          Debate ideas, respect people. No threats,
          harassment, spam, or sharing private information.
        </p>
      </div>
    </main>
  );
}

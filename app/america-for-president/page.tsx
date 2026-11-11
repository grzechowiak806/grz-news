
"use client";

import { useState } from "react";
import Link from "next/link";

type Message = {
  id: number;
  name: string;
  text: string;
};

export default function AmericaForPresident() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !message.trim()) return;

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: name.trim().slice(0, 30),
        text: message.trim().slice(0, 1000),
      },
    ]);

    setMessage("");
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
          <h2 className="mb-4 text-2xl font-bold">
            💬 Community Chat
          </h2>

          <p className="mb-4 text-sm text-slate-400">
            Preview mode: messages are only visible in
            this browser session. Live chat is coming next.
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
                    {item.name}
                  </strong>
                  <p className="mt-1 whitespace-pre-wrap break-words">
                    {item.text}
                  </p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={sendMessage} className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              placeholder="Choose a display name"
              aria-label="Display name"
              className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              placeholder="What's on your mind?"
              aria-label="Your message"
              className="min-h-24 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            />

            <button
              type="submit"
              className="rounded-lg bg-orange-600 px-6 py-3 font-bold hover:bg-orange-500"
            >
              Post Message
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

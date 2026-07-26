export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">GRZ NEWS</h1>
            <p className="text-sm text-zinc-400">
              Real news. Short reads. A little humor.
            </p>
          </div>

          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#top-story" className="hover:text-zinc-300">
              Top Story
            </a>
            <a href="#latest" className="hover:text-zinc-300">
              Latest
            </a>
            <a href="#subscribe" className="hover:text-zinc-300">
              Subscribe
            </a>
          </nav>
        </div>
      </header>

      <section
        id="top-story"
        className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2"
      >
        <div className="flex min-h-80 items-center justify-center rounded-3xl bg-zinc-800 text-zinc-400">
          Featured story image
        </div>

        <div className="flex flex-col justify-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-orange-400">
            Today&apos;s Top Story
          </p>

          <h2 className="text-4xl font-black leading-tight md:text-6xl">
            The world did something strange again.
          </h2>

          <p className="mt-6 text-lg leading-8 text-zinc-300">
            GRZ News explains the day&apos;s most interesting headlines in plain
            English, without making you read twelve paragraphs before learning
            what happened.
          </p>

          <div className="mt-8">
            <a
              href="#"
              className="inline-block rounded-full bg-white px-6 py-3 font-bold text-black hover:bg-zinc-200"
            >
              Read today&apos;s story
            </a>
          </div>
        </div>
      </section>

      <section id="latest" className="border-y border-zinc-800 bg-zinc-900">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-black">Latest Stories</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              "Technology promises to save us five minutes",
              "Scientists discover another thing to worry about",
              "Local animal refuses to follow community guidelines",
            ].map((headline) => (
              <article
                key={headline}
                className="rounded-2xl border border-zinc-700 bg-zinc-950 p-6"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  2-minute read
                </p>
                <h3 className="mt-4 text-2xl font-bold">{headline}</h3>
                <p className="mt-4 text-zinc-400">
                  A clear summary, why it matters, and one small reason to smile.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="subscribe" className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-4xl font-black">Get GRZ News in your inbox</h2>
        <p className="mt-4 text-lg text-zinc-400">
          One interesting story. One short email. No endless scrolling.
        </p>

        <form className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="you@example.com"
            className="flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 outline-none focus:border-white"
          />
          <button
            type="submit"
            className="rounded-full bg-orange-500 px-6 py-3 font-bold text-black hover:bg-orange-400"
          >
            Subscribe free
          </button>
        </form>

        <p className="mt-3 text-xs text-zinc-500">
          Unsubscribe anytime. We will not sell your email address.
        </p>
      </section>

      <footer className="border-t border-zinc-800 px-6 py-8 text-center text-sm text-zinc-500">
        © 2026 GRZ News
      </footer>
    </main>
  );
}
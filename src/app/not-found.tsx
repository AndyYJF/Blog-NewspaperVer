import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container grid min-h-[70vh] place-items-center py-24 text-center">
      <div>
        <p className="font-display text-[10rem] leading-none text-accent">404</p>
        <p className="eyebrow mt-2 text-accent">Errata</p>
        <h1 className="masthead mt-4 text-display-xl">
          Lost in the archive
        </h1>
        <p className="mx-auto mt-5 max-w-md font-italic italic text-lg text-muted">
          The page you were looking for has been mislaid between issues.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-3 border border-ink bg-ink px-6 py-3 font-sans text-[11px] uppercase tracking-eyebrow text-paper transition-colors hover:bg-accent hover:border-accent"
        >
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
            <path d="M14 5 L1 5 M5 1 L1 5 L5 9" stroke="currentColor" strokeWidth="1" />
          </svg>
          Return to the front page
        </Link>
      </div>
    </main>
  );
}

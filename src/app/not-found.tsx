import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="eyebrow text-accent">Error 404</p>
        <h1 className="mt-3 font-serif text-display-2xl font-bold tracking-tightest">
          Lost in the archive
        </h1>
        <p className="mt-4 font-serif italic text-muted">
          The page you were looking for has been mislaid.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block border border-ink bg-ink px-6 py-3 font-sans text-sm uppercase tracking-widest text-paper transition-colors hover:bg-accent hover:border-accent"
        >
          Return to the front page
        </Link>
      </div>
    </main>
  );
}

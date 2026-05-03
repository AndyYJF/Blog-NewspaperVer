export default function Loading() {
  return (
    <main className="container py-20">
      <div className="space-y-4">
        <div className="h-3 w-24 animate-pulse bg-subtle" />
        <div className="h-12 w-full max-w-xl animate-pulse bg-subtle" />
        <div className="h-12 w-full max-w-md animate-pulse bg-subtle" />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="aspect-[4/3] animate-pulse bg-subtle" />
          <div className="aspect-[4/3] animate-pulse bg-subtle" />
          <div className="aspect-[4/3] animate-pulse bg-subtle" />
        </div>
      </div>
    </main>
  );
}

export default function ProgramsGridSkeleton() {
  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex h-full animate-pulse flex-col overflow-hidden rounded-2xl border border-neutral-gray bg-white"
        >
          <div className="h-52 bg-neutral-gray sm:h-56" />
          <div className="flex flex-1 flex-col gap-3 p-6">
            <div className="h-4 w-2/3 rounded bg-neutral-gray" />
            <div className="h-6 w-full rounded bg-neutral-gray" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-neutral-gray" />
              <div className="h-3 w-5/6 rounded bg-neutral-gray" />
            </div>
            <div className="mt-auto h-11 rounded-xl bg-neutral-gray" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] border border-stone-200/80 overflow-hidden shadow-sm flex flex-col justify-between h-full group animate-pulse">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100" />

      <div className="p-6 text-left flex-1 flex flex-col space-y-3">
        <div className="h-3 w-1/3 rounded bg-stone-200" />
        <div className="h-5 w-3/4 rounded bg-stone-200" />
        <div className="h-3 w-full rounded bg-stone-100" />
        <div className="h-3 w-5/6 rounded bg-stone-100" />
        <div className="h-3 w-1/4 rounded bg-stone-100" />

        <div className="mt-auto pt-5 border-t border-stone-100 space-y-4">
          <div className="h-3 w-1/4 rounded bg-stone-100" />
          <div className="h-8 w-1/2 rounded bg-stone-200" />
          <div className="h-12 rounded-xl bg-stone-100" />
        </div>
      </div>
    </div>
  );
}

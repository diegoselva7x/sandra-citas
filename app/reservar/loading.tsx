export default function ReservarLoading() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-2xl space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-7 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
        {/* Paso 1: servicios */}
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl" />
          ))}
        </div>
        <div className="h-10 bg-muted rounded-lg w-32 ml-auto" />
      </div>
    </div>
  );
}

"use client";

export default function FloatingMiniStepper({
  step = 1,
  total = 5,
}: {
  step?: number;
  total?: number;
}) {
  const items = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <>
      {/*small dots for the desktop screens */}
      <div className="hidden md:flex items-center gap-2 justify-center mb-4">
        {items.map((n) => (
          <div
            key={n}
            className={`w-3 h-3 rounded-full ${
              n <= step ? "bg-emerald-600" : "bg-slate-300"
            }`}
            aria-hidden
          />
        ))}
      </div>

      {/* Mobile floating dots */}
      <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/95 px-3 py-2 rounded-full shadow-lg border border-[#b1b1ab] flex items-center gap-2">
          <div className="text-xs text-slate-600">
            Step {step} / {total}
          </div>
          <div className="flex items-center gap-1">
            {items.map((n) => (
              <div
                key={n}
                className={`w-2 h-2 rounded-full ${
                  n <= step ? "bg-emerald-600" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

import { cn } from "@/lib/utils";

/** Decorative editorial ornament — used between sections */
export function Ornament({ className, glyph = "❦" }: { className?: string; glyph?: string }) {
  return (
    <div className={cn("ornament", className)} aria-hidden>
      <span>{glyph}</span>
    </div>
  );
}

/** Editorial three-glyph ornament */
export function OrnamentTrio({ className }: { className?: string }) {
  return (
    <div className={cn("ornament", className)} aria-hidden>
      <span className="tracking-[0.6em] pl-[0.6em] font-display text-base text-accent">
        ✦ ❦ ✦
      </span>
    </div>
  );
}

/** Roman numeral helper — for issue / volume display */
export function RomanNumeral({ n, className }: { n: number; className?: string }) {
  const numerals: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  let remaining = n;
  for (const [value, symbol] of numerals) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return <span className={className}>{result}</span>;
}

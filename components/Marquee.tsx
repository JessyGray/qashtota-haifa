// A band of big words that slides sideways forever. The words are repeated so the loop has no gap.
export default function Marquee({ words, tone = "blue" }: { words: string[]; tone?: "blue" | "light" }) {
  const row = [...words, ...words, ...words];
  return (
    <div className={`marquee marquee-${tone}`} aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <span key={k}>
            {row.map((w, i) => (
              <b key={i}>{w}<i>✦</i></b>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

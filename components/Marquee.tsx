// A band of big words that slides sideways forever. The words are repeated so the loop has no gap.
export default function Marquee({ words, tone = "blue" }: { words: { text: string; lang: string }[]; tone?: "blue" | "light" }) {
  const row = words.length < 8 ? [...words, ...words, ...words] : words;
  return (
    <div className={`marquee marquee-${tone}`} aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <span key={k}>
            {row.map((w, i) => (
              <b key={i} lang={w.lang}>{w.text}<i /></b>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

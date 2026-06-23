'use client';

// Friends-style section heading: a title plus an "episode" subtitle with the
// iconic colored dots between words.
const DOT_COLORS = ['#ef4444', '#3b82f6', '#eab308'];

export default function SectionHeading({
  title,
  episode,
}: {
  title: string;
  episode: string;
}) {
  const words = episode.split(' ');
  return (
    <div className="mb-8">
      <h2 className="section-title">{title}</h2>
      <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm font-medium uppercase tracking-wide text-muted">
        {words.map((w, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {w}
            {i < words.length - 1 && (
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: DOT_COLORS[i % DOT_COLORS.length] }}
              />
            )}
          </span>
        ))}
      </p>
    </div>
  );
}

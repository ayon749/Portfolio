'use client';

import { useEffect, useState } from 'react';

// Cycles through a list of phrases with a typing / deleting effect.
export default function Typewriter({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;
    const current = phrases[index % phrases.length];

    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && text === current) {
      // Pause at the end of a word before deleting.
      timeout = setTimeout(() => setDeleting(true), 1400);
    } else if (deleting && text === '') {
      setDeleting(false);
      setIndex((i) => i + 1);
    } else {
      timeout = setTimeout(
        () => {
          setText(
            deleting
              ? current.slice(0, text.length - 1)
              : current.slice(0, text.length + 1)
          );
        },
        deleting ? 45 : 90
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index, phrases]);

  return (
    <span>
      <span className="gradient-text font-semibold">{text}</span>
      <span className="cursor text-accent">|</span>
    </span>
  );
}

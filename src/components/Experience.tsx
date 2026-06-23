'use client';

import type { Experience } from '@/lib/types';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

function fmt(d: string | null): string {
  if (!d) return '';
  const date = new Date(d + 'T00:00:00');
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function ExperienceSection({ items }: { items: Experience[] }) {
  return (
    <section id="experience" className="scroll-mt-20">
      <SectionHeading title="Experience" episode="The One With The Career" />

      {items.length === 0 ? (
        <p className="text-muted">No experience added yet — add it in the admin panel.</p>
      ) : (
        <div className="relative ml-3 border-l border-white/10 pl-8">
          {items.map((exp, i) => {
            const bullets = exp.responsibilities
              .split('\n')
              .map((b) => b.trim())
              .filter(Boolean);
            const range = `${fmt(exp.start_date)} — ${
              exp.is_current ? 'Present' : fmt(exp.end_date) || 'Present'
            }`;
            return (
              <Reveal key={exp.id} delay={i * 90}>
                <div className="relative mb-10 last:mb-0">
                  {/* timeline dot */}
                  <span className="absolute -left-[41px] top-1.5 flex h-4 w-4 items-center justify-center">
                    <span className="h-3 w-3 rounded-full bg-accent ring-4 ring-bg" />
                    {exp.is_current && (
                      <span className="absolute h-3 w-3 animate-ping rounded-full bg-accent/60" />
                    )}
                  </span>

                  <div className="card">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <h3 className="text-lg font-semibold">{exp.position}</h3>
                      <span className="text-xs font-medium uppercase tracking-wide text-accent">
                        {range}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-slate-300">{exp.company}</p>
                    {bullets.length > 0 && (
                      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
                        {bullets.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </section>
  );
}

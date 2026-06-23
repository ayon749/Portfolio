'use client';

import type { IconType } from 'react-icons';
import { SiDotnet, SiSharp, SiReact, SiClaude } from 'react-icons/si';
import { FaDatabase, FaCloud } from 'react-icons/fa';
import Reveal from './Reveal';

type Tech = { name: string; category: string; Icon: IconType; color: string };

const STACK: Tech[] = [
  { name: '.NET / .NET Core', category: 'Backend', Icon: SiDotnet, color: '#512BD4' },
  { name: 'C#', category: 'Backend', Icon: SiSharp, color: '#8a52d4' },
  { name: 'React', category: 'Frontend', Icon: SiReact, color: '#61DAFB' },
  { name: 'SQL Server', category: 'Database', Icon: FaDatabase, color: '#E0564B' },
  { name: 'Azure', category: 'Cloud', Icon: FaCloud, color: '#3b9eff' },
  { name: 'Claude AI', category: 'AI', Icon: SiClaude, color: '#D97757' },
];

export default function TechStack({ skills }: { skills: string[] }) {
  return (
    <section id="skills" className="scroll-mt-20">
      <h2 className="section-title mb-2">Skills &amp; Tech Stack</h2>
      <p className="mb-8 text-muted">The tools I build with every day.</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {STACK.map((t, i) => (
          <Reveal key={t.name} delay={i * 80}>
            <div
              className="group card relative flex flex-col items-center gap-3 overflow-hidden py-7 text-center"
              style={{ ['--c' as string]: t.color }}
            >
              {/* glow that appears on hover, tinted to the brand color */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${t.color}26, transparent 70%)`,
                }}
              />
              <t.Icon
                className="float-slow h-12 w-12 transition-transform duration-300 group-hover:scale-110"
                style={{ color: t.color }}
              />
              <div>
                <p className="font-semibold leading-tight">{t.name}</p>
                <p className="text-xs uppercase tracking-wide text-muted">{t.category}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {skills.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-muted">Also working with</p>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((s) => (
              <span
                key={s}
                className="rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-sm transition hover:border-accent/50"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

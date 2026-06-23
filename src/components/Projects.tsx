'use client';

import { publicUrl } from '@/lib/supabaseClient';
import type { Project } from '@/lib/types';

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="scroll-mt-20">
      <h2 className="section-title mb-6">Projects</h2>
      {projects.length === 0 ? (
        <p className="text-muted">No projects yet — add some in the admin panel.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p) => {
            const img = publicUrl(p.image_url);
            return (
              <article key={p.id} className="card flex flex-col">
                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img}
                    alt={p.title}
                    className="mb-4 h-40 w-full rounded-lg object-cover"
                  />
                )}
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {p.description}
                </p>
                {p.tech_tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tech_tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex gap-4 text-sm">
                  {p.repo_url && (
                    <a className="text-accent hover:underline" href={p.repo_url} target="_blank" rel="noreferrer">
                      Code →
                    </a>
                  )}
                  {p.live_url && (
                    <a className="text-accent hover:underline" href={p.live_url} target="_blank" rel="noreferrer">
                      Live →
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

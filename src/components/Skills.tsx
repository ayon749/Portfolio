'use client';

export default function Skills({ skills }: { skills: string[] }) {
  return (
    <section id="skills" className="scroll-mt-20">
      <h2 className="section-title mb-6">Skills</h2>
      {skills.length === 0 ? (
        <p className="text-muted">Add your skills in the admin panel.</p>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {skills.map((s) => (
            <span key={s} className="rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-sm">
              {s}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

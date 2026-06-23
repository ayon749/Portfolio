'use client';

import type { Profile } from '@/lib/types';

export default function Contact({ profile }: { profile: Profile | null }) {
  return (
    <section id="contact" className="scroll-mt-20">
      <h2 className="section-title mb-6">Contact</h2>
      <div className="card">
        <p className="text-muted">
          {profile?.email
            ? 'Feel free to reach out — I usually reply within a day.'
            : 'Add your email in the admin panel to enable contact.'}
        </p>
        {profile?.email && (
          <a className="btn-primary mt-4" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        )}
      </div>
    </section>
  );
}

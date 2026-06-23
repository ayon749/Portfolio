'use client';

import type { Profile } from '@/lib/types';
import SectionHeading from './SectionHeading';

export default function Contact({ profile }: { profile: Profile | null }) {
  const hasContact = profile?.email || profile?.phone;
  return (
    <section id="contact" className="scroll-mt-20">
      <SectionHeading title="Contact" episode="The One Where You Knock Three Times" />
      <div className="card">
        <p className="text-muted">
          {hasContact
            ? "Could I BE any easier to reach? Drop a line or give me a call."
            : 'Add your email and phone in the admin panel to enable contact.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {profile?.email && (
            <a className="btn-primary" href={`mailto:${profile.email}`}>
              ✉️ {profile.email}
            </a>
          )}
          {profile?.phone && (
            <a className="btn-ghost" href={`tel:${profile.phone.replace(/\s+/g, '')}`}>
              📞 {profile.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

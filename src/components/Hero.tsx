'use client';

import { publicUrl } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/types';

export default function Hero({ profile }: { profile: Profile | null }) {
  const photo = publicUrl(profile?.photo_url);
  const resume = publicUrl(profile?.resume_url);

  return (
    <section id="top" className="container-page pt-20 pb-12">
      <div className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
            {profile?.headline || 'Software Engineer'}
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {profile?.full_name || 'Your Name'}
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            {profile?.bio || 'Add your bio from the admin panel.'}
          </p>
          {profile?.location && (
            <p className="mt-3 text-sm text-muted">📍 {profile.location}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            {resume && (
              <a className="btn-primary" href={resume} target="_blank" rel="noreferrer">
                Download Résumé
              </a>
            )}
            <a className="btn-ghost" href="#contact">
              Get in touch
            </a>
          </div>
          <div className="mt-6 flex gap-4 text-sm text-muted">
            {profile?.github_url && (
              <a className="hover:text-slate-100" href={profile.github_url} target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}
            {profile?.linkedin_url && (
              <a className="hover:text-slate-100" href={profile.linkedin_url} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
            {profile?.twitter_url && (
              <a className="hover:text-slate-100" href={profile.twitter_url} target="_blank" rel="noreferrer">
                Twitter / X
              </a>
            )}
            {profile?.website_url && (
              <a className="hover:text-slate-100" href={profile.website_url} target="_blank" rel="noreferrer">
                Website
              </a>
            )}
          </div>
        </div>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={profile?.full_name || 'Profile photo'}
            className="h-36 w-36 rounded-2xl object-cover ring-2 ring-accent/40 sm:h-44 sm:w-44"
          />
        )}
      </div>
    </section>
  );
}

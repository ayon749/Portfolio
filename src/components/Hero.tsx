'use client';

import { publicUrl } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/types';
import Typewriter from './Typewriter';

export default function Hero({ profile }: { profile: Profile | null }) {
  const photo = publicUrl(profile?.photo_url);
  const resume = publicUrl(profile?.resume_url);

  // Roles cycled by the typewriter — leads with the profile headline if set.
  const roles = [
    profile?.headline || 'Software Engineer',
    '.NET Core Developer',
    'React Developer',
    'SQL Server · Azure · Claude AI',
  ].filter(Boolean);

  return (
    <section id="top" className="relative overflow-hidden pt-24 pb-16">
      {/* animated background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora-blob left-[-10%] top-[-10%] h-72 w-72 bg-accent" />
        <div
          className="aurora-blob right-[-5%] top-[10%] h-80 w-80 bg-cyan-500"
          style={{ animationDelay: '-6s' }}
        />
        <div
          className="aurora-blob left-[30%] bottom-[-20%] h-72 w-72 bg-violet-500"
          style={{ animationDelay: '-12s' }}
        />
        <div className="absolute inset-0 code-grid" />
      </div>

      <div className="container-page">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center">
          <div className="flex-1">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface/60 px-3 py-1 text-xs text-muted backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              Available for opportunities
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {profile?.full_name || 'Your Name'}
            </h1>
            <p className="mt-3 text-xl sm:text-2xl">
              <Typewriter phrases={roles} />
            </p>
            <p className="mt-5 max-w-xl leading-relaxed text-muted">
              {profile?.bio || 'Add your bio from the admin panel.'}
            </p>
            {profile?.location && (
              <p className="mt-3 text-sm text-muted">📍 {profile.location}</p>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
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

          {/* right: photo + terminal window */}
          <div className="w-full max-w-sm space-y-5">
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt={profile?.full_name || 'Profile photo'}
                className="float-slow mx-auto h-36 w-36 rounded-2xl object-cover ring-2 ring-accent/40 sm:h-40 sm:w-40"
              />
            )}
            <CodeWindow name={profile?.full_name || 'engineer'} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeWindow({ name }: { name: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0d14] shadow-2xl shadow-accent/10">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
        <span className="h-3 w-3 rounded-full bg-green-400/80" />
        <span className="ml-2 text-xs text-muted">~/dev — zsh</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code>
          <span className="text-accent">$</span> whoami{'\n'}
          <span className="text-green-400">{'>'} {name}</span>
          {'\n\n'}
          <span className="text-accent">$</span> stack --list{'\n'}
          <span className="text-cyan-300">{'>'} .NET Core · React · SQL Server</span>
          {'\n'}
          <span className="text-cyan-300">{'>'} Azure Cloud · Claude AI</span>
          {'\n\n'}
          <span className="text-accent">$</span> status{'\n'}
          <span className="text-violet-300">{'>'} building things that scale </span>
          <span className="cursor text-accent">▮</span>
        </code>
      </pre>
    </div>
  );
}

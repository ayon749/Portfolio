'use client';

import type { IconType } from 'react-icons';
import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { publicUrl } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/types';
import Typewriter from './Typewriter';

export default function Hero({ profile }: { profile: Profile | null }) {
  const photo = publicUrl(profile?.photo_url);
  const cover = publicUrl(profile?.cover_url);
  const resume = publicUrl(profile?.resume_url);

  const socials: { url?: string | null; label: string; Icon: IconType; color: string }[] = [
    { url: profile?.github_url, label: 'GitHub', Icon: FaGithub, color: '#e2e8f0' },
    { url: profile?.linkedin_url, label: 'LinkedIn', Icon: FaLinkedin, color: '#0a66c2' },
    { url: profile?.twitter_url, label: 'X', Icon: FaXTwitter, color: '#e2e8f0' },
    { url: profile?.website_url, label: 'Website', Icon: FaGlobe, color: '#22d3ee' },
  ];

  const roles = [
    profile?.headline || 'Software Engineer',
    '.NET Core Developer',
    'React Developer',
    'SQL Server · Azure · Claude AI',
  ].filter(Boolean);

  return (
    <section id="top" className="relative overflow-hidden pb-16">
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

      <div className="container-page pt-20">
        {/* cover banner (LinkedIn-style) */}
        <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-white/10 sm:h-52">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="Cover" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-accent/40 via-cyan-500/30 to-violet-500/40">
              <div className="absolute inset-0 code-grid opacity-60" />
            </div>
          )}
          {/* Friends-style colored dots in the corner */}
          <div className="absolute right-4 top-4 flex gap-2">
            {['#ef4444', '#3b82f6', '#eab308', '#ef4444'].map((c, i) => (
              <span key={i} className="h-3 w-3 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent" />
        </div>

        {/* profile photo overlapping the banner (relative z-10 so it paints
            ABOVE the position:relative banner instead of being covered by it) */}
        <div className="relative z-10 -mt-12 flex items-end gap-4 px-1 sm:-mt-14">
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={profile?.full_name || 'Profile photo'}
              className="h-24 w-24 rounded-2xl object-cover ring-4 ring-bg sm:h-28 sm:w-28"
            />
          )}
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface/70 px-3 py-1 text-xs text-muted backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Available for opportunities
          </span>
        </div>

        <div className="mt-6 flex flex-col items-start gap-10 lg:flex-row lg:items-center">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {profile?.full_name || 'Your Name'}
            </h1>
            <p className="mt-3 text-xl sm:text-2xl">
              <Typewriter phrases={roles} />
            </p>
            <p className="mt-2 text-sm italic text-muted">
              {/* The Big Bang Theory wink */}
              &ldquo;I&rsquo;m not insane, my code just has a tendency to compile on the first
              try.&rdquo; <span className="not-italic">🧠</span>
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
            <div className="mt-6 flex flex-wrap gap-3">
              {socials
                .filter((s) => s.url)
                .map(({ url, label, Icon, color }) => (
                  <a
                    key={label}
                    className="social-chip"
                    style={{ ['--c' as string]: color }}
                    href={url as string}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                  >
                    <Icon className="social-icon h-4 w-4" />
                    {label}
                  </a>
                ))}
            </div>
          </div>

          <div className="w-full max-w-sm">
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
        <span className="ml-2 text-xs text-muted">~/apartment_4A — zsh</span>
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
          <span className="text-accent">$</span> ./run_tests.sh{'\n'}
          <span className="text-yellow-300">{'>'} All passing. </span>
          <span className="font-bold text-pink-400">Bazinga!</span>{' '}
          <span className="cursor text-accent">▮</span>
        </code>
      </pre>
    </div>
  );
}

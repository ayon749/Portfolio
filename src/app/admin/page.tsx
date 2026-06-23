'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import Login from '@/components/admin/Login';
import ProfileEditor from '@/components/admin/ProfileEditor';
import ProjectsEditor from '@/components/admin/ProjectsEditor';
import ExperienceEditor from '@/components/admin/ExperienceEditor';
import PostsEditor from '@/components/admin/PostsEditor';

type Tab = 'profile' | 'experience' | 'projects' | 'posts';

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>('profile');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center text-muted">Loading…</main>
    );
  }

  if (!session) {
    return <Login />;
  }

  const tabs: [Tab, string][] = [
    ['profile', 'Profile'],
    ['experience', 'Experience'],
    ['projects', 'Projects'],
    ['posts', 'Blog Posts'],
  ];

  return (
    <main className="min-h-screen">
      <header className="border-b border-white/5 bg-surface">
        <div className="container-page flex h-14 items-center justify-between">
          <span className="font-semibold">Admin</span>
          <div className="flex items-center gap-4">
            <a href="../" className="text-sm text-muted hover:text-slate-100">
              View site →
            </a>
            <button
              className="btn-ghost"
              onClick={() => supabase.auth.signOut()}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-page py-8">
        <div className="mb-6 flex gap-2 border-b border-white/5">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition ${
                tab === key
                  ? 'border-accent text-slate-100'
                  : 'border-transparent text-muted hover:text-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'profile' && <ProfileEditor />}
        {tab === 'experience' && <ExperienceEditor />}
        {tab === 'projects' && <ProjectsEditor />}
        {tab === 'posts' && <PostsEditor />}
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Profile, Project, Post } from '@/lib/types';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import TechStack from '@/components/TechStack';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import Reveal from '@/components/Reveal';

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [p, pr, po] = await Promise.all([
        supabase.from('profile').select('*').eq('id', 1).single(),
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
        supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false }),
      ]);
      if (p.data) setProfile(p.data as Profile);
      if (pr.data) setProjects(pr.data as Project[]);
      if (po.data) setPosts(po.data as Post[]);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted">Loading…</div>
      </main>
    );
  }

  return (
    <main>
      <Nav name={profile?.full_name} />
      <Hero profile={profile} />
      <div className="container-page space-y-24 py-16">
        <Reveal>
          <Projects projects={projects} />
        </Reveal>
        <TechStack skills={profile?.skills ?? []} />
        <Reveal>
          <Blog posts={posts} />
        </Reveal>
        <Reveal>
          <Contact profile={profile} />
        </Reveal>
      </div>
      <footer className="border-t border-white/5 py-8 text-center text-sm text-muted">
        <p>
          © {new Date().getFullYear()} {profile?.full_name || 'Your Name'}.{' '}
          <a href="./admin/" className="text-accent hover:underline">
            Admin
          </a>
        </p>
        <p className="mt-2 text-xs">
          Built with ☕ at Central Perk &middot; powered by clean code &amp; the occasional
          <span className="font-semibold text-pink-400"> Bazinga!</span>
        </p>
      </footer>
    </main>
  );
}

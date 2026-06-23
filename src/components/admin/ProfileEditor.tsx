'use client';

import { useEffect, useState } from 'react';
import { supabase, uploadFile, publicUrl } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/types';

const BLANK: Profile = {
  id: 1,
  full_name: '',
  headline: '',
  bio: '',
  location: '',
  email: '',
  photo_url: '',
  resume_url: '',
  github_url: '',
  linkedin_url: '',
  twitter_url: '',
  website_url: '',
  skills: [],
};

export default function ProfileEditor() {
  const [p, setP] = useState<Profile>(BLANK);
  const [skillsText, setSkillsText] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase
      .from('profile')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setP({ ...BLANK, ...data });
          setSkillsText((data.skills ?? []).join(', '));
        }
      });
  }, []);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setP((prev) => ({ ...prev, [key]: value }));
  }

  async function handleUpload(folder: string, key: 'photo_url' | 'resume_url', file?: File) {
    if (!file) return;
    setBusy(true);
    setStatus(`Uploading ${file.name}…`);
    try {
      const path = await uploadFile(folder, file);
      set(key, path);
      setStatus('Uploaded — remember to Save.');
    } catch (e: unknown) {
      setStatus('Upload failed: ' + (e as Error).message);
    }
    setBusy(false);
  }

  async function save() {
    setBusy(true);
    setStatus('Saving…');
    const skills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const { error } = await supabase
      .from('profile')
      .update({ ...p, skills, id: 1 })
      .eq('id', 1);
    setStatus(error ? 'Error: ' + error.message : 'Saved ✓');
    setBusy(false);
  }

  const photo = publicUrl(p.photo_url);
  const resume = publicUrl(p.resume_url);

  return (
    <div className="max-w-2xl space-y-5">
      <Field label="Full name">
        <input className="input" value={p.full_name} onChange={(e) => set('full_name', e.target.value)} />
      </Field>
      <Field label="Headline (e.g. Senior Software Engineer)">
        <input className="input" value={p.headline} onChange={(e) => set('headline', e.target.value)} />
      </Field>
      <Field label="Bio">
        <textarea className="input min-h-28" value={p.bio} onChange={(e) => set('bio', e.target.value)} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Location">
          <input className="input" value={p.location ?? ''} onChange={(e) => set('location', e.target.value)} />
        </Field>
        <Field label="Email">
          <input className="input" value={p.email ?? ''} onChange={(e) => set('email', e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="GitHub URL">
          <input className="input" value={p.github_url ?? ''} onChange={(e) => set('github_url', e.target.value)} />
        </Field>
        <Field label="LinkedIn URL">
          <input className="input" value={p.linkedin_url ?? ''} onChange={(e) => set('linkedin_url', e.target.value)} />
        </Field>
        <Field label="Twitter / X URL">
          <input className="input" value={p.twitter_url ?? ''} onChange={(e) => set('twitter_url', e.target.value)} />
        </Field>
        <Field label="Website URL">
          <input className="input" value={p.website_url ?? ''} onChange={(e) => set('website_url', e.target.value)} />
        </Field>
      </div>
      <Field label="Skills (comma separated)">
        <input
          className="input"
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          placeholder="React, TypeScript, Node.js, Azure, SQL"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Profile photo">
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="mb-2 h-20 w-20 rounded-lg object-cover" />
          )}
          <input type="file" accept="image/*" onChange={(e) => handleUpload('profile', 'photo_url', e.target.files?.[0])} />
        </Field>
        <Field label="Résumé (PDF)">
          {resume && (
            <a href={resume} target="_blank" rel="noreferrer" className="mb-2 block text-sm text-accent">
              Current résumé →
            </a>
          )}
          <input type="file" accept="application/pdf" onChange={(e) => handleUpload('resume', 'resume_url', e.target.files?.[0])} />
        </Field>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button className="btn-primary" onClick={save} disabled={busy}>
          Save profile
        </button>
        {status && <span className="text-sm text-muted">{status}</span>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

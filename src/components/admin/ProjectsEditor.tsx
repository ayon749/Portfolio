'use client';

import { useEffect, useState } from 'react';
import { supabase, uploadFile, publicUrl } from '@/lib/supabaseClient';
import type { Project } from '@/lib/types';

export default function ProjectsEditor() {
  const [items, setItems] = useState<Project[]>([]);
  const [status, setStatus] = useState('');

  async function load() {
    const { data } = await supabase.from('projects').select('*').order('sort_order');
    setItems((data as Project[]) ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function addNew() {
    const { data, error } = await supabase
      .from('projects')
      .insert({ title: 'New project', sort_order: items.length })
      .select()
      .single();
    if (!error && data) setItems((prev) => [...prev, data as Project]);
  }

  function patch(id: string, key: keyof Project, value: unknown) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)));
  }

  async function save(p: Project) {
    setStatus('Saving…');
    const { error } = await supabase
      .from('projects')
      .update({
        title: p.title,
        description: p.description,
        tech_tags: p.tech_tags,
        image_url: p.image_url,
        repo_url: p.repo_url,
        live_url: p.live_url,
        sort_order: p.sort_order,
      })
      .eq('id', p.id);
    setStatus(error ? 'Error: ' + error.message : 'Saved ✓');
  }

  async function remove(id: string) {
    if (!confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  async function upload(id: string, file?: File) {
    if (!file) return;
    setStatus('Uploading…');
    try {
      const path = await uploadFile('projects', file);
      patch(id, 'image_url', path);
      setStatus('Uploaded — remember to Save this project.');
    } catch (e: unknown) {
      setStatus('Upload failed: ' + (e as Error).message);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <button className="btn-primary" onClick={addNew}>
          + Add project
        </button>
        {status && <span className="text-sm text-muted">{status}</span>}
      </div>

      {items.map((p) => {
        const img = publicUrl(p.image_url);
        return (
          <div key={p.id} className="card space-y-3">
            <input
              className="input font-semibold"
              value={p.title}
              onChange={(e) => patch(p.id, 'title', e.target.value)}
              placeholder="Title"
            />
            <textarea
              className="input"
              value={p.description}
              onChange={(e) => patch(p.id, 'description', e.target.value)}
              placeholder="Description"
            />
            <input
              className="input"
              value={(p.tech_tags ?? []).join(', ')}
              onChange={(e) =>
                patch(
                  p.id,
                  'tech_tags',
                  e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                )
              }
              placeholder="Tech tags (comma separated): React, Node.js"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="input"
                value={p.repo_url ?? ''}
                onChange={(e) => patch(p.id, 'repo_url', e.target.value)}
                placeholder="Repo URL"
              />
              <input
                className="input"
                value={p.live_url ?? ''}
                onChange={(e) => patch(p.id, 'live_url', e.target.value)}
                placeholder="Live URL"
              />
            </div>
            <div className="flex items-center gap-3">
              {img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt="" className="h-14 w-20 rounded object-cover" />
              )}
              <input type="file" accept="image/*" onChange={(e) => upload(p.id, e.target.files?.[0])} />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-muted">Order</label>
              <input
                type="number"
                className="input w-20"
                value={p.sort_order}
                onChange={(e) => patch(p.id, 'sort_order', Number(e.target.value))}
              />
              <div className="flex-1" />
              <button className="btn-primary" onClick={() => save(p)}>
                Save
              </button>
              <button className="btn-ghost" onClick={() => remove(p.id)}>
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

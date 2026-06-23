'use client';

import { useEffect, useState } from 'react';
import { supabase, uploadFile, publicUrl } from '@/lib/supabaseClient';
import type { Post } from '@/lib/types';

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function PostsEditor() {
  const [items, setItems] = useState<Post[]>([]);
  const [status, setStatus] = useState('');

  async function load() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setItems((data as Post[]) ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function addNew() {
    const title = 'Untitled post';
    const { data, error } = await supabase
      .from('posts')
      .insert({ title, slug: slugify(title) + '-' + Date.now(), body: '', published: false })
      .select()
      .single();
    if (!error && data) setItems((prev) => [data as Post, ...prev]);
  }

  function patch(id: string, key: keyof Post, value: unknown) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)));
  }

  async function save(p: Post) {
    setStatus('Saving…');
    const { error } = await supabase
      .from('posts')
      .update({
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        body: p.body,
        cover_url: p.cover_url,
        published: p.published,
      })
      .eq('id', p.id);
    setStatus(error ? 'Error: ' + error.message : 'Saved ✓');
  }

  async function remove(id: string) {
    if (!confirm('Delete this post?')) return;
    await supabase.from('posts').delete().eq('id', id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  async function upload(id: string, file?: File) {
    if (!file) return;
    setStatus('Uploading…');
    try {
      const path = await uploadFile('posts', file);
      patch(id, 'cover_url', path);
      setStatus('Uploaded — remember to Save this post.');
    } catch (e: unknown) {
      setStatus('Upload failed: ' + (e as Error).message);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <button className="btn-primary" onClick={addNew}>
          + New post
        </button>
        {status && <span className="text-sm text-muted">{status}</span>}
      </div>

      {items.map((p) => {
        const cover = publicUrl(p.cover_url);
        return (
          <div key={p.id} className="card space-y-3">
            <input
              className="input font-semibold"
              value={p.title}
              onChange={(e) => patch(p.id, 'title', e.target.value)}
              placeholder="Title"
            />
            <input
              className="input"
              value={p.slug}
              onChange={(e) => patch(p.id, 'slug', e.target.value)}
              placeholder="url-slug"
            />
            <input
              className="input"
              value={p.excerpt ?? ''}
              onChange={(e) => patch(p.id, 'excerpt', e.target.value)}
              placeholder="Short excerpt shown in the list"
            />
            <textarea
              className="input min-h-48 font-mono text-xs"
              value={p.body}
              onChange={(e) => patch(p.id, 'body', e.target.value)}
              placeholder="Write in Markdown…"
            />
            <div className="flex items-center gap-3">
              {cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt="" className="h-14 w-20 rounded object-cover" />
              )}
              <input type="file" accept="image/*" onChange={(e) => upload(p.id, e.target.files?.[0])} />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={p.published}
                  onChange={(e) => patch(p.id, 'published', e.target.checked)}
                />
                Published
              </label>
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

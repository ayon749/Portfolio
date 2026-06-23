'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Experience } from '@/lib/types';

// HTML <input type="month"> uses 'YYYY-MM'; the DB column is a date, so we
// store the first of the month and trim back to 'YYYY-MM' when editing.
const toMonth = (d: string | null) => (d ? d.slice(0, 7) : '');
const toDate = (m: string) => (m ? `${m}-01` : null);

export default function ExperienceEditor() {
  const [items, setItems] = useState<Experience[]>([]);
  const [status, setStatus] = useState('');

  async function load() {
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false, nullsFirst: false });
    setItems((data as Experience[]) ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  async function addNew() {
    setStatus('Adding…');
    const { data, error } = await supabase
      .from('experiences')
      .insert({ company: 'New company', position: 'Position' })
      .select()
      .single();
    if (error) {
      setStatus('Could not add: ' + error.message);
      return;
    }
    setItems((prev) => [data as Experience, ...prev]);
    setStatus('Added — fill it in and Save. Click “+ Add experience” again for more.');
  }

  function patch(id: string, key: keyof Experience, value: unknown) {
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, [key]: value } : e)));
  }

  async function save(e: Experience) {
    setStatus('Saving…');
    const { error } = await supabase
      .from('experiences')
      .update({
        company: e.company,
        position: e.position,
        start_date: e.start_date,
        end_date: e.is_current ? null : e.end_date,
        is_current: e.is_current,
        responsibilities: e.responsibilities,
      })
      .eq('id', e.id);
    setStatus(error ? 'Error: ' + error.message : 'Saved ✓');
  }

  async function remove(id: string) {
    if (!confirm('Delete this experience?')) return;
    await supabase.from('experiences').delete().eq('id', id);
    setItems((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <button className="btn-primary" onClick={addNew}>
          + Add experience
        </button>
        {status && <span className="text-sm text-muted">{status}</span>}
      </div>

      {items.map((e) => (
        <div key={e.id} className="card space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Company</label>
              <input
                className="input"
                value={e.company}
                onChange={(ev) => patch(e.id, 'company', ev.target.value)}
              />
            </div>
            <div>
              <label className="label">Position</label>
              <input
                className="input"
                value={e.position}
                onChange={(ev) => patch(e.id, 'position', ev.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Start (month / year)</label>
              <input
                type="month"
                className="input"
                value={toMonth(e.start_date)}
                onChange={(ev) => patch(e.id, 'start_date', toDate(ev.target.value))}
              />
            </div>
            <div>
              <label className="label">End (month / year)</label>
              <input
                type="month"
                className="input disabled:opacity-40"
                value={toMonth(e.end_date)}
                disabled={e.is_current}
                onChange={(ev) => patch(e.id, 'end_date', toDate(ev.target.value))}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={e.is_current}
              onChange={(ev) => patch(e.id, 'is_current', ev.target.checked)}
            />
            I currently work here (shows &ldquo;Present&rdquo;)
          </label>

          <div>
            <label className="label">Roles &amp; responsibilities (one per line)</label>
            <textarea
              className="input min-h-32"
              value={e.responsibilities}
              onChange={(ev) => patch(e.id, 'responsibilities', ev.target.value)}
              placeholder={'Built REST APIs in ASP.NET Core\nOptimized SQL Server queries\nLed CI/CD on Azure DevOps'}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1" />
            <button className="btn-primary" onClick={() => save(e)}>
              Save
            </button>
            <button className="btn-ghost" onClick={() => remove(e.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

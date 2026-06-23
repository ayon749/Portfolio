import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Surfaced in the browser console during dev if .env.local is missing.
  console.warn(
    '[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Copy .env.local.example to .env.local and fill in your project values.'
  );
}

export const supabase = createClient(url ?? '', anonKey ?? '');

// Public URL of the storage bucket used for uploads (images, resume).
export const MEDIA_BUCKET = 'media';

export function publicUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  // If a full URL was already stored, use it as-is.
  if (path.startsWith('http')) return path;
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

// Uploads a file to the media bucket and returns the storage path
// (e.g. "projects/162534-screenshot.png"). Store this path in the DB.
export async function uploadFile(folder: string, file: File): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const path = `${folder}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { upsert: true, cacheControl: '3600' });
  if (error) throw error;
  return path;
}

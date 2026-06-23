'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { publicUrl } from '@/lib/supabaseClient';
import type { Post } from '@/lib/types';
import SectionHeading from './SectionHeading';

export default function Blog({ posts }: { posts: Post[] }) {
  const [open, setOpen] = useState<Post | null>(null);

  return (
    <section id="blog" className="scroll-mt-20">
      <SectionHeading title="Blog" episode="The One Where I Write" />
      {posts.length === 0 ? (
        <p className="text-muted">No posts yet — write one in the admin panel.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <button
              key={post.id}
              onClick={() => setOpen(post)}
              className="card block w-full text-left"
            >
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="mt-1 text-xs text-muted">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
              {post.excerpt && (
                <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              )}
              <span className="mt-3 inline-block text-sm text-accent">Read →</span>
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-10"
          onClick={() => setOpen(null)}
        >
          <article
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-surface p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(null)}
              className="float-right text-muted hover:text-slate-100"
              aria-label="Close"
            >
              ✕
            </button>
            {publicUrl(open.cover_url) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={publicUrl(open.cover_url) as string}
                alt={open.title}
                className="mb-5 h-48 w-full rounded-lg object-cover"
              />
            )}
            <h3 className="text-2xl font-bold">{open.title}</h3>
            <p className="mb-6 mt-1 text-xs text-muted">
              {new Date(open.created_at).toLocaleDateString()}
            </p>
            <div className="prose-portfolio space-y-4 text-sm leading-relaxed text-slate-200">
              <ReactMarkdown>{open.body}</ReactMarkdown>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

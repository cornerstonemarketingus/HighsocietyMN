'use client';

import { Heart, MessageCircle, PenSquare } from 'lucide-react';
import { useState } from 'react';
import type { ForumPostRecord } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export function CommunityFeed({ posts }: { posts: ForumPostRecord[] }) {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [showComposer, setShowComposer] = useState(false);

  return (
    <section className="page-shell py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Community lounge</p>
          <h1 className="section-heading">Connect with Minnesota enthusiasts</h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-300 light:text-slate-600">
            Reviews, grow tips, event chat, and local recommendations curated around the High Society experience.
          </p>
        </div>
        <Button onClick={() => setShowComposer((value) => !value)}>
          <PenSquare className="mr-2 h-4 w-4" />
          Create post
        </Button>
      </div>

      {showComposer ? (
        <div className="glass-card mb-8 rounded-[28px] p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_180px]">
            <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" placeholder="What should the community talk about?" />
            <select className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <option>General</option>
              <option>Reviews</option>
              <option>Growing</option>
              <option>Events</option>
            </select>
          </div>
          <textarea className="mt-4 min-h-32 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Share your thoughts, ask a question, or start a discussion..." />
          <div className="mt-4 flex justify-end">
            <Button>Share with the community</Button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        {['General', 'Reviews', 'Growing', 'Events'].map((category) => (
          <div key={category} className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-center text-sm font-semibold text-slate-200 light:text-slate-800">
            {category}
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {posts.map((post) => {
          const isLiked = liked[post.id];
          return (
            <article key={post.id} className="glass-card rounded-[32px] p-6">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 light:text-slate-600">
                <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-brand-200">{post.category}</span>
                <span>{post.userName}</span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold">{post.title}</h2>
              <p className="mt-3 text-slate-300 light:text-slate-600">{post.body}</p>
              <div className="mt-5 flex gap-3 text-sm">
                <button className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${isLiked ? 'bg-brand-500 text-black' : 'bg-white/5 text-slate-200'}`} onClick={() => setLiked((value) => ({ ...value, [post.id]: !value[post.id] }))}>
                  <Heart className="h-4 w-4" /> {post.likes + (isLiked ? 1 : 0)}
                </button>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-slate-200">
                  <MessageCircle className="h-4 w-4" /> {post.comments.length} comments
                </div>
              </div>
              <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="rounded-2xl bg-black/30 p-4 light:bg-slate-100">
                    <div className="flex items-center justify-between text-sm text-slate-400 light:text-slate-600">
                      <span>{comment.userName}</span>
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-200 light:text-slate-800">{comment.body}</p>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

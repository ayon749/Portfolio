// Shapes mirror the tables defined in supabase/schema.sql

export interface Profile {
  id: number;
  full_name: string;
  headline: string;
  bio: string;
  location: string | null;
  email: string | null;
  phone: string | null;
  photo_url: string | null; // storage path or full URL
  cover_url: string | null; // banner image — storage path or full URL
  resume_url: string | null; // storage path or full URL
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
  skills: string[]; // e.g. ["React", "Node.js", "Azure"]
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_tags: string[];
  image_url: string | null;
  repo_url: string | null;
  live_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string | null; // 'YYYY-MM-DD'
  end_date: string | null; // 'YYYY-MM-DD'
  is_current: boolean;
  responsibilities: string; // one bullet per line
  created_at: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string; // markdown
  cover_url: string | null;
  published: boolean;
  created_at: string;
}

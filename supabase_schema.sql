-- ==========================================
-- REDEX PLATFORM DATABASE SCHEMA
-- Copy and run this in Supabase SQL Editor
-- ==========================================

-- 1. Create Projects Table
create table projects (
  id bigint primary key generated always as identity,
  title text not null,
  description text,
  category text,
  author text,
  image text,
  download_link text,
  status text default 'pending',
  stats jsonb default '{"likes": 0, "views": 0, "downloads": 0}',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create Questions Table
create table questions (
  id bigint primary key generated always as identity,
  title text not null,
  body text,
  author text,
  avatar text,
  replies jsonb default '[]',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Enable Row Level Security (RLS) - Optional for now but recommended
alter table projects enable row level security;
alter table questions enable row level security;

-- 4. Create Policies (Allow Public Read/Write for simplicity in this demo)
-- Ideally, you would restrict write access to authenticated users
create policy "Public Access Projects" on projects for all using (true);
create policy "Public Access Questions" on questions for all using (true);

-- 5. Insert Sample Data
insert into projects (title, description, category, author, image, status, stats)
values 
('لعبة الذاكرة', 'لعبة تدريب ذاكرة بسيطة باستخدام JavaScript.', '🎮 ألعاب', 'Ahmed', 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Memory+Game', 'approved', '{"likes": 5, "views": 120, "downloads": 10}'),
('تطبيق مهامي', 'تطبيق لتنظيم المهام اليومية.', '📱 تطبيقات', 'Sarah', 'https://via.placeholder.com/400x300/10b981/ffffff?text=Todo+App', 'approved', '{"likes": 12, "views": 200, "downloads": 45}');

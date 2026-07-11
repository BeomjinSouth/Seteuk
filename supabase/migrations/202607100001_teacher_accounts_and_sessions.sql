create table public.teacher_accounts (
    id uuid primary key default gen_random_uuid(),
    school text not null,
    login_id text not null,
    teacher_key text not null unique,
    teacher_name text not null,
    subject text not null default '담당 교과',
    password_hash text not null,
    role text not null default 'teacher' check (role in ('teacher', 'admin')),
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (school, login_id)
);

create table public.teacher_sessions (
    token_hash text primary key,
    account_id uuid not null references public.teacher_accounts(id) on delete cascade,
    expires_at timestamptz not null,
    created_at timestamptz not null default now(),
    last_seen_at timestamptz not null default now()
);

create index teacher_sessions_account_expiry_idx
    on public.teacher_sessions (account_id, expires_at);

alter table public.teacher_accounts enable row level security;
alter table public.teacher_sessions enable row level security;

revoke all on public.teacher_accounts from anon, authenticated;
revoke all on public.teacher_sessions from anon, authenticated;

create table if not exists public.admin_role_grants (
    school text not null,
    teacher_key text not null,
    teacher_name text not null,
    active boolean not null default true,
    bootstrap boolean not null default false,
    granted_by_teacher_key text,
    granted_at timestamptz not null default now(),
    revoked_by_teacher_key text,
    revoked_at timestamptz,
    primary key (school, teacher_key)
);

create index if not exists admin_role_grants_school_active_idx
    on public.admin_role_grants (school, active);

create index if not exists admin_role_grants_teacher_name_idx
    on public.admin_role_grants (school, teacher_name)
    where active = true;

alter table public.admin_role_grants enable row level security;

insert into public.admin_role_grants (
    school,
    teacher_key,
    teacher_name,
    active,
    bootstrap,
    granted_by_teacher_key,
    granted_at
)
values (
    '성호중학교',
    '성호중학교::박범진::담당-교과',
    '박범진',
    true,
    true,
    'bootstrap',
    now()
)
on conflict (school, teacher_key) do update
set
    active = true,
    bootstrap = true,
    teacher_name = excluded.teacher_name,
    revoked_at = null,
    revoked_by_teacher_key = null;

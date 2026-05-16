create table if not exists public.group_survey_sessions (
    id uuid primary key default gen_random_uuid(),
    access_code text not null unique,
    school text not null,
    teacher_key text not null,
    teacher_name text,
    class_id text not null,
    grade integer not null check (grade between 1 and 6),
    class_number integer not null check (class_number > 0),
    title text,
    status text not null default 'open',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint group_survey_sessions_status_check
        check (status in ('open', 'closed'))
);

create index if not exists group_survey_sessions_teacher_class_idx
    on public.group_survey_sessions (teacher_key, class_id, created_at desc);

create index if not exists group_survey_sessions_access_code_idx
    on public.group_survey_sessions (access_code);

create table if not exists public.group_survey_responses (
    session_id uuid not null references public.group_survey_sessions(id) on delete cascade,
    student_id text not null,
    school text not null,
    grade integer not null,
    class_number integer not null,
    number integer not null,
    name text not null,
    answers jsonb not null,
    will_avg numeric(4, 2) not null,
    agency_avg numeric(4, 2) not null,
    submitted_at timestamptz not null default now(),
    primary key (session_id, student_id),
    constraint group_survey_responses_answers_array
        check (jsonb_typeof(answers) = 'array' and jsonb_array_length(answers) = 12),
    constraint group_survey_responses_will_range
        check (will_avg >= 1 and will_avg <= 5),
    constraint group_survey_responses_agency_range
        check (agency_avg >= 1 and agency_avg <= 5)
);

create index if not exists group_survey_responses_session_number_idx
    on public.group_survey_responses (session_id, number);

create table if not exists public.group_student_skill_scores (
    teacher_key text not null,
    class_id text not null,
    student_id text not null,
    skill_score integer not null check (skill_score between 1 and 3),
    updated_at timestamptz not null default now(),
    primary key (teacher_key, class_id, student_id)
);

create index if not exists group_student_skill_scores_class_idx
    on public.group_student_skill_scores (teacher_key, class_id);

create table if not exists public.grouping_recommendation_runs (
    id uuid primary key default gen_random_uuid(),
    teacher_key text not null,
    class_id text not null,
    session_id uuid not null references public.group_survey_sessions(id) on delete cascade,
    group_size integer not null check (group_size between 2 and 5),
    result jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists grouping_recommendation_runs_teacher_class_idx
    on public.grouping_recommendation_runs (teacher_key, class_id, created_at desc);

alter table public.group_survey_sessions enable row level security;
alter table public.group_survey_responses enable row level security;
alter table public.group_student_skill_scores enable row level security;
alter table public.grouping_recommendation_runs enable row level security;

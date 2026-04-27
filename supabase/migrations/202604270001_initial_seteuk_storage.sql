create table if not exists public.sheet_rows (
    sheet_name text not null,
    row_index integer not null check (row_index >= 1),
    cells jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (sheet_name, row_index),
    constraint sheet_rows_cells_is_array check (jsonb_typeof(cells) = 'array')
);

create index if not exists sheet_rows_sheet_name_row_index_idx
    on public.sheet_rows (sheet_name, row_index);

create table if not exists public.app_state_documents (
    scope text not null,
    owner_key text not null,
    document_key text not null default 'default',
    payload jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (scope, owner_key, document_key),
    constraint app_state_documents_scope_check
        check (scope in ('workspace', 'observation-board'))
);

create index if not exists app_state_documents_owner_scope_idx
    on public.app_state_documents (owner_key, scope);

alter table public.sheet_rows enable row level security;
alter table public.app_state_documents enable row level security;

create or replace function public.append_sheet_row(
    p_sheet_name text,
    p_cells jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    next_index integer;
begin
    if jsonb_typeof(coalesce(p_cells, '[]'::jsonb)) <> 'array' then
        raise exception 'p_cells must be a JSON array';
    end if;

    select coalesce(max(row_index), 0) + 1
    into next_index
    from public.sheet_rows
    where sheet_name = p_sheet_name;

    insert into public.sheet_rows (sheet_name, row_index, cells)
    values (p_sheet_name, next_index, coalesce(p_cells, '[]'::jsonb));
end;
$$;

create or replace function public.replace_sheet(
    p_sheet_name text,
    p_rows jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
    if jsonb_typeof(coalesce(p_rows, '[]'::jsonb)) <> 'array' then
        raise exception 'p_rows must be a JSON array';
    end if;

    delete from public.sheet_rows
    where sheet_name = p_sheet_name;

    insert into public.sheet_rows (sheet_name, row_index, cells)
    select
        p_sheet_name,
        row_value.ordinality::integer,
        case
            when jsonb_typeof(row_value.value) = 'array' then row_value.value
            else '[]'::jsonb
        end
    from jsonb_array_elements(coalesce(p_rows, '[]'::jsonb)) with ordinality as row_value(value, ordinality);
end;
$$;

create or replace function public.update_sheet_row(
    p_sheet_name text,
    p_row_index integer,
    p_cells jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
    if p_row_index < 1 then
        raise exception 'p_row_index must be >= 1';
    end if;

    if jsonb_typeof(coalesce(p_cells, '[]'::jsonb)) <> 'array' then
        raise exception 'p_cells must be a JSON array';
    end if;

    insert into public.sheet_rows (sheet_name, row_index, cells, updated_at)
    values (p_sheet_name, p_row_index, coalesce(p_cells, '[]'::jsonb), now())
    on conflict (sheet_name, row_index)
    do update set
        cells = excluded.cells,
        updated_at = now();
end;
$$;

create or replace function public.delete_sheet_rows(
    p_sheet_name text,
    p_row_indices integer[]
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    row_index_to_delete integer;
begin
    if coalesce(array_length(p_row_indices, 1), 0) = 0 then
        return;
    end if;

    for row_index_to_delete in
        select distinct value
        from unnest(p_row_indices) as value
        where value >= 1
        order by value desc
    loop
        delete from public.sheet_rows
        where sheet_name = p_sheet_name
          and row_index = row_index_to_delete;

        update public.sheet_rows
        set row_index = row_index - 1,
            updated_at = now()
        where sheet_name = p_sheet_name
          and row_index > row_index_to_delete;
    end loop;
end;
$$;

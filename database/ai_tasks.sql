/**
 * @reason Store AI task instructions for OpenAI as raw YAML
 */
create table if not exists public.ai_tasks (
    -- Core fields
    task text primary key,
    instruction text not null,
    updated_at timestamp with time zone not null default now(),
    created_at timestamp with time zone not null default now()
);

-- Only service role access
alter table public.ai_tasks enable row level security;

create policy "Service role can manage tasks"
    on ai_tasks for all
    using (auth.role() = 'service_role');

-- Create trigger for updated_at
create trigger on_ai_tasks_updated
    before update on ai_tasks
    for each row
    execute function handle_updated_at();

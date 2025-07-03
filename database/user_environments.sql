-- User API Keys Storage (Key-Value Pattern)
-- Stores OpenAI and ElevenLabs API keys
-- IMPORTANT: All values are encrypted using AES encryption before storage

create table if not exists public.user_environments (
    -- Fields
    user_id uuid references auth.users(id) on delete cascade,
    key text not null check (key in ('openai_key', 'elevenlabs_key')),
    value text not null, -- encrypted

    -- Metadata
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),

    -- Composite primary key (allows multiple rows per user)
    primary key (user_id, key)
);

-- Enable RLS
alter table public.user_environments enable row level security;

-- One simple policy: Users manage their own environment
create policy "Users manage own environment"
    on user_environments for all
    using (auth.uid() = user_id);

-- Auto-update timestamp
create trigger update_user_environments_timestamp
    before update on user_environments
    for each row
    execute function handle_updated_at();
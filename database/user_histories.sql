/**
 * @reason Store user speech processing history
 */
create table if not exists public.user_histories (
    -- Core fields
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,

    -- Speech info
    source_language text not null,
    target_language text not null,
    duration numeric,

    -- Processing results
    transcription text not null,
    transcreation text,
    transliteration text,
    tts_audio_base64 text,
    tts_alignment jsonb,
    segments jsonb,

    -- Timestamps
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- RLS
alter table public.user_histories enable row level security;

-- Users can manage their own history (CRUD)
create policy "Users can manage own history"
    on user_histories for all
    using (auth.uid() = user_id);

-- Create trigger for updated_at
create trigger on_user_histories_updated
    before update on user_histories
    for each row
    execute function handle_updated_at();

/**
 * @reason Store user interface settings
 */
create table if not exists public.user_preferences (
    -- Core fields
    user_id uuid primary key references auth.users not null unique,

    -- Interface settings
    source_language text not null default 'tr',
    target_language text not null default 'en',

    -- Timestamps
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- RLS
alter table public.user_preferences enable row level security;

-- Users can read their own settings
create policy "Users can mange their own settings"
    on user_preferences for all
    using (auth.uid() = user_id);

-- Create trigger for updated_at
create trigger on_user_preferences_updated
    before update on user_preferences
    for each row
    execute function handle_updated_at();

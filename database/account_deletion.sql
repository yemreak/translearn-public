-- Hesap silme isteklerini takip eden tablo
CREATE TABLE IF NOT EXISTS public.deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scheduled_deletion_date TIMESTAMPTZ NOT NULL,
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    cancelled BOOLEAN NOT NULL DEFAULT FALSE,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    processed_at TIMESTAMPTZ
);

-- Hesap silme işlemlerini loglayan tablo
CREATE TABLE IF NOT EXISTS public.account_deletion_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    email TEXT,
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reason TEXT
);

-- RLS politikaları
ALTER TABLE public.deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_deletion_logs ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi silme isteklerini görebilir ve iptal edebilir
CREATE POLICY "Users can view their own deletion requests"
    ON public.deletion_requests
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own deletion requests"
    ON public.deletion_requests
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id AND cancelled = TRUE);

-- Servis rolü tüm işlemleri yapabilir
CREATE POLICY "Service role can do all on deletion_requests"
    ON public.deletion_requests
    FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do all on account_deletion_logs"
    ON public.account_deletion_logs
    FOR ALL
    USING (auth.role() = 'service_role');

-- Hesap silme isteği oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION request_account_deletion(
    scheduled_days INTEGER DEFAULT 7,
    client_ip TEXT DEFAULT NULL,
    client_user_agent TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    existing_request RECORD;
    result JSON;
BEGIN
    -- Mevcut bir istek var mı kontrol et
    SELECT * INTO existing_request
    FROM public.deletion_requests
    WHERE user_id = auth.uid()
    AND cancelled = FALSE
    AND processed = FALSE;

    IF FOUND THEN
        -- Mevcut istek varsa, tarihini güncelle
        UPDATE public.deletion_requests
        SET scheduled_deletion_date = NOW() + (scheduled_days || ' days')::INTERVAL,
            requested_at = NOW(),
            ip_address = COALESCE(client_ip, ip_address),
            user_agent = COALESCE(client_user_agent, user_agent)
        WHERE id = existing_request.id;

        result := json_build_object(
            'id', existing_request.id,
            'scheduled_deletion_date', NOW() + (scheduled_days || ' days')::INTERVAL,
            'updated', TRUE
        );
    ELSE
        -- Yeni istek oluştur
        WITH new_request AS (
            INSERT INTO public.deletion_requests (
                user_id,
                scheduled_deletion_date,
                ip_address,
                user_agent
            ) VALUES (
                auth.uid(),
                NOW() + (scheduled_days || ' days')::INTERVAL,
                client_ip,
                client_user_agent
            )
            RETURNING id, scheduled_deletion_date
        )
        SELECT json_build_object(
            'id', id,
            'scheduled_deletion_date', scheduled_deletion_date,
            'created', TRUE
        ) INTO result
        FROM new_request;
    END IF;

    RETURN result;
END;
$$;

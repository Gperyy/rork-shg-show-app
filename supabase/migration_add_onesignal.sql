-- =====================================================
-- OneSignal Entegrasyonu için Migration
-- SHG Airshow 2026
-- =====================================================

-- 1. Users tablosuna onesignal_player_id sütunu ekle
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS onesignal_player_id TEXT;

-- Player ID için index (bildirim gönderirken hızlı sorgulama için)
CREATE INDEX IF NOT EXISTS idx_users_onesignal_player_id
ON public.users(onesignal_player_id);

-- =====================================================
-- 2. Notification Events tablosu (Analytics için)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notification_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- 'sent', 'opened', 'clicked_ticket', 'purchase_yes', 'purchase_no', 'purchase_later'
    notification_id TEXT, -- OneSignal notification ID
    notification_title TEXT,
    campaign_name TEXT, -- Örn: 'flash_sale_jan', 'early_bird', 'reminder_7day'
    metadata JSONB DEFAULT '{}', -- Ek bilgiler (tıklanan link, indirim kodu vb)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indexler (analytics sorguları için)
CREATE INDEX IF NOT EXISTS idx_notification_events_user_id
ON public.notification_events(user_id);

CREATE INDEX IF NOT EXISTS idx_notification_events_event_type
ON public.notification_events(event_type);

CREATE INDEX IF NOT EXISTS idx_notification_events_campaign
ON public.notification_events(campaign_name);

CREATE INDEX IF NOT EXISTS idx_notification_events_created_at
ON public.notification_events(created_at);

-- RLS (Row Level Security) etkinleştir
ALTER TABLE public.notification_events ENABLE ROW LEVEL SECURITY;

-- Tüm işlemlere izin ver (gerekirse sonra kısıtlanabilir)
CREATE POLICY "Allow all operations on notification_events"
ON public.notification_events
FOR ALL
USING (true)
WITH CHECK (true);

-- =====================================================
-- 3. User Activity tablosu (Pasif kullanıcı takibi için)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_activity (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    last_opened_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    last_ticket_viewed_at TIMESTAMP WITH TIME ZONE,
    session_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Index (pasif kullanıcı sorguları için)
CREATE INDEX IF NOT EXISTS idx_user_activity_last_opened
ON public.user_activity(last_opened_at);

-- RLS etkinleştir
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Tüm işlemlere izin ver
CREATE POLICY "Allow all operations on user_activity"
ON public.user_activity
FOR ALL
USING (true)
WITH CHECK (true);

-- =====================================================
-- 4. Yardımcı Fonksiyonlar
-- =====================================================

-- Kullanıcı aktivitesini güncelle (uygulama her açıldığında çağrılır)
CREATE OR REPLACE FUNCTION public.update_user_activity(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.user_activity (user_id, last_opened_at, session_count)
    VALUES (p_user_id, NOW(), 1)
    ON CONFLICT (user_id)
    DO UPDATE SET
        last_opened_at = NOW(),
        session_count = public.user_activity.session_count + 1;
END;
$$ LANGUAGE plpgsql;

-- Pasif kullanıcıları getir (belirtilen gün sayısından fazla açmamış)
CREATE OR REPLACE FUNCTION public.get_inactive_users(days_inactive INTEGER DEFAULT 14)
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    name TEXT,
    onesignal_player_id TEXT,
    last_opened_at TIMESTAMP WITH TIME ZONE,
    inactive_days INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id as user_id,
        u.email,
        u.name,
        u.onesignal_player_id,
        ua.last_opened_at,
        EXTRACT(DAY FROM NOW() - ua.last_opened_at)::INTEGER as inactive_days
    FROM public.users u
    LEFT JOIN public.user_activity ua ON u.id = ua.user_id
    WHERE
        u.onesignal_player_id IS NOT NULL
        AND (
            ua.last_opened_at IS NULL
            OR ua.last_opened_at < NOW() - (days_inactive || ' days')::INTERVAL
        );
END;
$$ LANGUAGE plpgsql;

-- Kampanya performansını getir
CREATE OR REPLACE FUNCTION public.get_campaign_stats(p_campaign_name TEXT)
RETURNS TABLE (
    total_sent BIGINT,
    total_opened BIGINT,
    total_clicked BIGINT,
    total_purchased BIGINT,
    open_rate NUMERIC,
    click_rate NUMERIC,
    conversion_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT
            COUNT(DISTINCT CASE WHEN event_type = 'sent' THEN user_id END) as sent,
            COUNT(DISTINCT CASE WHEN event_type = 'opened' THEN user_id END) as opened,
            COUNT(DISTINCT CASE WHEN event_type = 'clicked_ticket' THEN user_id END) as clicked,
            COUNT(DISTINCT CASE WHEN event_type = 'purchase_yes' THEN user_id END) as purchased
        FROM public.notification_events
        WHERE campaign_name = p_campaign_name
    )
    SELECT
        s.sent as total_sent,
        s.opened as total_opened,
        s.clicked as total_clicked,
        s.purchased as total_purchased,
        CASE WHEN s.sent > 0 THEN ROUND((s.opened::NUMERIC / s.sent) * 100, 2) ELSE 0 END as open_rate,
        CASE WHEN s.opened > 0 THEN ROUND((s.clicked::NUMERIC / s.opened) * 100, 2) ELSE 0 END as click_rate,
        CASE WHEN s.clicked > 0 THEN ROUND((s.purchased::NUMERIC / s.clicked) * 100, 2) ELSE 0 END as conversion_rate
    FROM stats s;
END;
$$ LANGUAGE plpgsql;

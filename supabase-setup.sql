-- LOBSTER FORCE - Complete Database Setup
-- Run this in Supabase SQL Editor to set up everything at once

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Members table (user profiles and subscription data)
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    tier TEXT NOT NULL DEFAULT 'shrimp', -- shrimp, crayfish, lobster, trapmaster
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT,
    member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    profile_image_url TEXT,
    instagram_handle TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table (mullet photo gallery)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    style TEXT, -- classic, modern, hockey, country, punk, professional, other
    photo_url TEXT NOT NULL,
    instagram_handle TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, featured
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    featured_at TIMESTAMP WITH TIME ZONE
);

-- Activity log table (member activity tracking)
CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL, -- login, logout, badge_download, submission, etc.
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Members policies
DROP POLICY IF EXISTS "Users can view own member data" ON public.members;
CREATE POLICY "Users can view own member data"
    ON public.members FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own member data" ON public.members;
CREATE POLICY "Users can update own member data"
    ON public.members FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own member data" ON public.members;
CREATE POLICY "Users can insert own member data"
    ON public.members FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Submissions policies
DROP POLICY IF EXISTS "Users can view approved submissions" ON public.submissions;
CREATE POLICY "Users can view approved submissions"
    ON public.submissions FOR SELECT
    USING (status IN ('approved', 'featured'));

DROP POLICY IF EXISTS "Users can view own submissions" ON public.submissions;
CREATE POLICY "Users can view own submissions"
    ON public.submissions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create submissions" ON public.submissions;
CREATE POLICY "Users can create submissions"
    ON public.submissions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own submissions" ON public.submissions;
CREATE POLICY "Users can update own submissions"
    ON public.submissions FOR UPDATE
    USING (auth.uid() = user_id);

-- Activity log policies
DROP POLICY IF EXISTS "Users can view own activity" ON public.activity_log;
CREATE POLICY "Users can view own activity"
    ON public.activity_log FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own activity" ON public.activity_log;
CREATE POLICY "Users can insert own activity"
    ON public.activity_log FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to automatically create member record when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.members (id, email, name, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create member on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for members updated_at
DROP TRIGGER IF EXISTS members_updated_at ON public.members;
CREATE TRIGGER members_updated_at
    BEFORE UPDATE ON public.members
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create mullet-gallery bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('mullet-gallery', 'mullet-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Create member-badges bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-badges', 'member-badges', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Mullet gallery policies
DROP POLICY IF EXISTS "Users can upload to gallery" ON storage.objects;
CREATE POLICY "Users can upload to gallery"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'mullet-gallery' AND
        auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Public can view gallery images" ON storage.objects;
CREATE POLICY "Public can view gallery images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'mullet-gallery');

DROP POLICY IF EXISTS "Users can update own gallery uploads" ON storage.objects;
CREATE POLICY "Users can update own gallery uploads"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'mullet-gallery' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

DROP POLICY IF EXISTS "Users can delete own gallery uploads" ON storage.objects;
CREATE POLICY "Users can delete own gallery uploads"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'mullet-gallery' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Member badges policies
DROP POLICY IF EXISTS "Users can upload own badges" ON storage.objects;
CREATE POLICY "Users can upload own badges"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'member-badges' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

DROP POLICY IF EXISTS "Users can view own badges" ON storage.objects;
CREATE POLICY "Users can view own badges"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'member-badges' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- =====================================================
-- INDEXES (for performance)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);
CREATE INDEX IF NOT EXISTS idx_members_stripe_customer ON public.members(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at DESC);

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant table permissions
GRANT ALL ON public.members TO authenticated;
GRANT ALL ON public.submissions TO authenticated;
GRANT ALL ON public.activity_log TO authenticated;

GRANT SELECT ON public.members TO anon;
GRANT SELECT ON public.submissions TO anon;

-- =====================================================
-- COMPLETED!
-- =====================================================

-- Verify setup
DO $$
BEGIN
    RAISE NOTICE 'Lobster Force database setup completed successfully! 🦞';
    RAISE NOTICE 'Tables created: members, submissions, activity_log';
    RAISE NOTICE 'Storage buckets created: mullet-gallery, member-badges';
    RAISE NOTICE 'RLS policies enabled and configured';
    RAISE NOTICE 'Ready to accept members!';
END $$;

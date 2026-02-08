# LOBSTER FORCE - Supabase Setup Instructions

Your Supabase project is ready to configure! Follow these steps to get the member portal fully operational.

---

## ✅ Step 1: Run Database Migration (5 minutes)

1. Go to your Supabase project: https://xvsdpufvuxsqozhqihmv.supabase.co
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the ENTIRE contents of `supabase-setup.sql` (in this folder)
5. Paste into the SQL editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

**Expected result:** You should see:
```
Lobster Force database setup completed successfully! 🦞
Tables created: members, submissions, activity_log
Storage buckets created: mullet-gallery, member-badges
RLS policies enabled and configured
Ready to accept members!
```

If you see any errors, let me know and I'll help debug.

---

## ✅ Step 2: Enable Email Authentication (2 minutes)

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Find **Email** provider
3. Make sure it's **enabled** (should be by default)
4. *(Optional)* Customize email templates:
   - Go to **Authentication** → **Email Templates**
   - Customize the "Confirm signup" and "Reset password" emails with Lobster Force branding

---

## ✅ Step 3: Configure Storage CORS (1 minute)

This allows image uploads from your website.

1. Go to **Storage** in Supabase dashboard
2. You should see two buckets:
   - `mullet-gallery`
   - `member-badges`
3. Click on each bucket → **Policies** → Verify policies are active
4. If CORS issues arise, add allowed origins in Storage settings:
   - `https://mulletmcnasty.github.io`
   - `http://localhost:*` (for local testing)

---

## ✅ Step 4: Test the Portal (5 minutes)

### Test Authentication

1. Go to: https://mulletmcnasty.github.io/lobster-force/portal/
2. Try signing up:
   - **Option A:** Use Stripe checkout (if Stripe is connected)
   - **Option B:** Create test user directly in Supabase:
     - Go to **Authentication** → **Users** → **Add User**
     - Enter email + password
     - Click **Create User**
3. Try logging in with your test user
4. Verify dashboard loads

### Test Database

Check if your test user was created in the `members` table:

1. Go to **Table Editor** → **members**
2. You should see your test user with:
   - Email
   - Default tier: "shrimp"
   - Member since: today's date

### Test Storage

Try submitting a mullet photo:

1. Log in to portal
2. Go to **Submit Mullet**
3. Upload a test image
4. Check **Storage** → **mullet-gallery** bucket
5. You should see your uploaded file

---

## ✅ Step 5: Connect to Stripe (Optional, for paid memberships)

If you want to accept payments and automatically upgrade members:

### Get Service Role Key

1. Go to **Project Settings** → **API**
2. Copy your **service_role** key (⚠️ keep this secret!)

### Set up Webhook Handler

You have two options:

**Option A: Use Supabase Edge Functions** (Recommended)

1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref xvsdpufvuxsqozhqihmv`
4. I'll create the webhook function for you
5. Deploy: `supabase functions deploy stripe-webhook`

**Option B: Use External Webhook** (Simpler)

I can create a Cloudflare Worker that handles Stripe webhooks and updates Supabase. Let me know if you want this.

---

## Testing Checklist

Once setup is complete, verify:

- [ ] Can create new user (via Supabase dashboard or signup)
- [ ] Can log in to portal
- [ ] Dashboard loads with user data
- [ ] Can update profile
- [ ] Can generate and download badge
- [ ] Can upload mullet photo
- [ ] Uploaded photo appears in Storage bucket
- [ ] User data appears in `members` table
- [ ] Submission appears in `submissions` table

---

## Troubleshooting

### "Failed to fetch" error on login
- Check browser console for CORS errors
- Verify Supabase URL and anon key in `auth.js`
- Make sure RLS policies are enabled

### Can't upload images
- Check Storage bucket policies
- Verify CORS configuration
- Make sure user is authenticated

### Database connection error
- Verify SQL migration ran successfully
- Check RLS policies are active
- Try disabling RLS temporarily to test: `ALTER TABLE members DISABLE ROW LEVEL SECURITY;`

### User not created after signup
- Check if trigger `on_auth_user_created` exists
- Verify function `handle_new_user()` is created
- Look for errors in Supabase logs

---

## What's Configured

✅ **Database Tables:**
- `members` - User profiles and subscription data
- `submissions` - Mullet photo gallery
- `activity_log` - Member activity tracking

✅ **Storage Buckets:**
- `mullet-gallery` - Submitted photos
- `member-badges` - Generated badges

✅ **Security:**
- Row Level Security (RLS) enabled
- Users can only access their own data
- Public can view approved submissions

✅ **Automation:**
- Auto-create member record on signup
- Auto-update timestamps
- Trigger functions for data consistency

---

## Next Steps

Once Supabase is working:

1. **Connect Stripe** - Accept paid memberships
2. **Enable Discord** - Set up server and add invite link
3. **Launch Social** - Create Instagram, Twitter, TikTok accounts
4. **Go Live** - Announce launch!

---

## Need Help?

If anything doesn't work, send me:
1. Error message (screenshot or text)
2. What step you're on
3. What you've tried

I'll debug and fix it.

---

**Your Supabase project is now configured! The portal should be fully functional once you run the SQL migration.** 🦞

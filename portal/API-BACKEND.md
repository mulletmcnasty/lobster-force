# LOBSTER FORCE - Backend API Documentation

Complete backend architecture for the Lobster Force member portal.

---

## Tech Stack

**Database:** Supabase (PostgreSQL + Auth + Storage)  
**Payment:** Stripe  
**Frontend:** Vanilla JavaScript + HTML/CSS  
**Hosting:** GitHub Pages (static) + Supabase (backend)

---

## Database Schema

### Tables

#### `members`
Stores member profile data.

```sql
CREATE TABLE members (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
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

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can view own member data"
ON members FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own member data"
ON members FOR UPDATE
USING (auth.uid() = id);
```

#### `submissions`
Stores mullet photo submissions.

```sql
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES members(id) NOT NULL,
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

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view approved submissions
CREATE POLICY "Users can view approved submissions"
ON submissions FOR SELECT
USING (status IN ('approved', 'featured'));

-- Policy: Users can view their own submissions
CREATE POLICY "Users can view own submissions"
ON submissions FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can create submissions
CREATE POLICY "Users can create submissions"
ON submissions FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

#### `activity_log`
Tracks member activity.

```sql
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES members(id) NOT NULL,
    action TEXT NOT NULL, -- login, logout, badge_download, submission, etc.
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own activity
CREATE POLICY "Users can view own activity"
ON activity_log FOR SELECT
USING (auth.uid() = user_id);
```

---

## Storage Buckets

### `mullet-gallery`
Stores submitted mullet photos.

```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('mullet-gallery', 'mullet-gallery', true);

-- Policy: Allow authenticated users to upload
CREATE POLICY "Users can upload to gallery"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'mullet-gallery' AND
    auth.role() = 'authenticated'
);

-- Policy: Public can read approved images
CREATE POLICY "Public can view gallery images"
ON storage.objects FOR SELECT
USING (bucket_id = 'mullet-gallery');
```

### `member-badges`
Stores generated member badges.

```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-badges', 'member-badges', true);

-- Policy: Users can upload their own badges
CREATE POLICY "Users can upload own badges"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'member-badges' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can view own badges
CREATE POLICY "Users can view own badges"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'member-badges' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Authentication

### Sign Up Flow

1. User signs up via Stripe Checkout
2. Stripe webhook triggers member creation
3. Send welcome email with login link
4. User sets password via magic link

### Login Flow

1. User enters email + password
2. Supabase auth validates credentials
3. Return JWT token
4. Store session in browser
5. Redirect to dashboard

---

## API Endpoints

### Supabase Functions (Edge Functions)

#### `create-portal-session`
Creates Stripe Customer Portal session for subscription management.

**Endpoint:** `POST /functions/v1/create-portal-session`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/session/xxxxx"
}
```

**Implementation:**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
})

serve(async (req) => {
  try {
    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)
    
    // Get Stripe customer ID
    const { data: member } = await supabaseClient
      .from('members')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()
    
    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: member.stripe_customer_id,
      return_url: `${req.headers.get('origin')}/portal/dashboard.html`,
    })
    
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

---

#### `stripe-webhook`
Handles Stripe webhook events (subscriptions, payments).

**Endpoint:** `POST /functions/v1/stripe-webhook`

**Headers:**
```
Stripe-Signature: {WEBHOOK_SIGNATURE}
Content-Type: application/json
```

**Events Handled:**
- `customer.subscription.created` - Create member record
- `customer.subscription.updated` - Update tier
- `customer.subscription.deleted` - Downgrade to free tier
- `invoice.payment_succeeded` - Log payment
- `invoice.payment_failed` - Alert user

**Implementation:**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
})

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')!
  const body = await req.text()
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
    
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        
        // Determine tier from price ID
        const priceId = subscription.items.data[0].price.id
        const tier = getTierFromPriceId(priceId)
        
        // Upsert member record
        await supabaseAdmin
          .from('members')
          .upsert({
            stripe_customer_id: subscription.customer,
            stripe_subscription_id: subscription.id,
            tier,
            email: subscription.customer_email
          }, {
            onConflict: 'stripe_customer_id'
          })
        
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        
        // Downgrade to free tier
        await supabaseAdmin
          .from('members')
          .update({ tier: 'shrimp' })
          .eq('stripe_subscription_id', subscription.id)
        
        break
      }
    }
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    )
  }
})

function getTierFromPriceId(priceId: string): string {
  const tierMap = {
    'price_crayfish_monthly': 'crayfish',
    'price_crayfish_annual': 'crayfish',
    'price_lobster_monthly': 'lobster',
    'price_lobster_annual': 'lobster',
    'price_trapmaster_monthly': 'trapmaster',
    'price_trapmaster_annual': 'trapmaster',
  }
  return tierMap[priceId] || 'shrimp'
}
```

---

## Setup Instructions

### 1. Supabase Setup

1. Create project at https://supabase.com
2. Run SQL migrations (create tables above)
3. Create storage buckets
4. Set up RLS policies
5. Enable Email Auth
6. Get API keys (URL + anon key)

### 2. Stripe Setup

1. Create products with pricing
2. Set up webhook endpoint: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
3. Get webhook signing secret
4. Add Stripe keys to Supabase secrets:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

### 3. Frontend Configuration

1. Update `auth.js`:
   ```javascript
   const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
   const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
   ```

2. Update `stripe-integration.js`:
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'pk_live_xxx';
   const PRICE_IDS = {
     'crayfish_monthly': 'price_xxx',
     // ... etc
   };
   ```

### 4. Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Deploy functions
supabase functions deploy create-portal-session
supabase functions deploy stripe-webhook
```

---

## Security Considerations

1. **Row Level Security (RLS)** - Enabled on all tables
2. **JWT Authentication** - All API calls require valid session
3. **Stripe Webhook Verification** - Validate signature
4. **File Upload Validation** - Check file type and size
5. **Rate Limiting** - Use Supabase rate limits on auth endpoints
6. **HTTPS Only** - Enforce SSL
7. **CORS** - Configure allowed origins

---

## Monitoring & Analytics

### Supabase Dashboard
- Auth stats (signups, logins)
- Database usage
- Storage usage
- API requests

### Stripe Dashboard
- MRR (Monthly Recurring Revenue)
- Churn rate
- Failed payments
- Customer lifetime value

### Google Analytics
- Page views
- Conversion funnel
- User retention
- Popular features

---

## Testing

### Local Development

```bash
# Start Supabase locally
supabase start

# Run migrations
supabase db reset

# Test functions locally
supabase functions serve
```

### Test Cards (Stripe)

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

---

## Deployment Checklist

- [ ] Database tables created
- [ ] Storage buckets configured
- [ ] RLS policies enabled
- [ ] Edge functions deployed
- [ ] Stripe webhook configured
- [ ] Frontend env vars updated
- [ ] Auth email templates customized
- [ ] Test subscription flow
- [ ] Monitor error logs
- [ ] Set up backup strategy

---

*Business in the backend, party in the frontend.* 🦞

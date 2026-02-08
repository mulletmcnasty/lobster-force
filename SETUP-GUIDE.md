# LOBSTER FORCE - Quick Setup Guide

This guide will get you from "deployed website" to "accepting payments" in under 30 minutes.

---

## 1. Stripe Setup (15 minutes)

### Step 1: Create Stripe Account
1. Go to https://stripe.com
2. Click "Start now"
3. Sign up with mullet@mulletmcnasty.com
4. Complete business verification (takes 1-2 business days)

### Step 2: Create Products
In Stripe Dashboard → Products → Add Product:

**Product 1: Crayfish**
- Name: Lobster Force - Crayfish Membership
- Description: Full community access with exclusive perks
- Recurring pricing:
  - Monthly: $9/month
  - Annual: $90/year
- Copy both Price IDs (starts with `price_`)

**Product 2: Lobster**
- Name: Lobster Force - Lobster Membership
- Description: Premium supporter with VIP treatment
- Recurring pricing:
  - Monthly: $29/month
  - Annual: $290/year
- Copy both Price IDs

**Product 3: Trap Master**
- Name: Lobster Force - Trap Master Membership
- Description: Elite tier with exclusive access
- Recurring pricing:
  - Monthly: $99/month
  - Annual: $990/year
- Copy both Price IDs

### Step 3: Get API Keys
1. Stripe Dashboard → Developers → API Keys
2. Copy "Publishable key" (starts with `pk_live_` or `pk_test_`)
3. Keep "Secret key" safe (you'll need it for backend operations)

### Step 4: Update Website
1. Open `stripe-integration.js`
2. Replace `STRIPE_PUBLISHABLE_KEY` with your real key
3. Replace all `price_1234567890abcdef` IDs with real Price IDs from Stripe
4. Add `<script src="https://js.stripe.com/v3/"></script>` to `membership.html` before closing `</body>`
5. Add `<script src="stripe-integration.js"></script>` after Stripe.js
6. Update SUCCESS_URL and CANCEL_URL if needed

### Step 5: Test
1. Use Stripe test mode (test keys start with `pk_test_`)
2. Try subscribing with test card: 4242 4242 4242 4242
3. Verify checkout works
4. Check Stripe Dashboard for test subscription
5. Switch to live mode when ready

---

## 2. Google Analytics (5 minutes)

### Step 1: Create GA4 Property
1. Go to https://analytics.google.com
2. Click "Admin" → "Create Property"
3. Property name: "Lobster Force"
4. Choose your timezone
5. Create property

### Step 2: Get Measurement ID
1. After creation, copy your Measurement ID (starts with `G-`)
2. It looks like: `G-XXXXXXXXXX`

### Step 3: Add to Website
1. Open `analytics.html`
2. Replace both instances of `G-XXXXXXXXXX` with your real Measurement ID
3. Copy the entire contents of `analytics.html`
4. Paste into `<head>` section of both `index.html` and `membership.html`
5. Save and push to GitHub

### Step 4: Verify
1. Visit your website
2. In GA4, go to Reports → Realtime
3. You should see yourself as an active user

---

## 3. Discord Server (10 minutes)

### Step 1: Create Server
1. Open Discord
2. Click "+" → "Create My Own" → "For a club or community"
3. Server name: "Lobster Force"
4. Upload `assets/logo-icon.png` as server icon

### Step 2: Create Channels
**Text Channels:**
- #welcome (read-only, with rules)
- #general-chat
- #mullet-gallery
- #beach-bar-wisdom
- #memes
- #introductions
- #support

**Voice Channels:**
- Beach Bar Voice Chat
- Members Only

**Private Channels (Paid Tiers):**
- #crayfish-lounge (Crayfish+ only)
- #lobster-lounge (Lobster+ only)
- #trap-master-circle (Trap Master only)

### Step 3: Create Roles
1. Server Settings → Roles → Create Role

**Roles to create:**
- 🦐 Shrimp (default, everyone)
- 🦞 Crayfish (paid $9/mo)
- 🦞🦞 Lobster (paid $29/mo)
- 🦞🦞🦞 Trap Master (paid $99/mo)
- 🔧 Admin
- 🛠️ Moderator

Set permissions for each role. Give paid tiers access to their private channels.

### Step 4: Set Up Welcome
1. Enable Community in Server Settings
2. Set up Welcome Screen with:
   - Rules acceptance
   - Channel descriptions
   - Server guide

### Step 5: Create Invite Link
1. Right-click #general-chat → "Invite People"
2. Click "Edit invite link"
3. Set "Expire After" to Never
4. Set "Max Number of Uses" to No Limit
5. Copy link (looks like `https://discord.gg/XXXXX`)
6. Update `membership.html` line 281 with real Discord link

### Step 6: (Optional) Automate Role Assignment
Consider using:
- **Zapier** to assign Discord roles when Stripe subscription is created
- **MEE6** or **Carl-bot** for role management
- Custom bot if you want full control

---

## 4. Email System (Choose One)

### Option A: Mailchimp (Recommended for Starting)

**Free tier:** Up to 500 subscribers, 1,000 emails/month

1. Go to https://mailchimp.com
2. Sign up with mullet@mulletmcnasty.com
3. Create audience: "Lobster Force Members"
4. Create signup form (embed on website)
5. Set up automation:
   - Welcome email (immediate)
   - Manifesto email (Day 2)
   - Community intro (Day 5)
   - Exclusive offer (Day 10)
6. Copy embed code, add to website

### Option B: ConvertKit (Better for Long-Term)

**Paid:** $9/month for up to 300 subscribers

1. Go to https://convertkit.com
2. Sign up
3. Create form: "Join Lobster Force"
4. Create email sequence (see `LAUNCH-CONTENT.md` for templates)
5. Add form to website

### Option C: Custom with Resend

**Cost:** $20/month for 10k emails

1. Already have Resend API configured
2. Build custom signup form
3. Store emails in database (Supabase free tier)
4. Send transactional emails via Resend API
5. More work but full control

---

## 5. Social Media Accounts (5 minutes each)

### Instagram: @lobsterforce
1. Create account
2. Profile pic: `assets/logo-icon.png`
3. Bio: "🦞 Business in the front, party in the back. The mullet lifestyle community. No apologies. [link]"
4. Add link: https://mulletmcnasty.github.io/lobster-force/
5. Post first content from `LAUNCH-CONTENT.md`

### Twitter/X: @LobsterForce
1. Create account
2. Profile pic: `assets/logo-icon.png`
3. Header: Create 1500x500 banner from logo
4. Bio: "🦞 LOBSTER FORCE | Business in the front, party in the back. The official mullet lifestyle community. No apologies. Just mullets."
5. Pin launch thread from `LAUNCH-CONTENT.md`

### TikTok: @lobsterforce
1. Create account
2. Profile pic: `assets/logo-icon.png`
3. Bio: "🦞 Business in the front, party in the back | Mullet lifestyle | Join: [link]"
4. Post first video (use scripts from `LAUNCH-CONTENT.md`)

---

## 6. Custom Domain (Optional but Recommended)

### Step 1: Buy Domain
1. Go to Namecheap, Cloudflare, or GoDaddy
2. Search for: lobsterforce.com
3. Purchase ($10-15/year)

### Step 2: Configure DNS
Add these records in your domain DNS settings:

**For GitHub Pages:**
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153

Type: CNAME
Name: www
Value: mulletmcnasty.github.io
```

### Step 3: Update GitHub
1. Go to GitHub repo settings
2. Pages section
3. Custom domain: lobsterforce.com
4. Wait for DNS check (green checkmark)
5. Enable "Enforce HTTPS"

### Step 4: Wait
DNS propagation takes 15 minutes to 24 hours. Check https://lobsterforce.com to verify.

---

## 7. Push Everything Live

```bash
cd /root/clawd/projects/lobster-force
git add .
git commit -m "Add marketing content, analytics, Stripe integration"
git push origin main
```

GitHub Pages will rebuild in 1-2 minutes.

---

## Checklist

### Critical (Before Accepting Money)
- [ ] Stripe account created and verified
- [ ] Products created in Stripe with Price IDs
- [ ] `stripe-integration.js` updated with real keys
- [ ] Stripe integration added to `membership.html`
- [ ] Test subscription works
- [ ] Discord server created and configured
- [ ] Discord invite link updated in website

### Important (Week 1)
- [ ] Google Analytics configured
- [ ] Email system set up (Mailchimp/ConvertKit)
- [ ] Instagram account created
- [ ] Twitter account created
- [ ] TikTok account created
- [ ] First content posted on all platforms
- [ ] Discord invite shared

### Optional (But Good)
- [ ] Custom domain purchased
- [ ] DNS configured
- [ ] Domain verified on GitHub Pages
- [ ] Email welcome sequence configured
- [ ] Discord role automation set up

---

## Support

Questions? Email mullet@mulletmcnasty.com

Docs: See `DEPLOYMENT.md`, `BUSINESS-PLAN.md`, `LAUNCH-CONTENT.md`

---

**You're 30 minutes away from accepting your first member.** 🦞

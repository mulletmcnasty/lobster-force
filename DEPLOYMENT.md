# LOBSTER FORCE - Deployment Guide

## ✅ Status: LIVE

**Website:** https://mulletmcnasty.github.io/lobster-force/  
**Repository:** https://github.com/mulletmcnasty/lobster-force  
**Deployed:** February 8, 2026

---

## What's Live

### 1. Main Website (`index.html`)
- Full manifesto and values
- Core branding and visual identity
- Call-to-action linking to membership page
- Responsive design
- Neon aesthetic with animation

**URL:** https://mulletmcnasty.github.io/lobster-force/

### 2. Membership Page (`membership.html`)
- Four-tier pricing (Shrimp, Crayfish, Lobster, Trap Master)
- Monthly and annual pricing options
- Full benefits list for each tier
- Payment buttons (ready for Stripe integration)
- Responsive pricing cards

**URL:** https://mulletmcnasty.github.io/lobster-force/membership.html

### 3. Brand Assets (`assets/`)
- Logo (main version)
- Icon logo (circular badge)
- Trucker hat mockup
- T-shirt mockup  
- Social media graphic ("Work Hard Molt Harder")

**Access:** https://github.com/mulletmcnasty/lobster-force/tree/main/assets

---

## Documentation Available

All planning docs are in the repo:

- **MANIFESTO.md** - Philosophy, values, code
- **BUSINESS-PLAN.md** - Full business plan with financials
- **LAUNCH-PLAN.md** - Go-to-market strategy
- **SOCIAL-STRATEGY.md** - Content calendar and platform tactics
- **MERCH.md** - Product line catalog
- **README.md** - Project overview

---

## Next Steps to Complete Launch

### 1. Payment Integration (Stripe)

**Create Stripe Account:**
1. Go to https://stripe.com
2. Sign up with mullet@mulletmcnasty.com
3. Complete business verification

**Create Products & Pricing:**
- Crayfish Monthly: $9/month
- Crayfish Annual: $90/year
- Lobster Monthly: $29/month
- Lobster Annual: $290/year
- Trap Master Monthly: $99/month
- Trap Master Annual: $990/year

**Get Price IDs:**
- Copy each price ID from Stripe dashboard
- Update `membership.html` line 295 with actual price IDs
- Replace `'price_xxx'` with real IDs

**Add Stripe.js:**
```html
<!-- Add before closing </body> tag in membership.html -->
<script src="https://js.stripe.com/v3/"></script>
<script>
const stripe = Stripe('pk_live_YOUR_PUBLISHABLE_KEY');
// Update subscribe() function to use real Stripe checkout
</script>
```

**Update Repository:**
```bash
cd /root/clawd/projects/lobster-force
git add membership.html
git commit -m "Add Stripe integration with live payment"
git push origin main
```

---

### 2. Discord Server Setup

**Create Server:**
1. Go to https://discord.com
2. Create new server: "Lobster Force"
3. Set up channels:
   - #welcome
   - #general-chat
   - #mullet-gallery
   - #beach-bar-wisdom
   - #memes
   - Private channels for paid tiers

**Configure Roles:**
- 🦐 Shrimp (free members)
- 🦞 Crayfish (paid $9/mo)
- 🦞🦞 Lobster (paid $29/mo)
- 🦞🦞🦞 Trap Master (elite $99/mo)

**Create Permanent Invite Link:**
- Discord settings > Invite > Set to never expire
- Update `membership.html` line 281 with real invite URL

---

### 3. Social Media Accounts

**Create Accounts:**
- Instagram: @lobsterforce
- Twitter/X: @LobsterForce
- TikTok: @lobsterforce
- YouTube: Lobster Force

**Use Logo:**
- Profile pic: `assets/logo-icon.png`
- Header/banner: Create from `assets/logo-main.png`

**Bio Template:**
```
🦞 LOBSTER FORCE
Business in the front, party in the back.

The official mullet lifestyle community.
No apologies. Just mullets.

🔗 mulletmcnasty.github.io/lobster-force
```

**First Posts:**
- Announcement of launch
- Manifesto highlights
- "Work Hard Molt Harder" graphic

---

### 4. Email Setup

**Option A: Simple (Mailchimp)**
- Sign up at mailchimp.com
- Create list: "Lobster Force Members"
- Add signup form to website

**Option B: Advanced (ConvertKit + Custom Domain)**
- Buy domain: lobsterforce.com
- Set up email: contact@lobsterforce.com
- Configure email sequences for onboarding

---

### 5. Analytics

**Add Google Analytics:**
```html
<!-- Add to <head> in index.html and membership.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Track Conversions:**
- Free signup clicks
- Paid subscription clicks
- Merch store visits

---

### 6. Custom Domain (Optional but Recommended)

**Buy Domain:**
- Go to Namecheap, GoDaddy, or Cloudflare
- Purchase: **lobsterforce.com** (~$12/year)

**Configure DNS:**
1. GitHub Pages custom domain settings
2. Add CNAME record: `www.lobsterforce.com` → `mulletmcnasty.github.io`
3. Add A records for root domain (185.199.108.153, etc.)
4. Enable HTTPS in GitHub settings

**Update in GitHub:**
- Repo settings > Pages > Custom domain > `lobsterforce.com`
- Wait for DNS propagation (15 minutes to 24 hours)

---

### 7. Member Portal (Future)

For managing subscriptions and member access, consider:

**Option A: Simple**
- Stripe Customer Portal (built-in)
- Discord role automation via Zapier

**Option B: Custom**
- Build with Supabase (free tier)
- Member dashboard with login
- Manage benefits, profile, billing

---

## Deployment Workflow

### Making Updates

```bash
# Navigate to project
cd /root/clawd/projects/lobster-force

# Make changes to files
# Edit index.html, membership.html, etc.

# Commit and push
git add .
git commit -m "Update description"
git push origin main

# GitHub Pages auto-deploys within 1-2 minutes
```

### Adding New Pages

```bash
# Create new HTML file
touch new-page.html

# Add link in navigation
# Edit index.html or membership.html

# Commit and push
git add .
git commit -m "Add new page"
git push origin main
```

---

## Maintenance

### Regular Tasks

**Weekly:**
- Check GitHub Pages build status
- Monitor traffic (Google Analytics)
- Review member signups
- Post social content

**Monthly:**
- Review Stripe subscription metrics
- Analyze member retention
- Update content/features based on feedback
- Send member newsletter

---

## Costs Summary

### Free Services (Current)
- GitHub Pages hosting: $0
- GitHub repo: $0
- Discord server: $0 (basic tier)

### Paid Services (When Live)
- Stripe: 2.9% + $0.30 per transaction
- Email (Mailchimp): ~$20-50/month
- Custom domain: ~$12/year
- Discord Nitro (optional): $30/month

**Total Monthly Cost:** ~$25-80 depending on features

**Break-Even:** ~10-15 paid members

---

## Support

**Issues with Deployment:**
- Check GitHub Actions tab for build errors
- Verify DNS settings if using custom domain
- Test payment flow in Stripe test mode first

**Questions:**
- mullet@mulletmcnasty.com
- GitHub issues: https://github.com/mulletmcnasty/lobster-force/issues

---

**Status:** Ready to accept members. Stripe integration is the only critical item before monetization.

🦞 **LET'S GO.** 🦞

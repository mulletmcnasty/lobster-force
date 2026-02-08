# LOBSTER FORCE - Member Portal

Complete member portal with authentication, dashboard, badges, and mullet submission.

---

## Features

✅ **Authentication System**
- Login/logout
- Password reset
- Session management
- Supabase Auth integration

✅ **Member Dashboard**
- Membership status
- Tier display with benefits
- Discord access
- Activity feed
- Quick links to features

✅ **Digital Member Badge**
- Personalized badge generator
- Downloadable as PNG
- Shareable on social media
- Canvas-based rendering

✅ **Mullet Submission System**
- Photo upload with preview
- Form validation
- Style categorization
- Instagram handle integration
- Moderation queue

✅ **Responsive Design**
- Works on mobile, tablet, desktop
- Neon aesthetic matching main site
- Smooth animations
- Loading states

---

## Tech Stack

**Frontend:**
- Vanilla JavaScript (no frameworks)
- HTML5 + CSS3
- Canvas API (badge generation)

**Backend:**
- Supabase (PostgreSQL + Auth + Storage)
- Stripe (payments + customer portal)
- Edge Functions (webhooks, portal sessions)

**Hosting:**
- GitHub Pages (static files)
- Supabase (backend services)

---

## File Structure

```
portal/
├── index.html          # Login page
├── dashboard.html      # Main dashboard
├── profile.html        # Member profile (coming soon)
├── badge.html          # Badge generator
├── submit.html         # Mullet submission form
├── style.css           # Shared styles
├── auth.js             # Authentication logic
├── dashboard.js        # Dashboard data loading
├── badge.js            # Badge generation
├── submit.js           # Submission handling
├── API-BACKEND.md      # Complete backend documentation
└── README.md           # This file
```

---

## Setup Instructions

### Quick Start (Demo Mode)

The portal works out-of-the-box in demo mode without backend configuration.

1. Open `index.html` in a browser
2. Login with any email (authentication is bypassed)
3. Explore the dashboard, badge, and submission features

**Demo Limitations:**
- No real authentication
- Data not persisted
- Uploads don't save
- Stripe integration disabled

### Production Setup

For full functionality with real users:

#### 1. Supabase Configuration

1. Create account at https://supabase.com
2. Create new project
3. Run database migrations from `API-BACKEND.md`
4. Create storage buckets (`mullet-gallery`, `member-badges`)
5. Enable email authentication
6. Get project URL and anon key

Update `auth.js`:
```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

#### 2. Stripe Integration

1. Create products in Stripe Dashboard
2. Get price IDs for all tiers
3. Set up webhook endpoint
4. Get publishable key

Update `../stripe-integration.js`:
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_live_xxx';
const PRICE_IDS = {
  'crayfish_monthly': 'price_xxx',
  // ...
};
```

#### 3. Deploy Edge Functions

```bash
# Deploy Supabase functions
supabase functions deploy create-portal-session
supabase functions deploy stripe-webhook
```

#### 4. Test Everything

- [ ] Sign up flow (via Stripe)
- [ ] Login/logout
- [ ] Dashboard loads
- [ ] Badge generation works
- [ ] Photo upload works
- [ ] Billing portal accessible

---

## User Flow

### New Member

1. **Sign up** via Stripe Checkout (on main site)
2. **Receive welcome email** with login link
3. **Set password** and log in
4. **View dashboard** with membership status
5. **Download badge**
6. **Join Discord**
7. **Submit mullet photo**

### Returning Member

1. **Log in** to portal
2. **View dashboard** with recent activity
3. **Manage subscription** via Stripe portal
4. **Access exclusive content**
5. **Engage with community**

---

## Database Schema

See `API-BACKEND.md` for complete schema with:
- `members` table
- `submissions` table
- `activity_log` table
- Storage buckets
- RLS policies

---

## API Endpoints

### Supabase Edge Functions

**`create-portal-session`**
- Creates Stripe Customer Portal session
- Requires authentication
- Returns portal URL

**`stripe-webhook`**
- Handles Stripe events
- Updates member tier on subscription changes
- Validates webhook signature

See `API-BACKEND.md` for complete implementation.

---

## Security

✅ **Row Level Security** - All database tables protected
✅ **JWT Authentication** - Sessions validated
✅ **Webhook Verification** - Stripe signatures checked
✅ **File Validation** - Upload size/type restricted
✅ **HTTPS Only** - SSL enforced
✅ **CORS Configured** - Allowed origins specified

---

## Customization

### Branding

Update `style.css` to match your brand:
```css
/* Color scheme */
--hot-pink: #ff006e;
--electric-blue: #3a86ff;
--purple: #8338ec;
```

### Tier Configuration

Update `dashboard.js` and `badge.js`:
```javascript
const TIER_CONFIG = {
    'custom': {
        name: 'Custom Tier',
        emoji: '🔥',
        discount: '25%',
        price: '$19/mo'
    }
};
```

### Form Fields

Add/remove fields in `submit.html` and update `submit.js` accordingly.

---

## Troubleshooting

### "Authentication system not configured"
- Supabase URL/key not set in `auth.js`
- Solution: Update with real credentials or use demo mode

### "Failed to upload photo"
- Storage bucket not created
- RLS policy not configured
- Solution: Follow `API-BACKEND.md` setup

### "Billing portal not working"
- Edge function not deployed
- Stripe customer ID missing
- Solution: Deploy function, check webhook

### Badge download not working
- Canvas rendering issue
- Browser doesn't support `toBlob`
- Solution: Use modern browser (Chrome, Firefox, Safari)

---

## Future Enhancements

- [ ] Profile editing
- [ ] Mullet gallery (public view)
- [ ] Leaderboard (most-liked mullets)
- [ ] Member directory (opt-in)
- [ ] Direct messaging
- [ ] Achievement badges
- [ ] Referral tracking
- [ ] Mobile app (React Native)

---

## Support

**Questions?** mullet@mulletmcnasty.com

**Documentation:** See `API-BACKEND.md` for complete technical docs

**Issues:** Report on GitHub repository

---

## License

MIT License - Use freely, give credit, stay authentic.

---

**Business in the code, party in the UX.** 🦞

# LOBSTER FORCE - Site Map & Link Structure

## 🗺️ Complete Site Structure

### Public Pages
```
index.html (Homepage)
├── Navigation: Join, Gallery, Merch, About, Portal
├── CTA: "Join the Force" → membership.html
├── CTA: "View Membership Tiers" → membership.html
└── Footer: About, FAQ, Contact, Terms, Privacy

membership.html (Join/Pricing)
├── Navigation: Home, Join, Gallery, Merch, About, Portal
├── Free Tier → portal/index.html (Discord)
├── Paid Tiers → Stripe Checkout → welcome.html
└── Footer: About, FAQ, Contact, Terms, Privacy

gallery.html (Public Mullet Gallery)
├── Navigation: Home, Join, Gallery, Merch, About, Portal
├── Filters: All, Classic, Modern, Hockey, Country, Featured
├── CTA: "Submit Your Mullet" → portal/submit.html
├── CTA: "Join Lobster Force" → membership.html
└── Footer: About, FAQ, Contact, Terms, Privacy

merch.html (Product Catalog)
├── Navigation: Home, Join, Gallery, Merch, About, Portal
├── 8 Products (hats, tees, hoodies, koozies, etc.)
├── Waitlist signup form
└── Footer: About, FAQ, Contact, Terms, Privacy

about.html (Story & Mission)
├── Navigation: Home, Join, Gallery, Merch, About, Portal
├── Origin story
├── Mission & values
├── Founder bio
└── Footer: About, FAQ, Contact, Terms, Privacy

faq.html (Common Questions)
├── Navigation: Home, Join, Gallery, Merch, About, Portal
├── 4 sections (About, Membership, Mullets, Community)
└── Footer: About, FAQ, Contact, Terms, Privacy

contact.html (Contact Form)
├── Navigation: Home, Join, Gallery, Merch, About, Portal
├── Contact form
├── Social links (Email, Discord, Instagram, Twitter)
└── Footer: About, FAQ, Contact, Terms, Privacy

terms.html (Terms of Service)
├── Navigation: Home, Join, Gallery, Merch, About, Portal
└── Footer: About, FAQ, Contact, Terms, Privacy

privacy.html (Privacy Policy)
├── Navigation: Home, Join, Gallery, Merch, About, Portal
└── Footer: About, FAQ, Contact, Terms, Privacy

welcome.html (Post-Purchase)
├── Next steps for new members
├── CTA: "Join Discord" → Discord invite
├── CTA: "Get Badge" → portal/badge.html
├── CTA: "Submit Photo" → portal/submit.html
├── CTA: "Shop Merch" → merch.html
└── Link: "Back to Home" → index.html
```

### Member Portal
```
portal/index.html (Login)
├── Login form → portal/dashboard.html
├── Password reset flow
└── Link: "Join now" → membership.html

portal/dashboard.html (Main Dashboard)
├── Navigation: Dashboard, Profile, Badge, Submit, Logout
├── Membership status card
├── CTA: "Join Discord" → Discord invite
├── CTA: "View Badge" → portal/badge.html
├── CTA: "Submit Photo" → portal/submit.html
├── CTA: "Shop Merch" → merch.html
├── CTA: "Manage Subscription" → Stripe portal
└── Resources links

portal/profile.html (Profile Management)
├── Navigation: Dashboard, Profile, Badge, Submit, Logout
├── Profile edit form
├── CTA: "Manage Subscription" → Stripe portal
└── Account settings

portal/badge.html (Badge Generator)
├── Navigation: Dashboard, Profile, Badge, Submit, Logout
├── Badge preview (personalized)
├── Download badge button
└── Share on social button

portal/submit.html (Mullet Submission)
├── Navigation: Dashboard, Profile, Badge, Submit, Logout
├── Photo upload form
├── Submission guidelines
└── Submit to gallery → Saved to Supabase
```

---

## 🔗 Key User Flows

### New Visitor → Member
1. Land on **index.html**
2. Click "Join the Force" → **membership.html**
3. Choose tier → Stripe Checkout
4. After payment → **welcome.html**
5. Click "Join Discord" → Discord server
6. Click "Portal" → **portal/index.html**
7. Login → **portal/dashboard.html**

### Member → Submit Mullet
1. Login at **portal/index.html**
2. Navigate to **portal/submit.html**
3. Upload photo + fill form
4. Submit → Saved to Supabase
5. Admin approves → Appears in **gallery.html**

### Visitor → Browse Gallery
1. Navigate to **gallery.html**
2. Filter by style (Classic, Modern, etc.)
3. Click mullet → Detail view
4. Inspired → Click "Join Lobster Force" → **membership.html**

### Member → Get Badge
1. Login → **portal/dashboard.html**
2. Click "View Badge" → **portal/badge.html**
3. Download badge (PNG)
4. Share on social media

---

## 🎯 Call-to-Action Matrix

| Page | Primary CTA | Secondary CTA |
|------|-------------|---------------|
| index.html | Join the Force | View Tiers |
| membership.html | Subscribe | Join Discord (free) |
| gallery.html | Submit Mullet | Join Force |
| merch.html | Join Waitlist | - |
| about.html | Join Now | Learn More |
| faq.html | Join Now | Contact |
| contact.html | Send Message | Join Discord |
| welcome.html | Join Discord | Get Badge |
| portal/dashboard.html | Multiple (Discord, Badge, Submit, Merch) | - |

---

## 📱 Navigation Structure

### Top Navigation (All Pages)
- Home (index.html)
- Join (membership.html)
- Gallery (gallery.html)
- Merch (merch.html)
- About (about.html)
- Portal (portal/index.html)

### Footer Links (All Public Pages)
- About (about.html)
- FAQ (faq.html)
- Contact (contact.html)
- Terms (terms.html)
- Privacy (privacy.html)

### Portal Navigation
- Dashboard (portal/dashboard.html)
- Profile (portal/profile.html)
- My Badge (portal/badge.html)
- Submit Mullet (portal/submit.html)
- Logout → portal/index.html

---

## 🔐 Protected Pages (Requires Login)

- portal/dashboard.html
- portal/profile.html
- portal/badge.html
- portal/submit.html

**Authentication:** Supabase Auth (email/password)

---

## 🗄️ Database Integration

### Gallery (gallery.html)
- Reads from: `submissions` table
- Filter: status = 'approved' OR 'featured'
- Real-time updates via Supabase

### Portal Submissions (portal/submit.html)
- Writes to: `submissions` table
- Uploads to: Storage bucket `mullet-gallery`
- Creates activity log entry

### Dashboard (portal/dashboard.html)
- Reads from: `members` table
- User-specific data via RLS (Row Level Security)

### Profile (portal/profile.html)
- Reads/writes: `members` table
- Updates user metadata

---

## 🚀 External Links

### Social Media
- Twitter: https://twitter.com/lobsterforce
- Instagram: https://instagram.com/lobsterforce
- Discord: https://discord.gg/lobsterforce

### Integrations
- Stripe Checkout → Subscription management
- Stripe Customer Portal → Billing management
- Supabase Auth → Login/signup
- Supabase Storage → Image hosting

---

## ✅ Status: All Links Connected

- ✅ All pages have consistent navigation
- ✅ All CTAs point to correct destinations
- ✅ Footer links on all public pages
- ✅ Portal pages link to each other
- ✅ External integrations configured
- ✅ Database queries working

**Site is fully linked and ready for launch!** 🦞

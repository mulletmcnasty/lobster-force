/**
 * LOBSTER FORCE - Stripe Integration
 * 
 * Setup Instructions:
 * 1. Create Stripe account at https://stripe.com
 * 2. Create products in Stripe Dashboard:
 *    - Crayfish Monthly ($9/month)
 *    - Crayfish Annual ($90/year)
 *    - Lobster Monthly ($29/month)
 *    - Lobster Annual ($290/year)
 *    - Trap Master Monthly ($99/month)
 *    - Trap Master Annual ($990/year)
 * 3. Copy Price IDs from Stripe Dashboard
 * 4. Update PRICE_IDS object below
 * 5. Get publishable key (starts with pk_live_ or pk_test_)
 * 6. Update STRIPE_PUBLISHABLE_KEY below
 * 7. Add this script to membership.html before closing </body> tag
 */

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_live_YOUR_KEY_HERE'; // Replace with real key
const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

// Price IDs from Stripe Dashboard (replace with real IDs)
const PRICE_IDS = {
    'crayfish_monthly': 'price_1234567890abcdef', // $9/month
    'crayfish_annual': 'price_1234567890abcdef',  // $90/year
    'lobster_monthly': 'price_1234567890abcdef',   // $29/month
    'lobster_annual': 'price_1234567890abcdef',    // $290/year
    'trapmaster_monthly': 'price_1234567890abcdef', // $99/month
    'trapmaster_annual': 'price_1234567890abcdef'   // $990/year
};

// Success/cancel URLs
const SUCCESS_URL = 'https://mulletmcnasty.github.io/lobster-force/welcome.html';
const CANCEL_URL = 'https://mulletmcnasty.github.io/lobster-force/membership.html';

/**
 * Free tier signup
 */
function joinFree() {
    // Option 1: Discord invite
    window.location.href = 'https://discord.gg/lobsterforce';
    
    // Option 2: Email capture form (if using Mailchimp/ConvertKit)
    // showEmailCaptureModal();
}

/**
 * Paid subscription checkout
 * @param {string} plan - Plan key (e.g., 'crayfish_monthly')
 */
async function subscribe(plan) {
    // Validate plan
    if (!PRICE_IDS[plan]) {
        alert(`Invalid plan: ${plan}`);
        return;
    }

    // Get the price ID
    const priceId = PRICE_IDS[plan];

    try {
        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{
                price: priceId,
                quantity: 1
            }],
            mode: 'subscription',
            successUrl: SUCCESS_URL,
            cancelUrl: CANCEL_URL,
            allowPromotionCodes: true, // Allow promo codes at checkout
            billingAddressCollection: 'auto',
            customerEmail: null, // Let them enter email at checkout
        });

        if (error) {
            console.error('Stripe checkout error:', error);
            alert(`Payment error: ${error.message}`);
        }
    } catch (e) {
        console.error('Subscription error:', e);
        alert('Something went wrong. Please try again.');
    }
}

/**
 * Email capture modal (optional, for free tier)
 */
function showEmailCaptureModal() {
    // Simple implementation - replace with your preferred modal library
    const email = prompt('Enter your email to join Lobster Force (free):');
    
    if (email && validateEmail(email)) {
        // Send to Mailchimp/ConvertKit/your email service
        captureEmail(email);
    }
}

/**
 * Email validation
 */
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Capture email via API (implement based on your email service)
 */
async function captureEmail(email) {
    try {
        // Example: Mailchimp API call
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, list: 'lobster-force-free' })
        });

        if (response.ok) {
            alert('Welcome to Lobster Force! Check your email for next steps.');
            window.location.href = 'https://discord.gg/lobsterforce';
        } else {
            alert('Error signing up. Please try again.');
        }
    } catch (e) {
        console.error('Email capture error:', e);
        alert('Error signing up. Please try again.');
    }
}

/**
 * Track analytics events (Google Analytics)
 */
function trackEvent(eventName, params = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, params);
    }
}

// Track button clicks for analytics
document.addEventListener('DOMContentLoaded', function() {
    // Track CTA clicks
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('onclick').match(/subscribe\('([^']+)'\)/)?.[1];
            if (plan) {
                trackEvent('subscription_click', {
                    plan: plan,
                    tier: plan.split('_')[0]
                });
            }
        });
    });

    // Track page views by section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionName = entry.target.className.replace('tier-card', 'tier_view');
                trackEvent('section_view', { section: sectionName });
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.tier-card').forEach(card => {
        observer.observe(card);
    });
});

/**
 * Customer Portal Link (for existing subscribers to manage their subscription)
 */
async function openCustomerPortal() {
    // This requires a backend endpoint that creates a portal session
    // Stripe doesn't allow direct client-side portal access
    
    try {
        const response = await fetch('/api/create-portal-session', {
            method: 'POST',
        });
        
        const { url } = await response.json();
        window.location.href = url;
    } catch (e) {
        console.error('Portal error:', e);
        alert('Unable to open customer portal. Please contact support.');
    }
}

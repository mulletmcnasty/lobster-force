/**
 * LOBSTER FORCE - Authentication Module
 * 
 * Handles user authentication via Supabase
 * 
 * Setup Instructions:
 * 1. Create Supabase project at https://supabase.com
 * 2. Get your project URL and anon key
 * 3. Update SUPABASE_URL and SUPABASE_ANON_KEY below
 * 4. Enable Email Auth in Supabase dashboard
 */

// Supabase Configuration
const SUPABASE_URL = 'https://xvsdpufvuxsqozhqihmv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2c2RwdWZ2dXhzcW96aHFpaG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NjM0NDMsImV4cCI6MjA4NjEzOTQ0M30.8p6Ls7Gf5XuzbHtgzDGMP23l93w5Z15GIRgenSET6Dc';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Show message to user
 */
function showMessage(text, type = 'success') {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;
    
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

/**
 * Handle login form submission
 */
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!supabaseClient) {
        showMessage('Authentication system not configured. Please set up Supabase.', 'error');
        return;
    }
    
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        showMessage(error.message || 'Login failed. Please check your credentials.', 'error');
    }
}

/**
 * Handle password reset
 */
async function handlePasswordReset(event) {
    event.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    
    if (!supabaseClient) {
        showMessage('Authentication system not configured.', 'error');
        return;
    }
    
    try {
        const { error } = await supabaseClientClient.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/portal/reset-password.html`
        });
        
        if (error) throw error;
        
        showMessage('Password reset link sent! Check your email.', 'success');
        
        // Show login form after 3 seconds
        setTimeout(() => {
            showLogin();
        }, 3000);
        
    } catch (error) {
        console.error('Password reset error:', error);
        showMessage(error.message || 'Failed to send reset link.', 'error');
    }
}

/**
 * Handle logout
 */
async function handleLogout() {
    if (!supabaseClient) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const { error } = await supabaseClientClient.auth.signOut();
        if (error) throw error;
        
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
    }
}

/**
 * Check if user is authenticated
 */
async function checkAuth() {
    if (!supabaseClient) {
        // Demo mode - allow access
        return {
            id: 'demo-user',
            email: 'demo@lobsterforce.com',
            user_metadata: {
                name: 'Demo User'
            }
        };
    }
    
    try {
        const { data: { user } } = await supabaseClientClient.auth.getUser();
        
        if (!user) {
            // Not logged in, redirect to login page
            if (!window.location.pathname.includes('index.html') && 
                !window.location.pathname.endsWith('/portal/')) {
                window.location.href = 'index.html';
            }
            return null;
        }
        
        return user;
    } catch (error) {
        console.error('Auth check error:', error);
        return null;
    }
}

/**
 * Get current user session
 */
async function getSession() {
    if (!supabaseClient) {
        // Demo mode
        return {
            user: {
                id: 'demo-user',
                email: 'demo@lobsterforce.com',
                user_metadata: {
                    name: 'Demo User',
                    tier: 'lobster',
                    member_since: '2026-02-08'
                }
            }
        };
    }
    
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        return session;
    } catch (error) {
        console.error('Get session error:', error);
        return null;
    }
}

/**
 * Show login form
 */
function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('resetForm').style.display = 'none';
}

/**
 * Show password reset form
 */
function showPasswordReset() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('resetForm').style.display = 'block';
}

/**
 * Open Stripe Customer Portal
 */
async function openBillingPortal() {
    // This requires a backend endpoint that creates a portal session
    // For now, redirect to Stripe dashboard or show message
    
    alert('Billing portal integration coming soon! For now, email mullet@mulletmcnasty.com to manage your subscription.');
    
    // Future implementation:
    // const response = await fetch('/api/create-portal-session', { method: 'POST' });
    // const { url } = await response.json();
    // window.location.href = url;
}

// Initialize auth state on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if on a protected page
    const protectedPages = ['dashboard.html', 'profile.html', 'badge.html', 'submit.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        checkAuth();
    }
});

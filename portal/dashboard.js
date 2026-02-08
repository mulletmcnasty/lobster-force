/**
 * LOBSTER FORCE - Dashboard Module
 * Loads and displays member dashboard data
 */

// Member tier configuration
const TIER_CONFIG = {
    'shrimp': {
        name: 'Shrimp',
        emoji: '🦐',
        discount: '10%',
        price: 'Free'
    },
    'crayfish': {
        name: 'Crayfish',
        emoji: '🦞',
        discount: '15%',
        price: '$9/mo'
    },
    'lobster': {
        name: 'Lobster',
        emoji: '🦞🦞',
        discount: '20%',
        price: '$29/mo'
    },
    'trapmaster': {
        name: 'Trap Master',
        emoji: '🦞🦞🦞',
        discount: '30%',
        price: '$99/mo'
    }
};

/**
 * Load dashboard data
 */
async function loadDashboard() {
    const loadingEl = document.getElementById('loading');
    const contentEl = document.getElementById('dashboardContent');
    
    try {
        // Get user session
        const session = await getSession();
        
        if (!session || !session.user) {
            window.location.href = 'index.html';
            return;
        }
        
        const user = session.user;
        
        // Load user data (from Supabase or demo)
        const userData = await getUserData(user.id);
        
        // Update dashboard with user data
        updateDashboard(user, userData);
        
        // Hide loading, show content
        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
        
    } catch (error) {
        console.error('Dashboard load error:', error);
        loadingEl.innerHTML = `
            <p style="color: #ff006e;">Error loading dashboard</p>
            <p style="font-family: Arial, sans-serif; font-weight: normal; color: #888;">
                ${error.message}
            </p>
            <button onclick="location.reload()" class="cta-button" style="margin-top: 2rem;">
                Retry
            </button>
        `;
    }
}

/**
 * Get user data from database
 */
async function getUserData(userId) {
    // Demo data if Supabase not configured
    if (!supabase || userId === 'demo-user') {
        return {
            name: 'Demo User',
            tier: 'lobster',
            member_since: '2026-02-08',
            stripe_customer_id: null
        };
    }
    
    try {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            console.error('Error fetching user data:', error);
            // Return default data
            return {
                name: 'Member',
                tier: 'shrimp',
                member_since: new Date().toISOString().split('T')[0]
            };
        }
        
        return data;
    } catch (error) {
        console.error('getUserData error:', error);
        return {
            name: 'Member',
            tier: 'shrimp',
            member_since: new Date().toISOString().split('T')[0]
        };
    }
}

/**
 * Update dashboard UI with user data
 */
function updateDashboard(user, userData) {
    // Get tier config
    const tier = TIER_CONFIG[userData.tier] || TIER_CONFIG['shrimp'];
    
    // Update welcome message
    const userName = userData.name || user.email.split('@')[0];
    document.getElementById('userName').textContent = userName;
    
    // Update tier badge
    const tierBadge = `${tier.emoji} ${tier.name}`;
    document.getElementById('userTier').textContent = tierBadge;
    
    // Update membership status card
    document.getElementById('tierName').textContent = tier.name;
    document.getElementById('memberSince').textContent = formatDate(userData.member_since);
    
    // Update discount
    if (userData.tier !== 'shrimp') {
        document.getElementById('memberDiscount').style.display = 'block';
        document.getElementById('discountAmount').textContent = tier.discount;
    }
    
    // Load recent activity (if available)
    loadRecentActivity(user.id);
}

/**
 * Load recent activity feed
 */
async function loadRecentActivity(userId) {
    const activityEl = document.getElementById('activityFeed');
    
    // Demo data
    const activities = [
        { type: 'join', text: 'Joined Lobster Force', date: '2026-02-08' },
        { type: 'badge', text: 'Downloaded member badge', date: '2026-02-08' }
    ];
    
    if (activities.length === 0) {
        activityEl.innerHTML = `
            <p style="color: #888; font-family: Arial, sans-serif; font-weight: normal;">
                No recent activity to show. Start engaging with the community!
            </p>
        `;
        return;
    }
    
    // Render activity feed
    activityEl.innerHTML = activities.map(activity => `
        <div style="padding: 1rem; margin-bottom: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 5px;">
            <p style="font-family: Arial, sans-serif; font-weight: normal; margin-bottom: 0.25rem;">
                ${activity.text}
            </p>
            <p style="font-family: Arial, sans-serif; font-size: 0.85rem; color: #888;">
                ${formatDate(activity.date)}
            </p>
        </div>
    `).join('');
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    
    // Format as Month Year
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', loadDashboard);

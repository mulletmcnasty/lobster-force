/**
 * LOBSTER FORCE - Badge Generator
 * Creates downloadable member badges
 */

let userData = null;

/**
 * Load badge data
 */
async function loadBadge() {
    try {
        const session = await getSession();
        if (!session || !session.user) {
            window.location.href = 'index.html';
            return;
        }
        
        const user = session.user;
        userData = await getUserData(user.id);
        
        // Get tier config
        const tier = TIER_CONFIG[userData.tier] || TIER_CONFIG['shrimp'];
        
        // Update badge preview
        const userName = userData.name || user.email.split('@')[0];
        document.getElementById('badgeName').textContent = userName;
        document.getElementById('badgeTier').textContent = `${tier.emoji} ${tier.name} Member`;
        document.getElementById('badgeId').textContent = `ID: #${user.id.substring(0, 8).toUpperCase()}`;
        
    } catch (error) {
        console.error('Badge load error:', error);
        alert('Error loading badge. Please try again.');
    }
}

/**
 * Download badge as image
 */
async function downloadBadge() {
    const canvas = document.getElementById('badgeCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ff006e');
    gradient.addColorStop(0.5, '#8338ec');
    gradient.addColorStop(1, '#3a86ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw badge content
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    
    // Logo (use text emoji for simplicity)
    ctx.font = 'bold 150px Arial';
    ctx.fillText('🦞', canvas.width / 2, 250);
    
    // LOBSTER FORCE text
    ctx.font = 'bold 60px Arial Black';
    ctx.fillText('LOBSTER FORCE', canvas.width / 2, 370);
    
    // Member name
    ctx.font = 'bold 50px Arial';
    const userName = document.getElementById('badgeName').textContent;
    ctx.fillText(userName, canvas.width / 2, 500);
    
    // Tier
    ctx.font = '40px Arial';
    const tierText = document.getElementById('badgeTier').textContent;
    ctx.fillText(tierText, canvas.width / 2, 590);
    
    // ID
    ctx.font = '30px Courier New';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    const idText = document.getElementById('badgeId').textContent;
    ctx.fillText(idText, canvas.width / 2, 700);
    
    // Tagline
    ctx.font = 'italic 25px Arial';
    ctx.fillText('Business in the front, party in the back', canvas.width / 2, 850);
    
    // Convert canvas to image and download
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `lobster-force-badge-${userName.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    });
}

/**
 * Share badge on social media
 */
function shareBadge() {
    const userName = document.getElementById('badgeName').textContent;
    const tierText = document.getElementById('badgeTier').textContent;
    
    const shareText = `I'm ${tierText} at Lobster Force! 🦞\n\nBusiness in the front, party in the back.\n\nJoin the movement: https://mulletmcnasty.github.io/lobster-force/`;
    
    // Try native share API first
    if (navigator.share) {
        navigator.share({
            title: 'Lobster Force Member',
            text: shareText
        }).catch(err => console.log('Share cancelled', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Share text copied to clipboard! Paste it on your favorite social platform.');
        }).catch(err => {
            console.error('Copy failed:', err);
            alert('Unable to copy. Please manually share:\n\n' + shareText);
        });
    }
}

// Tier config (matching dashboard.js)
const TIER_CONFIG = {
    'shrimp': { name: 'Shrimp', emoji: '🦐' },
    'crayfish': { name: 'Crayfish', emoji: '🦞' },
    'lobster': { name: 'Lobster', emoji: '🦞🦞' },
    'trapmaster': { name: 'Trap Master', emoji: '🦞🦞🦞' }
};

// Placeholder getUserData function (will use from auth.js in production)
async function getUserData(userId) {
    if (!supabaseClient || userId === 'demo-user') {
        return {
            name: 'Demo User',
            tier: 'lobster',
            member_since: '2026-02-08'
        };
    }
    
    try {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            return {
                name: 'Member',
                tier: 'shrimp',
                member_since: new Date().toISOString().split('T')[0]
            };
        }
        
        return data;
    } catch (error) {
        return {
            name: 'Member',
            tier: 'shrimp',
            member_since: new Date().toISOString().split('T')[0]
        };
    }
}

// Load badge on page load
document.addEventListener('DOMContentLoaded', loadBadge);

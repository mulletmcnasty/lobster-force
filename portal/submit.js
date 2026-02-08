/**
 * LOBSTER FORCE - Mullet Submission Module
 * Handles photo uploads and submissions to gallery
 */

/**
 * Preview uploaded image
 */
function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Please upload an image under 5MB.');
        event.target.value = '';
        return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('previewImg').src = e.target.result;
        document.getElementById('imagePreview').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

/**
 * Handle form submission
 */
async function handleSubmit(event) {
    event.preventDefault();
    
    const messageEl = document.getElementById('submitMessage');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';
    
    try {
        // Get form data
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const style = document.getElementById('style').value;
        const instagram = document.getElementById('instagram').value;
        const photoFile = document.getElementById('photo').files[0];
        
        // Get current user
        const session = await getSession();
        if (!session || !session.user) {
            throw new Error('You must be logged in to submit');
        }
        
        // Upload to Supabase Storage (or use demo mode)
        let photoUrl;
        
        if (supabase && photoFile) {
            // Upload to Supabase Storage
            const fileExt = photoFile.name.split('.').pop();
            const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
            const filePath = `submissions/${fileName}`;
            
            const { data: uploadData, error: uploadError } = await supabaseClient.storage
                .from('mullet-gallery')
                .upload(filePath, photoFile);
            
            if (uploadError) throw uploadError;
            
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('mullet-gallery')
                .getPublicUrl(filePath);
            
            photoUrl = publicUrl;
        } else {
            // Demo mode - use placeholder
            photoUrl = URL.createObjectURL(photoFile);
        }
        
        // Save submission to database
        const submission = {
            user_id: session.user.id,
            title,
            description,
            style,
            instagram,
            photo_url: photoUrl,
            status: 'pending', // pending, approved, rejected
            created_at: new Date().toISOString()
        };
        
        if (supabaseClient) {
            const { error: dbError } = await supabase
                .from('submissions')
                .insert([submission]);
            
            if (dbError) throw dbError;
        }
        
        // Show success message
        messageEl.textContent = 'Submission received! We\'ll review it and notify you if it\'s featured.';
        messageEl.className = 'message success';
        messageEl.style.display = 'block';
        
        // Reset form
        document.getElementById('submitForm').reset();
        document.getElementById('imagePreview').style.display = 'none';
        
        // Scroll to message
        messageEl.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Submission error:', error);
        messageEl.textContent = `Error: ${error.message || 'Failed to submit. Please try again.'}`;
        messageEl.className = 'message error';
        messageEl.style.display = 'block';
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit to Gallery';
    }
}

// Check auth on page load
document.addEventListener('DOMContentLoaded', async () => {
    const session = await getSession();
    if (!session || !session.user) {
        window.location.href = 'index.html';
    }
});

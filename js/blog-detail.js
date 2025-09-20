// Blog Detail JavaScript functions

// Show loading overlay
function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize AOS animations
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-in-out',
        offset: 100
    });
    
    // Get blog ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    
    if (blogId) {
        // Fetch blog data
        fetchBlog(blogId);
    } else {
        // Redirect to home if no ID provided
        window.location = 'index.html';
    }
});

// Format date function
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Fetch blog data
function fetchBlog(blogId) {
    // Show loading overlay
    showLoading();
    
    // Check if Firebase is initialized
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.error('Firebase not initialized');
        document.getElementById('blog-title').textContent = 'Error Loading Blog';
        document.getElementById('blog-content').innerHTML = '<p class="text-center text-danger">Error loading blog. Please try again later.</p>';
        hideLoading();
        return;
    }
    
    // Get Firestore instance
    const db = firebase.firestore();
    
    db.collection('blogs').doc(blogId).get()
        .then((doc) => {
            if (doc.exists) {
                const blog = doc.data();
                
                // Update page title
                document.title = `${blog.title} - BlogCraft India`;
                
                // Populate blog header
                document.getElementById('blog-title').textContent = blog.title;
                document.getElementById('blog-author').textContent = blog.author;
                document.getElementById('blog-date').textContent = formatDate(blog.date);
                
                // Set header background image
                const header = document.getElementById('blog-header');
                header.style.background = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${blog.imageURL || 'https://picsum.photos/600/300'}')`;
                header.style.backgroundSize = 'cover';
                header.style.backgroundPosition = 'center';
                
                // Populate blog content
                document.getElementById('blog-content').innerHTML = blog.content;
                
                // Populate tags
                const tagsContainer = document.getElementById('blog-tags');
                if (blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0) {
                    let tagsHTML = '<h4 class="mb-3" data-aos="fade-right">Tags:</h4><div>';
                    blog.tags.forEach((tag, index) => {
                        tagsHTML += `<span class="tag me-2" data-aos="zoom-in" data-aos-delay="${index * 100}">${tag}</span>`;
                    });
                    tagsHTML += '</div>';
                    tagsContainer.innerHTML = tagsHTML;
                }
                hideLoading();
            } else {
                // Blog not found
                document.getElementById('blog-title').textContent = 'Blog Not Found';
                document.getElementById('blog-content').innerHTML = '<p class="text-center">The blog you are looking for does not exist.</p>';
                hideLoading();
            }
        })
        .catch((error) => {
            console.error('Error fetching blog: ', error);
            document.getElementById('blog-title').textContent = 'Error Loading Blog';
            document.getElementById('blog-content').innerHTML = '<p class="text-center text-danger">Error loading blog. Please try again later.</p>';
            hideLoading();
        });
}

// Comment form submission
document.getElementById('comment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('comment-name').value;
    const content = document.getElementById('comment-content').value;
    
    // In a real app, you would save this to a database
    // For now, we'll just show an alert
    alert(`Thank you ${name} for your comment! In a real application, this would be saved and displayed to the BlogCraft India community.`);
    
    // Reset form
    this.reset();
});

// Check auth state
if (typeof firebase !== 'undefined') {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            document.getElementById('auth-buttons').classList.add('d-none');
            document.getElementById('user-info').classList.remove('d-none');
            document.getElementById('user-name').textContent = user.email;
        } else {
            // User is signed out
            document.getElementById('auth-buttons').classList.remove('d-none');
            document.getElementById('user-info').classList.add('d-none');
            document.getElementById('user-name').textContent = '';
        }
    });
}
// Create Blog JavaScript functions

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
    
    // Check auth state
    if (typeof firebase !== 'undefined') {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in
                document.getElementById('auth-buttons').classList.add('d-none');
                document.getElementById('user-info').classList.remove('d-none');
                document.getElementById('user-name').textContent = user.email;
                document.getElementById('blog-author').value = user.displayName || user.email;
            } else {
                // User is signed out
                document.getElementById('auth-buttons').classList.remove('d-none');
                document.getElementById('user-info').classList.add('d-none');
                document.getElementById('user-name').textContent = '';
                // Redirect to home page
                window.location = 'index.html';
            }
        });
    }
});

// Tags functionality
let tags = [];

// Add tag when pressing Enter
document.getElementById('tag-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const tagValue = this.value.trim();
        if (tagValue && !tags.includes(tagValue)) {
            tags.push(tagValue);
            renderTags();
            this.value = '';
        }
    }
});

// Render tags
function renderTags() {
    const container = document.getElementById('tags-container');
    const input = document.getElementById('tag-input');
    
    // Clear container but keep the input
    container.innerHTML = '';
    container.appendChild(input);
    
    // Add tags
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag retro-tag';
        tagElement.innerHTML = `${tag} <i class="fas fa-times ms-1" style="cursor: pointer;"></i>`;
        
        // Add remove functionality
        tagElement.querySelector('i').addEventListener('click', function() {
            tags = tags.filter(t => t !== tag);
            renderTags();
        });
        
        container.insertBefore(tagElement, input);
    });
}

// Suggested tags functionality
const suggestedTags = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Education', 'Entertainment', 'Business', 'Science', 'Art', 'Music', 'Sports', 'Fashion', 'Design', 'Photography'];

document.getElementById('suggested-tags-btn').addEventListener('click', function() {
    const suggestedTagsContainer = document.getElementById('suggested-tags-container');
    
    if (suggestedTagsContainer) {
        suggestedTagsContainer.remove();
        return;
    }
    
    const container = document.createElement('div');
    container.id = 'suggested-tags-container';
    container.className = 'mt-2 p-2 border rounded retro-suggested-tags';
    
    suggestedTags.forEach(tag => {
        const tagBtn = document.createElement('button');
        tagBtn.type = 'button';
        tagBtn.className = 'btn btn-sm btn-outline-secondary me-1 mb-1 retro-tag-btn';
        tagBtn.textContent = tag;
        tagBtn.addEventListener('click', function() {
            if (!tags.includes(tag)) {
                tags.push(tag);
                renderTags();
            }
        });
        container.appendChild(tagBtn);
    });
    
    this.parentNode.appendChild(container);
});

// Rich Text Editor functionality
document.querySelector('.btn-bold').addEventListener('click', function() {
    document.execCommand('bold', false, null);
});

document.querySelector('.btn-italic').addEventListener('click', function() {
    document.execCommand('italic', false, null);
});

document.querySelector('.btn-underline').addEventListener('click', function() {
    document.execCommand('underline', false, null);
});

document.querySelector('.btn-strikethrough').addEventListener('click', function() {
    document.execCommand('strikethrough', false, null);
});

document.querySelector('.btn-list-ul').addEventListener('click', function() {
    document.execCommand('insertUnorderedList', false, null);
});

document.querySelector('.btn-list-ol').addEventListener('click', function() {
    document.execCommand('insertOrderedList', false, null);
});

document.querySelector('.btn-link').addEventListener('click', function() {
    const url = prompt('Enter the URL:');
    if (url) {
        document.execCommand('createLink', false, url);
    }
});

document.querySelector('.btn-image').addEventListener('click', function() {
    const url = prompt('Enter the image URL:');
    if (url) {
        document.execCommand('insertImage', false, url);
    }
});

document.querySelector('.btn-undo').addEventListener('click', function() {
    document.execCommand('undo', false, null);
});

document.querySelector('.btn-redo').addEventListener('click', function() {
    document.execCommand('redo', false, null);
});

// Focus on content editor when clicked
document.querySelector('.rich-text-content').addEventListener('click', function() {
    this.focus();
});

// Generate random image URL
document.getElementById('generate-image-btn').addEventListener('click', function() {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    document.getElementById('blog-image').value = `https://picsum.photos/800/400?random=${randomId}`;
});

// Reading time estimation
function updateReadingTime() {
    const content = document.getElementById('blog-content').innerText || '';
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute) || 0;
    document.getElementById('reading-time').textContent = readingTime;
}

// Update reading time as user types
document.getElementById('blog-content').addEventListener('input', updateReadingTime);

// Insert template functionality
document.getElementById('insert-template-btn').addEventListener('click', function() {
    const template = `
        <h2>Introduction</h2>
        <p>Start your introduction here...</p>
        
        <h2>Main Content</h2>
        <p>Your main content goes here...</p>
        
        <h3>Subsection</h3>
        <p>Add more details in subsections...</p>
        
        <h2>Conclusion</h2>
        <p>Wrap up your blog post with a strong conclusion...</p>
    `;
    
    document.getElementById('blog-content').innerHTML += template;
    updateReadingTime();
});

// Preview functionality
document.getElementById('preview-btn').addEventListener('click', function() {
    const title = document.getElementById('blog-title').value || 'Untitled Blog';
    const author = document.getElementById('blog-author').value || 'Anonymous Blogger';
    const content = document.getElementById('blog-content').innerHTML || '<p>Start writing your amazing blog content here...</p>';
    const image = document.getElementById('blog-image').value;
    
    let previewHTML = `
        <div class="blog-header" style="background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${image || 'https://picsum.photos/600/300'}'); background-size: cover; background-position: center; color: white; padding: 2rem 0; margin-bottom: 2rem;" data-aos="zoom-in">
            <div class="container">
                <h1 class="blog-title" data-aos="zoom-in-up">${title}</h1>
                <div class="blog-meta-detail" data-aos="fade-up">
                    <span class="me-3"><i class="fas fa-user me-1"></i> ${author}</span>
                    <span><i class="fas fa-calendar me-1"></i> ${new Date().toLocaleDateString()}</span>
                </div>
            </div>
        </div>
        
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="blog-content" data-aos="fade-up">
                        ${content}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('preview-content').innerHTML = previewHTML;
});

// Save draft functionality
document.getElementById('save-draft-btn').addEventListener('click', function() {
    const title = document.getElementById('blog-title').value;
    const author = document.getElementById('blog-author').value;
    const content = document.getElementById('blog-content').innerHTML;
    const image = document.getElementById('blog-image').value;
    const category = document.getElementById('blog-category').value;
    
    const draft = {
        title: title,
        author: author,
        content: content,
        image: image,
        category: category,
        tags: tags,
        date: new Date().toISOString()
    };
    
    localStorage.setItem('blogDraft', JSON.stringify(draft));
    console.log('Draft saved successfully!');
});

// Load draft if exists
function loadDraft() {
    const draft = localStorage.getItem('blogDraft');
    if (draft) {
        const blogData = JSON.parse(draft);
        document.getElementById('blog-title').value = blogData.title || '';
        document.getElementById('blog-author').value = blogData.author || '';
        document.getElementById('blog-content').innerHTML = blogData.content || '';
        document.getElementById('blog-image').value = blogData.image || '';
        document.getElementById('blog-category').value = blogData.category || '';
        
        if (blogData.tags && Array.isArray(blogData.tags)) {
            tags = blogData.tags;
            renderTags();
        }
        
        updateReadingTime();
        console.log('Draft loaded successfully!');
    }
}

// Load draft on page load
loadDraft();

// Blog form submission
document.getElementById('blog-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check if user is logged in
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.error('Firebase not initialized');
        console.log('Error: Firebase not initialized');
        return;
    }
    
    const user = firebase.auth().currentUser;
    if (!user) {
        console.log('You must be logged in to create a blog.');
        return;
    }
    
    // Get form values
    const title = document.getElementById('blog-title').value;
    const author = document.getElementById('blog-author').value;
    const imageURL = document.getElementById('blog-image').value || 'https://picsum.photos/600/300';
    const content = document.getElementById('blog-content').innerHTML;
    const date = new Date().toISOString().split('T')[0];
    const category = document.getElementById('blog-category').value;
    const isPublished = document.getElementById('publish-checkbox').checked;
    const isFeatured = document.getElementById('featured-checkbox').checked;
    
    // Validate required fields
    if (!title || !author || !content) {
        console.log('Please fill in all required fields.');
        return;
    }
    
    // Show loading
    showLoading();
    
    // Check if Firebase is initialized
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.error('Firebase not initialized');
        console.log('Error: Firebase not initialized');
        hideLoading();
        return;
    }
    
    // Get Firestore instance
    const db = firebase.firestore();
    
    // Create blog object
    const blog = {
        title: title,
        author: author,
        date: date,
        tags: tags,
        content: content,
        imageURL: imageURL,
        userId: user.uid,
        category: category,
        isPublished: isPublished,
        isFeatured: isFeatured
    };
    
    // Save to Firestore
    db.collection('blogs').add(blog)
        .then((docRef) => {
            console.log('Blog created with ID: ', docRef.id);
            console.log('Blog published successfully! Share your thoughts with the BlogCraft India community.');
            
            // Clear draft
            localStorage.removeItem('blogDraft');
            
            // Reset form
            document.getElementById('blog-form').reset();
            document.getElementById('blog-content').innerHTML = '';
            tags = [];
            renderTags();
            hideLoading();
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            console.error('Error adding blog: ', error);
            console.log('Error publishing blog: ' + error.message);
            hideLoading();
        });
});
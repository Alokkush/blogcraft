// blogs.js - Handle displaying all blogs

// Initialize AOS animations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true
        });
    }
    
    // Load blogs when page loads
    loadBlogs();
    
    // Set up sort functionality
    setupSortListeners();
});

// Load blogs from Firestore
async function loadBlogs(sortBy = 'latest') {
    console.log('Loading blogs with sort:', sortBy);
    showLoading();
    
    try {
        const blogsContainer = document.getElementById('blogs-container');
        
        // Show loading spinner
        blogsContainer.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
        
        // Check if Firebase is initialized
        if (typeof firebase === 'undefined' || firebase.apps.length === 0) {
            console.log('Firebase not initialized, showing demo blogs');
            // If Firebase is not initialized, show demo blogs
            showDemoBlogs();
            hideLoading();
            return;
        }
        
        // Get Firestore instance
        const db = firebase.firestore();
        
        // First, let's try to fetch blogs without any ordering to see if that's the issue
        console.log('Fetching blogs without ordering...');
        const blogsSnapshot = await db.collection('blogs').get();
        console.log('Query result size:', blogsSnapshot.size);
        
        if (blogsSnapshot.empty) {
            console.log('No blogs found, showing demo blogs');
            // If no blogs in database, show demo blogs
            showDemoBlogs();
            hideLoading();
            return;
        }
        
        // Convert to array for easier manipulation
        let blogsArray = [];
        blogsSnapshot.forEach(doc => {
            const blog = doc.data();
            blog.id = doc.id;
            blogsArray.push(blog);
        });
        
        // Apply sorting in JavaScript
        switch(sortBy) {
            case 'popular':
                // For popular, we order by date (assuming newer = more popular for now)
                blogsArray.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'featured':
                // For featured, we filter by isFeatured field and then sort by date
                blogsArray = blogsArray.filter(blog => blog.isFeatured === true);
                blogsArray.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            default: // latest
                // For latest, we order by date (newest first)
                blogsArray.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        console.log('Sorted blogs count:', blogsArray.length);
        
        if (blogsArray.length === 0) {
            console.log('No blogs found after sorting, showing demo blogs');
            // If no blogs after filtering, show demo blogs
            showDemoBlogs();
            hideLoading();
            return;
        }
        
        // Clear container
        blogsContainer.innerHTML = '';
        
        // Display blogs
        blogsArray.forEach(blog => {
            const blogId = blog.id;
            console.log('Processing blog:', blog);
            
            // Format date
            const date = blog.date || 'Unknown date';
            
            // Create blog card
            const blogCard = document.createElement('div');
            blogCard.className = 'col-md-6 col-lg-4 mb-4';
            blogCard.innerHTML = `
                <div class="card blog-card h-100 shadow-sm">
                    <img src="${blog.imageURL || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'}" 
                         class="card-img-top" alt="${blog.title}" style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${blog.title || 'Untitled'}</h5>
                        <p class="card-text flex-grow-1">${blog.content ? blog.content.replace(/<[^>]*>/g, '').substring(0, 100) : 'No content available'}...</p>
                        <div class="blog-meta text-muted small mb-2">
                            <span class="me-2"><i class="fas fa-user me-1"></i> ${blog.author || 'Unknown author'}</span>
                            <span><i class="fas fa-calendar me-1"></i> ${date}</span>
                        </div>
                        <div class="mt-auto">
                            ${blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 ? 
                              `<div class="blog-tags mb-3">
                                  ${blog.tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')}
                               </div>` : ''}
                            <a href="blog-detail.html?id=${blogId}" class="btn btn-primary w-100">Read More</a>
                        </div>
                    </div>
                </div>
            `;
            
            blogsContainer.appendChild(blogCard);
        });
        
        // Refresh AOS to animate the newly added elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error loading blogs: ', error);
        // Show demo blogs if there's an error
        showDemoBlogs();
        hideLoading();
    }
}

// Show demo blogs when there are no real blogs
function showDemoBlogs() {
    const blogsContainer = document.getElementById('blogs-container');
    
    // Demo blog data
    const demoBlogs = [
        {
            id: 'demo1',
            title: 'Getting Started with BlogCraft',
            author: 'BlogCraft Team',
            date: '2025-09-15',
            content: '<p>Welcome to BlogCraft! This is a demo blog post to show you how easy it is to create and publish content on our platform. With our intuitive editor, you can create beautiful blogs in minutes.</p><p>Whether you\'re a seasoned blogger or just starting out, BlogCraft provides all the tools you need to share your stories with the world.</p>',
            imageURL: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            tags: ['Getting Started', 'Tutorial', 'Platform']
        },
        {
            id: 'demo2',
            title: '10 Tips for Better Blog Writing',
            author: 'Writing Expert',
            date: '2025-09-10',
            content: '<p>Creating engaging blog content is both an art and a science. Here are 10 tips to help you write better blogs:</p><ol><li>Know your audience</li><li>Start with a strong headline</li><li>Use storytelling techniques</li><li>Include visuals</li><li>Keep paragraphs short</li><li>Use subheadings</li><li>Include actionable advice</li><li>End with a call-to-action</li><li>Edit ruthlessly</li><li>Be consistent</li></ol>',
            imageURL: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            tags: ['Writing Tips', 'Content Creation', 'Blogging']
        },
        {
            id: 'demo3',
            title: 'The Future of Digital Publishing',
            author: 'Tech Analyst',
            date: '2025-09-05',
            content: '<p>The digital publishing landscape is evolving rapidly. New technologies are changing how we create, distribute, and consume content. In this blog, we explore the latest trends in digital publishing and what they mean for content creators.</p><p>From AI-assisted writing tools to immersive reading experiences, the future of digital publishing is bright and full of possibilities.</p>',
            imageURL: 'https://images.unsplash.com/photo-1544654803-b69140b285a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            tags: ['Technology', 'Publishing', 'Future']
        },
        {
            id: 'demo4',
            title: 'Building a Personal Brand Through Blogging',
            author: 'Marketing Guru',
            date: '2025-08-28',
            content: '<p>In today\'s digital world, personal branding is more important than ever. Blogging is one of the most effective ways to establish yourself as an expert in your field and build a loyal following.</p><p>Your blog becomes a portfolio of your knowledge and expertise, showcasing your unique perspective and value to potential employers, clients, or collaborators.</p>',
            imageURL: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            tags: ['Personal Branding', 'Marketing', 'Career']
        },
        {
            id: 'demo5',
            title: 'The Art of Storytelling in Content Creation',
            author: 'Creative Writer',
            date: '2025-08-20',
            content: '<p>Storytelling is at the heart of compelling content. Whether you\'re writing a blog post, creating a video, or designing a presentation, incorporating storytelling elements can make your content more engaging and memorable.</p><p>Great stories have the power to connect with people on an emotional level, making your message more impactful and your brand more relatable.</p>',
            imageURL: 'https://images.unsplash.com/photo-1497514440783-20f98b682f56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            tags: ['Storytelling', 'Content Creation', 'Writing']
        },
        {
            id: 'demo6',
            title: 'Maximizing Your Blog\'s SEO Potential',
            author: 'SEO Specialist',
            date: '2025-08-15',
            content: '<p>Search engine optimization (SEO) is crucial for ensuring your blog content reaches its intended audience. Without proper SEO, even the best content can get lost in the vast digital landscape.</p><p>In this guide, we\'ll cover essential SEO strategies that can help improve your blog\'s visibility and drive more organic traffic to your site.</p>',
            imageURL: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            tags: ['SEO', 'Digital Marketing', 'Traffic']
        }
    ];
    
    // Clear container
    blogsContainer.innerHTML = '';
    
    // Display demo blogs
    demoBlogs.forEach(blog => {
        const blogCard = document.createElement('div');
        blogCard.className = 'col-md-6 col-lg-4 mb-4';
        blogCard.innerHTML = `
            <div class="card blog-card h-100 shadow-sm">
                <img src="${blog.imageURL}" 
                     class="card-img-top" alt="${blog.title}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${blog.title}</h5>
                    <p class="card-text flex-grow-1">${blog.content.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
                    <div class="blog-meta text-muted small mb-2">
                        <span class="me-2"><i class="fas fa-user me-1"></i> ${blog.author}</span>
                        <span><i class="fas fa-calendar me-1"></i> ${blog.date}</span>
                    </div>
                    <div class="mt-auto">
                        ${blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 ? 
                          `<div class="blog-tags mb-3">
                              ${blog.tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')}
                           </div>` : ''}
                        <a href="#" class="btn btn-primary w-100 disabled" aria-disabled="true">Read More (Demo)</a>
                    </div>
                </div>
            </div>
        `;
        
        blogsContainer.appendChild(blogCard);
    });
    
    // Add message about creating blogs
    const infoDiv = document.createElement('div');
    infoDiv.className = 'col-12 text-center mt-4';
    infoDiv.innerHTML = `
        <div class="alert alert-info">
            <h4>No blogs found in the database</h4>
            <p>These are demo blogs. Create your own blogs to see them appear here automatically!</p>
            <a href="create-blog.html" class="btn btn-primary">Create Your First Blog</a>
        </div>
    `;
    
    blogsContainer.appendChild(infoDiv);
    
    // Refresh AOS to animate the newly added elements
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Set up sort listeners
function setupSortListeners() {
    const sortLinks = document.querySelectorAll('[data-sort]');
    sortLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sortBy = this.getAttribute('data-sort');
            loadBlogs(sortBy);
            
            // Update dropdown button text
            document.getElementById('sortDropdown').textContent = 
                this.textContent;
        });
    });
}

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

// Check auth state
if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
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
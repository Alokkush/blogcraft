// Main JavaScript functions

// Famous quotes array from renowned thinkers and leaders (inspirational only)
const famousQuotes = [
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "In the middle of difficulty lies opportunity.",
        author: "Albert Einstein"
    },
    {
        text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        author: "Nelson Mandela"
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    },
    {
        text: "Your time is limited, don't waste it living someone else's life.",
        author: "Steve Jobs"
    },
    {
        text: "If life were predictable it would cease to be life, and be without flavor.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "Life is what happens when you're busy making other plans.",
        author: "John Lennon"
    },
    {
        text: "The purpose of our lives is to be happy.",
        author: "Dalai Lama"
    },
    {
        text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
        author: "Benjamin Franklin"
    },
    {
        text: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins"
    },
    {
        text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
        author: "Albert Einstein"
    },
    {
        text: "Be the change that you wish to see in the world.",
        author: "Mahatma Gandhi"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs"
    },
    {
        text: "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.",
        author: "Oprah Winfrey"
    },
    {
        text: "You only live once, but if you do it right, once is enough.",
        author: "Mae West"
    },
    {
        text: "The greatest wealth is to live content with little.",
        author: "Plato"
    },
    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },
    {
        text: "The best way to predict the future is to create it.",
        author: "Peter Drucker"
    },
    {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson"
    },
    {
        text: "The harder I work, the more luck I seem to have.",
        author: "Thomas Jefferson"
    },
    {
        text: "Success is walking from failure to failure with no loss of enthusiasm.",
        author: "Winston Churchill"
    },
    {
        text: "Opportunities don't happen. You create them.",
        author: "Chris Grosser"
    }
];

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

// Display a random inspirational quote
function displayRandomQuote() {
    const quoteContainer = document.getElementById('quote-container');
    if (!quoteContainer) return;
    
    // Get a random quote
    const randomIndex = Math.floor(Math.random() * famousQuotes.length);
    const quote = famousQuotes[randomIndex];
    
    // Display the quote with enhanced styling
    quoteContainer.innerHTML = `
        <div class="quote-content" data-aos="fade-up">
            <p class="quote-text mb-3">"${quote.text}"</p>
            <p class="quote-author">- ${quote.author}</p>
        </div>
    `;
}

// Initialize AOS animations
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-in-out',
        offset: 100
    });
    
    // Display random quote on page load
    displayRandomQuote();
    
    // Add event listener for refresh quote button
    const refreshButton = document.getElementById('refresh-quote');
    if (refreshButton) {
        refreshButton.addEventListener('click', function(e) {
            e.preventDefault();
            displayRandomQuote();
        });
    }
});

// Format date function
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Render blogs on home page
function renderBlogs(blogs) {
    const blogsContainer = document.getElementById('blogs-container');
    
    if (blogs.length === 0) {
        blogsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3>No blogs found</h3>
                <p class="text-muted">Be the first to create a blog! Share your thoughts with the BlogCraft India community.</p>
            </div>
        `;
        return;
    }
    
    let blogsHTML = '';
    let index = 0;
    
    blogs.forEach(blog => {
        // Create tags HTML
        let tagsHTML = '';
        if (blog.tags && Array.isArray(blog.tags)) {
            tagsHTML = blog.tags.map(tag => 
                `<span class="tag">${tag}</span>`
            ).join('');
        }
        
        blogsHTML += `
            <div class="col-lg-4 col-md-6 mb-4" data-aos="flip-up" data-aos-delay="${index * 100}">
                <div class="blog-card">
                    <img src="${blog.imageURL || 'https://picsum.photos/600/300'}" class="card-img-top" alt="${blog.title}" data-aos="zoom-in">
                    <div class="card-body">
                        <h5 class="card-title" data-aos="fade-right">${blog.title}</h5>
                        <p class="card-text" data-aos="fade-left">${blog.content.substring(0, 100)}...</p>
                        
                        <div class="blog-meta" data-aos="fade-up">
                            <span><i class="fas fa-user me-1"></i> ${blog.author}</span>
                            <span><i class="fas fa-calendar me-1"></i> ${formatDate(blog.date)}</span>
                        </div>
                        
                        <div class="mb-3" data-aos="fade-up">
                            ${tagsHTML}
                        </div>
                        
                        <a href="blog-detail.html?id=${blog.id}" class="btn btn-read" data-aos="zoom-in" data-aos-delay="100">Read More</a>
                    </div>
                </div>
            </div>
        `;
        index++;
    });
    
    blogsContainer.innerHTML = blogsHTML;
}

// Fetch blogs from Firestore
function fetchBlogs() {
    const blogsContainer = document.getElementById('blogs-container');
    
    // Show loading spinner
    blogsContainer.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    
    // Show loading overlay
    showLoading();
    
    // Check if Firebase is initialized
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.error('Firebase not initialized');
        // Show demo blogs when Firebase is not initialized
        renderDemoBlogs();
        hideLoading();
        return;
    }
    
    // Get Firestore instance
    const db = firebase.firestore();
    
    // Fetch blogs from Firestore
    db.collection('blogs')
        .orderBy('date', 'desc')
        .limit(6)
        .get()
        .then((querySnapshot) => {
            const blogs = [];
            querySnapshot.forEach((doc) => {
                const blog = doc.data();
                blog.id = doc.id;
                blogs.push(blog);
            });
            
            // If no blogs found, show demo blogs
            if (blogs.length === 0) {
                renderDemoBlogs();
            } else {
                renderBlogs(blogs);
            }
            hideLoading();
        })
        .catch((error) => {
            console.error('Error fetching blogs: ', error);
            // Show demo blogs when there's an error
            renderDemoBlogs();
            hideLoading();
        });
}

// Load blogs when page loads
document.addEventListener('DOMContentLoaded', function() {
    fetchBlogs();
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

// Demo blogs data for when there are no blogs in the database
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
    }
];

// Function to render demo blogs when there are no real blogs
function renderDemoBlogs() {
    renderBlogs(demoBlogs);
}
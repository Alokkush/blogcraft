// Dashboard JavaScript functions

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

let currentEditTags = [];
let blogsData = [];
let charts = {};

// Initialize AOS animations
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-in-out',
        offset: 100
    });
    
    // Check auth state
    checkAuthState();
    
    // Add event listeners for navigation
    document.getElementById('all-blogs-link').addEventListener('click', function(e) {
        e.preventDefault();
        showBlogsView();
    });
    
    document.getElementById('analytics-link').addEventListener('click', function(e) {
        e.preventDefault();
        showAnalyticsView();
    });
});

// Check authentication state
function checkAuthState() {
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in
                console.log('User is signed in:', user);
                document.getElementById('auth-buttons').classList.add('d-none');
                document.getElementById('user-info').classList.remove('d-none');
                document.getElementById('user-name').textContent = user.email;
                document.getElementById('user-display-name').textContent = user.displayName || user.email;
                
                // Load user blogs
                loadUserBlogs(user.uid);
            } else {
                // User is signed out
                console.log('User is signed out');
                document.getElementById('auth-buttons').classList.remove('d-none');
                document.getElementById('user-info').classList.add('d-none');
                document.getElementById('user-name').textContent = '';
                // Redirect to home page
                window.location = 'index.html';
            }
        });
    } else {
        // Firebase not initialized, redirect to home
        console.error('Firebase not initialized');
        window.location = 'index.html';
    }
}

// Load user blogs function
function loadUserBlogs(userId) {
    // Fetch blogs from Firestore for this user
    fetchUserBlogs(userId);
}

// Show blogs view
function showBlogsView() {
    document.getElementById('blogs-view').classList.remove('d-none');
    document.getElementById('analytics-view').classList.add('d-none');
    document.getElementById('all-blogs-link').classList.add('active');
    document.getElementById('analytics-link').classList.remove('active');
}

// Show analytics view
function showAnalyticsView() {
    document.getElementById('blogs-view').classList.add('d-none');
    document.getElementById('analytics-view').classList.remove('d-none');
    document.getElementById('all-blogs-link').classList.remove('active');
    document.getElementById('analytics-link').classList.add('active');
    
    // Render analytics if we have data
    if (blogsData.length > 0) {
        renderAnalytics(blogsData);
    }
}

// Format date function
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Fetch user's blogs
function fetchUserBlogs(userId) {
    console.log('Fetching blogs for user ID:', userId);
    const tableBody = document.getElementById('blogs-table-body');
    
    // Show loading spinner
    tableBody.innerHTML = `
        <tr>
            <td colspan="3" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </td>
        </tr>
    `;
    
    // Show loading overlay
    showLoading();
    
    // Check if Firebase is initialized
    if (typeof firebase === 'undefined' || firebase.apps.length === 0) {
        console.error('Firebase not initialized');
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-danger">
                    Error: Firebase not initialized. Please try again later.
                </td>
            </tr>
        `;
        hideLoading();
        return;
    }
    
    // Get Firestore instance
    const db = firebase.firestore();
    
    // Fetch blogs from Firestore for this user
    db.collection('blogs')
        .where('userId', '==', userId)
        .get()
        .then((querySnapshot) => {
            console.log('Query snapshot size:', querySnapshot.size);
            if (querySnapshot.empty) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="3" class="text-center">
                            <p class="mb-0">You haven't created any blogs yet.</p>
                            <a href="create-blog.html" class="btn btn-primary mt-2">Create Your First Blog</a>
                        </td>
                    </tr>
                `;
                hideLoading();
                return;
            }
            
            // Convert to array and sort by date
            let blogsArray = [];
            querySnapshot.forEach(doc => {
                const blog = doc.data();
                blog.id = doc.id;
                blogsArray.push(blog);
            });
            
            // Sort by date (newest first)
            blogsArray.sort((a, b) => {
                // Handle different date formats
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA;
            });
            
            let blogsHTML = '';
            blogsData = [];
            
            blogsArray.forEach((blog, index) => {
                // Add simulated view count for analytics
                blog.views = Math.floor(Math.random() * 1000) + 1;
                blogsData.push(blog);
                
                blogsHTML += `
                    <tr data-aos="flip-left" data-aos-delay="${index * 100}">
                        <td>
                            <strong data-aos="fade-right">${blog.title}</strong>
                            <div class="text-muted small" data-aos="fade-right" data-aos-delay="100">${blog.author}</div>
                        </td>
                        <td data-aos="fade-up">${formatDate(blog.date)}</td>
                        <td>
                            <a href="blog-detail.html?id=${blog.id}" class="btn btn-sm btn-outline-primary me-1" title="View" data-aos="zoom-in">
                                <i class="fas fa-eye"></i>
                            </a>
                            <button class="btn btn-sm btn-outline-success me-1 edit-blog-btn" data-id="${blog.id}" title="Edit" data-aos="zoom-in" data-aos-delay="100">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-blog-btn" data-id="${blog.id}" title="Delete" data-aos="zoom-in" data-aos-delay="200">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            
            tableBody.innerHTML = blogsHTML;
            
            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-blog-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const blogId = this.getAttribute('data-id');
                    editBlog(blogId);
                });
            });
            
            document.querySelectorAll('.delete-blog-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const blogId = this.getAttribute('data-id');
                    deleteBlog(blogId);
                });
            });
            
            hideLoading();
        })
        .catch((error) => {
            console.error('Error fetching blogs: ', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-danger">
                        Error loading blogs. Please try again later.
                    </td>
                </tr>
            `;
            hideLoading();
        });
}

// Render analytics view
function renderAnalytics(blogs) {
    // Calculate analytics data
    const totalBlogs = blogs.length;
    const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);
    const avgViews = totalBlogs > 0 ? Math.round(totalViews / totalBlogs) : 0;
    const topBlog = blogs.reduce((top, blog) => blog.views > top.views ? blog : top, { views: 0, title: '-' });
    
    // Update summary cards
    document.getElementById('total-blogs').textContent = totalBlogs;
    document.getElementById('total-views').textContent = totalViews;
    document.getElementById('avg-views').textContent = avgViews;
    document.getElementById('top-blog').textContent = topBlog.title;
    
    // Render analytics table
    const analyticsTableBody = document.getElementById('analytics-table-body');
    let analyticsHTML = '';
    
    blogs.forEach((blog, index) => {
        const performance = blog.views > avgViews ? 'Above Average' : blog.views === avgViews ? 'Average' : 'Below Average';
        const performanceClass = blog.views > avgViews ? 'text-success' : blog.views === avgViews ? 'text-warning' : 'text-danger';
        
        analyticsHTML += `
            <tr data-aos="fade-up" data-aos-delay="${index * 50}">
                <td>${blog.title}</td>
                <td>${blog.views}</td>
                <td>${formatDate(blog.date)}</td>
                <td class="${performanceClass}">${performance}</td>
            </tr>
        `;
    });
    
    analyticsTableBody.innerHTML = analyticsHTML;
    
    // Render charts
    renderCharts(blogs);
}

// Render charts for analytics
function renderCharts(blogs) {
    // Destroy existing charts if they exist
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    
    // Views over time chart (simulated data)
    const viewsCtx = document.getElementById('viewsChart').getContext('2d');
    const dates = [];
    const viewsData = [];
    
    // Generate last 7 days of data
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        viewsData.push(Math.floor(Math.random() * 500) + 100);
    }
    
    charts.viewsChart = new Chart(viewsCtx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Blog Views',
                data: viewsData,
                borderColor: '#1ABC9C',
                backgroundColor: 'rgba(26, 188, 156, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Top blogs chart
    const topBlogsCtx = document.getElementById('topBlogsChart').getContext('2d');
    const topBlogs = [...blogs]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    
    const blogTitles = topBlogs.map(blog => blog.title.length > 15 ? blog.title.substring(0, 15) + '...' : blog.title);
    const blogViews = topBlogs.map(blog => blog.views);
    
    charts.topBlogsChart = new Chart(topBlogsCtx, {
        type: 'bar',
        data: {
            labels: blogTitles,
            datasets: [{
                label: 'Views',
                data: blogViews,
                backgroundColor: [
                    'rgba(26, 188, 156, 0.7)',
                    'rgba(243, 156, 18, 0.7)',
                    'rgba(41, 128, 185, 0.7)',
                    'rgba(155, 89, 182, 0.7)',
                    'rgba(231, 76, 60, 0.7)'
                ],
                borderColor: [
                    'rgba(26, 188, 156, 1)',
                    'rgba(243, 156, 18, 1)',
                    'rgba(41, 128, 185, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Edit blog function
function editBlog(blogId) {
    // Show loading
    showLoading();
    
    // Check if Firebase is initialized
    if (typeof firebase === 'undefined' || firebase.apps.length === 0) {
        console.error('Firebase not initialized');
        console.log('Error: Firebase not initialized');
        hideLoading();
        return;
    }
    
    // Get Firestore instance
    const db = firebase.firestore();
    
    // Fetch blog data
    db.collection('blogs').doc(blogId).get()
        .then((doc) => {
            if (doc.exists) {
                const blog = doc.data();
                
                // Populate form fields
                document.getElementById('edit-blog-id').value = blogId;
                document.getElementById('edit-blog-title').value = blog.title;
                document.getElementById('edit-blog-author').value = blog.author;
                document.getElementById('edit-blog-image').value = blog.imageURL || '';
                document.getElementById('edit-blog-content').innerHTML = blog.content;
                
                // Set tags
                currentEditTags = blog.tags || [];
                renderEditTags();
                
                // Show modal
                const editModal = new bootstrap.Modal(document.getElementById('editBlogModal'));
                editModal.show();
                hideLoading();
            } else {
                console.log('Blog not found.');
                hideLoading();
            }
        })
        .catch((error) => {
            console.error('Error fetching blog: ', error);
            console.log('Error loading blog data.');
            hideLoading();
        });
}

// Render edit tags
function renderEditTags() {
    const container = document.getElementById('edit-tags-container');
    const input = document.getElementById('edit-tag-input');
    
    // Clear container but keep the input
    container.innerHTML = '';
    container.appendChild(input);
    
    // Add tags
    currentEditTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.innerHTML = `${tag} <i class="fas fa-times ms-1" style="cursor: pointer;"></i>`;
        
        // Add remove functionality
        tagElement.querySelector('i').addEventListener('click', function() {
            currentEditTags = currentEditTags.filter(t => t !== tag);
            renderEditTags();
        });
        
        container.insertBefore(tagElement, input);
    });
}

// Add tag when pressing Enter in edit modal
document.getElementById('edit-tag-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const tagValue = this.value.trim();
        if (tagValue && !currentEditTags.includes(tagValue)) {
            currentEditTags.push(tagValue);
            renderEditTags();
            this.value = '';
        }
    }
});

// Save blog changes
document.getElementById('save-blog-changes').addEventListener('click', function() {
    const blogId = document.getElementById('edit-blog-id').value;
    const title = document.getElementById('edit-blog-title').value;
    const author = document.getElementById('edit-blog-author').value;
    const imageURL = document.getElementById('edit-blog-image').value;
    const content = document.getElementById('edit-blog-content').innerHTML;
    
    // Validate required fields
    if (!title || !author || !content) {
        console.log('Please fill in all required fields.');
        return;
    }
    
    // Show loading
    showLoading();
    
    // Check if Firebase is initialized
    if (typeof firebase === 'undefined' || firebase.apps.length === 0) {
        console.error('Firebase not initialized');
        console.log('Error: Firebase not initialized');
        hideLoading();
        return;
    }
    
    // Get Firestore instance
    const db = firebase.firestore();
    
    // Update blog in Firestore
    db.collection('blogs').doc(blogId).update({
        title: title,
        author: author,
        imageURL: imageURL,
        content: content,
        tags: currentEditTags,
        date: new Date().toISOString().split('T')[0] // Update date to current
    })
    .then(() => {
        console.log('Blog updated successfully');
        console.log('Blog updated successfully!');
        
        // Close modal
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editBlogModal'));
        editModal.hide();
        
        // Refresh blog list
        const user = firebase.auth().currentUser;
        if (user) {
            loadUserBlogs(user.uid);
        }
        hideLoading();
    })
    .catch((error) => {
        console.error('Error updating blog: ', error);
        console.log('Error updating blog: ' + error.message);
        hideLoading();
    });
});

// Delete blog function
function deleteBlog(blogId) {
    if (confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
        // Show loading
        showLoading();
        
        // Check if Firebase is initialized
        if (typeof firebase === 'undefined' || firebase.apps.length === 0) {
            console.error('Firebase not initialized');
            console.log('Error: Firebase not initialized');
            hideLoading();
            return;
        }
        
        // Get Firestore instance
        const db = firebase.firestore();
        
        db.collection('blogs').doc(blogId).delete()
            .then(() => {
                console.log('Blog deleted successfully');
                console.log('Blog deleted successfully!');
                
                // Refresh blog list
                const user = firebase.auth().currentUser;
                if (user) {
                    loadUserBlogs(user.uid);
                }
                hideLoading();
            })
            .catch((error) => {
                console.error('Error deleting blog: ', error);
                console.log('Error deleting blog: ' + error.message);
                hideLoading();
            });
    }
}

// Rich Text Editor functionality for edit modal
document.querySelector('#editBlogModal .btn-bold').addEventListener('click', function() {
    document.execCommand('bold', false, null);
});

document.querySelector('#editBlogModal .btn-italic').addEventListener('click', function() {
    document.execCommand('italic', false, null);
});

document.querySelector('#editBlogModal .btn-underline').addEventListener('click', function() {
    document.execCommand('underline', false, null);
});

document.querySelector('#editBlogModal .btn-list-ul').addEventListener('click', function() {
    document.execCommand('insertUnorderedList', false, null);
});

document.querySelector('#editBlogModal .btn-list-ol').addEventListener('click', function() {
    document.execCommand('insertOrderedList', false, null);
});

// Focus on content editor when clicked
document.querySelector('#edit-blog-content').addEventListener('click', function() {
    this.focus();
});
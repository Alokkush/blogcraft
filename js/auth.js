// Authentication functions

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

// Show user info when logged in
function showUserInfo(user) {
    document.getElementById('auth-buttons').classList.add('d-none');
    document.getElementById('user-info').classList.remove('d-none');
    document.getElementById('user-name').textContent = user.email;
    
    // Refresh inspirational quote when user logs in
    if (typeof displayRandomQuote === 'function') {
        displayRandomQuote();
    }
}

// Hide user info when logged out
function hideUserInfo() {
    document.getElementById('auth-buttons').classList.remove('d-none');
    document.getElementById('user-info').classList.add('d-none');
    document.getElementById('user-name').textContent = '';
}

// Login function
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Show loading
    showLoading();
    
    // Check if Firebase is initialized
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.error('Firebase not initialized');
        hideLoading();
        return;
    }
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            showUserInfo(user);
            // Replace jQuery modal hide with vanilla JS
            const authModal = document.getElementById('authModal');
            if (authModal) {
                const modalInstance = bootstrap.Modal.getInstance(authModal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
            
            // Show success message using console.log instead of alert to avoid potential jQuery issues
            console.log('Login successful! Welcome to BlogCraft India!');
            
            // Reset form
            document.getElementById('login-form').reset();
            hideLoading();
            
            // Redirect to home page after a short delay to ensure UI updates
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Login error: ', errorMessage);
            // Show error message using console.log instead of alert to avoid potential jQuery issues
            console.log('Error: ' + errorMessage);
            hideLoading();
        });
});

// Signup function
document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Show loading
    showLoading();
    
    // Check if Firebase is initialized
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.error('Firebase not initialized');
        hideLoading();
        return;
    }
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            showUserInfo(user);
            // Replace jQuery modal hide with vanilla JS
            const authModal = document.getElementById('authModal');
            if (authModal) {
                const modalInstance = bootstrap.Modal.getInstance(authModal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
            
            // Show success message using console.log instead of alert to avoid potential jQuery issues
            console.log('Account created successfully! Welcome to BlogCraft India!');
            
            // Reset form
            document.getElementById('signup-form').reset();
            hideLoading();
            
            // Redirect to home page after a short delay to ensure UI updates
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Signup error: ', errorMessage);
            // Show error message using console.log instead of alert to avoid potential jQuery issues
            console.log('Error: ' + errorMessage);
            hideLoading();
        });
});

// Logout function
document.getElementById('logout-btn').addEventListener('click', function() {
    // Show loading
    showLoading();
    
    // Check if Firebase is initialized
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.error('Firebase not initialized');
        hideLoading();
        return;
    }
    
    firebase.auth().signOut()
        .then(() => {
            // Sign-out successful
            hideUserInfo();
            console.log('You have been logged out. Dhanyavaad!');
            
            // Redirect to home page if not already there
            if (!window.location.pathname.includes('index.html') && 
                window.location.pathname !== '/') {
                window.location = 'index.html';
            }
            hideLoading();
        })
        .catch((error) => {
            // An error happened
            console.error('Logout error: ', error.message);
            console.log('Error logging out: ' + error.message);
            hideLoading();
        });
});

// Check auth state
if (typeof firebase !== 'undefined') {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            showUserInfo(user);
        } else {
            // User is signed out
            hideUserInfo();
        }
    });
}

// Switch between login and signup tabs
document.getElementById('login-btn').addEventListener('click', function() {
    document.getElementById('login-tab').click();
});

document.getElementById('signup-btn').addEventListener('click', function() {
    document.getElementById('signup-tab').click();
});

// Get started button redirects to create blog page if logged in, otherwise opens auth modal
document.getElementById('get-started-btn').addEventListener('click', function() {
    if (typeof firebase !== 'undefined') {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                window.location = 'create-blog.html';
            } else {
                document.getElementById('signup-tab').click();
                // Replace jQuery modal show with vanilla JS
                const authModal = document.getElementById('authModal');
                if (authModal) {
                    const modalInstance = new bootstrap.Modal(authModal);
                    modalInstance.show();
                }
            }
        });
    }
});
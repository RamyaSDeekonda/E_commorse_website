document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Here you would typically send these credentials to a server
    // For this example, we'll just do a simple check
    if (email && password) {
        // Store login status in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        // Redirect to home page
        window.location.href = 'index.html';
    } else {
        alert('Please fill in all fields');
    }
}); 
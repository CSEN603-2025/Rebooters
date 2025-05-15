document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const role = document.getElementById('role').value;
            const email = document.getElementById('email').value;
            if (role && email) {
                localStorage.setItem('userRole', role);
                localStorage.setItem('userEmail', email);
                window.location.href = "dashboard.html";
            }
        });
    }
});
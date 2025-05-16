document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        if (email && password && role) {
            // Redirect to the appropriate dashboard
            window.location.href = `../2-dashboards/${role}.html`;
        } else {
            alert('Please fill in all fields.');
        }
    });
});

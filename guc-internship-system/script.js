// Dummy users database
const users = [
    { email: "student@guc.edu.eg", password: "student123", role: "student" },
    { email: "company@guc.com", password: "company123", role: "company" },
    { email: "scad@guc.edu.eg", password: "scad123", role: "scad" },
    { email: "faculty@guc.edu.eg", password: "faculty123", role: "faculty" }
];

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const role = document.getElementById('role').value;
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Find user in dummy database
    const user = users.find(u => u.email === email && u.password === password && u.role === role);

    if (user) {
        localStorage.setItem('userRole', role);
        localStorage.setItem('userEmail', email);
        window.location.href = "dashboard.html";
    } else {
        document.getElementById('loginMessage').textContent = "Invalid email, password, or role. Please try again.";
    }
});
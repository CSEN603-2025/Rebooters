// Authentication state management
let currentUser = null;

// Hardcoded user database (for demo only - replace with real backend in production)
const userDatabase = {
    // Student credentials
    'student@guc.edu.eg': {
        password: 'student123',
        role: 'student',
        name: 'John Student',
        avatar: 'assets/images/student-avatar.png'
    },
    // PRO Student credentials
    'prostudent@guc.edu.eg': {
        password: 'prostudent123',
        role: 'pro-student',
        name: 'Jane PRO Student',
        avatar: 'assets/images/pro-student-avatar.png'
    },
    // Company credentials
    'company@example.com': {
        password: 'company123',
        role: 'company',
        name: 'Tech Solutions Inc.',
        avatar: 'assets/images/company-logo.png'
    },
    // SCAD credentials
    'scad@guc.edu.eg': {
        password: 'scad123',
        role: 'scad',
        name: 'SCAD Office',
        avatar: 'assets/images/scad-logo.png'
    },
    // Faculty credentials
    'faculty@guc.edu.eg': {
        password: 'faculty123',
        role: 'faculty',
        name: 'Dr. Ahmed Mahmoud',
        avatar: 'assets/images/faculty-avatar.png'
    }
};

// Authentication functions
function login(email, password) {
    const user = userDatabase[email];
    
    if (user && user.password === password) {
        currentUser = {
            email: email,
            role: user.role,
            name: user.name,
            avatar: user.avatar
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        redirectToDashboard(user.role);
        return true;
    }
    
    return false;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = '..\..\index.html';
}

function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        return true;
    }
    return false;
}

function redirectToDashboard(role) {
    const basePath = '../pages';
    switch(role) {
        case 'student':
            window.location.href = `${basePath}/student/dashboard.html`;
            break;
        case 'pro-student':
            window.location.href = `${basePath}/student/dashboard.html?pro=true`;
            break;
        case 'company':
            window.location.href = `${basePath}/company/dashboard.html`;
            break;
        case 'scad':
            window.location.href = `${basePath}/scad/dashboard.html`;
            break;
        case 'faculty':
            window.location.href = `${basePath}/faculty/dashboard.html`;
            break;
        default:
            window.location.href = '../index.html';
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    if (checkAuth()) {
        redirectToDashboard(currentUser.role);
    }

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const role = document.getElementById('loginRole').value;

            if (!login(email, password)) {
                const errorElement = document.getElementById('loginError');
                errorElement.textContent = 'Incorrect email or password';
                errorElement.style.display = 'block';
            }
        });
    }
});

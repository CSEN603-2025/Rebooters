// ======================
// Authentication Service
// ======================
const AuthService = {
    currentUser: null,
    
    // User database (in production, replace with API calls)
    userDatabase: {
        'student@guc.edu.eg': {
            password: 'student123',
            role: 'student',
            name: 'Farah Mokhtar',
            avatar: 'assets/images/default-avatar.png'
        },
        'prostudent@guc.edu.eg': {
            password: 'prostudent123',
            role: 'pro-student',
            name: 'Jane PRO Student',
            avatar: 'assets/images/default-avatar.png'
        },
        'company@example.com': {
            password: 'company123',
            role: 'company',
            name: 'Tech Solutions Inc.',
            avatar: 'assets/images/company-avatar.png'
        },
        'scad@guc.edu.eg': {
            password: 'scad123',
            role: 'scad',
            name: 'SCAD Office',
            avatar: 'assets/images/guc-logo.png'
        },
        'faculty@guc.edu.eg': {
            password: 'faculty123',
            role: 'faculty',
            name: 'Dr. Ahmed Mahmoud',
            avatar: 'assets/images/default-avatar.png'
        }
    },

    // Login function
    login(email, password) {
        const user = this.userDatabase[email];
        
        if (user && user.password === password) {
            this.currentUser = {
                email: email,
                role: user.role,
                name: user.name,
                avatar: user.avatar
            };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            return true;
        }
        return false;
    },

    // Logout function
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = '../../index.html';
    },

    // Check authentication status
    checkAuth() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
            return true;
        }
        return false;
    },

    // Redirect to appropriate dashboard
    redirectToDashboard() {
        if (!this.currentUser) return window.location.href = '../../index.html';
        
        const basePath = 'pages';
        const role = this.currentUser.role;
        
        const routes = {
            'student': `${basePath}/student/dashboard.html`,
            'pro-student': `${basePath}/student/dashboard.html?pro=true`,
            'company': `${basePath}/company/dashboard.html`,
            'scad': `${basePath}/scad/dashboard.html`,
            'faculty': `${basePath}/faculty/dashboard.html`
        };
        
        window.location.href = routes[role] || '../../index.html';
    }
};

// ======================
// PRO Features Service
// ======================
const ProService = {
    checkEligibility() {
        const totalMonthsCompleted = this.calculateTotalInternshipMonths();
        
        if (totalMonthsCompleted >= 3) {
            this.showProBadge();
            this.enableProFeatures();
            
        }
    },

    calculateTotalInternshipMonths() {
        // Replace with actual calculation in production
        return 2; // Demo value
    },

    showProBadge() {
        const proBadge = document.getElementById('pro-badge');
        if (proBadge) proBadge.style.display = 'inline-block';
    },

    enableProFeatures() {
        // Show PRO-only navigation items
        document.querySelectorAll('.pro-feature').forEach(item => {
            item.classList.add('show-pro');
            item.style.display = 'block';
        });
    },

    
};

// ======================
// Modal Service
// ======================
const ModalService = {
    activeModal: null,

    open(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal with ID ${modalId} not found`);
            return;
        }
        
        this.closeAll(); // Close any open modals first
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.activeModal = modal;
    },

    close(modalId) {
        const modal = modalId ? document.getElementById(modalId) : this.activeModal;
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.activeModal = null;
        }
    },

    closeAll() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
        this.activeModal = null;
    },

    initCloseListeners() {
        // Close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });

        // Click outside to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.close();
            });
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.close();
            }
        });
    }
};

// ======================
// Form Handlers
// ======================
const FormHandlers = {
    initLoginForm() {
        const form = document.getElementById('login-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const role = document.getElementById('login-role').value;

            const user = AuthService.userDatabase[email];
            
            if (user && user.password === password && user.role === role) {
                AuthService.login(email, password);
                ModalService.close('login-modal');
                AuthService.redirectToDashboard();
            } else {
                alert('Invalid credentials or role mismatch');
            }
        });
    },

    initSignupForm() {
        const form = document.getElementById('signup-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('signup-firstname').value;
            const lastName = document.getElementById('signup-lastname').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            const role = document.getElementById('signup-role').value;
            
            // Validation
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (AuthService.userDatabase[email]) {
                alert('Email already registered!');
                return;
            }
            
            // In a real app, send to backend here
            alert(`Account created as ${role}! (Demo - not actually saved)`);
            ModalService.close('signup-modal');
            ModalService.open('login-modal');
        });
    },

    initLogoutHandlers() {
        const logoutBtn = document.getElementById('logout-btn');
        const logoutModal = document.getElementById('logout-modal');
        const cancelLogout = document.getElementById('cancel-logout');
        const confirmLogout = document.getElementById('confirm-logout');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                ModalService.open('logout-modal');
            });
        }

        if (confirmLogout) {
            confirmLogout.addEventListener('click', () => {
                AuthService.logout();
            });
        }

        if (cancelLogout) {
            cancelLogout.addEventListener('click', () => {
                ModalService.close('logout-modal');
            });
        }
    }
};

// ======================
// Event Listeners Setup
// ======================
const EventManager = {
    initButtonListeners() {
        // Login buttons
        document.querySelectorAll('.login-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                ModalService.open('login-modal');
            });
        });

        // Signup buttons
        document.querySelectorAll('.signup-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                ModalService.open('signup-modal');
            });
        });

        // Switch between login and signup
        const switchToSignup = document.querySelector('.switch-to-signup');
        const switchToLogin = document.querySelector('.switch-to-login');

        if (switchToSignup) {
            switchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                ModalService.close('login-modal');
                ModalService.open('signup-modal');
            });
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                ModalService.close('signup-modal');
                ModalService.open('login-modal');
            });
        }
    }
};

// ======================
// Main Initialization
// ======================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize services
    ModalService.initCloseListeners();
    FormHandlers.initLoginForm();
    FormHandlers.initSignupForm();
    FormHandlers.initLogoutHandlers();
    EventManager.initButtonListeners();

    // Check authentication status on page load
    if (AuthService.checkAuth()) {
        // If logged in, check for PRO eligibility
        if (AuthService.currentUser.role === 'student') {
            ProService.checkEligibility();
        }
    }

    // Debugging
    console.log('Authentication system initialized');
});

// Mobile Navigation
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navMenu = document.querySelector('.nav-menu');

hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburgerMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.classList.add('animated');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
});

// Login/Signup Modal
function createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <h2>GUC Internship System Login</h2>
            </div>
            <div class="modal-body">
                <div class="tabs">
                    <button class="tab-btn active" data-tab="login">Login</button>
                    <button class="tab-btn" data-tab="signup">Sign Up</button>
                </div>
                
                <div class="tab-content active" id="login">
                    <form class="auth-form" id="loginForm">
                        <div class="form-group">
                            <label for="login-email">Email</label>
                            <input type="email" id="login-email" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <input type="password" id="login-password" required>
                        </div>
                        <div class="form-group">
                            <label for="login-role">I am a:</label>
                            <select id="login-role" required>
                                <option value="">Select role</option>
                                <option value="student">Student</option>
                                <option value="pro-student">PRO Student</option>
                                <option value="faculty">Faculty Member</option>
                                <option value="company">Company</option>
                                <option value="scad">SCAD Member</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Login</button>
                    </form>
                </div>
                
                <div class="tab-content" id="signup">
                    <form class="auth-form" id="signupForm">
                        <div class="form-group">
                            <label for="signup-email">Email</label>
                            <input type="email" id="signup-email" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-password">Password</label>
                            <input type="password" id="signup-password" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-confirm">Confirm Password</label>
                            <input type="password" id="signup-confirm" required>
                        </div>
                        <div class="form-group">
                            <label for="user-type">I am a:</label>
                            <select id="user-type" required>
                                <option value="">Select user type</option>
                                <option value="student">Student</option>
                                <option value="pro-student">PRO Student</option>
                                <option value="faculty">Faculty Member</option>
                                <option value="company">Company</option>
                                <option value="scad">SCAD Member</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Form validation for password match
    const signupForm = modal.querySelector('#signupForm');
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        
        if (password !== confirm) {
            alert('Passwords do not match!');
            return;
        }
        
        const userType = document.getElementById('user-type').value;
        alert(`Account created successfully! Redirecting to ${userType} dashboard...`);
        setTimeout(() => {
            window.location.href = `pages/${userType}/dashboard.html`;
        }, 1000);
    });
    
    // Login form submission
    const loginForm = modal.querySelector('#loginForm');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userType = document.getElementById('login-role').value;
        if (!userType) {
            alert('Please select your role');
            return;
        }
        
        alert(`Login successful! Redirecting to ${userType} dashboard...`);
        setTimeout(() => {
            window.location.href = `pages/${userType}/dashboard.html`;
        }, 1000);
    });
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Tab switching
    modal.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            modal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
    
    return modal;
}

// Initialize modal when login/signup buttons are clicked
document.querySelectorAll('.login-btn, .signup-btn, .btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.querySelector('.modal') || createModal();
        modal.style.display = 'block';
        
        // If signup button was clicked, switch to signup tab
        if (btn.classList.contains('signup-btn') || (btn.classList.contains('btn-secondary') && btn.textContent.includes('Sign Up'))) {
            modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            modal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            modal.querySelector('[data-tab="signup"]').classList.add('active');
            document.getElementById('signup').classList.add('active');
        }
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.querySelector('.modal');
    if (modal && e.target === modal) {
        modal.style.display = 'none';
    }
});
// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
  // Auth first
  if (typeof Auth !== 'undefined') {
    Auth.init();
  }
  
  // Then specific page controllers
  if (window.location.pathname.includes('company')) {
    if (typeof CompanyController !== 'undefined') {
      CompanyController.init();
    }
  }
  else if (window.location.pathname.includes('student')) {
    if (typeof StudentController !== 'undefined') {
      StudentController.init();
    }
  }
  else if (window.location.pathname.includes('scad')) {
    if (typeof SCADController !== 'undefined') {
      SCADController.init();
    }
  }
  else if (window.location.pathname.includes('faculty')) {
    if (typeof FacultyController !== 'undefined') {
      FacultyController.init();
    }
  }
});
// Initialize all systems when their pages load
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication first
    if (typeof Auth !== 'undefined') {
        Auth.init();
    }
    
    // Initialize specific page controllers
    const path = window.location.pathname;
    
    if (path.includes('internships.html') && typeof InternshipSystem !== 'undefined') {
        new InternshipSystem();
    }
    else if (path.includes('notifications.html') && typeof NotificationSystem !== 'undefined') {
        new NotificationSystem();
    }
    else if (path.includes('appointments.html') && typeof AppointmentSystem !== 'undefined') {
        new AppointmentSystem();
    }
    else if (path.includes('workshops.html') && typeof WorkshopSystem !== 'undefined') {
        new WorkshopSystem();
    }
    // Add other page initializations as needed
});
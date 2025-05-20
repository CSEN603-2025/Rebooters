document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) {
        window.location.href = '../index.html';
        return;
    }

    // Initialize UI components
    initHamburgerMenu();
    initLogoutButton();
    // Initialize notifications
    initNotifications();
    // Load data and check PRO status
    loadDashboardData();
    loadSuggestedInternships();
    setTimeout(checkProEligibility, 500); // Delay to let DOM settle

    
    
});

function initHamburgerMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    
    if (hamburgerMenu && sidebar) {
        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            sidebar.classList.toggle('active');
        });
    }
}

function initLogoutButton() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

function initNotifications() {
    const closeNotificationBtn = document.getElementById('close-notification');
    if (closeNotificationBtn) {
        closeNotificationBtn.addEventListener('click', function() {
            const toast = document.getElementById('notification-toast');
            if (toast) toast.style.display = 'none';
        });
    }
    
    // Simulate some notifications
    setTimeout(() => {
        showNotificationToast('Internship Cycle Update', 'New internship cycle begins in 2 months', 'success');
    }, 2000);
    
    setTimeout(() => {
        showNotificationToast('Report Status', 'Your internship report was accepted', 'success');
    }, 10000);
}

function showNotificationToast(title, message, type = 'success') {
    const toast = document.getElementById('notification-toast');
    const messageEl = document.getElementById('notification-message');
    
    if (toast && messageEl) {
        toast.className = `notification-toast ${type}`;
        toast.querySelector('.notification-title').textContent = title;
        messageEl.textContent = message;
        toast.style.display = 'block';
        
        // Update notification count
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            const currentCount = parseInt(badge.textContent) || 0;
            badge.textContent = currentCount + 1;
        }
    }
}

function loadDashboardData() {
    // In a real app, you would fetch this from an API
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    // Update user profile
    if (user) {
        const profileElement = document.querySelector('.user-profile');
        if (profileElement) {
            const nameElement = profileElement.querySelector('h3');
            const avatarElement = profileElement.querySelector('img');
            
            if (nameElement) nameElement.textContent = user.name;
            if (avatarElement) avatarElement.src = user.avatar || '../../assets/images/default-avatar.png';
        }
    }
}

function loadSuggestedInternships() {
    const internships = [
        {
            title: "Frontend Developer Intern",
            company: "Tech Solutions Inc.",
            industry: "Software Development",
            interest: "Web Development",
            recommendations: 5,
            duration: "3 months",
            stipend: "2000 L.E/month"
        },
        {
            title: "Data Analyst Intern",
            company: "Insight Analytics",
            industry: "Data Science",
            interest: "Data Analysis",
            recommendations: 3,
            duration: "2 months",
            stipend: "1500 L.E/month"
        },
        {
            title: "Marketing Assistant Intern",
            company: "BrightWave Media",
            industry: "Marketing & Advertising",
            interest: "Digital Marketing",
            recommendations: 4,
            duration: "3 months",
            stipend: "1000 L.E/month"
        }
    ];

    const container = document.querySelector('.internship-list');
    if (!container) return;
  
    container.innerHTML = '';

    internships.forEach(internship => {
        const card = document.createElement('div');
        card.className = 'internship-card';
        card.innerHTML = `
            <h3>${internship.title}</h3>
            <p class="company">${internship.company}</p>
            <p class="industry"><strong>Industry:</strong> ${internship.industry}</p>
            <p class="interest-match"><strong>Matched Interest:</strong> ${internship.interest}</p>
            <p class="recommendation"><strong>Recommended by:</strong> ${internship.recommendations} past interns</p>
            <div class="internship-meta">
                <span><i class="fas fa-clock"></i> ${internship.duration}</span>
                <span><i class="fas fa-money-bill-wave"></i> ${internship.stipend}</span>
            </div>
            <div class="internship-actions">
                <a href="internship-details.html" class="btn btn-primary">View Details</a>
                <button class="btn btn-secondary">Apply Now</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function checkProEligibility() {
    // In a real app, calculate from actual internship data
    const totalMonthsCompleted = calculateTotalInternshipMonths(); 
    
    if (totalMonthsCompleted >= 3) {
        showProBadge();
        enableProFeatures();
        showNotificationToast('PRO Status Unlocked!', 
            'You\'ve gained access to exclusive PRO features', 
            'success');
    }
}

function calculateTotalInternshipMonths() {
    // Dummy implementation - replace with real calculation
    return 2; // For demo purposes - change to test different scenarios
}

function showProBadge() {
    const proBadge = document.getElementById('pro-badge');
    if (proBadge) {
        proBadge.style.display = 'inline-block';
    }
}

function enableProFeatures() {
    // 1. Show PRO-only navigation items
    const proNavItems = document.querySelectorAll('.pro-feature');
    if (proNavItems.length > 0) {
        proNavItems.forEach(item => {
            item.classList.add('show-pro');
            item.style.display = 'block';
        });
    }

    // 2. Add PRO badge to profile
    const proBadge = document.getElementById('pro-badge');
    if (proBadge) proBadge.style.display = 'inline-block';

    // 3. Enable PRO dashboard features
    enableProDashboardFeatures();
}

function enableProDashboardFeatures() {
    // Add PRO sections to dashboard
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    // Add Profile Views section
    const profileViews = document.createElement('div');
    profileViews.className = 'dashboard-section pro-section';
    profileViews.innerHTML = `
        <h2><i class="fas fa-eye"></i> Companies That Viewed Your Profile</h2>
        <div class="company-views">
            <div class="view-item">
                <img src="../../assets/images/company1.png" alt="Tech Corp">
                <div>
                    <h4>Tech Corp</h4>
                    <p>Viewed 2 days ago</p>
                    <button class="btn btn-small">View Details</button>
                </div>
            </div>
        </div>
    `;
    mainContent.appendChild(profileViews);

    // Add Assessments section
    const assessments = document.createElement('div');
    assessments.className = 'dashboard-section pro-section';
    assessments.innerHTML = `
        <h2><i class="fas fa-tasks"></i> Available Assessments</h2>
        <div class="assessment-list">
            <div class="assessment-card">
                <h3>Frontend Developer Skills Test</h3>
                <p>30 questions | 45 minutes</p>
                <div class="assessment-actions">
                    <button class="btn btn-primary">Start Assessment</button>
                    <button class="btn btn-secondary">View Sample</button>
                </div>
            </div>
        </div>
    `;
    mainContent.appendChild(assessments);

    // Add Workshops section
    const workshops = document.createElement('div');
    workshops.className = 'dashboard-section pro-section';
    workshops.innerHTML = `
        <h2><i class="fas fa-video"></i> Upcoming Workshops</h2>
        <div class="workshop-list">
            <div class="workshop-card">
                <div class="workshop-header">
                    <h3>Advanced React Patterns</h3>
                    <span class="badge">Live</span>
                </div>
                <p class="workshop-date">Tomorrow, 3:00 PM</p>
                <div class="workshop-actions">
                    <button class="btn btn-primary">Register</button>
                    <button class="btn btn-secondary">View Details</button>
                </div>
            </div>
        </div>
    `;
    mainContent.appendChild(workshops);
}
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) {
        window.location.href = '../index.html';
        return;
    }

    // Hamburger menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            sidebar.classList.toggle('active');
        });
    }

    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }

    // Load dynamic content
    loadDashboardData();
});

function loadDashboardData() {
    // In a real app, you would fetch this from an API
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    // Update user profile
    if (user) {
        const profileElement = document.querySelector('.user-profile');
        if (profileElement) {
            profileElement.querySelector('h3').textContent = user.name;
            profileElement.querySelector('img').src = user.avatar || '../assets/images/default-avatar.png';
        }
    }
    
    // You would load other dashboard data here
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
    container.innerHTML = '';

    internships.forEach(internship => {
        container.innerHTML += `
            <div class="internship-card">
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
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // your existing logic...
    loadSuggestedInternships(); // load the internships
});

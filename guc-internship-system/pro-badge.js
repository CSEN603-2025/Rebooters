document.addEventListener('DOMContentLoaded', function() {
    const assessmentForm = document.getElementById('assessmentForm');
    const assessmentResult = document.getElementById('assessmentResult');
    const resultContent = document.getElementById('resultContent');
    
    // Load existing assessment if any
    const existingAssessment = JSON.parse(localStorage.getItem('proBadgeAssessment')) || null;
    if (existingAssessment) {
        showAssessmentResult(existingAssessment);
    }
    
    assessmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect all checked criteria
        const criteria = {
            performance: Array.from(document.querySelectorAll('input[name="performance"]:checked')).map(cb => cb.value),
            report: Array.from(document.querySelectorAll('input[name="report"]:checked')).map(cb => cb.value),
            development: Array.from(document.querySelectorAll('input[name="development"]:checked')).map(cb => cb.value)
        };
        
        // Calculate score
        const score = calculateScore(criteria);
        const assessment = {
            criteria,
            score,
            date: new Date().toISOString(),
            status: score >= 8 ? 'approved' : 'pending'
        };
        
        // Save assessment
        localStorage.setItem('proBadgeAssessment', JSON.stringify(assessment));
        
        // Show result
        showAssessmentResult(assessment);
    });
    
    function calculateScore(criteria) {
        let score = 0;
        
        // Performance criteria (max 4 points)
        score += criteria.performance.length * 2;
        
        // Report criteria (max 3 points)
        score += criteria.report.length * 1.5;
        
        // Development criteria (max 3 points)
        score += criteria.development.length * 1.5;
        
        return score;
    }
    
    function showAssessmentResult(assessment) {
        assessmentForm.style.display = 'none';
        assessmentResult.style.display = 'block';
        
        const statusClass = assessment.status === 'approved' ? 'approved' : 'pending';
        
        resultContent.innerHTML = `
            <div class="result-section ${statusClass}">
                <h3>Status: ${assessment.status.toUpperCase()}</h3>
                <p>Score: ${assessment.score}/10</p>
                <p>Assessment Date: ${new Date(assessment.date).toLocaleDateString()}</p>
            </div>
            <div class="criteria-results">
                <h3>Criteria Met:</h3>
                <ul>
                    ${Object.entries(assessment.criteria).map(([category, items]) => `
                        <li>${category.charAt(0).toUpperCase() + category.slice(1)}:
                            <ul>
                                ${items.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
});

// Track PRO badge status and benefits
const PRO_BADGE_BENEFITS = {
    onlineAssessments: true,
    appointments: true,
    workshops: true,
    enhancedVisibility: true
};

function checkProBadgeEligibility() {
    const user = localStorage.getItem('userEmail');
    const profile = JSON.parse(localStorage.getItem('profile_' + user)) || {};
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const internships = JSON.parse(localStorage.getItem('internships')) || [];
    
    // Calculate total completed internship duration
    let totalDuration = 0;
    applications.forEach(app => {
        if (app.status === "complete") {
            const internship = internships.find(i => i.id === app.internshipId);
            if (internship) {
                totalDuration += internship.duration;
            }
        }
    });
    
    // Award PRO badge if 3 months completed
    if (totalDuration >= 3 && !profile.proBadge) {
        profile.proBadge = true;
        profile.proBadgeDate = new Date().toISOString();
        profile.proBadgeBenefits = PRO_BADGE_BENEFITS;
        localStorage.setItem('profile_' + user, JSON.stringify(profile));
        
        // Show notification
        showProBadgeNotification();
        return true;
    }
    
    return profile.proBadge || false;
}

function showProBadgeNotification() {
    const notification = document.createElement('div');
    notification.className = 'pro-badge-notification';
    notification.innerHTML = `
        <div class="pro-badge-content">
            <h3>🎉 Congratulations! You've earned your PRO badge! 🎉</h3>
            <p>You now have access to:</p>
            <ul>
                <li>Online Assessments</li>
                <li>Appointment Management</li>
                <li>Workshop Participation</li>
                <li>Enhanced Profile Visibility</li>
            </ul>
            <button onclick="window.location.href='profile.html'">View Profile</button>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

function hasProBadgeAccess(feature) {
    const user = localStorage.getItem('userEmail');
    const profile = JSON.parse(localStorage.getItem('profile_' + user)) || {};
    return profile.proBadge && profile.proBadgeBenefits && profile.proBadgeBenefits[feature];
} 
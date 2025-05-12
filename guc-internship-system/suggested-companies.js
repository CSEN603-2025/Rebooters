// Dummy companies data
const companies = [
    { name: "Tech Solutions", industry: "IT", jobAreas: ["Software Engineering", "Web Development"], recommended: true },
    { name: "Data Insights", industry: "Data Science", jobAreas: ["Data Analysis", "Business Intelligence"], recommended: false },
    { name: "MarketMakers", industry: "Marketing", jobAreas: ["Marketing", "Sales"], recommended: true },
    { name: "FinServe", industry: "Finance", jobAreas: ["Finance", "Accounting"], recommended: false },
    // Add more companies as needed
];

// Get student profile from localStorage
function getStudentProfile() {
    const user = localStorage.getItem('userEmail') || 'student@guc.edu.eg';
    return JSON.parse(localStorage.getItem('profile_' + user)) || {};
}

function renderSuggestedCompanies() {
    const profile = getStudentProfile();
    const interests = (profile.jobInterests || "").toLowerCase().split(",");
    const industry = (profile.industry || "").toLowerCase();

    // Filter companies by job interests or industry
    const suggested = companies.filter(c => {
        const matchesIndustry = industry && c.industry.toLowerCase().includes(industry);
        const matchesInterest = interests.some(interest => c.jobAreas.map(j => j.toLowerCase()).includes(interest.trim()));
        return matchesIndustry || matchesInterest || c.recommended;
    });

    const container = document.getElementById('suggestedCompanies');
    if (suggested.length === 0) {
        container.innerHTML = "<p>No suggestions found. Please update your profile with your interests and industry!</p>";
        return;
    }
    container.innerHTML = suggested.map(c => `
        <div class="internship-card">
            <h3>${c.name}</h3>
            <p><strong>Industry:</strong> ${c.industry}</p>
            <p><strong>Job Areas:</strong> ${c.jobAreas.join(", ")}</p>
            ${c.recommended ? `<span style="color:green;font-weight:bold;">Recommended by past interns</span>` : ""}
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderSuggestedCompanies);
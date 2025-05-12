// Dummy data for internships
let internships = [
    {
        id: 1,
        title: "Frontend Developer Intern",
        company: "Tech Solutions",
        duration: 3,
        paid: true,
        description: "Work on real web projects using HTML, CSS, and JS.",
    },
    {
        id: 2,
        title: "Data Analyst Intern",
        company: "Data Insights",
        duration: 2,
        paid: false,
        description: "Assist in analyzing and visualizing data for clients.",
    },
    {
        id: 3,
        title: "Marketing Intern",
        company: "MarketMakers",
        duration: 1,
        paid: true,
        description: "Support the marketing team in campaign management.",
    },
    {
        id: 4,
        title: "Backend Developer Intern",
        company: "Tech Solutions",
        duration: 3,
        paid: true,
        description: "Work on backend APIs and databases.",

    }
    // Add more dummy internships as needed
];

// If internships exist in localStorage, use them instead
const storedInternships = JSON.parse(localStorage.getItem('internships'));
if (storedInternships && Array.isArray(storedInternships)) {
    internships = storedInternships;
}

// Populate company filter dropdown
function populateCompanyFilter() {
    const companySet = new Set(internships.map(i => i.company));
    const companyFilter = document.getElementById('companyFilter');
    companySet.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        companyFilter.appendChild(option);
    });
}

// Render internships based on filters
function renderInternships() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const company = document.getElementById('companyFilter').value;
    const duration = document.getElementById('durationFilter').value;
    const paid = document.getElementById('paidFilter').value;

    const list = document.getElementById('internshipList');
    list.innerHTML = '';

    let filtered = internships.filter(i => {
        const matchesSearch = i.title.toLowerCase().includes(search) || i.company.toLowerCase().includes(search);
        const matchesCompany = !company || i.company === company;
        const matchesDuration = !duration || i.duration == duration;
        const matchesPaid = !paid || (paid === "paid" ? i.paid : !i.paid);
        return matchesSearch && matchesCompany && matchesDuration && matchesPaid;
    });

    if (filtered.length === 0) {
        list.innerHTML = "<p>No internships found.</p>";
        return;
    }

    filtered.forEach(i => {
    const card = document.createElement('div');
    card.className = 'internship-card';
    card.innerHTML = `
        <h3>${i.title}</h3>
        <p><strong>Company:</strong> ${i.company}</p>
        <p><strong>Duration:</strong> ${i.duration} month(s)</p>
        <p><strong>${i.paid ? "Paid" : "Unpaid"}</strong></p>
        <p>${i.description}</p>
        <button onclick="viewDetails(${i.id})">View Details</button>
    `;
    list.appendChild(card);
});

window.viewDetails = function(id) {
    window.location.href = `internship-details.html?id=${id}`;
};
}

// Event listeners for filters
document.addEventListener('DOMContentLoaded', () => {
    populateCompanyFilter();
    renderInternships();

    document.getElementById('searchInput').addEventListener('input', renderInternships);
    document.getElementById('companyFilter').addEventListener('change', renderInternships);
    document.getElementById('durationFilter').addEventListener('change', renderInternships);
    document.getElementById('paidFilter').addEventListener('change', renderInternships);
});

// Example: Get job interests from profile (localStorage)
const jobInterests = (localStorage.getItem('jobInterests') || '').toLowerCase().split(',').map(s => s.trim());

// Example: Get all evaluations
const evaluations = JSON.parse(localStorage.getItem('evaluations')) || [];

// 1. Companies recommended by past interns
const recommendedCompanies = new Set(
    evaluations.filter(e => e.recommend === 'yes').map(e => {
        // Find the company name from internshipId
        const internship = internships.find(i => i.id === e.internshipId);
        return internship ? internship.company : null;
    }).filter(Boolean)
);

// 2. Companies matching job interests or industry
function getSuggestedCompanies() {
    // Get unique companies from internships
    const companies = {};
    internships.forEach(i => {
        if (!companies[i.company]) {
            companies[i.company] = { name: i.company, industry: i.industry || '', internships: [] };
        }
        companies[i.company].internships.push(i);
    });

    // Score companies
    let suggestions = Object.values(companies).map(company => {
        // Score for job interest match
        let interestScore = company.internships.some(i =>
            jobInterests.some(interest =>
                i.title.toLowerCase().includes(interest) ||
                (i.description && i.description.toLowerCase().includes(interest))
            )
        ) ? 1 : 0;

        // Score for industry match (if you have industry info)
        let industryScore = jobInterests.some(interest =>
            company.industry.toLowerCase().includes(interest)
        ) ? 1 : 0;

        // Score for recommendations
        let recommendScore = recommendedCompanies.has(company.name) ? 1 : 0;

        return {
            ...company,
            score: interestScore + industryScore + recommendScore,
            recommended: recommendScore > 0
        };
    });

    // Sort by score, then by name
    suggestions = suggestions.filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

    return suggestions;
}

// Render suggestions
function renderSuggestedCompanies() {
    const container = document.getElementById('suggestedCompanies');
    const suggestions = getSuggestedCompanies();
    if (suggestions.length === 0) {
        container.innerHTML = "<p>No suggested companies found based on your interests and recommendations.</p>";
        return;
    }
    container.innerHTML = suggestions.map(company => `
        <div class="suggested-company-card">
            <h4>${company.name} ${company.recommended ? '<span style="color:green;">★ Recommended</span>' : ''}</h4>
            <p><strong>Industry:</strong> ${company.industry || 'N/A'}</p>
            <ul>
                ${company.internships.map(i => `<li>${i.title} (${i.paid ? 'Paid' : 'Unpaid'})</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

// Button event
document.getElementById('showSuggestedBtn').addEventListener('click', renderSuggestedCompanies);

// Add to internships.js
function loadMajorVideo() {
    // Try to get the major from different sources
    const userMajor = localStorage.getItem('userMajor') || 'Computer Science';
    console.log('Loading video for major:', userMajor);
    
    const videoElement = document.getElementById('majorVideo');
    const descriptionElement = document.getElementById('majorDescription');
    
    // Video sources and descriptions for each major
    const majorContent = {
        'Computer Science': {
            video: 'videos/cs-internships.mp4',
            description: 'Computer Science internships should focus on software development, algorithms, data structures, and computer systems. Ideal internships include positions in software engineering, data science, artificial intelligence, and cybersecurity.'
        },
        'Business Informatics': {
            video: 'videos/bi-internships.mp4',
            description: 'Business Informatics internships should combine business processes with information technology. Look for positions in business analysis, ERP systems, database management, and business intelligence.'
        },
        'Media Engineering': {
            video: 'videos/me-internships.mp4',
            description: 'Media Engineering internships should focus on digital media, computer graphics, and multimedia systems. Consider positions in digital media production, computer graphics, animation, and multimedia development.'
        }
    };
    
    // Set video source and description
    if (majorContent[userMajor]) {
        videoElement.src = majorContent[userMajor].video;
        descriptionElement.textContent = majorContent[userMajor].description;
    } else {
        videoElement.src = 'videos/general-internships.mp4';
        descriptionElement.textContent = 'Please select your major in your profile to see specific internship requirements.';
    }
}

// Add this function to save the major when it's selected
function saveMajor(major) {
    localStorage.setItem('userMajor', major);
    loadMajorVideo(); // Reload the video when major changes
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Get the major from localStorage or default to Computer Science
    const userMajor = localStorage.getItem('userMajor') || 'Computer Science';
    
    // Set the major in the select element if it exists
    const majorSelect = document.getElementById('majorSelect');
    if (majorSelect) {
        majorSelect.value = userMajor;
    }
    
    loadMajorVideo();
});


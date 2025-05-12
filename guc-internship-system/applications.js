// Dummy data for internships (should match your other files)
const internships = [
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

// Dummy applications data (simulate applications stored in localStorage)
function getApplications() {
    // In a real app, you'd fetch this from a backend or localStorage
    // For now, we'll use a dummy array
    let apps = JSON.parse(localStorage.getItem('applications')) || [];
    return apps;
}

// Render applications
function renderApplications() {
    const applications = getApplications();
    const list = document.getElementById('applicationsList');
    list.innerHTML = '';

    if (applications.length === 0) {
        list.innerHTML = "<p>You have not applied to any internships yet.</p>";
        return;
    }

    applications.forEach(app => {
        const internship = internships.find(i => i.id === app.internshipId);
        if (!internship) return;
        const card = document.createElement('div');
        card.className = 'internship-card';
        card.innerHTML = `
            <h3>${internship.title}</h3>
            <p><strong>Company:</strong> ${internship.company}</p>
            <p><strong>Status:</strong> <span class="app-status ${app.status}">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span></p>
            ${app.cv ? `<p>CV: ${app.cv}</p>` : ""}
            ${app.coverLetter ? `<p>Cover Letter: ${app.coverLetter}</p>` : ""}
            ${app.certificate ? `<p>Certificate: ${app.certificate}</p>` : ""}
            <button onclick="window.location.href='internship-details.html?id=${internship.id}'">View Details</button>
        `;
        list.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', renderApplications);

function getUserApplication(internshipId, userEmail) {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    return applications.find(app => app.internshipId === internshipId && app.user === userEmail);
}

// applications.js
const applications = [
    {
        internshipId: 1,
        user: "student@guc.edu.eg",
        status: "pending"
    },
    {
        internshipId: 2,
        user: "student@guc.edu.eg",
        status: "accepted"
    },
    {
        internshipId: 3,
        user: "student@guc.edu.eg",
        status: "rejected"
    },
    {
        internshipId: 4,
        user: "student@guc.edu.eg",
        status: "finalized"
    }
    // ...more as needed
];

// Save to localStorage for demo/testing
localStorage.setItem('applications', JSON.stringify(applications));
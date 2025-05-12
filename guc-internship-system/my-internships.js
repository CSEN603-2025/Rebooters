// Dummy internships data (should match your main internships.js)
const internships = [
    {
        id: 1,
        title: "Frontend Developer Intern",
        company: "Tech Solutions",
        duration: 3,
        paid: true,
        expectedSalary: "$500/month",
        skills: ["HTML", "CSS", "JavaScript"],
        description: "Work on real web projects using HTML, CSS, and JS.",
        date: "2025-07-01"
    },
    {
        id: 2,
        title: "Data Analyst Intern",
        company: "Data Insights",
        duration: 2,
        paid: false,
        expectedSalary: "N/A",
        skills: ["Data Analysis", "Excel"],
        description: "Assist in analyzing and visualizing data for clients.",
        date: "2025-01-15"
    },
    {
        id: 3,
        title: "Marketing Intern",
        company: "MarketMakers",
        duration: 1,
        paid: true,
        expectedSalary: "$300/month",
        skills: ["Marketing", "Communication"],
        description: "Support the marketing team in campaign management.",
        date: "2025-12-10"
    },
    {
        id: 4,
        title: "Backend Developer Intern",
        company: "Tech Solutions",
        duration: 3,
        paid: true,
        expectedSalary: "$600/month",
        skills: ["Node.js", "Databases"],
        description: "Work on backend APIs and databases.",
        date: "2025-06-01"
    }
    // Add more as needed
];

// Get applications for the current user
function getMyApplications() {
    const user = localStorage.getItem('userEmail') || 'student@guc.edu.eg';
    let apps = JSON.parse(localStorage.getItem('applications')) || [];
    
    // Filter for accepted and finalized internships
    apps = apps.filter(app => app.status === "accepted" || app.status === "finalized");
    
    // Update status based on dates
    const currentDate = new Date();
    apps.forEach(app => {
        const internship = internships.find(i => i.id === app.internshipId);
        if (!internship) return;
        
        // If no date is set, use the internship's default date
        if (!app.date) {
            app.date = internship.date;
        }
        
        const startDate = new Date(app.date);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + internship.duration);
        
        // If the internship hasn't started yet
        if (currentDate < startDate) {
            app.status = "pending";
        }
        // If the internship is currently ongoing
        else if (startDate <= currentDate && currentDate <= endDate) {
            app.status = "current";
        }
        // If the internship has ended
        else if (currentDate > endDate) {
            app.status = "complete";
        }
        
        // Save updated status
    //    localStorage.setItem('applications', JSON.stringify(apps));
    });
    
    return apps;
}

function renderMyInternships() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const applications = getMyApplications();
    const list = document.getElementById('internshipList');
    list.innerHTML = '';

    // If no applications exist yet
    if (!applications || applications.length === 0) {
        list.innerHTML = "<p>You haven't applied to any internships yet.</p>";
        return;
    }

    let filtered = applications.filter(app => {
        const internship = internships.find(i => i.id === app.internshipId);
        if (!internship) return false;
        
        // Search in title, company, and description
        const matchesSearch = 
            internship.title.toLowerCase().includes(search) || 
            internship.company.toLowerCase().includes(search) ||
            (internship.description && internship.description.toLowerCase().includes(search));
        const matchesStatus = !status || app.status === status;
        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        list.innerHTML = `<p>No internships found matching "${search}".</p>`;
        return;
    }

    filtered.forEach(app => {
        const internship = internships.find(i => i.id === app.internshipId);
        if (!internship) return;
        
        const startDate = new Date(app.date);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + internship.duration);
        
        // Get status display text
        let statusText = "Unknown";
        switch(app.status) {
            case "pending":
                statusText = "Not Started";
                break;
            case "current":
                statusText = "Current Intern";
                break;
            case "complete":
                statusText = "Internship Complete";
                break;
        }
        
        list.innerHTML += `
            <div class="internship-card">
                <h3>${internship.title}</h3>
                <p><strong>Company:</strong> ${internship.company}</p>
                <p><strong>Duration:</strong> ${internship.duration} month(s)</p>
                <p><strong>Start Date:</strong> ${startDate.toLocaleDateString()}</p>
                <p><strong>End Date:</strong> ${endDate.toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${statusText}</p>
                <button onclick="window.location.href='internship-details.html?id=${internship.id}'">View Details</button>
                ${app.status === "complete" ? `<button onclick="window.location.href='evaluation.html?id=${internship.id}'">Evaluate Company</button>` : ''}
            </div>
        `;
    });
}

// Attach event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchInput').addEventListener('input', renderMyInternships);
    document.getElementById('statusFilter').addEventListener('change', renderMyInternships);
    renderMyInternships();
});
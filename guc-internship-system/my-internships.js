// My internships data - separate from general internships
const myInternshipsData = [
    {
        id: 1,
        title: "Frontend Developer Intern",
        company: "Tech Solutions",
        duration: 3,
        paid: true,
        expectedSalary: "$500/month",
        skills: ["HTML", "CSS", "JavaScript"],
        description: "Work on real web projects using HTML, CSS, and JS.",
        date: "2025-10-01",
        status: "complete"  // complete, ongoing, pending
    },
    {
        id: 2,
        title: "Data Analyst Intern",
        company: "Data Insights",
        duration: 1,
        paid: false,
        expectedSalary: "N/A",
        skills: ["Data Analysis", "Excel"],
        description: "Assist in analyzing and visualizing data for clients.",
        date: "2025-09-01",
        status: "complete"
    },
    {
        id: 3,
        title: "Marketing Intern",
        company: "MarketMakers",
        duration: 3,
        paid: true,
        expectedSalary: "$300/month",
        skills: ["Marketing", "Communication"],
        description: "Support the marketing team in campaign management.",
        date: "2025-05-01",
        status: "ongoing"
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
        date: "2025-06-01",
        status: "pending"
    }
];

// Initialize my internships in localStorage if not exists
if (!localStorage.getItem('myInternships')) {
    localStorage.setItem('myInternships', JSON.stringify(myInternshipsData));
}

// Get applications for the current user
function getMyApplications() {
    const user = localStorage.getItem('userEmail') || 'student@guc.edu.eg';
    const myInternships = JSON.parse(localStorage.getItem('myInternships')) || [];
    
    // Update status based on dates
    const currentDate = new Date();
    myInternships.forEach(internship => {
        const startDate = new Date(internship.date);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + internship.duration);

        // Only update if not already complete
        if (internship.status !== "complete") {
            if (currentDate < startDate) {
                internship.status = "pending";
            } else if (currentDate > endDate) {
                internship.status = "complete";
            } else {
                internship.status = "ongoing";
            }
        }
    });

    // Save updated statuses
    localStorage.setItem('myInternships', JSON.stringify(myInternships));
    return myInternships;
}

// Calculate total internship duration (only for completed internships)
function calculateTotalInternshipDuration() {
    const myInternships = JSON.parse(localStorage.getItem('myInternships')) || [];
    
    // Only count completed internships
    const completedInternships = myInternships.filter(internship => internship.status === "complete");
    
    console.log('Completed internships:', completedInternships);

    // Calculate total duration
    let totalDuration = 0;
    completedInternships.forEach(internship => {
        if (!isNaN(parseInt(internship.duration, 10))) {
            totalDuration += parseInt(internship.duration, 10);
            console.log(`Adding duration ${internship.duration} from completed internship ${internship.id}`);
        }
    });

    console.log('Total duration from completed internships:', totalDuration);
    return totalDuration;
}

// Check and update PRO badge status
function checkAndUpdateProBadge() {
    const totalDuration = calculateTotalInternshipDuration();
    const user = localStorage.getItem('userEmail') || 'student@guc.edu.eg';
    const profile = JSON.parse(localStorage.getItem('profile_' + user)) || {};

    console.log('Checking PRO badge eligibility:');
    console.log('Total completed internship duration:', totalDuration);
    console.log('Current PRO badge status:', profile.proBadge);

    // Award PRO badge if completed internships total 3 or more months
    if (totalDuration >= 3 && !profile.proBadge) {
        profile.proBadge = true;
        profile.proBadgeDate = new Date().toISOString();
        localStorage.setItem('profile_' + user, JSON.stringify(profile));
        console.log('PRO badge awarded!');
        return true;
    }

    return profile.proBadge || false;
}

// Render My Internships
function renderMyInternships() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const startDateFilter = document.getElementById('startDateFilter').value;
    const endDateFilter = document.getElementById('endDateFilter').value;
    
    const myInternships = getMyApplications();
    const list = document.getElementById('internshipList');
    list.innerHTML = '';

    // Check and update PRO badge status
    const proBadgeAwarded = checkAndUpdateProBadge();

    // If PRO badge was just awarded, show a notification
    if (proBadgeAwarded) {
        const notification = document.createElement('div');
        notification.className = 'pro-badge-notification';
        notification.innerHTML = `
            <div class="pro-badge-content">
                <h3>🎉 Congratulations! 🎉</h3>
                <p>You've earned your PRO badge by completing 3 months of internships!</p>
                <button onclick="window.location.href='profile.html'">View Profile</button>
            </div>
        `;
        list.parentElement.insertBefore(notification, list);
    }

    // If no internships exist yet
    if (!myInternships || myInternships.length === 0) {
        list.innerHTML = "<p>You haven't started any internships yet.</p>";
        return;
    }

    let filtered = myInternships.filter(internship => {
        const matchesSearch =
            internship.title.toLowerCase().includes(search) ||
            internship.company.toLowerCase().includes(search) ||
            (internship.description && internship.description.toLowerCase().includes(search));
        
        // Check if status matches
        const matchesStatus = !status || internship.status === status;

        // Check if dates match
        let matchesDates = true;
        const internshipStartDate = new Date(internship.date);
        const internshipEndDate = new Date(internshipStartDate);
        internshipEndDate.setMonth(internshipEndDate.getMonth() + internship.duration);

        if (startDateFilter) {
            const filterStartDate = new Date(startDateFilter);
            matchesDates = matchesDates && internshipStartDate >= filterStartDate;
        }
        
        if (endDateFilter) {
            const filterEndDate = new Date(endDateFilter);
            matchesDates = matchesDates && internshipEndDate <= filterEndDate;
        }

        return matchesSearch && matchesStatus && matchesDates;
    });

    // Sort internships by date and status
    filtered.sort((a, b) => {
        // Sort by status priority (ongoing first, then pending, then complete)
        const statusPriority = { 'ongoing': 0, 'pending': 1, 'complete': 2 };
        if (statusPriority[a.status] !== statusPriority[b.status]) {
            return statusPriority[a.status] - statusPriority[b.status];
        }
        
        // If same status, sort by date (most recent first)
        return new Date(b.date) - new Date(a.date);
    });

    if (filtered.length === 0) {
        list.innerHTML = `<p>No internships found matching your filters.</p>`;
        return;
    }

    filtered.forEach(internship => {
        const startDate = new Date(internship.date);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + internship.duration);

        const startDateString = startDate.toLocaleDateString();
        const endDateString = endDate.toLocaleDateString();

        // Get status display text
        let statusText = "Unknown";
        let statusClass = "";
        switch (internship.status) {
            case "pending":
                statusText = "Not Started";
                statusClass = "status-pending";
                break;
            case "ongoing":
                statusText = "Current Intern";
                statusClass = "status-ongoing";
                break;
            case "complete":
                statusText = "Internship Complete";
                statusClass = "status-complete";
                break;
        }

        list.innerHTML += `
            <div class="internship-card ${statusClass}">
                <h3>${internship.title}</h3>
                <p><strong>Company:</strong> ${internship.company}</p>
                <p><strong>Duration:</strong> ${internship.duration} month(s)</p>
                <p><strong>Start Date:</strong> ${startDateString}</p>
                <p><strong>End Date:</strong> ${endDateString}</p>
                <p><strong>Status:</strong> ${statusText}</p>
                <button onclick="window.location.href='internship-details.html?id=${internship.id}'">View Details</button>
                ${internship.status === "complete" ? `<button onclick="window.location.href='evaluation.html?id=${internship.id}'">Evaluate Company</button>` : ''}
            </div>
        `;
    });
}

// Function to clear date filters
function clearDateFilters() {
    document.getElementById('startDateFilter').value = '';
    document.getElementById('endDateFilter').value = '';
    renderMyInternships();
}

// Attach event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchInput').addEventListener('input', renderMyInternships);
    document.getElementById('statusFilter').addEventListener('change', renderMyInternships);
    document.getElementById('startDateFilter').addEventListener('change', renderMyInternships);
    document.getElementById('endDateFilter').addEventListener('change', renderMyInternships);
    document.getElementById('clearDateFilter').addEventListener('click', clearDateFilters);
    renderMyInternships();
});
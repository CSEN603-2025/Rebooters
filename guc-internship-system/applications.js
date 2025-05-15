

function updateApplicationStatuses() {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const internships = JSON.parse(localStorage.getItem('internships')) || [];
    const now = new Date();
    let updated = false;

    // Update applications
    applications.forEach(app => {
        const internship = internships.find(i => i.id === app.internshipId);
        if (!internship) return;

        const startDate = new Date(app.date || internship.date);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + parseInt(internship.duration, 10));

        // Only update if not already accepted or rejected
        if (app.status !== "accepted" && app.status !== "rejected") {
            if (now > endDate) {
                app.status = "finalized";
            } else {
                app.status = "pending";
            }
            updated = true;
        }
    });

    if (updated) {
        localStorage.setItem('applications', JSON.stringify(applications));
    }
}

// Add function to update application status
function updateApplicationStatus(internshipId, newStatus) {
    if (!["accepted", "rejected", "pending", "finalized"].includes(newStatus)) {
        console.error('Invalid status');
        return false;
    }

    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    
    // Update in applications only
    const application = applications.find(app => app.internshipId === internshipId);
    if (application) {
        application.status = newStatus;
        localStorage.setItem('applications', JSON.stringify(applications));
        return true;
    }
    
    return false;
}

// Helper function to get current user
function getCurrentUser() {
    return localStorage.getItem('userEmail') || 'student@guc.edu.eg';
}

function getApplications() {
    const user = getCurrentUser();
    // Get only actual applications from localStorage
    const apps = JSON.parse(localStorage.getItem('applications')) || [];
    // Return only applications for the current user
    return apps.filter(app => app.user === user);
}

// Render applications
function renderApplications() {
    const applications = getApplications();
    const internships = JSON.parse(localStorage.getItem('internships')) || [];
    const list = document.getElementById('applicationsList');
    list.innerHTML = '';

    if (applications.length === 0) {
        list.innerHTML = "<p>You have not applied to any internships yet.</p>";
        return;
    }

    applications.forEach(app => {
        const internship = internships.find(i => i.id === app.internshipId);
        if (!internship) return;
        
        // Get appropriate status class and icon
        let statusClass = app.status;
        let statusIcon = '';
        switch(app.status) {
            case 'accepted':
                statusIcon = '✅';
                break;
            case 'rejected':
                statusIcon = '❌';
                break;
            case 'pending':
                statusIcon = '⏳';
                break;
            case 'finalized':
                statusIcon = '🏁';
                break;
        }
        
        const card = document.createElement('div');
        card.className = 'internship-card';
        card.innerHTML = `
            <h3>${internship.title}</h3>
            <p><strong>Company:</strong> ${internship.company}</p>
            <p><strong>Duration:</strong> ${internship.duration} month(s)</p>
            <p><strong>${internship.paid ? "Paid" : "Unpaid"}</strong></p>
            <p><strong>Description:</strong> ${internship.description}</p>
            <p><strong>Status:</strong> <span class="app-status ${statusClass}">${statusIcon} ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span></p>
            <p><strong>Applied on:</strong> ${new Date(app.date).toLocaleDateString()}</p>
            ${app.cv ? `<p><strong>CV:</strong> ${app.cv}</p>` : ""}
            ${app.coverLetter ? `<p><strong>Cover Letter:</strong> ${app.coverLetter}</p>` : ""}
            ${app.certificate ? `<p><strong>Certificate:</strong> ${app.certificate}</p>` : ""}
            <button onclick="window.location.href='internship-details.html?id=${internship.id}'">View Details</button>
        `;
        list.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateApplicationStatuses();
    renderApplications();
});

function getUserApplication(internshipId, userEmail) {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const myInternships = JSON.parse(localStorage.getItem('myInternships')) || [];
    
    // Check both applications and my-internships
    const application = applications.find(app => app.internshipId === internshipId && app.user === userEmail);
    const myInternship = myInternships.find(intern => intern.id === internshipId);
    
    return application || myInternship;
}

// Function to handle new applications
function applyForInternship(internshipId) {
    const user = getCurrentUser();
    const internships = JSON.parse(localStorage.getItem('internships')) || [];
    const internship = internships.find(i => i.id === internshipId);
    
    if (!internship) {
        console.error('Internship not found');
        return false;
    }

    // Add to applications with pending status
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const newApplication = {
        internshipId: internshipId,
        user: user,
       status: "pending",
        date: new Date().toISOString()
    };
    applications.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(applications));

    return true;
}




    


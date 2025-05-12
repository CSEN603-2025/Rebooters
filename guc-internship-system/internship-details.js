// Dummy data (should match internships.js)
const internships = [
    {
        id: 1,
        title: "Frontend Developer Intern",
        company: "Tech Solutions",
        duration: 3,
        paid: true,
        expectedSalary: "$500/month",
        skills: ["HTML", "CSS", "JavaScript"],
        description: "Work on real web projects using HTML, CSS, and JS."
    },
    {
        id: 2,
        title: "Data Analyst Intern",
        company: "Data Insights",
        duration: 2,
        paid: false,
        expectedSalary: "N/A",
        skills: ["Data Analysis", "Excel"],
        description: "Assist in analyzing and visualizing data for clients."
    },
    {
        id: 3,
        title: "Marketing Intern",
        company: "MarketMakers",
        duration: 1,
        paid: true,
        expectedSalary: "$300/month",
        skills: ["Marketing", "Communication"],
        description: "Support the marketing team in campaign management."
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
    
    // Add more dummy internships as needed
];

// Get internship ID from URL
function getInternshipId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

function renderDetails() {
    const id = getInternshipId();
    const internship = internships.find(i => i.id === id);
    const detailsDiv = document.getElementById('details');

    if (!internship) {
        detailsDiv.innerHTML = "<p>Internship not found.</p>";
        return;
    }

    const user = localStorage.getItem('userEmail');
    const userApp = getUserApplication(internship.id, user);

    let statusHtml = '';
    if (userApp) {
        statusHtml = `<p><strong>Your Application Status:</strong> <span class="app-status ${userApp.status}">${userApp.status.charAt(0).toUpperCase() + userApp.status.slice(1)}</span></p>`;
    }

    const applied = hasApplied(internship.id, user);

    const applyButton = `<button id="applyNowBtn" ${applied ? 'disabled' : ''}>
        ${applied ? 'Already Applied' : 'Apply Now'}
    </button>`;

    detailsDiv.innerHTML = `
        <h2>${internship.title}</h2>
        <p><strong>Company:</strong> ${internship.company}</p>
        <p><strong>Duration:</strong> ${internship.duration} month(s)</p>
        <p><strong>${internship.paid ? "Paid" : "Unpaid"}</strong></p>
        <p><strong>Expected Salary:</strong> ${internship.expectedSalary || "N/A"}</p>
        <p><strong>Skills Required:</strong> ${internship.skills ? internship.skills.join(", ") : "N/A"}</p>
        <p><strong>Description:</strong> ${internship.description}</p>
        ${statusHtml}
        ${applyButton}
        <div id="applySection"></div>
        <div id="applyMessage"></div>
    `;

    if (!applied) {
        document.getElementById('applyNowBtn').onclick = function() {
            showUploadForm(id);
            document.getElementById('applyNowBtn').disabled = true;
        };
    }
}

function showUploadForm(id) {
    document.getElementById('applySection').innerHTML = `
        <form id="applyForm">
            <label>Upload CV: <input type="file" id="cvFile"></label><br>
            <label>Upload Cover Letter: <input type="file" id="coverLetterFile"></label><br>
            <label>Upload Certificate: <input type="file" id="certificateFile"></label><br>
            <button type="submit" id="applyBtn">Apply</button>
        </form>
    `;

    document.getElementById('applyForm').onsubmit = function(e) {
        e.preventDefault();
        let apps = JSON.parse(localStorage.getItem('applications')) || [];
        const user = localStorage.getItem('userEmail');
        // Prevent duplicate applications for the same user and internship
        if (!apps.some(app => app.internshipId === id && app.user === user)) {
            apps.push({
                internshipId: id,
                user: user, // Save the user!
                status: "pending",
                cv: document.getElementById('cvFile').files[0]?.name || "",
                coverLetter: document.getElementById('coverLetterFile').files[0]?.name || "",
                certificate: document.getElementById('certificateFile').files[0]?.name || ""
            });
            localStorage.setItem('applications', JSON.stringify(apps));
        }
        document.getElementById('applyMessage').textContent = "Application submitted!";
        document.getElementById('applyBtn').disabled = true;
    };
}

function hasApplied(internshipId, userEmail) {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    return applications.some(app => app.internshipId === internshipId && app.user === userEmail);
}

function applyForJob(internshipId) {
    const user = localStorage.getItem('userEmail');
    if (hasApplied(internshipId, user)) {
        alert("You have already applied for this internship.");
        return;
    }
    // ...proceed with application logic...
}

function getUserApplication(internshipId, userEmail) {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    return applications.find(app => app.internshipId === internshipId && app.user === userEmail);
}

document.addEventListener('DOMContentLoaded', renderDetails);
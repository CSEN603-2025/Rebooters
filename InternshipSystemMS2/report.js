let editingReportId = null; // Track if editing

// Test reports data
const testReports = [
    {
        id: 1,
        user: 'student@guc.edu.eg',
        title: "Frontend Development at Tech Corp",
        intro: "My experience as a frontend intern at Tech Corp was very educational.",
        body: "During my internship, I worked with React and learned modern web development practices.",
        major: "Computer Science",
        helpfulCourses: ["Web Development", "JavaScript Programming"],
        date: "2024-03-15T10:00:00.000Z",
        status: "pending",
        finalized: true
    },
    {
        id: 2,
        user: 'student@guc.edu.eg',
        title: "Data Analysis Internship Report",
        intro: "Successfully completed data analysis internship at Analytics Co.",
        body: "Applied statistical methods and machine learning techniques to real-world datasets.",
        major: "Data Science",
        helpfulCourses: ["Statistics", "Machine Learning"],
        date: "2024-03-10T09:00:00.000Z",
        status: "accepted",
        finalized: true
    },
    {
        id: 3,
        user: 'student@guc.edu.eg',
        title: "Marketing Internship Report",
        intro: "Marketing internship experience at Digital Marketing Agency",
        body: "The report needs more specific details about your contributions and metrics achieved.",
        major: "Business Administration",
        helpfulCourses: ["Digital Marketing", "Market Research"],
        date: "2024-03-05T11:00:00.000Z",
        status: "rejected",
        comments: "Please include specific campaign results and metrics. The report lacks quantitative data.",
        finalized: true
    },
    {
        id: 4,
        user: 'student@guc.edu.eg',
        title: "Software Engineering Internship",
        intro: "Backend development internship at Software Solutions Inc.",
        body: "Worked on developing RESTful APIs and database optimization.",
        major: "Computer Science",
        helpfulCourses: ["Database Systems", "Software Engineering"],
        date: "2024-03-01T14:00:00.000Z",
        status: "flagged",
        comments: "Please clarify the technologies used and add more details about the database optimization process.",
        finalized: true
    }
];

// Initialize reports in localStorage if not exists
if (!localStorage.getItem('reports')) {
    localStorage.setItem('reports', JSON.stringify(testReports));
}

function getCurrentUser() {
    return localStorage.getItem('userEmail') || 'student@guc.edu.eg';
}

function getReports() {
    return JSON.parse(localStorage.getItem('reports')) || [];
}

function saveReports(reports) {
    localStorage.setItem('reports', JSON.stringify(reports));
}

function renderReports() {
    const user = localStorage.getItem('userEmail');
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    const myReports = reports.filter(r => r.user === user);
    const container = document.getElementById('submittedReports');
    container.innerHTML = '';

    if (myReports.length === 0) {
        container.innerHTML = "<p>No reports submitted yet.</p>";
        document.getElementById('finalizedReportSection').style.display = "none";
        return;
    }

    // Show all reports, newest first
    myReports.sort((a, b) => new Date(b.date) - new Date(a.date));
    myReports.forEach(report => {
        container.innerHTML += getReportCardHTML(report);
    });

    // Hide the single finalized report section (if you want to keep it, you can adjust this)
    document.getElementById('finalizedReportSection').style.display = "none";
}

function getReportCardHTML(report) {
    const statusInfo = getReportStatusInfo(report.status || 'pending');
    const canAppeal = report.status === 'rejected' || report.status === 'flagged';
    
    return `
        <div class="finalized-report-card" data-report-id="${report.id}">
            <div class="report-status ${report.status || 'pending'}" style="border-left-color: ${statusInfo.color}">
                <h3>Status: ${statusInfo.message}</h3>
                ${(report.status === 'rejected' || report.status === 'flagged') ? `
                    <div class="report-comments">
                        <h4>Comments:</h4>
                        <p>${report.comments || 'No comments provided'}</p>
                    </div>
                ` : ''}
                ${canAppeal ? `
                    <div class="appeal-section" id="appeal-section-${report.id}">
                        ${!report.appeal ? `
                            <h4>Submit Appeal</h4>
                            <textarea id="appeal-text-${report.id}" 
                                placeholder="Explain why you would like to appeal this decision..."
                                rows="4"
                                style="width: 100%; margin-bottom: 10px;"></textarea>
                            <button class="appeal-btn" onclick="submitAppeal(${report.id})">
                                Submit Appeal
                            </button>
                        ` : `
                            <div class="appeal-status">
                                <h4>Appeal Status</h4>
                                <p>Appeal submitted on: ${new Date(report.appeal.date).toLocaleDateString()}</p>
                                <p>Message: ${report.appeal.message}</p>
                                <p>Status: ${report.appeal.status || 'Pending Review'}</p>
                            </div>
                        `}
                    </div>
                ` : ''}
            </div>
            <h4 style="color:#b80000; margin-bottom:8px;">${report.title}</h4>
            <p><strong>Major:</strong> ${report.major || 'Not specified'}</p>
            <p><strong>Introduction:</strong> ${report.intro}</p>
            <p><strong>Body:</strong> ${report.body}</p>
            <p><strong>Helpful Courses:</strong> ${report.helpfulCourses && report.helpfulCourses.length ? report.helpfulCourses.join(', ') : 'None selected'}</p>
            <small style="color:#888;">Submitted on: ${report.date}</small>
            <div class="finalized-btn-group">
                <button class="finalized-btn edit" onclick="editReport(${report.id})">Edit</button>
                <button class="finalized-btn delete" onclick="deleteReport(${report.id})">Delete</button>
            </div>
        </div>
    `;
}

function viewFinalizedReport(idx) {
    const reports = getReports();
    const user = getCurrentUser();
    const myReports = reports.filter(r => r.user === user);
    const report = myReports[idx];
    if (!report) return;
    document.getElementById('finalizedReportSection').style.display = "block";
    document.getElementById('finalizedReport').innerHTML = `
        <h4>${report.title}</h4>
        <p>${report.body}</p>
        ${report.fileName ? `<p><em>Uploaded File: ${report.fileName}</em></p>` : ""}
        <small>Submitted on: ${report.date}</small>
    `;
    // Store for download simulation
    localStorage.setItem('finalizedReport', JSON.stringify(report));
}

function downloadPDF() {
    // Simulate PDF download by creating a text file
    const report = JSON.parse(localStorage.getItem('finalizedReport'));
    if (!report) return;
    const content = `Title: ${report.title}\n\n${report.body}\n\nSubmitted on: ${report.date}`;
    const blob = new Blob([content], { type: "application/pdf" });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${report.title.replace(/\\s+/g, '_')}.pdf`;
    link.click();
}

function showFinalizedReport(report) {
    const section = document.getElementById('finalizedReportSection');
    section.style.display = "block";
    
    // Get status message and color
    const statusInfo = getReportStatusInfo(report.status || 'pending');
    
    document.getElementById('finalizedReport').innerHTML = `
        <div class="finalized-report-card">
            <div class="report-status ${report.status || 'pending'}" style="border-left-color: ${statusInfo.color}">
                <h3>Status: ${statusInfo.message}</h3>
                ${report.status === 'rejected' || report.status === 'flagged' ? 
                    `<div class="report-comments">
                        <h4>Comments:</h4>
                        <p>${report.comments || 'No comments provided'}</p>
                    </div>` : ''}
            </div>
            <h4 style="color:#b80000; margin-bottom:8px;">${report.title}</h4>
            <p><strong>Major:</strong> ${report.major || 'Not specified'}</p>
            <p><strong>Introduction:</strong> ${report.intro}</p>
            <p><strong>Body:</strong> ${report.body}</p>
            <p><strong>Helpful Courses:</strong> ${report.helpfulCourses && report.helpfulCourses.length ? report.helpfulCourses.join(', ') : 'None selected'}</p>
            <small style="color:#888;">Submitted on: ${report.date}</small>
            <div class="finalized-btn-group">
                <button class="finalized-btn edit" onclick="editReport(${report.id})">Edit</button>
                <button class="finalized-btn delete" onclick="deleteReport(${report.id})">Delete</button>
            </div>
        </div>
    `;
    
    // Store for download simulation
    localStorage.setItem('finalizedReport', JSON.stringify(report));
}

// Add this function to get status information
function getReportStatusInfo(status) {
    switch(status) {
        case 'accepted':
            return {
                message: '✅ Accepted',
                color: '#28a745'
            };
        case 'rejected':
            return {
                message: '❌ Rejected',
                color: '#dc3545'
            };
        case 'flagged':
            return {
                message: '⚠️ Flagged for Review',
                color: '#ffc107'
            };
        case 'pending':
        default:
            return {
                message: '⏳ Pending Review',
                color: '#6c757d'
            };
    }
}

document.getElementById('reportForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('reportTitle').value;
    const intro = document.getElementById('reportIntro').value;
    const body = document.getElementById('reportBody').value;
    const major = document.getElementById('majorSelect').value;
    const selectedCourses = Array.from(document.querySelectorAll('input[name="helpfulCourses"]:checked')).map(cb => cb.value);
    const user = localStorage.getItem('userEmail');
    let reports = JSON.parse(localStorage.getItem('reports')) || [];

    if (editingReportId) {
        // Update existing report
        const idx = reports.findIndex(r => r.id === editingReportId && r.user === user);
        if (idx !== -1) {
            reports[idx] = { 
                ...reports[idx], 
                title, 
                intro, 
                body, 
                major, 
                helpfulCourses: selectedCourses, 
                finalized: true,
                status: 'pending', // Reset status when edited
                date: new Date().toISOString()
            };
        }
        editingReportId = null;
        document.getElementById('reportMessage').textContent = "Report updated and pending review!";
    } else {
        // Create new report
        const newReport = {
            id: Date.now(),
            user,
            title,
            intro,
            body,
            major,
            helpfulCourses: selectedCourses,
            date: new Date().toISOString(),
            finalized: true,
            status: 'pending' // Initial status
        };
        reports.push(newReport);
        document.getElementById('reportMessage').textContent = "Report submitted and pending review!";
    }
    localStorage.setItem('reports', JSON.stringify(reports));
    renderReports();
    this.reset();
    renderCourseCheckboxes('');
});

window.editReport = function(id) {
    const user = localStorage.getItem('userEmail');
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    const report = reports.find(r => r.id === id && r.user === user);
    if (report) {
        document.getElementById('reportTitle').value = report.title;
        document.getElementById('reportIntro').value = report.intro;
        document.getElementById('reportBody').value = report.body;
        document.getElementById('majorSelect').value = report.major || '';
        renderCourseCheckboxes(report.major || '');
        // Check the checkboxes for helpfulCourses
        if (report.helpfulCourses) {
            report.helpfulCourses.forEach(course => {
                const cb = document.querySelector(`input[name="helpfulCourses"][value="${course}"]`);
                if (cb) cb.checked = true;
            });
        }
        editingReportId = id;
        document.getElementById('finalizedReportSection').style.display = "none";
        document.getElementById('reportMessage').textContent = "Editing report. Make changes and submit.";
    }
};

window.deleteReport = function(id) {
    if (!confirm("Are you sure you want to delete this report?")) return;
    const user = localStorage.getItem('userEmail');
    let reports = JSON.parse(localStorage.getItem('reports')) || [];
    reports = reports.filter(r => !(r.id === id && r.user === user));
    localStorage.setItem('reports', JSON.stringify(reports));
    renderReports();
    document.getElementById('reportMessage').textContent = "Report deleted.";
};

window.finalizeReport = function(id) {
    let reports = getReports();
    const idx = reports.findIndex(r => r.id === id && r.user === getCurrentUser());
    if (idx !== -1) {
        reports[idx].finalized = true;
        saveReports(reports);
        renderReports();
        // Show in finalized section
        showFinalizedReport(reports[idx]);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    renderReports();
    checkForStatusUpdates();
    
    // Set up periodic checks for status updates
    setInterval(checkForStatusUpdates, 5 * 60 * 1000); // Check every 5 minutes
});

// Example: Submit a new report
function submitReport(reportData) {
    const reports = JSON.parse(localStorage.getItem('internshipReports')) || [];
    const newReport = {
        id: Date.now(), // Generate unique ID
        ...reportData,
        status: 'pending',
        submittedAt: new Date().toISOString()
    };
    reports.push(newReport);
    localStorage.setItem('internshipReports', JSON.stringify(reports));
}

// Example: Update report status
function updateReportStatus(reportId, newStatus) {
    const reports = JSON.parse(localStorage.getItem('internshipReports')) || [];
    const reportIndex = reports.findIndex(r => r.id === reportId);
    
    if (reportIndex !== -1) {
        reports[reportIndex].status = newStatus;
        localStorage.setItem('internshipReports', JSON.stringify(reports));
        
        // Notify the student about the status change
        checkReportStatus(reportId);
    }
}

// Add this to your report.html page load
document.addEventListener('DOMContentLoaded', function() {
    const reportId = new URLSearchParams(window.location.search).get('id');
    if (reportId) {
        displayReportStatus(reportId);
    }
});

// Add this function to handle status updates
function updateReportStatus(reportId, newStatus, comments = '') {
    const reports = getReports();
    const idx = reports.findIndex(r => r.id === reportId);
    
    if (idx !== -1) {
        // Update the report status and add timestamp
        reports[idx].status = newStatus;
        reports[idx].lastStatusUpdate = new Date().toISOString();
        
        // Save comments for rejected or flagged reports
        if (newStatus === 'rejected' || newStatus === 'flagged') {
            reports[idx].comments = comments || 'No comments provided';
        }
        
        // Save the updated reports to localStorage
        saveReports(reports);
        
        // Send notification for status change
        const report = reports[idx];
        notifyReportStatusChange(reportId, newStatus, comments);
        
        // Refresh the display
        renderReports();
        return true;
    }
    return false;
}

// Add this function to get status message
function getStatusMessage(status) {
    switch(status) {
        case 'pending':
            return '⏳ Pending Review';
        case 'accepted':
            return '✅ Accepted';
        case 'rejected':
            return '❌ Rejected';
        case 'flagged':
            return '⚠️ Flagged for Review';
        default:
            return status;
    }
}

// Modify the showFinalizedReport function to better handle status display
function showFinalizedReport(report) {
    const section = document.getElementById('finalizedReportSection');
    section.style.display = "block";
    
    // Get status message and color
    const statusInfo = getReportStatusInfo(report.status || 'pending');
    
    document.getElementById('finalizedReport').innerHTML = `
        <div class="finalized-report-card">
            <div class="report-status ${report.status || 'pending'}" style="border-left-color: ${statusInfo.color}">
                <h3>Status: ${statusInfo.message}</h3>
                ${report.status === 'rejected' || report.status === 'flagged' ? 
                    `<div class="report-comments">
                        <h4>Comments:</h4>
                        <p>${report.comments || 'No comments provided'}</p>
                    </div>` : ''}
            </div>
            <h4 style="color:#b80000; margin-bottom:8px;">${report.title}</h4>
            <p><strong>Major:</strong> ${report.major || 'Not specified'}</p>
            <p><strong>Introduction:</strong> ${report.intro}</p>
            <p><strong>Body:</strong> ${report.body}</p>
            <p><strong>Helpful Courses:</strong> ${report.helpfulCourses && report.helpfulCourses.length ? report.helpfulCourses.join(', ') : 'None selected'}</p>
            <small style="color:#888;">Submitted on: ${report.date}</small>
            <div class="finalized-btn-group">
                <button class="finalized-btn edit" onclick="editReport(${report.id})">Edit</button>
                <button class="finalized-btn delete" onclick="deleteReport(${report.id})">Delete</button>
            </div>
        </div>
    `;
    
    // Store for download simulation
    localStorage.setItem('finalizedReport', JSON.stringify(report));
}

// Add this function to simulate status updates (for testing)
window.simulateStatusUpdate = function(reportId, newStatus) {
    if (updateReportStatus(reportId, newStatus)) {
        alert(`Report status updated to: ${newStatus}`);
    } else {
        alert('Failed to update report status');
    }
};

// Add this to dashboard.js
function checkReportStatusChanges() {
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    const user = localStorage.getItem('userEmail');
    const userReports = reports.filter(r => r.user === user);
    
    // Get the last time we checked for status changes
    const lastCheck = localStorage.getItem('lastReportStatusCheck') || '0';
    const lastCheckTime = parseInt(lastCheck);
    
    // Check for any status changes since last check
    userReports.forEach(report => {
        if (report.lastStatusUpdate && new Date(report.lastStatusUpdate).getTime() > lastCheckTime) {
            notifyReportStatusChange(report.id, report.status, report.comments);
        }
    });
    
    // Update last check time
    localStorage.setItem('lastReportStatusCheck', Date.now().toString());
}

function checkForStatusUpdates() {
    const reports = getReports();
    const user = getCurrentUser();
    const userReports = reports.filter(r => r.user === user);
    
    // Get the last time we checked for status changes
    const lastCheck = localStorage.getItem('lastReportStatusCheck') || '0';
    const lastCheckTime = parseInt(lastCheck);
    
    // Check for any status changes since last check
    userReports.forEach(report => {
        if (report.lastStatusUpdate && new Date(report.lastStatusUpdate).getTime() > lastCheckTime) {
            // Update the report status in the UI
            const reportElement = document.querySelector(`[data-report-id="${report.id}"]`);
            if (reportElement) {
                const statusInfo = getReportStatusInfo(report.status);
                reportElement.querySelector('.report-status').innerHTML = `
                    <h3>Status: ${statusInfo.message}</h3>
                    ${(report.status === 'rejected' || report.status === 'flagged') ? `
                        <div class="report-comments">
                            <h4>Comments:</h4>
                            <p>${report.comments || 'No comments provided'}</p>
                        </div>
                    ` : ''}
                `;
            }
        }
    });
    
    // Update last check time
    localStorage.setItem('lastReportStatusCheck', Date.now().toString());
}

// Add function to handle appeal submission
window.submitAppeal = function(reportId) {
    const appealText = document.getElementById(`appeal-text-${reportId}`).value.trim();
    
    if (!appealText) {
        alert('Please enter an appeal message.');
        return;
    }
    
    const reports = getReports();
    const reportIndex = reports.findIndex(r => r.id === reportId);
    
    if (reportIndex !== -1) {
        // Add appeal to the report
        reports[reportIndex].appeal = {
            date: new Date().toISOString(),
            message: appealText,
            status: 'pending'
        };
        
        // Save updated reports
        saveReports(reports);
        
        // Refresh the display
        renderReports();
        
        // Show confirmation
        document.getElementById('reportMessage').textContent = "Appeal submitted successfully!";
    }
};

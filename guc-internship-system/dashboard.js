// Dummy: Get user role from query string or localStorage (simulate login)
function getUserRole() {
    // For now, just prompt the user (later, pass from login)
    let role = localStorage.getItem('userRole');
    if (!role) {
        role = prompt("Enter your role (student, company, scad, faculty):");
        localStorage.setItem('userRole', role);
    }
    return role;
}

function renderDashboard(role) {
    const dashboardTitle = document.getElementById('dashboardTitle');
    const dashboardContent = document.getElementById('dashboardContent');
    let html = '';

    switch (role) {
        case 'student':
            dashboardTitle.textContent = "Student Dashboard";
            html = `
                <ul>
                    <li><button onclick="window.location.href='profile.html'">View Profile</button></li>
                    <li><button onclick="window.location.href='my-internships.html'">My Internships</button></li>
                    <li><button onclick="window.location.href='internships.html'">View Available Internships</button></li>
                    <li><button onclick="window.location.href='applications.html'">View Internships You Applied To</button></li>
                    <li><button onclick="window.location.href='report.html'">Submit Internship Report</button></li>
                    <li><button onclick="window.location.href='workshops.html'">Workshops</button></li>
                    <li><button onclick="window.location.href='video-call.html'">Appointments</button></li>
                    <li><button onclick="window.location.href='assessments.html'">Assessments</button></li>
                </ul>
            `;
            break;
        case 'company':
            dashboardTitle.textContent = "Company Dashboard";
            html = `
                <ul>
                    <li><a href="#">Post New Internship</a></li>
                    <li><a href="#">View Applicants</a></li>
                    <li><a href="#">Evaluate Interns</a></li>
                    <li><a href="#">Company Profile</a></li>
                </ul>
            `;
            break;
        case 'scad':
            dashboardTitle.textContent = "SCAD Office Dashboard";
            html = `
                <ul>
                    <li><a href="#">Approve Companies</a></li>
                    <li><a href="#">Manage Internships</a></li>
                    <li><a href="#">View Reports</a></li>
                    <li><a href="#">Statistics</a></li>
                </ul>
            `;
            break;
        case 'faculty':
            dashboardTitle.textContent = "Faculty Member Dashboard";
            html = `
                <ul>
                    <li><a href="#">View Assigned Students</a></li>
                    <li><a href="#">Review Reports</a></li>
                    <li><a href="#">Submit Evaluations</a></li>
                </ul>
            `;
            break;
        default:
            dashboardTitle.textContent = "Dashboard";
            html = `<p>Unknown role. Please <a href="index.html">login again</a>.</p>`;
    }

    dashboardContent.innerHTML = html;
}

function logout() {
    localStorage.removeItem('userRole');
    window.location.href = "index.html";
}

// On page load
const role = getUserRole();
renderDashboard(role);

// Add this at the top of your file, after the role declaration
let internships = [];
let hasShownNotifications = false;
let closedNotifications = new Set();

// Update the initialization code
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize notifications for students
    if (role === 'student') {
        initializeStudentNotifications();
    }
});

// Separate function for student notification initialization
function initializeStudentNotifications() {
    // Load previously closed notifications from localStorage
    const savedClosedNotifications = localStorage.getItem('closedNotifications');
    if (savedClosedNotifications) {
        try {
            const data = JSON.parse(savedClosedNotifications);
            closedNotifications = new Set(Array.isArray(data) ? data : data.keys);
        } catch (e) {
            console.error('Error loading closed notifications:', e);
            closedNotifications = new Set();
        }
    }
    
    requestNotificationPermission();
    
    // Only initialize internships if they haven't been initialized before
    if (!localStorage.getItem('internshipsInitialized')) {
        internships = initializeInternships();
        localStorage.setItem('internshipsInitialized', 'true');
    } else {
        internships = JSON.parse(localStorage.getItem('internships')) || [];
    }
    
    // Check if notifications have been shown before
    hasShownNotifications = localStorage.getItem('hasShownNotifications') === 'true';
    
    // Only check for upcoming internships if notifications haven't been shown
    if (!hasShownNotifications) {
        checkUpcomingInternships();
    }
}

// Update the initializeInternships function with more dummy data
function initializeInternships() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const newInternships = [
        {
            id: 1,
            title: "Frontend Developer Intern",
            company: "Tech Solutions",
            date: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day from now
            status: "pending"
        },
        {
            id: 2,
            title: "Data Analyst Intern",
            company: "Data Insights",
            date: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
            status: "accepted"
        },
        {
            id: 3,
            title: "Backend Developer Intern",
            company: "Code Masters",
            date: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
            status: "finalized"
        },
        {
            id: 4,
            title: "UI/UX Design Intern",
            company: "Creative Solutions",
            date: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
            status: "rejected"
        }
    ];

    console.log("Initialized internship dates:", newInternships);
    
    // Save to localStorage
    localStorage.setItem('internships', JSON.stringify(newInternships));
    return newInternships;
}

// Add notification types enum
const NotificationType = {
    REPORT_STATUS: 'report_status',
    REPORT_COMMENTS: 'report_comments',
    PRO_BADGE: 'pro_badge',
    APPOINTMENT: 'appointment',
    CALL: 'call',
    WORKSHOP: 'workshop',
    ASSESSMENT: 'assessment',
    PROFILE_VIEW: 'profile_view',
    REPORT_STATUS_CHANGE: 'report_status_change'
};

// Update the sendNotification function
function sendNotification(message, type = 'default', data = {}) {
    // Only send notifications for students
    if (role !== 'student') {
        console.log('Notifications are only available for students');
        return;
    }
    
    console.log(`Attempting to send ${type} notification:`, message);
    
    // Create a unique key for this notification
    const notificationKey = `${type}-${data.internshipId || data.reportId || ''}-${message}`;
    
    // Check if this notification was previously closed
    if (closedNotifications.has(notificationKey)) {
        console.log("Notification was previously closed, not showing again");
        return;
    }
    
    if (Notification.permission === "granted") {
        try {
            const notification = new Notification("GUC Internship System", {
                body: message,
                tag: notificationKey, // Use the same key for the notification tag
                requireInteraction: true,
                silent: false,
                vibrate: [200, 100, 200],
                data: data
            });

            notification.onclick = function() {
                handleNotificationClick(type, data);
                window.focus();
                this.close();
            };

            showFallbackMessage(message, type, notificationKey);
            console.log(`${type} notification sent successfully`);
        } catch (error) {
            console.error(`Error sending ${type} notification:`, error);
            showFallbackMessage(message, type, notificationKey);
        }
    } else {
        console.log("Notification permission not granted");
        showFallbackMessage(message, type, notificationKey);
    }
}

// Add notification handlers
function handleNotificationClick(type, data) {
    switch(type) {
        case NotificationType.REPORT_STATUS:
            window.location.href = 'report.html';
            break;
        case NotificationType.REPORT_COMMENTS:
            window.location.href = `report.html?id=${data.reportId}`;
            break;
        case NotificationType.PRO_BADGE:
            window.location.href = 'profile.html';
            break;
        case NotificationType.APPOINTMENT:
            window.location.href = 'appointments.html';
            break;
        case NotificationType.CALL:
            // Handle incoming call
            if (data.isIncoming) {
                showCallDialog(data);
            }
            break;
        case NotificationType.WORKSHOP:
            window.location.href = `workshop.html?id=${data.workshopId}`;
            break;
        case NotificationType.ASSESSMENT:
            window.location.href = 'assessments.html';
            break;
        case NotificationType.PROFILE_VIEW:
            window.location.href = 'profile-views.html';
            break;
        case NotificationType.REPORT_STATUS_CHANGE:
            window.location.href = `report.html?id=${data.reportId}`;
            break;
        default:
            console.log('Unknown notification type:', type);
    }
}

// Example functions for different notification types
function notifyReportStatus(reportId, status) {
    const message = `Your internship report has been ${status}`;
    sendNotification(message, NotificationType.REPORT_STATUS, { reportId });
}

function notifyReportComments(reportId) {
    const message = "New comments on your internship report";
    sendNotification(message, NotificationType.REPORT_COMMENTS, { reportId });
}

function notifyProBadge() {
    const message = "Congratulations! You've earned your PRO badge";
    sendNotification(message, NotificationType.PRO_BADGE);
}

function notifyAppointment(appointmentId, status) {
    const message = `Your appointment has been ${status}`;
    sendNotification(message, NotificationType.APPOINTMENT, { appointmentId });
}

function notifyIncomingCall(callId, callerName) {
    const message = `Incoming call from ${callerName}`;
    sendNotification(message, NotificationType.CALL, { 
        callId, 
        isIncoming: true,
        callerName 
    });
}

function notifyWorkshop(workshopId, workshopName, timeUntil) {
    const message = `Upcoming workshop: ${workshopName} in ${timeUntil}`;
    sendNotification(message, NotificationType.WORKSHOP, { workshopId });
}

function notifyAssessment(assessmentId, assessmentName) {
    const message = `New assessment available: ${assessmentName}`;
    sendNotification(message, NotificationType.ASSESSMENT, { assessmentId });
}

function notifyProfileView(companyName) {
    const message = `${companyName} viewed your profile`;
    sendNotification(message, NotificationType.PROFILE_VIEW);
}

// Update the showFallbackMessage function
function showFallbackMessage(message, type, notificationKey) {
    // Only show fallback messages for students
    if (role !== 'student') {
        console.log('Notifications are only available for students');
        return;
    }
    
    // Check if this notification was previously closed
    if (closedNotifications.has(notificationKey)) {
        console.log("Notification was previously closed, not showing again");
        return;
    }

    const notificationElement = document.createElement('div');
    notificationElement.className = `notification-message notification-${type}`;
    notificationElement.innerHTML = `
        <div class="notification-content">
            <h3>GUC Internship System</h3>
            <p>${message}</p>
            <div class="notification-actions">
                <button onclick="handleNotificationClick('${type}', ${JSON.stringify({})})">View</button>
                <button onclick="closeNotification(this, '${notificationKey}')">Close</button>
            </div>
        </div>
    `;

    // Add styles to the notification
    notificationElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.5s ease-out;
        border-left: 4px solid #007bff;
        min-width: 300px;
    `;

    // Add the notification to the page
    document.body.appendChild(notificationElement);
}

// Update the closeNotification function to permanently store closed notifications
function closeNotification(button, notificationKey) {
    const notificationElement = button.closest('.notification-message');
    notificationElement.style.animation = 'slideOut 0.5s ease-out';
    
    // Add the notification key to the closed set
    closedNotifications.add(notificationKey);
    
    // Save closed notifications to localStorage with a timestamp
    const closedNotificationsData = {
        keys: [...closedNotifications],
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('closedNotifications', JSON.stringify(closedNotificationsData));
    
    setTimeout(() => notificationElement.remove(), 500);
}

function requestNotificationPermission() {
    // Only request permission for students
    if (role !== 'student') {
        console.log('Notifications are only available for students');
        return;
    }
    
    if (!("Notification" in window)) {
        alert("This browser does not support notifications.");
        return;
    }

    if (Notification.permission === "granted") {
        console.log("Notification permission already granted!");
        // Send a test notification immediately to verify it works
        sendNotification("Welcome to GUC Internship System! You will now receive notifications about upcoming internships.");
        return;
    }

    if (Notification.permission === "denied") {
        alert("Notification permission denied. Please enable it in your browser settings.");
        // Show fallback message
        showFallbackMessage("Please enable notifications in your browser settings to receive internship updates.", 'default');
        return;
    }

    // Request permission
    Notification.requestPermission().then(function(permission) {
        if (permission === "granted") {
            console.log("Notification permission granted!");
            // Send a welcome notification
            sendNotification("Welcome to GUC Internship System! You will now receive notifications about upcoming internships.", 'default');
        } else {
            console.log("Notification permission denied");
            showFallbackMessage("Please enable notifications in your browser settings to receive internship updates.", 'default');
        }
    });
}

// Test notification function

// Update the checkUpcomingInternships function to respect closed notifications
function checkUpcomingInternships() {
    // If notifications have already been shown, don't show them again
    if (hasShownNotifications) {
        console.log("Notifications already shown");
        return;
    }

    console.log("Checking for upcoming internships...");
    const storedInternships = JSON.parse(localStorage.getItem('internships')) || [];
    
    storedInternships.forEach(internship => {
        const statusMessage = getStatusMessage(internship.status);
        const message = `Internship: ${internship.title} at ${internship.company}\nStatus: ${statusMessage}`;
        const notificationKey = `internship-${internship.id}-${message}`;
        
        // Only show notification if it hasn't been shown before
        if (!closedNotifications.has(notificationKey)) {
            sendNotification(message, 'internship', { 
                status: internship.status,
                internshipId: internship.id 
            });
        }
    });

    // Mark notifications as shown
    hasShownNotifications = true;
    localStorage.setItem('hasShownNotifications', 'true');
}

// Add a function to get status message
function getStatusMessage(status) {
    switch(status) {
        case 'pending':
            return '⏳ Pending';
        case 'accepted':
            return '✅ Accepted';
        case 'finalized':
            return '✨ Finalized';
        case 'rejected':
            return '❌ Rejected';
        default:
            return status;
    }
}

// Add a function to clear notification history (for testing purposes)
function clearNotificationHistory() {
    closedNotifications.clear();
    localStorage.removeItem('closedNotifications');
    hasShownNotifications = false;
    localStorage.removeItem('hasShownNotifications');
    console.log('Notification history cleared');
}

// When a report status changes
notifyReportStatus(123, "approved");

// When receiving an incoming call
notifyIncomingCall(456, "SCAD Officer");

// When a workshop is approaching
notifyWorkshop(789, "Career Development", "2 hours");

// Add a function to reset all notifications (for testing)
function resetAllNotifications() {
    closedNotifications.clear();
    localStorage.removeItem('closedNotifications');
    hasShownNotifications = false;
    localStorage.removeItem('hasShownNotifications');
    checkUpcomingInternships();
}

// Add this function to handle report status notifications
function notifyReportStatusChange(reportId, status, comments = '') {
    let message = '';
    switch(status) {
        case 'accepted':
            message = 'Your internship report has been accepted!';
            break;
        case 'rejected':
            message = `Your internship report has been rejected. ${comments ? 'Comments: ' + comments : ''}`;
            break;
        case 'flagged':
            message = `Your internship report has been flagged for review. ${comments ? 'Comments: ' + comments : ''}`;
            break;
        case 'under_appeal':
            message = 'Your report appeal is under review.';
            break;
        default:
            message = `Your internship report status has been updated to: ${status}`;
    }

    sendNotification(message, NotificationType.REPORT_STATUS_CHANGE, {
        reportId: reportId,
        status: status,
        comments: comments
    });
}
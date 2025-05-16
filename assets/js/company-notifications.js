// Sample notifications data
const notificationsData = [
    {
        id: 1,
        type: "application",
        title: "New Application Received",
        message: "Ahmed Mohamed applied to your Frontend Developer Intern position",
        date: "2023-10-15 14:30",
        read: false,
        emailSent: true,
        internshipId: 1
    },
    {
        id: 2,
        type: "status",
        title: "Registration Approved",
        message: "Your company registration has been approved by SCAD office",
        date: "2023-10-14 09:15",
        read: true,
        emailSent: true
    },
    {
        id: 3,
        type: "application",
        title: "Application Status Changed",
        message: "Mariam Ali's application for Data Science Intern has been finalized",
        date: "2023-10-13 16:45",
        read: false,
        emailSent: true,
        internshipId: 2
    },
    {
        id: 4,
        type: "system",
        title: "System Maintenance",
        message: "Scheduled maintenance on Saturday, October 21 from 2:00 AM to 4:00 AM",
        date: "2023-10-12 11:20",
        read: true,
        emailSent: true
    }
];

// Initialize notifications
document.addEventListener('DOMContentLoaded', function() {
    renderNotifications();
    updateNotificationCount();
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderNotifications(this.dataset.filter);
        });
    });
    
    // Mark all as read
    document.getElementById('mark-all-read').addEventListener('click', function() {
        notificationsData.forEach(notif => notif.read = true);
        renderNotifications();
        updateNotificationCount();
    });
});

// Render notifications based on filter
function renderNotifications(filter = 'all') {
    const container = document.getElementById('notifications-list');
    container.innerHTML = '';
    
    const filtered = filter === 'all' 
        ? notificationsData 
        : notificationsData.filter(n => n.type === filter);
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-notifications">No notifications found</div>';
        return;
    }
    
    filtered.forEach(notif => {
        const notifElement = document.createElement('div');
        notifElement.className = `notification-item ${notif.read ? '' : 'unread'}`;
        notifElement.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${getNotificationIcon(notif.type)}"></i>
            </div>
            <div class="notification-content">
                <h3>${notif.title}</h3>
                <p>${notif.message}</p>
                <div class="notification-meta">
                    <span class="notification-date">${notif.date}</span>
                    ${notif.emailSent ? '<span class="email-sent"><i class="fas fa-envelope"></i> Email sent</span>' : ''}
                </div>
            </div>
            <div class="notification-actions">
                ${!notif.read ? '<button class="btn btn-sm mark-read" data-id="'+notif.id+'">Mark Read</button>' : ''}
                ${notif.internshipId ? '<a href="applications.html?post='+notif.internshipId+'" class="btn btn-sm btn-primary">View</a>' : ''}
            </div>
        `;
        container.appendChild(notifElement);
    });
    
    // Add event listeners to mark as read buttons
    document.querySelectorAll('.mark-read').forEach(btn => {
        btn.addEventListener('click', function() {
            const notifId = parseInt(this.dataset.id);
            const notif = notificationsData.find(n => n.id === notifId);
            if (notif) {
                notif.read = true;
                renderNotifications(filter);
                updateNotificationCount();
            }
        });
    });
}

// Update notification count in badge
function updateNotificationCount() {
    const unreadCount = notificationsData.filter(n => !n.read).length;
    document.getElementById('notification-count').textContent = unreadCount;
    
    // Also update the count in the dashboard if we're not on notifications page
    if (document.querySelector('title').textContent !== 'Notifications | SCAD System') {
        const badge = document.querySelector('.notification-badge');
        if (badge) badge.textContent = unreadCount;
    }
}

// Get appropriate icon for notification type
function getNotificationIcon(type) {
    switch(type) {
        case 'application': return 'fa-file-alt';
        case 'status': return 'fa-check-circle';
        case 'system': return 'fa-server';
        default: return 'fa-bell';
    }
}
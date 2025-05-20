// Sample notifications data
const notificationsData = [
    {
        id: 1,
        title: "Report Status",
        message: "Your internship report was accepted",
        date: "2024-10-15 14:30",
        read: false,
        emailSent: true,
        internshipId: 1
                
        
    },
    {
        id: 2,
        title: "Internship Cycle Update",
        message: "New internship cycle begins in 2 months",
        date: "2024-10-12 11:20",
        read: false,
        emailSent: false
                
    },
    {
        id: 3,
        title: "New Internship Opportunity",
                message: "Microsoft has posted a new internship for Software Engineers",
                type: "internship",
                date: "2025-05-15T10:30:00",
                read: true
        
        
    },
    {
        id: 4,
        title: "Application Update",
                message: "Your application to Google has been rejected",
                type: "application",
                date: "2025-05-14T15:45:00",
                read: true
        
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

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.loadNotifications();
    }
    
    loadNotifications() {
        // In real app, this would come from backend
        this.notifications = [
            {
                id: 1,
                title: "New Internship Opportunity",
                message: "Microsoft has posted a new internship for Software Engineers",
                type: "internship",
                date: "2025-05-15T10:30:00",
                read: true
            },
            {
                id: 2,
                title: "Application Update",
                message: "Your application to Google has been reviewed",
                type: "application",
                date: "2025-05-14T15:45:00",
                read: true
            },
            // Add more notifications...
        ];
    }
    
    getNotifications() {
        return this.notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            // In real app, would update on backend
        }
    }
    
    addNotification(title, message, type) {
        const newNotification = {
            id: Date.now(),
            title,
            message,
            type,
            date: new Date().toISOString(),
            read: false
        };
        this.notifications.unshift(newNotification);
        return newNotification;
    }
}

// Initialize notifications
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('notificationsList')) {
        const notificationSystem = new NotificationSystem();
        const notifications = notificationSystem.getNotifications();
        const notificationsList = document.getElementById('notificationsList');
        
        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `notification-item ${notification.read ? '' : 'unread'}`;
            notificationItem.innerHTML = `
                <div class="notification-icon">
                    <i class="fas ${getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <small>${new Date(notification.date).toLocaleString()}</small>
                </div>
            `;
            
            notificationItem.addEventListener('click', () => {
                notificationSystem.markAsRead(notification.id);
                notificationItem.classList.remove('unread');
                showNotificationDetails(notification);
            });
            
            notificationsList.appendChild(notificationItem);
        });
    }
});

function getNotificationIcon(type) {
    switch(type) {
        case 'internship': return 'fa-briefcase';
        case 'application': return 'fa-file-alt';
        case 'workshop': return 'fa-chalkboard-teacher';
        case 'appointment': return 'fa-calendar-check';
        default: return 'fa-bell';
    }
}

function showNotificationDetails(notification) {
    // Implement notification details view
    alert(`Notification: ${notification.title}\n\n${notification.message}`);
}

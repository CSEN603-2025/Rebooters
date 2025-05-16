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
                read: false
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
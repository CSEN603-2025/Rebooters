// Existing internship post functionality
document.getElementById('new-internship-btn').addEventListener('click', () => {
    document.getElementById('new-internship-modal').style.display = 'flex';
});

// Toggle salary field based on internship type
document.getElementById('internship-type').addEventListener('change', (e) => {
    document.getElementById('salary-group').style.display = 
        e.target.value === 'paid' ? 'block' : 'none';
});

// Handle form submission
document.getElementById('internship-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Internship post created successfully!');
    document.getElementById('new-internship-modal').style.display = 'none';
});

// Close all modals
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    });
});

// NEW: Company Registration Functionality
document.getElementById('register-company-btn').addEventListener('click', () => {
    document.getElementById('company-registration-modal').style.display = 'flex';
});

// Logo upload preview for registration
const regLogoInput = document.getElementById('reg-company-logo');
const regLogoPreview = document.getElementById('reg-logo-preview');
const regPreviewImage = document.getElementById('reg-preview-image');
const regRemoveLogoBtn = document.getElementById('reg-remove-logo');
const regLogoFileName = document.getElementById('logo-file-name');

regLogoInput.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        
        // Validate file
        if (!file.type.match('image.*')) {
            alert('Please select an image file (JPEG, PNG)');
            return;
        }
        
        if (file.size > 2 * 1024 * 1024) {
            alert('File size should not exceed 2MB');
            return;
        }
        
        // Update file name display
        regLogoFileName.textContent = file.name;
        
        // Show preview
        const reader = new FileReader();
        reader.onload = function(event) {
            regPreviewImage.src = event.target.result;
            regLogoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Remove logo
regRemoveLogoBtn.addEventListener('click', function() {
    regLogoInput.value = '';
    regPreviewImage.src = '#';
    regLogoPreview.style.display = 'none';
    regLogoFileName.textContent = 'Choose file (max 2MB)';
});

// Document upload display
const regDocsInput = document.getElementById('reg-verification-docs');
const regDocsFileName = document.getElementById('docs-file-name');

regDocsInput.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
        const files = e.target.files;
        if (files.length === 1) {
            regDocsFileName.textContent = files[0].name;
        } else {
            regDocsFileName.textContent = `${files.length} files selected`;
        }
    }
});

// Handle company registration form submission
document.getElementById('company-registration-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    const companyName = document.getElementById('reg-company-name').value.trim();
    const companyEmail = document.getElementById('reg-company-email').value.trim();
    const industry = document.getElementById('reg-company-industry').value;
    const size = document.getElementById('reg-company-size').value;
    const hasLogo = regLogoInput.files.length > 0;
    const hasDocs = regDocsInput.files.length > 0;
    
    if (!companyName || !companyEmail || !industry || !size || !hasDocs) {
        alert('Please fill in all required fields and upload verification documents');
        return;
    }
    
    // Simulate successful registration
    const statusAlert = document.getElementById('registration-status');
    const statusMessage = document.getElementById('status-message');
    
    statusMessage.textContent = `Registration submitted for ${companyName}. Awaiting SCAD office approval.`;
    statusAlert.style.display = 'flex';
    
    // Close modal
    document.getElementById('company-registration-modal').style.display = 'none';
    
    // Reset form
    this.reset();
    regPreviewImage.src = '#';
    regLogoPreview.style.display = 'none';
    regLogoFileName.textContent = 'Choose file (max 2MB)';
    regDocsFileName.textContent = 'Upload documents (PDF/Word/Image)';
});
// Sample data structure
let companyData = {
    posts: [
        {
            id: 1,
            title: "Frontend Developer Intern",
            duration: 3,
            type: "paid",
            salary: 800,
            skills: "HTML, CSS, JavaScript, React",
            description: "We are looking for a frontend developer intern...",
            applications: [
                {
                    id: 101,
                    student: "Ahmed Mohamed",
                    status: "pending",
                    date: "2023-10-15"
                }
            ],
            created: "2023-10-10",
            updated: "2023-10-10"
        }
    ],
    notifications: [
        {
            id: 1,
            type: "application",
            message: "Ahmed Mohamed applied to Frontend Developer position",
            date: "2023-10-15",
            read: false,
            emailSent: true
        },
        {
            id: 2,
            type: "status",
            message: "Your company registration has been approved",
            date: "2023-10-12",
            read: true,
            emailSent: true
        }
    ]
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    loadNotifications();
    
    // New post modal
    document.getElementById('new-internship-btn').addEventListener('click', () => {
        resetPostForm();
        document.getElementById('new-internship-modal').style.display = 'flex';
    });

    // Toggle salary field
    document.getElementById('internship-type').addEventListener('change', function() {
        document.getElementById('salary-group').style.display = 
            this.value === 'paid' ? 'block' : 'none';
    });

    // Post form submission
    document.getElementById('internship-form').addEventListener('submit', function(e) {
        e.preventDefault();
        savePost();
    });

    // Registration form submission
    document.getElementById('company-registration-form').addEventListener('submit', function(e) {
        e.preventDefault();
        registerCompany();
    });

    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
});

// Load all internship posts
function loadPosts() {
    const postsContainer = document.querySelector('.internship-posts');
    postsContainer.innerHTML = '';
    
    companyData.posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <div class="post-header">
                <h3>${post.title}</h3>
                <span class="badge">${post.applications.length} applications</span>
            </div>
            <div class="post-details">
                <p><strong>Duration:</strong> ${post.duration} months</p>
                <p><strong>Type:</strong> ${post.type === "paid" ? `Paid ($${post.salary}/month)` : "Unpaid"}</p>
                <p><strong>Skills:</strong> ${post.skills}</p>
            </div>
            <div class="post-actions">
                <button class="btn btn-sm btn-primary edit-post" data-id="${post.id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-post" data-id="${post.id}">Delete</button>
                <a href="applications.html?post=${post.id}" class="btn btn-sm btn-secondary">View Applications</a>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
    
    // Add event listeners to edit/delete buttons
    document.querySelectorAll('.edit-post').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = parseInt(this.dataset.id);
            editPost(postId);
        });
    });
    
    document.querySelectorAll('.delete-post').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = parseInt(this.dataset.id);
            deletePost(postId);
        });
    });
}

// Load notifications
function loadNotifications() {
    const unreadCount = companyData.notifications.filter(n => !n.read).length;
    document.querySelector('.notification-badge').textContent = unreadCount;
}

// Save new or updated post
function savePost() {
    const form = document.getElementById('internship-form');
    const postId = form.dataset.editId || companyData.posts.length + 1;
    
    const postData = {
        id: postId,
        title: document.getElementById('job-title').value,
        duration: parseInt(document.getElementById('duration').value),
        type: document.getElementById('internship-type').value,
        salary: document.getElementById('internship-type').value === 'paid' ? 
               parseInt(document.getElementById('salary').value) : 0,
        skills: document.getElementById('skills').value,
        description: document.getElementById('description').value,
        applications: [],
        created: form.dataset.editId ? 
                companyData.posts.find(p => p.id === parseInt(postId)).created : 
                new Date().toISOString().split('T')[0],
        updated: new Date().toISOString().split('T')[0]
    };
    
    if (form.dataset.editId) {
        // Update existing post
        const index = companyData.posts.findIndex(p => p.id === parseInt(postId));
        postData.applications = companyData.posts[index].applications;
        companyData.posts[index] = postData;
    } else {
        // Add new post
        companyData.posts.push(postData);
        
        // Simulate email notification
        sendEmailNotification(
            "New Internship Post Created",
            `Your internship post "${postData.title}" has been created successfully.`
        );
    }
    
    closeModals();
    loadPosts();
    alert('Internship post saved successfully!');
}

// Edit existing post
function editPost(id) {
    const post = companyData.posts.find(p => p.id === id);
    if (!post) return;
    
    document.getElementById('job-title').value = post.title;
    document.getElementById('duration').value = post.duration;
    document.getElementById('internship-type').value = post.type;
    
    if (post.type === 'paid') {
        document.getElementById('salary').value = post.salary;
        document.getElementById('salary-group').style.display = 'block';
    } else {
        document.getElementById('salary-group').style.display = 'none';
    }
    
    document.getElementById('skills').value = post.skills;
    document.getElementById('description').value = post.description;
    
    document.getElementById('internship-form').dataset.editId = id;
    document.getElementById('new-internship-modal').style.display = 'flex';
}

// Delete post
function deletePost(id) {
    if (confirm('Are you sure you want to delete this internship post?')) {
        companyData.posts = companyData.posts.filter(p => p.id !== id);
        loadPosts();
        alert('Internship post deleted successfully!');
    }
}

// Register company
function registerCompany() {
    const form = document.getElementById('company-registration-form');
    
    // Simulate registration process
    setTimeout(() => {
        // Simulate email notification
        sendEmailNotification(
            "Company Registration Submitted",
            "Your company registration has been received and is under review."
        );
        
        // Show status message
        document.getElementById('status-message').textContent = 
            "Registration submitted. Awaiting approval from SCAD office.";
        document.getElementById('registration-status').style.display = 'flex';
        
        closeModals();
    }, 1000);
}

// Simulate email notification
function sendEmailNotification(subject, body) {
    console.log(`Email sent:\nSubject: ${subject}\nBody: ${body}`);
    // In a real app, this would call your email service
}

// Close all modals
function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Reset post form
function resetPostForm() {
    const form = document.getElementById('internship-form');
    form.reset();
    delete form.dataset.editId;
    document.getElementById('salary-group').style.display = 'block';
}
// Test notification
setTimeout(() => {
    companyData.notifications.push({
        id: companyData.notifications.length + 1,
        type: "application",
        message: "Test Student applied to Frontend Developer position",
        date: new Date().toISOString().split('T')[0],
        read: false,
        emailSent: true
    });
    loadNotifications();
    
    // Show email simulation
    const emailNotif = document.getElementById('email-notification');
    document.getElementById('email-message').textContent = 
        "New application received for Frontend Developer position";
    emailNotif.style.display = 'block';
    setTimeout(() => {
        emailNotif.style.display = 'none';
    }, 5000);
}, 3000);

// Sample notification data
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
    // ... same as in notifications.js ...
];

// Function to add a new notification
function addNotification(type, title, message, internshipId = null) {
    const newNotif = {
        id: notificationsData.length + 1,
        type,
        title,
        message,
        date: new Date().toLocaleString(),
        read: false,
        emailSent: true,
        internshipId
    };
    
    notificationsData.unshift(newNotif);
    updateNotificationCount();
    
    // Simulate email
    sendEmailNotification(title, message);
}

// Update notification count
function updateNotificationCount() {
    const unreadCount = notificationsData.filter(n => !n.read).length;
    const badge = document.querySelector('.notification-badge');
    if (badge) badge.textContent = unreadCount;
}
// Test notification - would be called when someone applies
setTimeout(() => {
    addNotification(
        "application",
        "New Application Received",
        "Test Student applied to your Frontend Developer position",
        1
    );
}, 2000);
// Example usage when someone applies:
// addNotification(
//     "application", 
//     "New Application Received", 
//     "John Doe applied to your Backend Developer position",
//     3
// );
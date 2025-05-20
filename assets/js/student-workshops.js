document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const workshopsGrid = document.getElementById('workshopsGrid');
    const workshopSearch = document.getElementById('workshopSearch');
    const statusFilter = document.getElementById('statusFilter');
    const viewRegisteredBtn = document.getElementById('viewRegisteredBtn');
    const videoPlayerModal = document.getElementById('videoPlayerModal');
    const notificationToast = document.getElementById('notificationToast');
    
    // Workshop data
    let workshops = [
        {
            id: 1,
            title: "Web Development Fundamentals",
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
            duration: 120,
            speaker: "Dr. Ahmed Ali",
            description: "Learn HTML, CSS, and JavaScript basics.",
            status: "upcoming",
            registered: false,
            certificateAvailable: false,
            videoUrl: "https://example.com/video1"
        },
        {
            id: 2,
            title: "Career Preparation",
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
            duration: 90,
            speaker: "Ms. Fatma Hassan",
            description: "Resume writing and interview techniques.",
            status: "upcoming",
            registered: false,
            certificateAvailable: false,
            videoUrl: "https://example.com/video2"
        },
        {
            id: 3,
            title: "Data Science Intro",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            duration: 150,
            speaker: "Prof. Sarah Johnson",
            description: "Introduction to data science concepts.",
            status: "recorded",
            registered: true,
            certificateAvailable: true,
            videoUrl: "https://example.com/video3"
        }
    ];

    // Video player state
    let videoPlayerState = {
        isPlaying: false,
        currentTime: 0,
        duration: 3600, // 60 minutes in seconds
        interval: null
    };

    // Chat messages
    let chatMessages = [];
    let currentWorkshop = null;

    // Initialize the application
    function init() {
        renderWorkshops(workshops);
        setupEventListeners();
    }

    // Render workshops to the grid
    function renderWorkshops(workshopsToRender) {
        workshopsGrid.innerHTML = '';
        
        workshopsToRender.forEach(workshop => {
            const workshopCard = document.createElement('div');
            workshopCard.className = 'workshop-card';
            workshopCard.innerHTML = `
                <div class="workshop-card-header">
                    <h3>${workshop.title}</h3>
                    <span class="badge ${getStatusClass(workshop.status)}">${workshop.status}</span>
                </div>
                <div class="workshop-card-body">
                    <p><i class="fas fa-calendar-alt"></i> ${formatDate(workshop.date)}</p>
                    <p><i class="fas fa-user-tie"></i> ${workshop.speaker}</p>
                    <p>${workshop.description}</p>
                </div>
                <div class="workshop-card-footer">
                    <button class="btn btn-sm btn-outline view-btn" data-id="${workshop.id}">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    ${getActionButton(workshop)}
                </div>
            `;
            workshopsGrid.appendChild(workshopCard);
        });
        
        // Add event listeners to all buttons
        setupWorkshopButtons();
    }

    // Helper function to get status class
    function getStatusClass(status) {
        switch(status) {
            case 'upcoming': return 'info';
            case 'live': return 'warning';
            case 'completed': return 'success';
            default: return '';
        }
    }

    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Get the appropriate action button for a workshop
    function getActionButton(workshop) {
        if (workshop.status === 'upcoming') {
            if (workshop.registered) {
                return `<button class="btn btn-sm btn-success registered-btn" data-id="${workshop.id}" disabled>
                    <i class="fas fa-check"></i> Registered
                </button>`;
            } else {
                return `<button class="btn btn-sm btn-primary register-btn" data-id="${workshop.id}">
                    <i class="fas fa-calendar-plus"></i> Register
                </button>`;
            }
        } else if (workshop.status === 'live') {
            return `<button class="btn btn-sm btn-danger join-btn" data-id="${workshop.id}">
                <i class="fas fa-video"></i> Join
            </button>`;
        } else if (workshop.status === 'recorded') {
            return `<button class="btn btn-sm btn-secondary watch-btn" data-id="${workshop.id}">
                <i class="fas fa-play"></i> Watch
            </button>`;
        } else if (workshop.certificateAvailable) {
            return `<button class="btn btn-sm btn-info certificate-btn" data-id="${workshop.id}">
                <i class="fas fa-certificate"></i> Certificate
            </button>`;
        }
        return '';
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Search and filter
        workshopSearch.addEventListener('input', filterWorkshops);
        statusFilter.addEventListener('change', filterWorkshops);
        viewRegisteredBtn.addEventListener('click', viewRegisteredWorkshops);
        
        // Video player controls
        document.getElementById('playBtn').addEventListener('click', playVideo);
        document.getElementById('pauseBtn').addEventListener('click', pauseVideo);
        
        // Chat functionality
        document.getElementById('sendMessageBtn').addEventListener('click', sendChatMessage);
        document.getElementById('chatInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendChatMessage();
        });
        
        // Modal close button
        document.querySelector('.close-modal').addEventListener('click', function() {
            videoPlayerModal.style.display = 'none';
            clearVideoInterval();
        });
        
        // Notification close button
        document.querySelector('.notification-close').addEventListener('click', function() {
            notificationToast.style.display = 'none';
        });
    }

    // Setup workshop card buttons
    function setupWorkshopButtons() {
        // Register buttons
        document.querySelectorAll('.register-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const workshopId = parseInt(this.getAttribute('data-id'));
                registerForWorkshop(workshopId);
            });
        });
        
        // Watch buttons
        document.querySelectorAll('.watch-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const workshopId = parseInt(this.getAttribute('data-id'));
                watchWorkshop(workshopId);
            });
        });
        
        // Join buttons
        document.querySelectorAll('.join-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const workshopId = parseInt(this.getAttribute('data-id'));
                joinWorkshop(workshopId);
            });
        });
        
        // Certificate buttons
        document.querySelectorAll('.certificate-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const workshopId = parseInt(this.getAttribute('data-id'));
                showCertificate(workshopId);
            });
        });
    }

    // Filter workshops based on search and status
    function filterWorkshops() {
        const searchTerm = workshopSearch.value.toLowerCase();
        const status = statusFilter.value;
        
        const filtered = workshops.filter(workshop => {
            const matchesSearch = workshop.title.toLowerCase().includes(searchTerm) || 
                                 workshop.description.toLowerCase().includes(searchTerm);
            const matchesStatus = status === 'all' || workshop.status === status;
            return matchesSearch && matchesStatus;
        });
        
        renderWorkshops(filtered);
    }

    // Show only registered workshops
    function viewRegisteredWorkshops() {
        const registered = workshops.filter(w => w.registered);
        renderWorkshops(registered);
    }

    // Register for a workshop
    function registerForWorkshop(workshopId) {
        const workshop = workshops.find(w => w.id === workshopId);
        if (!workshop) return;
        
        workshop.registered = true;
        
        // Update the UI
        const workshopCard = document.querySelector(`.workshop-card [data-id="${workshopId}"]`);
        if (workshopCard) {
            const registerBtn = workshopCard.closest('.workshop-card').querySelector('.register-btn');
            if (registerBtn) {
                registerBtn.innerHTML = '<i class="fas fa-check"></i> Registered';
                registerBtn.disabled = true;
                registerBtn.classList.remove('btn-primary');
                registerBtn.classList.add('btn-success');
                registerBtn.classList.remove('register-btn');
                registerBtn.classList.add('registered-btn');
            }
        }
        
        showNotification(
            "Registration Successful", 
            `You've successfully registered for "${workshop.title}"`,
            "success"
        );
        
        // Schedule reminder notification (2 days before)
        const workshopDate = new Date(workshop.date);
        const now = new Date();
        const diffInDays = Math.floor((workshopDate - now) / (1000 * 60 * 60 * 24));
        
        if (diffInDays >= 2) {
            setTimeout(() => {
                showNotification(
                    "Upcoming Workshop", 
                    `Your "${workshop.title}" workshop is in 2 days`,
                    "info"
                );
            }, 1000); // In a real app, this would be (diffInDays - 2) * 24 * 60 * 60 * 1000
        }
    }

    // Watch a recorded workshop
    function watchWorkshop(workshopId) {
        const workshop = workshops.find(w => w.id === workshopId);
        if (!workshop) return;
        
        currentWorkshop = workshop;
        
        // Set up the video player modal
        document.getElementById('videoWorkshopTitle').textContent = workshop.title;
        
        // Reset video player state
        videoPlayerState = {
            isPlaying: false,
            currentTime: 0,
            duration: 3600,
            interval: null
        };
        
        // Reset chat
        chatMessages = [
            { sender: "Moderator", message: "Welcome to the workshop recording!", time: "10:00 AM" },
            { sender: workshop.speaker, message: "Let's get started with the first topic.", time: "10:05 AM" },
            { sender: "Student1", message: "This is very helpful!", time: "10:20 AM" }
        ];
        renderChatMessages();
        
        // Update time display
        document.getElementById('timeDisplay').textContent = 
            `00:00 / ${formatTime(videoPlayerState.duration)}`;
        
        // Show the modal
        videoPlayerModal.style.display = 'block';
    }

    // Join a live workshop
    function joinWorkshop(workshopId) {
        const workshop = workshops.find(w => w.id === workshopId);
        if (!workshop) return;
        
        currentWorkshop = workshop;
        
        // Set up the video player modal
        document.getElementById('videoWorkshopTitle').textContent = workshop.title + " (Live)";
        
        // Reset video player state
        videoPlayerState = {
            isPlaying: true, // Auto-play live workshops
            currentTime: 0,
            duration: 3600,
            interval: null
        };
        
        // Reset chat
        chatMessages = [];
        renderChatMessages();
        
        // Start simulating live chat
        simulateLiveChat();
        
        // Start the video player
        playVideo();
        
        // Show the modal
        videoPlayerModal.style.display = 'block';
    }

    // Show certificate
    function showCertificate(workshopId) {
        const workshop = workshops.find(w => w.id === workshopId);
        if (!workshop) return;
        
        showNotification(
            "Certificate Downloaded", 
            `Your certificate for "${workshop.title}" has been downloaded as PDF`,
            "success"
        );
    }

    // Video player controls
    function playVideo() {
        if (videoPlayerState.isPlaying) return;
        
        videoPlayerState.isPlaying = true;
        document.getElementById('playBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-block';
        
        // Simulate video playback
        videoPlayerState.interval = setInterval(() => {
            if (videoPlayerState.currentTime >= videoPlayerState.duration) {
                pauseVideo();
                return;
            }
            
            videoPlayerState.currentTime += 1;
            updateVideoTimeDisplay();
        }, 1000);
    }

    function pauseVideo() {
        if (!videoPlayerState.isPlaying) return;
        
        videoPlayerState.isPlaying = false;
        document.getElementById('playBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';
        
        clearInterval(videoPlayerState.interval);
    }

    function clearVideoInterval() {
        if (videoPlayerState.interval) {
            clearInterval(videoPlayerState.interval);
            videoPlayerState.interval = null;
        }
    }

    function updateVideoTimeDisplay() {
        document.getElementById('timeDisplay').textContent = 
            `${formatTime(videoPlayerState.currentTime)} / ${formatTime(videoPlayerState.duration)}`;
    }

    // Format time as MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Chat functionality
    function sendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (message) {
            const newMessage = {
                sender: "You",
                message: message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            chatMessages.push(newMessage);
            renderChatMessages();
            chatInput.value = '';
            
            // Scroll to bottom
            const chatContainer = document.getElementById('chatMessages');
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            // Simulate response after 2 seconds
            setTimeout(() => {
                const responses = [
                    "That's a great question!",
                    "Thanks for your input!",
                    "I'll address that point next.",
                    "Could you elaborate on that?",
                    "Let me add to what you said..."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                const responseMessage = {
                    sender: currentWorkshop ? currentWorkshop.speaker : "Moderator",
                    message: randomResponse,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                
                chatMessages.push(responseMessage);
                renderChatMessages();
                
                // Scroll to bottom
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 2000);
        }
    }

    function renderChatMessages() {
        const chatContainer = document.getElementById('chatMessages');
        chatContainer.innerHTML = '';
        
        chatMessages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message';
            
            if (msg.sender === "You") {
                messageDiv.classList.add('own-message');
                messageDiv.innerHTML = `
                    <div class="message-content">
                        <div class="message-text">${msg.message}</div>
                        <div class="message-time">${msg.time}</div>
                    </div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="message-sender">${msg.sender}</div>
                    <div class="message-content">
                        <div class="message-text">${msg.message}</div>
                        <div class="message-time">${msg.time}</div>
                    </div>
                `;
            }
            
            chatContainer.appendChild(messageDiv);
        });
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Simulate live chat messages
    function simulateLiveChat() {
        if (!currentWorkshop) return;
        
        const sampleMessages = [
            { sender: "Moderator", message: "Welcome to the live workshop!", delay: 1000 },
            { sender: currentWorkshop.speaker, message: "We'll be starting in a few minutes.", delay: 3000 },
            { sender: "Student1", message: "Excited to be here!", delay: 5000 },
            { sender: currentWorkshop.speaker, message: "Let's get started with the first topic.", delay: 8000 },
            { sender: "Moderator", message: "Please keep questions for the Q&A section later.", delay: 12000 }
        ];
        
        sampleMessages.forEach(msg => {
            setTimeout(() => {
                chatMessages.push({
                    sender: msg.sender,
                    message: msg.message,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
                
                renderChatMessages();
            }, msg.delay);
        });
    }

    // Show notification
    function showNotification(title, message, type = 'info') {
        document.getElementById('notificationTitle').textContent = title;
        document.getElementById('notificationMessage').textContent = message;
        
        // Set notification type
        notificationToast.className = 'notification-toast';
        if (type === 'error') notificationToast.classList.add('error');
        else if (type === 'warning') notificationToast.classList.add('warning');
        else if (type === 'success') notificationToast.classList.add('success');
        
        // Show notification
        notificationToast.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notificationToast.style.display = 'none';
        }, 5000);
    }

    // Initialize the application
    init();
});
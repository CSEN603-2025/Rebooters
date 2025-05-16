// Add this at the beginning of the file, before the WorkshopType definition
function checkAndValidateProBadge() {
    const user = localStorage.getItem('userEmail');
    if (!user) return false;

    // Clear any potentially incorrect profile data
    const profile = JSON.parse(localStorage.getItem('profile_' + user)) || {};
    
    // Get internships data to validate PRO badge
    const myInternships = JSON.parse(localStorage.getItem('myInternships')) || [];
    const completedInternships = myInternships.filter(internship => internship.status === "complete");
    
    // Calculate total duration of completed internships
    let totalDuration = 0;
    completedInternships.forEach(internship => {
        if (!isNaN(parseInt(internship.duration, 10))) {
            totalDuration += parseInt(internship.duration, 10);
        }
    });

    // Only set proBadge to true if they have completed 3 months of internships
    profile.proBadge = totalDuration >= 3;
    
    // Save the validated profile back to localStorage
    localStorage.setItem('profile_' + user, JSON.stringify(profile));
    
    return profile.proBadge;
}

// Workshop types and status management
const WorkshopType = {
    LIVE: 'live',
    PRE_RECORDED: 'pre-recorded'
};

const WorkshopStatus = {
    UPCOMING: 'upcoming',
    ONGOING: 'ongoing',
    COMPLETED: 'completed'
};

// Enhanced workshop data structure
class Workshop {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.category = data.category;
        this.type = data.type; // live or pre-recorded
        this.date = data.date;
        this.time = data.time;
        this.duration = data.duration;
        this.instructor = data.instructor;
        this.capacity = data.capacity;
        this.registered = data.registered || 0;
        this.videoUrl = data.videoUrl || null;
        this.materials = data.materials || [];
        this.chatEnabled = data.type === WorkshopType.LIVE;
        this.certificateTemplate = data.certificateTemplate || 'default';
    }

    get status() {
        const now = new Date();
        const workshopDate = new Date(this.date + ' ' + this.time);
        const endTime = new Date(workshopDate.getTime() + this.getDurationInMs());

        if (now < workshopDate) return WorkshopStatus.UPCOMING;
        if (now > endTime) return WorkshopStatus.COMPLETED;
        return WorkshopStatus.ONGOING;
    }

    getDurationInMs() {
        const [hours, minutes] = this.duration.split(' ')[0].split('.');
        return (parseInt(hours) * 60 + (parseInt(minutes) || 0)) * 60 * 1000;
    }
}

// Workshop Manager Class
class WorkshopManager {
    constructor() {
        // First check if user has valid PRO badge
        if (!checkAndValidateProBadge()) {
            console.log('User does not have PRO badge access');
            this.workshops = [];
            return;
        }

        this.workshops = [];
        this.chatMessages = {};
        this.currentLiveWorkshopId = null;
        this.loadWorkshops();
        this.initializeNotifications();
        this.setupTestRegistrations(); // Add test registrations
        this.setupSimulatedStudents(); // Add simulated students
    }

    loadWorkshops() {
        // Get current date for creating relative dates
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);

        // Create a date string for the current time
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const startTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

        this.workshops = [
            // Currently Ongoing Live Workshop
            new Workshop({
                id: 1,
                title: "Live Technical Interview Practice",
                description: "Join our live mock interview session with real-time feedback and peer interactions.",
                category: "technical",
                type: WorkshopType.LIVE,
                date: now.toISOString().split('T')[0], // Today
                time: startTime, // Current time
                duration: "2 hours",
                instructor: "John Doe",
                capacity: 30,
                registered: 15,
                videoUrl: "https://example.com/live-workshop",
                materials: ["Interview Questions", "Coding Problems"]
            }),

            // Currently Ongoing Pre-recorded Workshop
            new Workshop({
                id: 2,
                title: "Advanced JavaScript Concepts",
                description: "Master advanced JavaScript concepts with hands-on examples and exercises.",
                category: "technical",
                type: WorkshopType.PRE_RECORDED,
                date: now.toISOString().split('T')[0], // Today
                time: startTime, // Current time
                duration: "1.5 hours",
                instructor: "Jane Smith",
                capacity: 100,
                registered: 45,
                videoUrl: "https://example.com/js-workshop",
                materials: ["JavaScript Guide", "Code Examples"]
            }),

            // Upcoming Workshop
            new Workshop({
                id: 3,
                title: "Resume Building Workshop",
                description: "Create a standout tech resume with industry experts.",
                category: "career",
                type: WorkshopType.PRE_RECORDED,
                date: tomorrow.toISOString().split('T')[0],
                time: "15:00",
                duration: "1.5 hours",
                instructor: "Sarah Wilson",
                capacity: 20,
                videoUrl: "https://example.com/workshop2",
                materials: ["Resume Template", "Cover Letter Guide"]
            }),

            // Completed Workshops
            new Workshop({
                id: 4,
                title: "Software Architecture Fundamentals",
                description: "Learn the basics of software architecture and system design.",
                category: "technical",
                type: WorkshopType.PRE_RECORDED,
                date: yesterday.toISOString().split('T')[0],
                time: "09:00",
                duration: "4 hours",
                instructor: "Mike Johnson",
                capacity: 50,
                registered: 50,
                videoUrl: "https://example.com/workshop4",
                materials: ["Architecture Patterns Guide", "Case Studies"]
            })
        ];
    }

    setupTestRegistrations() {
        // Set up some test registrations for the current user
        const userEmail = localStorage.getItem('userEmail');
        const registrations = [
            {
                id: Date.now(),
                workshopId: 1, // Live Technical Interview Practice (ongoing)
                userEmail: userEmail,
                registeredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                completed: false,
                notified: true
            },
            {
                id: Date.now() + 1,
                workshopId: 2, // Advanced JavaScript Concepts (ongoing)
                userEmail: userEmail,
                registeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                completed: false,
                notified: true
            },
            {
                id: Date.now() + 2,
                workshopId: 4, // Software Architecture (completed)
                userEmail: userEmail,
                registeredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                completed: true,
                notified: true
            }
        ];

        localStorage.setItem('workshopRegistrations', JSON.stringify(registrations));

        // Add some test notes
        const notes = [
            {
                id: Date.now(),
                workshopId: 4,
                userEmail: userEmail,
                content: "Learned about microservices architecture patterns",
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: Date.now() + 1,
                workshopId: 5,
                userEmail: userEmail,
                content: "Key points about sprint planning and retrospectives",
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];

        localStorage.setItem('workshopNotes', JSON.stringify(notes));
    }

    initializeNotifications() {
        // Check for upcoming workshops every minute
        setInterval(() => this.checkUpcomingWorkshops(), 60000);
    }

    checkUpcomingWorkshops() {
        const registrations = this.getMyRegistrations();
        const now = new Date();

        registrations.forEach(reg => {
            const workshop = this.getWorkshopById(reg.workshopId);
            if (!workshop) return;

            const workshopTime = new Date(workshop.date + ' ' + workshop.time);
            const timeDiff = workshopTime - now;
            
            // Notify 15 minutes before workshop
            if (timeDiff > 0 && timeDiff <= 15 * 60 * 1000 && !reg.notified) {
                this.sendNotification(`Workshop "${workshop.title}" starts in 15 minutes!`);
                reg.notified = true;
                this.updateRegistration(reg);
            }
        });
    }

    getMyRegistrations() {
        const userEmail = localStorage.getItem('userEmail');
        return JSON.parse(localStorage.getItem('workshopRegistrations') || '[]')
            .filter(reg => reg.userEmail === userEmail);
    }

    getWorkshopById(id) {
        return this.workshops.find(w => w.id === id);
    }

    registerForWorkshop(workshopId, notes = '') {
        // Verify PRO badge status before registration
        if (!checkAndValidateProBadge()) {
            throw new Error('PRO badge required to register for workshops');
        }

        const workshop = this.getWorkshopById(workshopId);
        if (!workshop) {
            throw new Error('Workshop not found');
        }

        if (workshop.registered >= workshop.capacity) {
            throw new Error('Workshop is full');
        }

        // Check if already registered
        const existingRegistrations = this.getMyRegistrations();
        if (existingRegistrations.some(reg => reg.workshopId === workshopId)) {
            throw new Error('Already registered for this workshop');
        }

        const registration = {
            id: Date.now(),
            workshopId,
            userEmail: localStorage.getItem('userEmail'),
            notes,
            registeredAt: new Date().toISOString(),
            notified: false,
            completed: false
        };

        // Update registrations in localStorage
        let registrations = JSON.parse(localStorage.getItem('workshopRegistrations') || '[]');
        registrations.push(registration);
        localStorage.setItem('workshopRegistrations', JSON.stringify(registrations));

        // Update workshop registered count
        workshop.registered++;

        return registration;
    }

    // Workshop Playback Controls (for pre-recorded workshops)
    initializeVideoPlayer(videoElement, workshopId) {
        if (!checkAndValidateProBadge()) {''
            throw new Error('PRO badge required to access workshop content');
        }

        const workshop = this.getWorkshopById(workshopId);
        if (!workshop || !workshop.videoUrl) return;

        return {
            play: () => videoElement.play(),
            pause: () => videoElement.pause(),
            stop: () => {
                videoElement.pause();
                videoElement.currentTime = 0;
            },
            getCurrentTime: () => videoElement.currentTime,
            setCurrentTime: (time) => videoElement.currentTime = time
        };
    }

    // Note Taking System
    saveNote(workshopId, note) {
        const userEmail = localStorage.getItem('userEmail');
        const notes = JSON.parse(localStorage.getItem('workshopNotes') || '[]');
        
        notes.push({
            id: Date.now(),
            workshopId,
            userEmail,
            content: note,
            timestamp: new Date().toISOString()
        });

        localStorage.setItem('workshopNotes', JSON.stringify(notes));
    }

    getNotes(workshopId) {
        const userEmail = localStorage.getItem('userEmail');
        const notes = JSON.parse(localStorage.getItem('workshopNotes') || '[]');
        return notes.filter(note => note.workshopId === workshopId && note.userEmail === userEmail);
    }

    // Certificate Generation
    generateCertificate(workshopId) {
        const workshop = this.getWorkshopById(workshopId);
        const userEmail = localStorage.getItem('userEmail');
        
        if (!workshop) return null;

        return {
            certificateId: `CERT-${workshopId}-${Date.now()}`,
            recipientName: userEmail.split('@')[0], // Simple name extraction
            workshopTitle: workshop.title,
            completionDate: new Date().toLocaleDateString(),
            instructor: workshop.instructor
        };
    }

    // Workshop Rating and Feedback
    submitFeedback(workshopId, rating, feedback) {
        const userEmail = localStorage.getItem('userEmail');
        let feedbacks = JSON.parse(localStorage.getItem('workshopFeedbacks') || '[]');
        
        feedbacks.push({
            workshopId,
            userEmail,
            rating,
            feedback,
            submittedAt: new Date().toISOString()
        });

        localStorage.setItem('workshopFeedbacks', JSON.stringify(feedbacks));
    }

    // Live Chat System
    initializeChat(workshopId) {
        if (!checkAndValidateProBadge()) {
            throw new Error('PRO badge required to access workshop chat');
        }

        const workshop = this.getWorkshopById(workshopId);
        if (!workshop || !workshop.chatEnabled) return null;

        // Set current live workshop ID for simulated chat
        this.currentLiveWorkshopId = workshopId;

        return {
            messages: this.chatMessages[workshopId] || [],
            sendMessage: (message) => {
                const userEmail = localStorage.getItem('userEmail');
                const chatMessage = {
                    id: Date.now(),
                    workshopId,
                    userEmail,
                    content: message,
                    timestamp: new Date().toISOString()
                };
                
                // Add message to chat history
                if (!this.chatMessages[workshopId]) {
                    this.chatMessages[workshopId] = [];
                }
                this.chatMessages[workshopId].push(chatMessage);
                
                // Broadcast the message
                this.broadcastChatMessage(chatMessage);
            },
            subscribe: (callback) => {
                // First, send existing messages
                if (this.chatMessages[workshopId]) {
                    this.chatMessages[workshopId].forEach(msg => callback(msg));
                }

                // Then subscribe to new messages
                window.addEventListener('workshopChat', (e) => {
                    if (e.detail.workshopId === workshopId) {
                        callback(e.detail);
                    }
                });
            }
        };
    }

    broadcastChatMessage(message) {
        // Add message to chat history
        if (!this.chatMessages[message.workshopId]) {
            this.chatMessages[message.workshopId] = [];
        }
        this.chatMessages[message.workshopId].push(message);

        // Broadcast the message
        const event = new CustomEvent('workshopChat', { detail: message });
        window.dispatchEvent(event);

        // Only show notifications for messages from others
        if (message.userEmail !== localStorage.getItem('userEmail')) {
            const student = this.simulatedStudents.find(s => s.email === message.userEmail);
            const name = student ? student.name : message.userEmail;
            this.sendNotification(`New message from ${name} in "${this.getWorkshopById(message.workshopId).title}"`);
        }
    }

    sendNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    updateRegistration(registration) {
        let registrations = JSON.parse(localStorage.getItem('workshopRegistrations') || '[]');
        const index = registrations.findIndex(r => r.id === registration.id);
        if (index !== -1) {
            registrations[index] = registration;
            localStorage.setItem('workshopRegistrations', JSON.stringify(registrations));
        }
    }

    setupSimulatedStudents() {
        this.simulatedStudents = [
            { email: 'alice@example.com', name: 'Alice' },
            { email: 'bob@example.com', name: 'Bob' },
            { email: 'carol@example.com', name: 'Carol' },
            { email: 'david@example.com', name: 'David' }
        ];

        // Store simulated chat messages
        this.chatMessages = {
            1: [ // Messages for Live Technical Interview Workshop (ID: 1)
                {
                    id: Date.now() - 5000,
                    workshopId: 1,
                    userEmail: 'alice@example.com',
                    content: "Hi everyone! Excited for this interview practice session!",
                    timestamp: new Date(Date.now() - 5000).toISOString()
                },
                {
                    id: Date.now() - 4000,
                    workshopId: 1,
                    userEmail: 'bob@example.com',
                    content: "Same here! Anyone done technical interviews before?",
                    timestamp: new Date(Date.now() - 4000).toISOString()
                },
                {
                    id: Date.now() - 3000,
                    workshopId: 1,
                    userEmail: 'carol@example.com',
                    content: "I had one last month, happy to share my experience",
                    timestamp: new Date(Date.now() - 3000).toISOString()
                }
            ]
        };

        // Start simulated chat interaction
        this.startSimulatedChat();
    }

    startSimulatedChat() {
        // Simulate periodic messages from other students
        setInterval(() => {
            if (this.currentLiveWorkshopId) {
                const student = this.simulatedStudents[Math.floor(Math.random() * this.simulatedStudents.length)];
                const messages = [
                    "That's a great point!",
                    "Could you explain that in more detail?",
                    "Thanks for sharing your experience!",
                    "I have a question about that...",
                    "Interesting perspective!",
                    "Has anyone tried solving it differently?",
                    "The instructor's approach makes sense.",
                    "This is really helpful!"
                ];
                const message = messages[Math.floor(Math.random() * messages.length)];
                
                const chatMessage = {
                    id: Date.now(),
                    workshopId: this.currentLiveWorkshopId,
                    userEmail: student.email,
                    content: message,
                    timestamp: new Date().toISOString()
                };
                
                this.broadcastChatMessage(chatMessage);
            }
        }, 15000); // Send a message every 15 seconds
    }

    markWorkshopAsCompleted(workshopId) {
        const userEmail = localStorage.getItem('userEmail');
        let completedWorkshops = JSON.parse(localStorage.getItem('completedWorkshops_' + userEmail) || '[]');
        
        if (!completedWorkshops.includes(workshopId)) {
            completedWorkshops.push(workshopId);
            localStorage.setItem('completedWorkshops_' + userEmail, JSON.stringify(completedWorkshops));
            
            // Update registration status
            let registrations = JSON.parse(localStorage.getItem('workshopRegistrations_' + userEmail) || '[]');
            registrations = registrations.map(reg => {
                if (reg.workshopId === workshopId) {
                    return { ...reg, completed: true, completedAt: new Date().toISOString() };
                }
                return reg;
            });
            localStorage.setItem('workshopRegistrations_' + userEmail, JSON.stringify(registrations));
        }
    }
}
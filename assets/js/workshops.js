class WorkshopSystem {
    constructor() {
        this.workshops = [];
        this.registeredWorkshops = [];
        this.loadWorkshops();
    }
    
    loadWorkshops() {
        // In real app, this would come from backend
        this.workshops = [
            {
                id: 1,
                title: "Career Preparation Workshop",
                date: "2023-06-20",
                time: "10:00 - 12:00",
                speaker: "Dr. Mohamed Ali",
                description: "Learn how to prepare for your career after graduation",
                agenda: "1. Resume building\n2. Interview techniques\n3. Networking strategies",
                type: "live",
                registered: false
            },
            // Add more workshops...
        ];
        
        this.registeredWorkshops = [1]; // IDs of registered workshops
    }
    
    getUpcomingWorkshops() {
        return this.workshops.filter(w => new Date(w.date) > new Date());
    }
    
    getPastWorkshops() {
        return this.workshops.filter(w => new Date(w.date) < new Date());
    }
    
    getRegisteredWorkshops() {
        return this.workshops.filter(w => this.registeredWorkshops.includes(w.id));
    }
    
    registerForWorkshop(workshopId) {
        if (!this.registeredWorkshops.includes(workshopId)) {
            this.registeredWorkshops.push(workshopId);
            return true;
        }
        return false;
    }
}

// Initialize workshops
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('upcomingWorkshops')) {
        const workshopSystem = new WorkshopSystem();
        
        // Render tabs
        renderWorkshops('upcoming', workshopSystem.getUpcomingWorkshops());
        renderWorkshops('past', workshopSystem.getPastWorkshops());
        renderWorkshops('registered', workshopSystem.getRegisteredWorkshops());
        
        // Tab switching
        document.querySelectorAll('.workshops-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // Update active tab
                document.querySelectorAll('.workshops-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.workshops-tabs .tab-content').forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
});

function renderWorkshops(type, workshops) {
    const container = document.getElementById(`${type}Workshops`);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (workshops.length === 0) {
        container.innerHTML = '<p class="no-workshops">No workshops found</p>';
        return;
    }
    
    workshops.forEach(workshop => {
        const workshopCard = document.createElement('div');
        workshopCard.className = 'workshop-card';
        workshopCard.innerHTML = `
            <div class="workshop-header">
                <h3>${workshop.title}</h3>
                <span class="workshop-date">${new Date(workshop.date).toLocaleDateString()} • ${workshop.time}</span>
            </div>
            <div class="workshop-details">
                <p><strong>Speaker:</strong> ${workshop.speaker}</p>
                <p>${workshop.description.substring(0, 100)}...</p>
            </div>
            <div class="workshop-actions">
                <button class="btn btn-primary view-details" data-id="${workshop.id}">View Details</button>
                ${workshop.registered ? `
                    <button class="btn btn-success" disabled>Registered</button>
                ` : `
                    <button class="btn btn-secondary register-btn" data-id="${workshop.id}">Register</button>
                `}
            </div>
        `;
        
        container.appendChild(workshopCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const workshopId = parseInt(this.dataset.id);
            showWorkshopDetails(workshopId);
        });
    });
    
    document.querySelectorAll('.register-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const workshopId = parseInt(this.dataset.id);
            registerForWorkshop(workshopId);
        });
    });
}

function showWorkshopDetails(id) {
    const workshopSystem = new WorkshopSystem();
    const workshop = workshopSystem.workshops.find(w => w.id === id);
    
    if (workshop) {
        const modal = document.getElementById('workshopModal');
        
        modal.innerHTML = `
            <div class="modal-content large">
                <span class="close-modal">&times;</span>
                <div class="modal-header">
                    <h2>${workshop.title}</h2>
                    <p>${new Date(workshop.date).toLocaleDateString()} • ${workshop.time}</p>
                </div>
                <div class="modal-body">
                    <div class="workshop-details">
                        <div class="detail-item">
                            <h4>Speaker</h4>
                            <p>${workshop.speaker}</p>
                        </div>
                        <div class="detail-item">
                            <h4>Description</h4>
                            <p>${workshop.description}</p>
                        </div>
                        <div class="detail-item">
                            <h4>Agenda</h4>
                            <pre>${workshop.agenda}</pre>
                        </div>
                        ${workshop.type === 'live' ? `
                            <div class="detail-item">
                                <h4>How to Join</h4>
                                <p>The workshop will be conducted via Zoom. The meeting link will be sent to registered participants.</p>
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-actions">
                        ${workshopSystem.registeredWorkshops.includes(workshop.id) ? `
                            <button class="btn btn-success" disabled>Already Registered</button>
                        ` : `
                            <button class="btn btn-primary" id="registerFromModal" data-id="${workshop.id}">Register Now</button>
                        `}
                        <button class="btn btn-outline close-modal-btn">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Close modal handlers
        document.querySelector('.close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        document.querySelector('.close-modal-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Register from modal
        const registerBtn = document.getElementById('registerFromModal');
        if (registerBtn) {
            registerBtn.addEventListener('click', function() {
                const workshopId = parseInt(this.dataset.id);
                registerForWorkshop(workshopId);
                modal.style.display = 'none';
            });
        }
    }
}

function registerForWorkshop(id) {
    const workshopSystem = new WorkshopSystem();
    if (workshopSystem.registerForWorkshop(id)) {
        alert('Successfully registered for the workshop!');
        renderWorkshops('upcoming', workshopSystem.getUpcomingWorkshops());
        renderWorkshops('registered', workshopSystem.getRegisteredWorkshops());
    }
}
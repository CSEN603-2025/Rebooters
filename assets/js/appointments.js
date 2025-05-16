class AppointmentSystem {
    constructor() {
        this.appointments = [];
        this.loadAppointments();
    }
    
    loadAppointments() {
        // In real app, this would come from backend
        this.appointments = [
            {
                id: 1,
                type: "Career Guidance",
                date: "2023-06-15",
                time: "14:00",
                with: "Dr. Ahmed Mahmoud",
                status: "confirmed",
                notes: "Discuss internship opportunities in Europe"
            },
            // Add more appointments...
        ];
    }
    
    getUpcomingAppointments() {
        return this.appointments.filter(a => a.status === 'confirmed' && new Date(`${a.date}T${a.time}`) > new Date());
    }
    
    getPastAppointments() {
        return this.appointments.filter(a => new Date(`${a.date}T${a.time}`) < new Date());
    }
    
    getRequestedAppointments() {
        return this.appointments.filter(a => a.status === 'pending');
    }
    
    createAppointment(appointmentData) {
        const newAppointment = {
            id: Date.now(),
            ...appointmentData,
            status: 'pending'
        };
        this.appointments.push(newAppointment);
        return newAppointment;
    }
}

// Initialize appointments
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('upcomingAppointments')) {
        const appointmentSystem = new AppointmentSystem();
        
        // Render tabs
        renderAppointments('upcoming', appointmentSystem.getUpcomingAppointments());
        renderAppointments('past', appointmentSystem.getPastAppointments());
        renderAppointments('requested', appointmentSystem.getRequestedAppointments());
        
        // Tab switching
        document.querySelectorAll('.appointments-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // Update active tab
                document.querySelectorAll('.appointments-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.appointments-tabs .tab-content').forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // New appointment button
        document.getElementById('newAppointmentBtn').addEventListener('click', showNewAppointmentModal);
    }
});

function renderAppointments(type, appointments) {
    const container = document.getElementById(`${type}Appointments`);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (appointments.length === 0) {
        container.innerHTML = '<p class="no-appointments">No appointments found</p>';
        return;
    }
    
    appointments.forEach(appointment => {
        const appointmentCard = document.createElement('div');
        appointmentCard.className = 'appointment-card';
        appointmentCard.innerHTML = `
            <div class="appointment-header">
                <h4>${appointment.type}</h4>
                <span class="status-badge ${appointment.status}">${appointment.status}</span>
            </div>
            <div class="appointment-details">
                <p><i class="fas fa-calendar-day"></i> ${appointment.date} at ${appointment.time}</p>
                <p><i class="fas fa-user-tie"></i> With ${appointment.with}</p>
                ${appointment.notes ? `<p><i class="fas fa-sticky-note"></i> ${appointment.notes}</p>` : ''}
            </div>
            <div class="appointment-actions">
                ${appointment.status === 'pending' ? `
                    <button class="btn btn-outline cancel-appointment" data-id="${appointment.id}">Cancel</button>
                ` : ''}
                ${appointment.status === 'confirmed' ? `
                    <button class="btn btn-primary start-call" data-id="${appointment.id}">
                        <i class="fas fa-video"></i> Start Call
                    </button>
                ` : ''}
            </div>
        `;
        
        container.appendChild(appointmentCard);
    });
}

function showNewAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <h2>Request New Appointment</h2>
            </div>
            <div class="modal-body">
                <form id="appointmentForm">
                    <div class="form-group">
                        <label for="appointmentType">Appointment Type*</label>
                        <select id="appointmentType" required>
                            <option value="">Select type</option>
                            <option value="Career Guidance">Career Guidance</option>
                            <option value="Report Clarification">Report Clarification</option>
                            <option value="Internship Advice">Internship Advice</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="appointmentDate">Date*</label>
                            <input type="date" id="appointmentDate" required>
                        </div>
                        <div class="form-group">
                            <label for="appointmentTime">Time*</label>
                            <input type="time" id="appointmentTime" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="appointmentWith">With*</label>
                        <select id="appointmentWith" required>
                            <option value="">Select officer</option>
                            <option value="Dr. Ahmed Mahmoud">Dr. Ahmed Mahmoud</option>
                            <option value="Ms. Fatma Hassan">Ms. Fatma Hassan</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="appointmentNotes">Notes</label>
                        <textarea id="appointmentNotes" rows="3"></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline close-modal-btn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Request Appointment</button>
                    </div>
                </form>
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
    
    // Form submission
    document.getElementById('appointmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const appointmentData = {
            type: document.getElementById('appointmentType').value,
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            with: document.getElementById('appointmentWith').value,
            notes: document.getElementById('appointmentNotes').value
        };
        
        // In real app, would submit to backend
        alert('Appointment requested successfully!');
        modal.style.display = 'none';
    });
}
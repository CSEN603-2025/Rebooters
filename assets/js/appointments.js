class AppointmentSystem {
    constructor() {
        this.appointments = [];
        this.callInProgress = false;
        this.callTimer = null;
        this.callDurationTimer = null;
        this.secondsElapsed = 0;
        this.localStream = null;
        this.isMicOn = true;
        this.isCameraOn = true;
        this.isSharingScreen = false;
        this.currentCall = null;
        
        this.initDummyData();
        this.initEventListeners();
        this.renderAppointments();
    }

    initDummyData() {
        this.appointments = [
            {
                id: 1,
                title: "Career Guidance",
                officer: "Dr. Ahmed",
                date: "2025-06-20",
                time: "10:00",
                type: "career",
                status: "confirmed",
                notes: "Discuss career options after graduation",
                officerOnline: true
            },
            {
                id: 2,
                title: "Report Review",
                officer: "Prof. Sarah",
                date: "2025-06-22",
                time: "14:00",
                type: "report",
                status: "pending",
                notes: "Final internship report feedback",
                officerOnline: false
            },
            {
                id: 3,
                title: "Internship Discussion",
                officer: "Mr. Mahmoud",
                date: "2025-06-25",
                time: "11:00",
                type: "internship",
                status: "requires-action",
                notes: "Potential internship opportunities",
                officerOnline: true
            }
        ];
    }

    initEventListeners() {
        // Request appointment modal
        document.getElementById('requestAppointmentBtn').addEventListener('click', () => {
            document.getElementById('requestAppointmentModal').style.display = 'flex';
        });

        // Close modals
        document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Appointment form submission
        document.getElementById('appointmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAppointmentRequest();
        });

        // Call controls
        document.querySelector('.mic-btn').addEventListener('click', () => this.toggleMic());
        document.querySelector('.video-btn').addEventListener('click', () => this.toggleCamera());
        document.querySelector('.screen-btn').addEventListener('click', () => this.toggleScreenShare());
        document.querySelector('.end-call-btn').addEventListener('click', () => this.endCall(false));

        // Notification controls
        document.getElementById('closeCallEndedNotification').addEventListener('click', () => {
            document.getElementById('callEndedNotification').style.display = 'none';
        });
        document.querySelector('.close-notification-btn').addEventListener('click', () => {
            document.getElementById('appointmentNotification').style.display = 'none';
        });

        // Incoming call controls
        document.querySelector('.accept-call-btn').addEventListener('click', () => this.acceptIncomingCall());
        document.querySelector('.reject-call-btn').addEventListener('click', () => this.rejectIncomingCall());

        // Delegate appointment actions
        document.getElementById('appointmentsList').addEventListener('click', (e) => {
            if (e.target.closest('.start-call-btn')) {
                const appointmentId = parseInt(e.target.closest('.start-call-btn').dataset.id);
                this.startCall(appointmentId);
            }
            if (e.target.closest('.accept-appointment-btn')) {
                const appointmentId = parseInt(e.target.closest('.accept-appointment-btn').dataset.id);
                this.acceptAppointment(appointmentId);
            }
            if (e.target.closest('.reject-appointment-btn')) {
                const appointmentId = parseInt(e.target.closest('.reject-appointment-btn').dataset.id);
                this.rejectAppointment(appointmentId);
            }
        });

        // Simulate incoming call for testing
        setTimeout(() => this.simulateIncomingCall(), 10000);
    }

    renderAppointments() {
        const container = document.getElementById('appointmentsList');
        container.innerHTML = this.appointments.map(appointment => `
            <div class="appointment-card ${appointment.status}">
                <div class="appointment-header">
                    <h3>${appointment.title}</h3>
                    <span class="status-badge ${appointment.status}">${this.formatStatus(appointment.status)}</span>
                </div>
                <div class="appointment-details">
                    <p><i class="fas fa-user"></i> ${appointment.officer} <span class="user-status ${appointment.officerOnline ? 'online' : 'offline'}">
                        <i class="fas fa-circle"></i> ${appointment.officerOnline ? 'Online' : 'Offline'}
                    </span></p>
                    <p><i class="fas fa-calendar-alt"></i> ${this.formatDate(appointment.date)}</p>
                    <p><i class="fas fa-clock"></i> ${this.formatTime(appointment.time)}</p>
                    ${appointment.notes ? `<p><i class="fas fa-comment"></i> ${appointment.notes}</p>` : ''}
                </div>
                <div class="appointment-actions">
                    ${this.renderAppointmentActions(appointment)}
                </div>
            </div>
        `).join('');
    }

    renderAppointmentActions(appointment) {
        switch(appointment.status) {
            case 'confirmed':
                return `<button class="btn btn-primary start-call-btn" data-id="${appointment.id}">
                    <i class="fas fa-video"></i> Start Call
                </button>`;
            case 'pending':
                return `
                    <button class="btn btn-secondary">Edit</button>
                    <button class="btn btn-danger">Cancel</button>
                `;
            case 'requires-action':
                return `
                    <button class="btn btn-primary accept-appointment-btn" data-id="${appointment.id}">Accept</button>
                    <button class="btn btn-danger reject-appointment-btn" data-id="${appointment.id}">Decline</button>
                `;
            default:
                return '';
        }
    }

    async startCall(appointmentId) {
        if (this.callInProgress) return;
        
        const appointment = this.appointments.find(a => a.id === appointmentId);
        if (!appointment) return;
        
        try {
            this.currentCall = appointment;
            this.callInProgress = true;
            this.secondsElapsed = 0;
            
            // Update UI
            document.getElementById('videoCallModal').style.display = 'flex';
            document.getElementById('remoteUserName').textContent = appointment.officer;
            document.getElementById('callTitle').textContent = appointment.title;
            
            // Start timers
            this.startCallTimer();
            this.scheduleCallEnd();
            
            // Simulate remote participant joining
            setTimeout(() => {
                this.showNotification('Call Connected', `${appointment.officer} has joined the call`);
            }, 2000);
            
        } catch (error) {
            console.error('Error starting call:', error);
            this.showNotification('Call Failed', 'Could not start the video call');
        }
    }

    acceptIncomingCall() {
        document.getElementById('incomingCallNotification').style.display = 'none';
        const caller = document.getElementById('incomingCallerName').textContent;
        this.showNotification('Call Accepted', `You are now connected with ${caller}`);
        // In real implementation, you would establish the call connection here
    }

    rejectIncomingCall() {
        document.getElementById('incomingCallNotification').style.display = 'none';
        this.showNotification('Call Rejected', 'You declined the incoming call');
    }

    simulateIncomingCall() {
        const officers = ['Dr. Ahmed', 'Prof. Sarah', 'Mr. Mahmoud'];
        const randomOfficer = officers[Math.floor(Math.random() * officers.length)];
        document.getElementById('incomingCallerName').textContent = randomOfficer;
        document.getElementById('incomingCallNotification').style.display = 'block';
    }

    acceptAppointment(appointmentId) {
        const appointment = this.appointments.find(a => a.id === appointmentId);
        if (!appointment) return;
        
        appointment.status = 'confirmed';
        this.renderAppointments();
        this.showNotification('Appointment Accepted', `You accepted the appointment with ${appointment.officer}`);
    }

    rejectAppointment(appointmentId) {
        const appointment = this.appointments.find(a => a.id === appointmentId);
        if (!appointment) return;
        
        appointment.status = 'cancelled';
        this.renderAppointments();
        this.showNotification('Appointment Declined', `You declined the appointment with ${appointment.officer}`);
    }

    handleAppointmentRequest() {
        const type = document.getElementById('appointmentType').value;
        const officer = document.getElementById('appointmentOfficer').value;
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime').value;
        const notes = document.getElementById('appointmentNotes').value;
        
        const newAppointment = {
            id: Date.now(),
            title: type === 'career' ? 'Career Guidance' : 
                  type === 'report' ? 'Report Review' : 'Internship Discussion',
            officer,
            date,
            time,
            type,
            status: 'pending',
            notes,
            officerOnline: Math.random() > 0.5 // Random online status
        };
        
        this.appointments.push(newAppointment);
        this.renderAppointments();
        document.getElementById('requestAppointmentModal').style.display = 'none';
        
        // Simulate officer accepting appointment after delay
        setTimeout(() => {
            if (Math.random() > 0.3) { // 70% chance of acceptance
                newAppointment.status = 'confirmed';
                this.renderAppointments();
                this.showNotification(
                    'Appointment Confirmed', 
                    `${officer} has accepted your appointment request`
                );
            }
        }, 3000);
    }

    toggleMic() {
        this.isMicOn = !this.isMicOn;
        const micBtn = document.querySelector('.mic-btn');
        const icon = micBtn.querySelector('i');
        
        micBtn.classList.toggle('active', this.isMicOn);
        icon.classList.toggle('fa-microphone-slash', !this.isMicOn);
        icon.classList.toggle('fa-microphone', this.isMicOn);
    }

    toggleCamera() {
        this.isCameraOn = !this.isCameraOn;
        const cameraBtn = document.querySelector('.video-btn');
        const icon = cameraBtn.querySelector('i');
        
        cameraBtn.classList.toggle('active', this.isCameraOn);
        icon.classList.toggle('fa-video-slash', !this.isCameraOn);
        icon.classList.toggle('fa-video', this.isCameraOn);
    }

    async toggleScreenShare() {
        if (this.isSharingScreen) {
            this.isSharingScreen = false;
            document.querySelector('.screen-btn').classList.remove('active');
        } else {
            try {
                // This would actually share screen in a real implementation
                this.isSharingScreen = true;
                document.querySelector('.screen-btn').classList.add('active');
                this.showNotification('Screen Sharing', 'You started sharing your screen');
            } catch (error) {
                console.error('Error sharing screen:', error);
            }
        }
    }

    startCallTimer() {
        this.callTimer = setInterval(() => {
            this.secondsElapsed++;
            const minutes = Math.floor(this.secondsElapsed / 60);
            const seconds = this.secondsElapsed % 60;
            document.querySelector('.call-timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    scheduleCallEnd() {
        
        this.callDurationTimer = setTimeout(() => {
            this.endCall(true); // Ended by other participant
        }, 10000);
    }

    endCall(endedByOther) {
        if (!this.callInProgress) return;
        
        clearInterval(this.callTimer);
        clearTimeout(this.callDurationTimer);
        
        document.getElementById('videoCallModal').style.display = 'none';
        this.callInProgress = false;
        this.isSharingScreen = false;
        
        if (endedByOther && this.currentCall) {
            const message = `${this.currentCall.officer} has left the call`;
            document.getElementById('callEndedMessage').textContent = message;
            document.getElementById('callEndedNotification').style.display = 'block';
        }
    }

    showNotification(title, message) {
        document.getElementById('notificationTitle').textContent = title;
        document.getElementById('notificationMessage').textContent = message;
        document.getElementById('appointmentNotification').style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('appointmentNotification').style.display = 'none';
        }, 5000);
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    formatStatus(status) {
        const statusMap = {
            'confirmed': 'Confirmed',
            'pending': 'Pending',
            'requires-action': 'Action Required',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AppointmentSystem();
});
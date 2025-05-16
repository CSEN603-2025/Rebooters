let localStream;
let peerConnection;
let dataChannel;

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

// Video Call and Appointment Management System

// Store for active users and appointments
const VideoCallSystem = {
    activeUsers: new Map(),
    appointments: [],
    currentCall: null,
    notifications: [],
    profileViews: new Map(),
    
    addProfileView: function(companyId) {
        const views = this.profileViews.get(companyId) || [];
        views.push({
            timestamp: new Date().toISOString(),
            companyName: getCompanyName(companyId)
        });
        this.profileViews.set(companyId, views);
        this.updateProfileViewsUI();
    },
    
    updateProfileViewsUI: function() {
        const container = document.getElementById('profileViewsList');
        if (!container) return;
        
        let viewsHTML = '';
        this.profileViews.forEach((views, companyId) => {
            const latestView = views[views.length - 1];
            viewsHTML += `
                <div class="profile-view-item">
                    <h4>${latestView.companyName}</h4>
                    <p>Last viewed: ${new Date(latestView.timestamp).toLocaleString()}</p>
                    <p>Total views: ${views.length}</p>
                </div>
            `;
        });
        
        container.innerHTML = viewsHTML || '<p>No profile views yet</p>';
    }
};

// User Online Status System
const OnlineStatusSystem = {
    onlineUsers: new Map(),
    heartbeatInterval: null,

    initialize: function() {
        // Set initial online status
        const currentUser = getCurrentUser();
        if (currentUser) {
            this.setUserOnline(currentUser);
            
            // Start heartbeat
            this.heartbeatInterval = setInterval(() => {
                this.updateHeartbeat(currentUser);
            }, 30000); // Every 30 seconds
        }

        // Clean up offline users every minute
        setInterval(() => {
            this.cleanupOfflineUsers();
        }, 60000);

        // Handle page unload
        window.addEventListener('beforeunload', () => {
            if (currentUser) {
                this.setUserOffline(currentUser);
            }
        });
    },

    setUserOnline: function(userId) {
        this.onlineUsers.set(userId, {
            lastHeartbeat: Date.now(),
            status: 'online'
        });
        this.broadcastStatusChange(userId, 'online');
    },

    setUserOffline: function(userId) {
        this.onlineUsers.delete(userId);
        this.broadcastStatusChange(userId, 'offline');
    },

    updateHeartbeat: function(userId) {
        const userStatus = this.onlineUsers.get(userId);
        if (userStatus) {
            userStatus.lastHeartbeat = Date.now();
            this.onlineUsers.set(userId, userStatus);
        }
    },

    cleanupOfflineUsers: function() {
        const now = Date.now();
        const timeout = 60000; // 1 minute timeout

        this.onlineUsers.forEach((status, userId) => {
            if (now - status.lastHeartbeat > timeout) {
                this.setUserOffline(userId);
            }
        });
    },

    isUserOnline: function(userId) {
        const userStatus = this.onlineUsers.get(userId);
        return userStatus && userStatus.status === 'online';
    },

    broadcastStatusChange: function(userId, status) {
        // Notify relevant users about status change
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const userAppointments = appointments.filter(apt => 
            apt.userId === userId || apt.advisorId === userId
        );

        userAppointments.forEach(apt => {
            const otherUser = apt.userId === userId ? apt.advisorId : apt.userId;
            if (otherUser) {
                showNotification(`User ${status === 'online' ? 'is now available' : 'has gone offline'}`, 
                    'user_status', { userId, status });
            }
        });
    }
};

// Check if user has PRO badge
function checkProStatus() {
    const user = getCurrentUser();
    const profile = JSON.parse(localStorage.getItem('profile_' + user)) || {};
    return profile.proBadge === true;
}

// Request an appointment
function requestAppointment(details) {
    if (!checkProStatus()) {
        showNotification('This feature is only available for PRO students');
        return;
    }

    const appointment = {
        id: Date.now(),
        student: getCurrentUser(),
        officer: details.officer,
        date: details.date,
        time: details.time,
        purpose: details.purpose,
        status: 'pending',
        created: new Date().toISOString()
    };

    VideoCallSystem.appointments.push(appointment);
    saveAppointments();
    showNotification('Appointment request sent successfully!');
}

// Handle appointment response
function handleAppointmentResponse(appointmentId, status) {
    const appointment = VideoCallSystem.appointments.find(a => a.id === appointmentId);
    if (!appointment) return;

    // Update appointment status
    appointment.status = status;
    saveAppointments();

    // Get user online status
    const otherUser = appointment.userId === getCurrentUser() ? appointment.advisorId : appointment.userId;
    const isOnline = OnlineStatusSystem.isUserOnline(otherUser);

    // Create notification message
    let message = '';
    let notificationType = 'appointment';
    
    switch(status) {
        case 'accepted':
            message = `Appointment for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been accepted`;
            if (appointment.isVideoCall) {
                message += '. You can join the video call when it\'s time.';
                notificationType = 'video_call_accepted';
            }
            break;
        case 'rejected':
            message = `Appointment for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been rejected`;
            break;
        case 'cancelled':
            message = `Appointment for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been cancelled`;
            break;
    }

    // Show notification to both parties
    showNotification(message, notificationType, {
        appointmentId: appointmentId,
        status: status,
        isVideoCall: appointment.isVideoCall,
        userOnline: isOnline
    });

    // If it's a video call and it's accepted, show additional notification about online status
    if (appointment.isVideoCall && status === 'accepted') {
        const onlineMessage = isOnline ? 
            'The other participant is currently online and available for the call' :
            'The other participant is currently offline. You\'ll be notified when they come online';
        
        showNotification(onlineMessage, 'user_status', {
            userId: otherUser,
            status: isOnline ? 'online' : 'offline'
        });
    }

    // Update UI
    updateCallUI();
}

// Enhanced video call controls
const VideoCallControls = {
    startCall: async function(appointmentId) {
        const appointment = VideoCallSystem.appointments.find(a => a.id === appointmentId);
        if (!appointment) return;

        try {
            // Request media permissions
            localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            
            VideoCallSystem.currentCall = {
                id: Date.now(),
                appointment: appointmentId,
                participants: [appointment.student, appointment.officer],
                status: 'connecting',
                settings: {
                    video: true,
                    audio: true,
                    screenShare: false
                }
            };

            // Initialize WebRTC connection
            initializeWebRTCConnection();
            
            showNotification('Starting video call...');
            updateCallUI();
        } catch (error) {
            console.error('Error starting call:', error);
            showNotification('Failed to start call. Please check your camera and microphone permissions.');
        }
    },

    toggleVideo: function() {
        if (!VideoCallSystem.currentCall || !localStream) return;
        
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            VideoCallSystem.currentCall.settings.video = videoTrack.enabled;
            updateCallUI();
            
            // Notify other participant
            sendToRemotePeer({
                type: 'video_state',
                enabled: videoTrack.enabled
            });
        }
    },

    toggleAudio: function() {
        if (!VideoCallSystem.currentCall || !localStream) return;
        
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            VideoCallSystem.currentCall.settings.audio = audioTrack.enabled;
            updateCallUI();
            
            // Notify other participant
            sendToRemotePeer({
                type: 'audio_state',
                enabled: audioTrack.enabled
            });
        }
    },

    toggleScreenShare: async function() {
        if (!VideoCallSystem.currentCall) return;
        
        try {
            if (!VideoCallSystem.currentCall.settings.screenShare) {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true
                });
                
                // Handle screen share stop
                screenStream.getVideoTracks()[0].onended = () => {
                    VideoCallControls.toggleScreenShare();
                };
                
                // Replace video track with screen share
                const videoSender = peerConnection.getSenders().find(s => s.track.kind === 'video');
                if (videoSender) {
                    await videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
                }
                
                VideoCallSystem.currentCall.settings.screenShare = true;
                showNotification('Screen sharing started');
            } else {
                // Revert to camera
                const videoTrack = localStream.getVideoTracks()[0];
                const videoSender = peerConnection.getSenders().find(s => s.track.kind === 'video');
                if (videoSender) {
                    await videoSender.replaceTrack(videoTrack);
                }
                
                VideoCallSystem.currentCall.settings.screenShare = false;
                showNotification('Screen sharing stopped');
            }
            
            updateCallUI();
            
            // Notify other participant
            sendToRemotePeer({
                type: 'screen_share_state',
                enabled: VideoCallSystem.currentCall.settings.screenShare
            });
        } catch (error) {
            console.error('Error toggling screen share:', error);
            showNotification('Failed to share screen. Please try again.');
        }
    },

    endCall: function(isRemoteEnd = false) {
        if (!VideoCallSystem.currentCall) return;
        
        if (isRemoteEnd) {
            showNotification('The other participant has left the call');
        } else {
            // Notify other participant
            sendToRemotePeer({
                type: 'call_ended'
            });
        }
        
        // Stop all tracks
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        
        if (peerConnection) {
            peerConnection.close();
        }
        
        VideoCallSystem.currentCall = null;
        updateCallUI();
        
        // Redirect after a brief delay
        setTimeout(() => {
            window.location.href = 'appointments.html';
        }, 2000);
    }
};

// Enhanced UI updates
function updateCallUI() {
    const callContainer = document.getElementById('video-call-container');
    if (!callContainer) return;

    if (VideoCallSystem.currentCall) {
        callContainer.innerHTML = `
            <div class="video-grid">
                <div class="video-participant local">
                    <video id="localVideo" ${VideoCallSystem.currentCall.settings.video ? '' : 'hidden'}></video>
                    <div class="participant-name">You</div>
                </div>
                <div class="video-participant remote">
                    <video id="remoteVideo"></video>
                    <div class="participant-name">Remote User</div>
                </div>
            </div>
            <div class="call-controls">
                <button onclick="VideoCallControls.toggleVideo()" class="video-control-btn ${VideoCallSystem.currentCall.settings.video ? 'active' : ''}">
                    ${VideoCallSystem.currentCall.settings.video ? '🎥' : '❌'} Video
                </button>
                <button onclick="VideoCallControls.toggleAudio()" class="video-control-btn ${VideoCallSystem.currentCall.settings.audio ? 'active' : ''}">
                    ${VideoCallSystem.currentCall.settings.audio ? '🎤' : '🔇'} Audio
                </button>
                <button onclick="VideoCallControls.toggleScreenShare()" class="video-control-btn ${VideoCallSystem.currentCall.settings.screenShare ? 'active' : ''}">
                    ${VideoCallSystem.currentCall.settings.screenShare ? '📺' : '💻'} Share Screen
                </button>
                <button onclick="VideoCallControls.endCall()" class="video-control-btn end-call">
                    ❌ End Call
                </button>
            </div>
        `;
        
        // Set up video elements
        const localVideo = document.getElementById('localVideo');
        const remoteVideo = document.getElementById('remoteVideo');
        
        if (localStream) {
            localVideo.srcObject = localStream;
        }
        if (remoteStream) {
            remoteVideo.srcObject = remoteStream;
        }
    } else {
        callContainer.innerHTML = '<p>No active call</p>';
    }
}

// Notifications
function showNotification(message) {
    const notification = {
        id: Date.now(),
        message,
        type: 'info',
        timestamp: new Date().toISOString()
    };

    VideoCallSystem.notifications.push(notification);
    updateNotificationsUI();
}

function updateNotificationsUI() {
    const container = document.getElementById('notifications-container');
    if (!container) return;

    container.innerHTML = VideoCallSystem.notifications
        .slice(-5)
        .map(notification => `
            <div class="notification ${notification.type}">
                <p>${notification.message}</p>
                <small>${new Date(notification.timestamp).toLocaleString()}</small>
            </div>
        `)
        .join('');
}

// Storage functions
function saveAppointments() {
    localStorage.setItem('appointments', JSON.stringify(VideoCallSystem.appointments));
}

function loadAppointments() {
    VideoCallSystem.appointments = JSON.parse(localStorage.getItem('appointments')) || [];
}

// Handle incoming calls
function handleIncomingCall(callData) {
    const { callId, callerName, appointmentId } = callData;
    
    // Check if this is a scheduled appointment
    const appointment = VideoCallSystem.appointments.find(a => a.id === appointmentId);
    if (!appointment || appointment.status !== 'accepted') {
        rejectIncomingCall(callId, 'Invalid appointment');
        return;
    }
    
    // Create incoming call modal with enhanced UI
    const callModal = document.createElement('div');
    callModal.className = 'incoming-call-modal';
    callModal.innerHTML = `
        <div class="modal-content">
            <div class="call-header">
                <h3>📞 Incoming Video Call</h3>
                <div class="caller-info">
                    <p class="caller-name">From: ${callerName}</p>
                    <p class="call-purpose">Purpose: ${appointment.purpose || 'Scheduled Appointment'}</p>
                    <p class="call-time">Scheduled Time: ${appointment.time}</p>
                </div>
            </div>
            <div class="call-preview">
                <video id="previewVideo" autoplay muted playsinline></video>
            </div>
            <div class="call-actions">
                <button onclick="acceptIncomingCall('${callId}', '${appointmentId}')" class="accept-btn">
                    <span class="icon">✓</span> Accept
                </button>
                <button onclick="rejectIncomingCall('${callId}')" class="reject-btn">
                    <span class="icon">✕</span> Decline
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(callModal);
    
    // Show preview of local video
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const previewVideo = document.getElementById('previewVideo');
            if (previewVideo) {
                previewVideo.srcObject = stream;
            }
        })
        .catch(error => console.log('Preview error:', error));
    
    // Play call sound
    const ringtone = playCallSound();
    
    // Auto-reject if not answered within 30 seconds
    const timeout = setTimeout(() => {
        if (document.body.contains(callModal)) {
            rejectIncomingCall(callId, 'Call timeout');
            document.body.removeChild(callModal);
            if (ringtone) ringtone.pause();
        }
    }, 30000);

    // Store timeout ID to clear it when needed
    callModal.dataset.timeoutId = timeout;
}

function acceptIncomingCall(callId, appointmentId) {
    // Clear timeout and stop ringtone
    const modal = document.querySelector('.incoming-call-modal');
    if (modal) {
        clearTimeout(Number(modal.dataset.timeoutId));
        document.body.removeChild(modal);
    }
    
    // Stop preview stream if exists
    const previewVideo = document.getElementById('previewVideo');
    if (previewVideo && previewVideo.srcObject) {
        previewVideo.srcObject.getTracks().forEach(track => track.stop());
    }
    
    // Initialize video call
    initializeCall();
    
    // Send acceptance to caller
    sendToRemotePeer({
        type: 'call_accepted',
        callId: callId,
        appointmentId: appointmentId
    });

    // Show notification
    showNotification('Call accepted', 'call_status', {
        status: 'accepted',
        appointmentId: appointmentId
    });
}

function rejectIncomingCall(callId, reason = 'Call declined') {
    // Clear timeout and stop ringtone
    const modal = document.querySelector('.incoming-call-modal');
    if (modal) {
        clearTimeout(Number(modal.dataset.timeoutId));
        document.body.removeChild(modal);
    }
    
    // Stop preview stream if exists
    const previewVideo = document.getElementById('previewVideo');
    if (previewVideo && previewVideo.srcObject) {
        previewVideo.srcObject.getTracks().forEach(track => track.stop());
    }
    
    // Send rejection to caller
    sendToRemotePeer({
        type: 'call_rejected',
        callId: callId,
        reason: reason
    });

    // Show notification
    showNotification(`Call rejected: ${reason}`, 'call_status', {
        status: 'rejected',
        reason: reason
    });
}

// Handle remote peer leaving
function handleRemotePeerLeft() {
    showNotification('The other participant has left the call', 'call_status', {
        status: 'ended',
        reason: 'participant_left'
    });

    // End the call locally
    VideoCallControls.endCall(true);
}

// Play call sound
function playCallSound() {
    const audio = new Audio('/assets/call-sound.mp3');
    audio.loop = true;
    audio.play().catch(error => console.log('Error playing sound:', error));
    return audio;
}

// Update the event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize test data first
    initializeTestData();
    
    // Initialize online status system
    OnlineStatusSystem.initialize();
    
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    const toggleVideoBtn = document.getElementById('toggleVideo');
    const toggleAudioBtn = document.getElementById('toggleAudio');
    const endCallBtn = document.getElementById('endCall');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    // Initialize WebRTC
    async function initializeCall() {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            
            localVideo.srcObject = localStream;
            
            // Create peer connection
            peerConnection = new RTCPeerConnection(configuration);
            
            // Add local stream to peer connection
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
            
            // Handle remote stream
            peerConnection.ontrack = event => {
                remoteVideo.srcObject = event.streams[0];
            };
            
            // Create data channel for chat
            dataChannel = peerConnection.createDataChannel('chat');
            setupDataChannel(dataChannel);
            
            // Handle ICE candidates
            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    // Send candidate to remote peer
                    sendToRemotePeer({
                        type: 'candidate',
                        candidate: event.candidate
                    });
                }
            };
            
        } catch (error) {
            console.error('Error accessing media devices:', error);
            alert('Error accessing camera and microphone. Please check permissions.');
        }
    }
    
    function setupDataChannel(channel) {
        channel.onopen = () => {
            console.log('Data channel opened');
        };
        
        channel.onclose = () => {
            console.log('Data channel closed');
        };
        
        channel.onmessage = event => {
            const message = JSON.parse(event.data);
            displayMessage(message.sender, message.text);
        };
    }
    
    function displayMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <strong>${sender}:</strong> ${text}
        `;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Event listeners
    toggleVideoBtn.addEventListener('click', () => {
        const videoTrack = localStream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        toggleVideoBtn.classList.toggle('disabled');
    });
    
    toggleAudioBtn.addEventListener('click', () => {
        const audioTrack = localStream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        toggleAudioBtn.classList.toggle('disabled');
    });
    
    endCallBtn.addEventListener('click', () => {
        endCall();
    });
    
    sendMessageBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message && dataChannel.readyState === 'open') {
            const messageData = {
                sender: 'You',
                text: message
            };
            dataChannel.send(JSON.stringify(messageData));
            displayMessage('You', message);
            messageInput.value = '';
        }
    });
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageBtn.click();
        }
    });
    
    function endCall() {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        
        if (peerConnection) {
            peerConnection.close();
        }
        
        localVideo.srcObject = null;
        remoteVideo.srcObject = null;
        
        // Redirect to dashboard or show call ended message
        window.location.href = 'dashboard.html';
    }
    
    // Listen for remote peer leaving
    peerConnection.oniceconnectionstatechange = () => {
        if (peerConnection.iceConnectionState === 'disconnected') {
            VideoCallControls.handleCallEnd(true);
        }
    };
    
    // Handle screen sharing
    document.getElementById('screenShareBtn').addEventListener('click', () => {
        VideoCallControls.toggleScreenShare();
    });
    
    // Initialize call
    initializeCall();

    loadAppointments();
    updateCallUI();
    updateNotificationsUI();
});

function checkProAccess(elementToProtect, message) {
    if (!checkProStatus()) {
        showNotification(message);
        return false;
    }
    return true;
}

function initializeTestData() {
    // Test users with PRO status
    const testUsers = {
        student: {
            email: 'student1@guc.edu.eg',
            name: 'Sarah Ahmed',
            role: 'student',
            proBadge: true,
            completedInternships: 3
        },
        officer: {
            email: 'officer1@guc.edu.eg',
            name: 'Dr. Mohamed Hassan',
            role: 'scad_officer',
            proBadge: true
        }
    };
    
    // Store test users
    Object.values(testUsers).forEach(user => {
        localStorage.setItem(`profile_${user.email}`, JSON.stringify(user));
    });
    localStorage.setItem('currentUser', testUsers.student.email);

    // Create test appointments with different statuses
    const testAppointments = [
        {
            id: 'test-call-1',
            type: 'career_guidance',
            date: new Date().toISOString().split('T')[0], // Today
            time: '14:00',
            notes: 'Career guidance session - Test video call',
            isVideoCall: true,
            status: 'accepted',
            userId: testUsers.student.email,
            advisorId: testUsers.officer.email,
            created: new Date().toISOString()
        },
        {
            id: 'test-call-2',
            type: 'report_clarification',
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            time: '10:00',
            notes: 'Report review session',
            isVideoCall: true,
            status: 'pending',
            userId: testUsers.student.email,
            advisorId: testUsers.officer.email,
            created: new Date().toISOString()
        },
        {
            id: 'test-call-3',
            type: 'career_guidance',
            date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
            time: '15:30',
            notes: 'Follow-up session',
            isVideoCall: true,
            status: 'pending',
            userId: testUsers.student.email,
            advisorId: testUsers.officer.email,
            created: new Date().toISOString()
        }
    ];

    localStorage.setItem('appointments', JSON.stringify(testAppointments));

    // Initialize online status system with test data
    OnlineStatusSystem.initialize();
    OnlineStatusSystem.setUserOnline(testUsers.student.email);
    OnlineStatusSystem.setUserOnline(testUsers.officer.email);

    // Show initial notifications
    showNotification('Test data initialized successfully!');
    showNotification(`You have ${testAppointments.length} appointments scheduled`);
    showNotification('SCAD Officer is currently online', 'user_status', {
        userId: testUsers.officer.email,
        status: 'online'
    });

    // Return test data for reference
    return {
        currentUser: testUsers.student,
        officer: testUsers.officer,
        appointments: testAppointments
    };
} 
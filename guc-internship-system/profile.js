// In-memory data store
const DataStore = {
    _data: null,

    // Initialize data from localStorage or default values
    init: function() {
        const savedData = localStorage.getItem('profileData');
        if (savedData) {
            this._data = JSON.parse(savedData);
        } else {
            this._data = {
                internships: [
                    {
                        id: 1,
                        title: "Frontend Developer Intern",
                        company: "Tech Solutions",
                        duration: 3,
                        paid: true,
                        expectedSalary: "$500/month",
                        skills: ["HTML", "CSS", "JavaScript"],
                        description: "Work on real web projects using HTML, CSS, and JS.",
                        date: "2025-07-01"
                    },
                    {
                        id: 2,
                        title: "Data Analyst Intern",
                        company: "Data Insights",
                        duration: 3,
                        paid: false,
                        expectedSalary: "N/A",
                        skills: ["Data Analysis", "Excel"],
                        description: "Assist in analyzing and visualizing data for clients.",
                        date: "2025-01-15"
                    },
                    {
                        id: 3,
                        title: "Marketing Intern",
                        company: "MarketMakers",
                        duration: 3,
                        paid: true,
                        expectedSalary: "$300/month",
                        skills: ["Marketing", "Communication"],
                        description: "Support the marketing team in campaign management.",
                        date: "2025-12-10"
                    },
                    {
                        id: 4,
                        title: "Backend Developer Intern",
                        company: "Tech Solutions",
                        duration: 3,
                        paid: true,
                        expectedSalary: "$600/month",
                        skills: ["Node.js", "Databases"],
                        description: "Work on backend APIs and databases.",
                        date: "2025-06-01"
                    }
                ],
                applications: [],
                profiles: {},
                profileViews: []
            };
            this._saveToLocalStorage();
        }
    },

    // Save data to localStorage
    _saveToLocalStorage: function() {
        localStorage.setItem('profileData', JSON.stringify(this._data));
    },

    // Get data
    get: function(key) {
        return this._data[key];
    },

    // Set data
    set: function(key, value) {
        this._data[key] = value;
        this._saveToLocalStorage();
    },

    // Get profile for a specific user
    getProfile: function(user) {
        return this._data.profiles[user] || {};
    },

    // Set profile for a specific user
    setProfile: function(user, profile) {
        this._data.profiles[user] = profile;
        this._saveToLocalStorage();
    }
};

// Initialize DataStore when the page loads
DataStore.init();

// Helper functions
function getCurrentUser() {
    return 'student@guc.edu.eg'; // Default user
}

// Initialize jobs and activities arrays
window.jobs = [];
window.activities = [];

// Helper to render jobs and activities
function renderJobs(jobs) {
    const jobsList = document.getElementById('jobsList');
    jobsList.innerHTML = jobs.map((job, idx) => `
        <div class="job-entry">
            <input type="text" placeholder="Company Name" value="${job.company || ''}" onchange="updateJob(${idx}, 'company', this.value)">
            <input type="text" placeholder="Role/Title" value="${job.role || ''}" onchange="updateJob(${idx}, 'role', this.value)">
            <input type="text" placeholder="Duration" value="${job.duration || ''}" onchange="updateJob(${idx}, 'duration', this.value)">
            <input type="text" placeholder="Responsibilities" value="${job.responsibilities || ''}" onchange="updateJob(${idx}, 'responsibilities', this.value)">
            <button type="button" onclick="removeJob(${idx})">Remove</button>
        </div>
    `).join('');
}

function renderActivities(activities) {
    const activitiesList = document.getElementById('activitiesList');
    activitiesList.innerHTML = activities.map((act, idx) => `
        <div class="activity-entry">
            <input type="text" placeholder="Activity Name" value="${act.name || ''}" onchange="updateActivity(${idx}, 'name', this.value)">
            <input type="text" placeholder="Description" value="${act.description || ''}" onchange="updateActivity(${idx}, 'description', this.value)">
            <button type="button" onclick="removeActivity(${idx})">Remove</button>
        </div>
    `).join('');
}

// PRO Badge functionality
function checkAndAwardProBadge() {
    const user = getCurrentUser();
    const profile = DataStore.getProfile(user);
    
    // Get my internships from localStorage instead of DataStore
    const myInternships = JSON.parse(localStorage.getItem('myInternships')) || [];
    
    // Debug log
    console.log('Checking PRO badge eligibility:');
    console.log('Current user:', user);
    console.log('My internships:', myInternships);

    let totalDuration = 0;
    
    // Only count completed internships
    const completedInternships = myInternships.filter(internship => internship.status === "complete");
    
    // Sum up durations of completed internships only
    completedInternships.forEach(internship => {
        if (!isNaN(parseInt(internship.duration, 10))) {
            totalDuration += parseInt(internship.duration, 10);
            console.log(`Adding duration ${internship.duration} from completed internship ${internship.id}`);
        }
    });

    console.log('Total completed internship duration:', totalDuration);
    console.log('Current PRO badge status:', profile.proBadge);

    if (totalDuration >= 3 || profile.proBadge) {
        profile.proBadge = true;
        profile.proBadgeDate = profile.proBadgeDate || new Date().toISOString();
        DataStore.setProfile(user, profile);
        console.log('PRO badge awarded!');
        return true;
    }

    return false;
}

// Load profile
function loadProfile() {
    const user = getCurrentUser();
    const profile = DataStore.getProfile(user);
    document.getElementById('fullName').value = profile.fullName || '';
    document.getElementById('jobInterests').value = profile.jobInterests || '';
    document.getElementById('majorSelect').value = profile.major || '';
    document.getElementById('semesterSelect').value = profile.semester || '';
    window.jobs = profile.jobs || [];
    window.activities = profile.activities || [];
    renderJobs(window.jobs);
    renderActivities(window.activities);
}

// Add, update, remove jobs
function addJob() {
    window.jobs.push({ company: '', role: '', duration: '', responsibilities: '' });
    renderJobs(window.jobs);
}

function updateJob(idx, field, value) {
    window.jobs[idx][field] = value;
}

function removeJob(idx) {
    window.jobs.splice(idx, 1);
    renderJobs(window.jobs);
}

// Add, update, remove activities
function addActivity() {
    window.activities.push({ name: '', description: '' });
    renderActivities(window.activities);
}

function updateActivity(idx, field, value) {
    window.activities[idx][field] = value;
}

function removeActivity(idx) {
    window.activities.splice(idx, 1);
    renderActivities(window.activities);
}

// Toggle between view and edit modes
function toggleEditMode() {
    const profileView = document.getElementById('profileView');
    const profileForm = document.getElementById('profileForm');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const sidebar = document.getElementById('profileViewsSidebar');
    
    if (profileView.style.display !== 'none') {
        // Switch to edit mode
        profileView.style.display = 'none';
        profileForm.style.display = 'block';
        editProfileBtn.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none'; // Hide sidebar while editing
        loadProfile(); // Load current profile data into form
    } else {
        // Switch to view mode
        profileView.style.display = 'block';
        profileForm.style.display = 'none';
        editProfileBtn.style.display = 'inline-block';
        if (sidebar) sidebar.style.display = 'block'; // Show sidebar in view mode
        renderProfileView(); // Re-render the profile view
    }
}

// Initialize DataStore if not exists
if (!DataStore._data.profileViews) {
    DataStore._data.profileViews = [];
    DataStore._saveToLocalStorage();
}

function renderProfileViewsSidebar(user) {
    const sidebar = document.getElementById('profileViewsSidebar');
    const profile = DataStore.getProfile(user);
    
    // Only show profile views for Pro badge holders
    if (!profile.proBadge) {
        sidebar.innerHTML = '';
        return;
    }

    const views = DataStore.get('profileViews').filter(view => view.student === user);
    
    let html = `
        <div class="profile-views-sidebar">
            <h3>Companies That Viewed Your Profile</h3>
            ${views.length > 0 ? `
                <ul>
                    ${views.map(view => `
                        <li>
                            <strong>${view.company}</strong><br>
                            <span class="view-date">Viewed on ${new Date(view.date).toLocaleString()}</span>
                        </li>
                    `).join('')}
                </ul>
            ` : '<p>No companies have viewed your profile yet.</p>'}
        </div>
    `;
    sidebar.innerHTML = html;
}

// Update renderProfileView to include sidebar rendering
function renderProfileView() {
    const user = getCurrentUser();
    const profile = DataStore.getProfile(user);
    const isPro = checkAndAwardProBadge();
    
    // Get shared assessment scores
    const sharedScores = JSON.parse(localStorage.getItem('sharedAssessmentScores')) || [];
    
    const profileView = document.getElementById('profileView');
    profileView.innerHTML = `
        <div class="profile-header">
            <h2>${profile.fullName || 'Your Profile'}</h2>
            ${isPro ? '<span class="pro-badge">PRO</span>' : ''}
        </div>
        
        <div class="profile-section">
            <h3>Academic Information</h3>
            <p><strong>Major:</strong> ${profile.major || 'Not specified'}</p>
            <p><strong>Semester:</strong> ${profile.semester || 'Not specified'}</p>
        </div>

        <div class="profile-section">
            <h3>Job Interests</h3>
            <p>${profile.jobInterests || 'Not specified'}</p>
        </div>

        <div class="profile-section">
            <h3>Previous Experience</h3>
            ${window.jobs.length > 0 ? `
                <div class="jobs-list">
                    ${window.jobs.map(job => `
                        <div class="job-item">
                            <h4>${job.role} at ${job.company}</h4>
                            <p><strong>Duration:</strong> ${job.duration}</p>
                            <p>${job.responsibilities}</p>
                        </div>
                    `).join('')}
                </div>
            ` : '<p>No previous experience listed</p>'}
        </div>

        <div class="profile-section">
            <h3>College Activities</h3>
            ${window.activities.length > 0 ? `
                <div class="activities-list">
                    ${window.activities.map(activity => `
                        <div class="activity-item">
                            <h4>${activity.name}</h4>
                            <p>${activity.description}</p>
                        </div>
                    `).join('')}
                </div>
            ` : '<p>No activities listed</p>'}
        </div>
    `;

    // Always show profile views for all users
    renderProfileViewsSidebar(user);

    // Then render assessment scores below the sidebar
    const sidebar = document.getElementById('profileViewsSidebar');
    if (sharedScores.length > 0) {
        const assessmentSection = document.createElement('div');
        assessmentSection.innerHTML = `
            <div class="profile-section assessment-scores">
                <h3>Assessment Scores</h3>
                <div class="scores-grid">
                    ${sharedScores.map(score => `
                        <div class="score-card ${score.badgeLevel.toLowerCase()}-badge">
                            <h4>${score.title}</h4>
                            <div class="score-info">
                                <div class="score-number">${Math.round(score.score)}%</div>
                                <div class="badge-level">${score.badgeLevel} Badge</div>
                            </div>
                            <p class="completion-date">
                                Completed: ${new Date(score.completedAt).toLocaleDateString()}
                            </p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        sidebar.appendChild(assessmentSection);
    }

    document.getElementById('editProfileBtn').style.display = 'inline-block';
}

// Add event listener for the edit button
document.addEventListener('DOMContentLoaded', function() {
    // Initialize profile view
    renderProfileView();
    
    // Add event listener for edit button
    document.getElementById('editProfileBtn').addEventListener('click', toggleEditMode);
    
    // Add event listener for form submission
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const user = getCurrentUser();
        const profile = DataStore.getProfile(user);
        
        // Update profile with form values
        const updatedProfile = {
            ...profile,
            fullName: document.getElementById('fullName').value,
            jobInterests: document.getElementById('jobInterests').value,
            major: document.getElementById('majorSelect').value,
            semester: document.getElementById('semesterSelect').value,
            jobs: window.jobs || [],
            activities: window.activities || [],
            proBadge: profile.proBadge || false,
            proBadgeDate: profile.proBadgeDate
        };

        // Save to DataStore
        DataStore.setProfile(user, updatedProfile);
        
        // Show success message
        document.getElementById('profileMessage').textContent = 'Profile saved successfully!';
        
        // Switch back to view mode after short delay
        setTimeout(() => {
            toggleEditMode();
            renderProfileView();
        }, 1000);
    });
});

// Add function to record profile views
function recordProfileView(studentEmail, companyName) {
    const views = DataStore.get('profileViews');
    views.push({
        student: studentEmail,
        company: companyName,
        date: new Date().toISOString()
    });
    DataStore.set('profileViews', views);
    renderProfileViewsSidebar(studentEmail);
}

function updateApplicationStatuses() {
    const applications = DataStore.get('applications');
    const internships = DataStore.get('internships');
    const now = new Date();
    let updated = false;

    applications.forEach(app => {
        const internship = internships.find(i => i.id === app.internshipId);
        if (!internship) return;
        
        const startDate = new Date(app.date || internship.date);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + parseInt(internship.duration, 10));

        // Only update status if not already in a final state
        if (app.status !== "accepted" && app.status !== "rejected" && app.status !== "finalized") {
            const oldStatus = app.status;
            
            if (now < startDate) {
                app.status = "pending";
            } else if (now > endDate) {
                app.status = "finalized"; // Mark as finalized when internship period is over
            } else {
                app.status = "ongoing"; // During the internship
            }

            if (oldStatus !== app.status) {
                updated = true;
                console.log(`Updated application ${app.internshipId} status from ${oldStatus} to ${app.status}`);
            }
        }
    });

    if (updated) {
        console.log('Saving updated application statuses');
        DataStore.set('applications', applications);
    }
}


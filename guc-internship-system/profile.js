function getCurrentUser() {
    return localStorage.getItem('userEmail') || 'student@guc.edu.eg';
}

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
            <input type="text" placeholder="Role/Description" value="${act.description || ''}" onchange="updateActivity(${idx}, 'description', this.value)">
            <button type="button" onclick="removeActivity(${idx})">Remove</button>
        </div>
    `).join('');
}

// Load profile from localStorage
function loadProfile() {
    const user = getCurrentUser();
    const profile = JSON.parse(localStorage.getItem('profile_' + user)) || {};
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

function renderProfileView() {
    const user = getCurrentUser();
    const profile = JSON.parse(localStorage.getItem('profile_' + user)) || {};
    const jobs = profile.jobs || [];
    const activities = profile.activities || [];
    document.getElementById('profileView').innerHTML = `
        <p><strong>Full Name:</strong> ${profile.fullName || ''}</p>
        <p><strong>Job Interests:</strong> ${profile.jobInterests || ''}</p>
        <p><strong>Major:</strong> ${profile.major || ''}</p>
        <p><strong>Semester:</strong> ${profile.semester || ''}</p>
        <h3>Previous Internships / Part-Time Jobs</h3>
        <ul>
            ${jobs.length ? jobs.map(job => `
                <li>
                    <strong>Company:</strong> ${job.company || ''} |
                    <strong>Role:</strong> ${job.role || ''} |
                    <strong>Duration:</strong> ${job.duration || ''} |
                    <strong>Responsibilities:</strong> ${job.responsibilities || ''}
                </li>
            `).join('') : '<li>None</li>'}
        </ul>
        <h3>College Activities</h3>
        <ul>
            ${activities.length ? activities.map(act => `
                <li>
                    <strong>Activity:</strong> ${act.name || ''} |
                    <strong>Description:</strong> ${act.description || ''}
                </li>
            `).join('') : '<li>None</li>'}
        </ul>
    `;
    document.getElementById('profileView').style.display = 'block';
    document.getElementById('profileForm').style.display = 'none';
    document.getElementById('editProfileBtn').style.display = 'inline-block';
}

document.getElementById('editProfileBtn').onclick = function() {
    document.getElementById('profileView').style.display = 'none';
    document.getElementById('profileForm').style.display = 'block';
    document.getElementById('editProfileBtn').style.display = 'none';
    loadProfile(); // Fill the form with current data
};

document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = getCurrentUser();
    const profile = {
        fullName: document.getElementById('fullName').value.trim(),
        jobInterests: document.getElementById('jobInterests').value.trim(),
        major: document.getElementById('majorSelect').value,
        semester: document.getElementById('semesterSelect').value,
        jobs: window.jobs,
        activities: window.activities
    };
    localStorage.setItem('profile_' + user, JSON.stringify(profile));
    document.getElementById('profileMessage').textContent = "Profile saved successfully!";
    setTimeout(() => {
        renderProfileView();
    }, 1000);
});

document.addEventListener('DOMContentLoaded', renderProfileView);

// Make functions global for inline event handlers
window.addJob = addJob;
window.updateJob = updateJob;
window.removeJob = removeJob;
window.addActivity = addActivity;
window.updateActivity = updateActivity;
window.removeActivity = removeActivity;
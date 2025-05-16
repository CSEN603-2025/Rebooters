document.addEventListener('DOMContentLoaded', function() {
    // Toggle between view and edit modes
    const editBtn = document.getElementById('edit-profile-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const viewMode = document.getElementById('profile-view-mode');
    const editMode = document.getElementById('profile-edit-mode');
    
    if (editBtn && cancelBtn) {
        editBtn.addEventListener('click', function() {
            viewMode.classList.add('hidden');
            editMode.classList.remove('hidden');
            populateEditForm();
        });
        
        cancelBtn.addEventListener('click', function() {
            editMode.classList.add('hidden');
            viewMode.classList.remove('hidden');
        });
    }

    // Handle form submission
    const profileForm = document.getElementById('profile-edit-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, you would send data to server here
            alert('Profile updated successfully!');
            viewMode.classList.remove('hidden');
            editMode.classList.add('hidden');
            // Update the view with new data
            updateProfileView();
        });
    }

    // Interest tags functionality
    const addTagBtn = document.getElementById('add-tag-btn');
    if (addTagBtn) {
        addTagBtn.addEventListener('click', function() {
            const newTagInput = document.getElementById('new-tag-input');
            const newTag = newTagInput.value.trim();
            if (newTag) {
                addTagToEditForm(newTag);
                newTagInput.value = '';
            }
        });
    }

    // Add experience/activity functionality
    document.getElementById('add-experience-btn')?.addEventListener('click', addExperienceField);
    document.getElementById('add-activity-btn')?.addEventListener('click', addActivityField);
});

function populateEditForm() {
    // Populate interests
    const currentTagsContainer = document.getElementById('current-tags');
    currentTagsContainer.innerHTML = '';
    const interests = ['Business Analysis', 'Data Analytics', 'Project Management', 'UI/UX Design'];
    interests.forEach(interest => {
        addTagToEditForm(interest);
    });
    
    // Populate experience
    const experienceContainer = document.getElementById('experience-edit-container');
    experienceContainer.innerHTML = '';
    addExperienceField(
        'Business Analyst Intern', 
        'Tech Solutions Inc.', 
        'Summer 2022 (3 months)', 
        ['Conducted market research', 'Created business requirements', 'Assisted in product roadmaps']
    );
    addExperienceField(
        'Part-time Tutor', 
        'GUC Tutoring Center', 
        'Fall 2021 - Present', 
        ['Tutored first-year students', 'Conducted weekly study sessions']
    );
    
    // Populate activities
    const activitiesContainer = document.getElementById('activities-edit-container');
    activitiesContainer.innerHTML = '';
    addActivityField(
        'ACM Student Chapter', 
        'Vice President', 
        '2021 - Present', 
        'Organized tech talks and coding competitions'
    );
    addActivityField(
        'GUC Annual Hackathon 2022', 
        'Participant', 
        '', 
        'Developed a mobile app for campus navigation',
        '2nd Place Winner'
    );
}

function addTagToEditForm(tagText) {
    const container = document.getElementById('current-tags');
    const tag = document.createElement('div');
    tag.className = 'tag tag-editable';
    tag.innerHTML = `
        ${tagText}
        <span class="remove-tag" onclick="this.parentElement.remove()">&times;</span>
    `;
    container.appendChild(tag);
}

function addExperienceField(title = '', company = '', duration = '', bulletPoints = []) {
    const container = document.getElementById('experience-edit-container');
    const field = document.createElement('div');
    field.className = 'edit-item';
    field.innerHTML = `
        <div class="form-group">
            <label>Title/Role</label>
            <input type="text" value="${title}" placeholder="Internship Title">
        </div>
        <div class="form-group">
            <label>Company/Organization</label>
            <input type="text" value="${company}" placeholder="Company Name">
        </div>
        <div class="form-group">
            <label>Duration</label>
            <input type="text" value="${duration}" placeholder="e.g., Summer 2022 (3 months)">
        </div>
        <div class="form-group">
            <label>Responsibilities (one per line)</label>
            <textarea placeholder="Describe your responsibilities">${bulletPoints.join('\n')}</textarea>
        </div>
        <div class="edit-item-actions">
            <button type="button" class="remove-item-btn" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `;
    container.appendChild(field);
}

function addActivityField(name = '', role = '', duration = '', description = '', achievement = '') {
    const container = document.getElementById('activities-edit-container');
    const field = document.createElement('div');
    field.className = 'edit-item';
    field.innerHTML = `
        <div class="form-group">
            <label>Activity Name</label>
            <input type="text" value="${name}" placeholder="e.g., ACM Student Chapter">
        </div>
        <div class="form-group">
            <label>Your Role</label>
            <input type="text" value="${role}" placeholder="e.g., Vice President">
        </div>
        <div class="form-group">
            <label>Duration</label>
            <input type="text" value="${duration}" placeholder="e.g., 2021 - Present">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea placeholder="Describe the activity">${description}</textarea>
        </div>
        <div class="form-group">
            <label>Achievements (if any)</label>
            <input type="text" value="${achievement}" placeholder="e.g., 2nd Place Winner">
        </div>
        <div class="edit-item-actions">
            <button type="button" class="remove-item-btn" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `;
    container.appendChild(field);
}

function updateProfileView() {
    // This would update the view mode with the edited data
    // In a real app, you would get this from the form or from a data object
    console.log('Updating profile view with new data');
}
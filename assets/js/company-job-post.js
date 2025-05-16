document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('jobPostForm');
    const compensationSelect = document.getElementById('compensation');
    const salaryField = document.getElementById('salaryField');
    const skillsInput = document.getElementById('skillsInput');
    const skillsContainer = document.getElementById('skillsContainer');
    let skills = [];
    
    // Show/hide salary field based on compensation selection
    compensationSelect.addEventListener('change', function() {
        salaryField.style.display = this.value === 'paid' ? 'block' : 'none';
    });
    
    // Skills input functionality
    skillsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            e.preventDefault();
            const skill = this.value.trim();
            
            if (!skills.includes(skill)) {
                skills.push(skill);
                renderSkills();
            }
            
            this.value = '';
        }
    });
    
    function renderSkills() {
        skillsContainer.innerHTML = '';
        skills.forEach((skill, index) => {
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                ${skill}
                <span class="remove-skill" data-index="${index}">&times;</span>
            `;
            skillsContainer.appendChild(tag);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-skill').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                skills.splice(index, 1);
                renderSkills();
            });
        });
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (compensationSelect.value === 'paid' && !document.getElementById('salary').value) {
            alert('Please enter expected salary for paid positions');
            return;
        }
        
        if (skills.length === 0) {
            alert('Please add at least one required skill');
            return;
        }
        
        // In a real app, you would send this data to the server
        const jobData = {
            title: document.getElementById('jobTitle').value,
            type: document.getElementById('jobType').value,
            duration: document.getElementById('duration').value,
            compensation: compensationSelect.value,
            salary: compensationSelect.value === 'paid' ? document.getElementById('salary').value : null,
            skills: skills,
            description: document.getElementById('jobDescription').value,
            responsibilities: document.getElementById('responsibilities').value,
            requirements: document.getElementById('requirements').value
        };
        
        console.log('Job post data:', jobData);
        
        // Show success message and redirect
        alert('Job posted successfully!');
        window.location.href = 'company-dashboard.html';
    });
});
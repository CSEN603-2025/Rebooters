// Get internship ID from URL
function getInternshipId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// Load company information
function loadCompanyInfo() {
    const internshipId = getInternshipId();
    const internships = JSON.parse(localStorage.getItem('internships')) || [];
    const internship = internships.find(i => i.id === internshipId);
    
    if (internship) {
        document.getElementById('companyInfo').innerHTML = `
            <h3>${internship.title}</h3>
            <p><strong>Company:</strong> ${internship.company}</p>
        `;
    }
}

// Load existing evaluation if it exists
function loadExistingEvaluation() {
    const internshipId = getInternshipId();
    const evaluations = JSON.parse(localStorage.getItem('evaluations')) || [];
    const evaluation = evaluations.find(e => e.internshipId === internshipId);
    
    if (evaluation) {
        // Set star rating
        document.querySelector(`input[name="rating"][value="${evaluation.rating}"]`).checked = true;
        
        // Set other fields
        document.getElementById('recommend').value = evaluation.recommend;
        document.getElementById('pros').value = evaluation.pros;
        document.getElementById('cons').value = evaluation.cons;
        document.getElementById('experience').value = evaluation.experience;
        
        // Show delete button
        document.getElementById('deleteBtn').style.display = 'block';
        
        // Disable form if evaluation exists
        document.getElementById('evaluationForm').querySelectorAll('input, select, textarea').forEach(element => {
            element.disabled = true;
        });
        document.getElementById('deleteBtn').disabled = false;
    }
}

// Delete evaluation
function deleteEvaluation() {
    if (!confirm('Are you sure you want to delete this evaluation?')) {
        return;
    }
    
    const internshipId = getInternshipId();
    let evaluations = JSON.parse(localStorage.getItem('evaluations')) || [];
    
    // Remove the evaluation
    evaluations = evaluations.filter(e => e.internshipId !== internshipId);
    localStorage.setItem('evaluations', JSON.stringify(evaluations));
    
    // Show success message and redirect
    document.getElementById('message').innerHTML = `
        <div class="success-message">
            Evaluation deleted successfully!
            <button onclick="window.location.href='my-internships.html'">Back to My Internships</button>
        </div>
    `;
}

// Handle form submission
document.getElementById('evaluationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const internshipId = getInternshipId();
    const evaluation = {
        internshipId,
        rating: document.querySelector('input[name="rating"]:checked').value,
        recommend: document.getElementById('recommend').value,
        pros: document.getElementById('pros').value,
        cons: document.getElementById('cons').value,
        experience: document.getElementById('experience').value,
        date: new Date().toISOString(),
        user: localStorage.getItem('userEmail')
    };
    
    // Get existing evaluations
    let evaluations = JSON.parse(localStorage.getItem('evaluations')) || [];
    
    // Check if evaluation already exists
    const existingIndex = evaluations.findIndex(e => e.internshipId === internshipId);
    if (existingIndex !== -1) {
        // Update existing evaluation
        evaluations[existingIndex] = evaluation;
    } else {
        // Add new evaluation
        evaluations.push(evaluation);
    }
    
    // Save to localStorage
    localStorage.setItem('evaluations', JSON.stringify(evaluations));
    
    // Show success message
    document.getElementById('message').innerHTML = `
        <div class="success-message">
            Evaluation submitted successfully!
            <button onclick="window.location.href='my-internships.html'">Back to My Internships</button>
        </div>
    `;
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadCompanyInfo();
    loadExistingEvaluation();
    
    // Show user info in header
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        const role = localStorage.getItem('userRole') || 'Guest';
        const email = localStorage.getItem('userEmail') || '';
        userInfo.textContent = `${role.charAt(0).toUpperCase() + role.slice(1)}${email ? ' (' + email + ')' : ''}`;
    }
}); 
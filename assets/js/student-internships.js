document.addEventListener('DOMContentLoaded', function() {
    localStorage.removeItem('appliedInternships');
    // Sample internship data
    const internships = [
        {
            id: 1,
            title: "Software Engineer Intern",
            company: "TechCorp",
            industry: "Technology",
            duration: 1,
            paid: true,
            description: "Work on cutting-edge software projects with our engineering team.",
            skills: "JavaScript, Python, React"
        },
        {
            id: 2,
            title: "Financial Analyst Intern",
            company: "FinGroup",
            industry: "Finance",
            duration: 2,
            paid: false,
            description: "Assist in financial reporting and market analysis.",
            skills: "Excel, Financial Modeling, Accounting"
        },
        {
            id: 3,
            title: "Healthcare Assistant Intern",
            company: "MediLife",
            industry: "Healthcare",
            duration: 2,
            paid: true,
            description: "Support healthcare professionals in patient care.",
            skills: "Medical terminology, Communication"
        }
    ];

    // Track applied internships (would normally come from backend)
    let appliedInternships = JSON.parse(localStorage.getItem('appliedInternships')) || [];
    
    // DOM elements
    const internshipList = document.getElementById('internshipList');
    const searchInput = document.getElementById('internshipSearch');
    const filterIndustry = document.getElementById('internshipFilterIndustry');
    const filterDuration = document.getElementById('internshipFilterDuration');
    const filterPaid = document.getElementById('internshipFilterPaid');
    const internshipModal = document.getElementById('internshipModal');

    // Render internships
    function renderInternships(list) {
        internshipList.innerHTML = '';

        if (list.length === 0) {
            internshipList.innerHTML = '<p class="no-results">No internships match your criteria.</p>';
            return;
        }

        list.forEach(internship => {
            const isApplied = appliedInternships.some(applied => applied.id === internship.id);
            
            const card = document.createElement('div');
            card.classList.add('internship-card');
            card.innerHTML = `
                <div class="card-header">
                    <h3>${internship.title}</h3>
                    <span class="company-badge">${internship.company}</span>
                </div>
                <div class="card-body">
                    <p><i class="fas fa-industry"></i> ${internship.industry}</p>
                    <p><i class="fas fa-clock"></i> ${internship.duration} month(s)</p>
                    <p><i class="fas fa-money-bill-wave"></i> ${internship.paid ? 'Paid' : 'Unpaid'}</p>
                    <div class="card-actions">
                        <button class="btn btn-outline view-details" data-id="${internship.id}">
                            <i class="fas fa-eye"></i> Details
                        </button>
                        ${isApplied ? 
                            '<span class="applied-badge"><i class="fas fa-check"></i> Applied</span>' : 
                            `<button class="btn btn-primary apply-now" data-id="${internship.id}">
                                <i class="fas fa-paper-plane"></i> Apply
                            </button>`}
                    </div>
                </div>
            `;
            internshipList.appendChild(card);
        });

        // Add event listeners
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', () => {
                const internship = list.find(i => i.id == btn.dataset.id);
                showInternshipModal(internship);
            });
        });

        document.querySelectorAll('.apply-now').forEach(btn => {
            btn.addEventListener('click', () => {
                const internship = list.find(i => i.id == btn.dataset.id);
                showApplyModal(internship);
            });
        });
    }

    // Filter internships
    function filterInternships() {
        const searchText = searchInput.value.toLowerCase();
        const selectedIndustry = filterIndustry.value;
        const selectedDuration = filterDuration.value;
        const selectedPaid = filterPaid.value;

        const filtered = internships.filter(internship => {
            const matchesSearch = internship.title.toLowerCase().includes(searchText) ||
                               internship.company.toLowerCase().includes(searchText);
            const matchesIndustry = selectedIndustry === '' || internship.industry === selectedIndustry;
            const matchesDuration = selectedDuration === '' || 
                                  (selectedDuration === '1' && internship.duration === 1) ||
                                  (selectedDuration === '2' && internship.duration >= 2);
            const matchesPaid = selectedPaid === '' || 
                              (selectedPaid === 'paid' && internship.paid) || 
                              (selectedPaid === 'unpaid' && !internship.paid);

            return matchesSearch && matchesIndustry && matchesDuration && matchesPaid;
        });

        renderInternships(filtered);
    }

    // Show internship details modal
    function showInternshipModal(internship) {
        internshipModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>${internship.title}</h2>
                <p class="company-name">${internship.company}</p>
                
                <div class="modal-section">
                    <h3><i class="fas fa-info-circle"></i> Details</h3>
                    <p><strong>Industry:</strong> ${internship.industry}</p>
                    <p><strong>Duration:</strong> ${internship.duration} month(s)</p>
                    <p><strong>Compensation:</strong> ${internship.paid ? 'Paid' : 'Unpaid'}</p>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-tasks"></i> Skills Required</h3>
                    <p>${internship.skills}</p>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-align-left"></i> Description</h3>
                    <p>${internship.description}</p>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-outline close-btn">Close</button>
                    ${appliedInternships.some(applied => applied.id === internship.id) ? 
                        '<span class="applied-badge"><i class="fas fa-check"></i> Already Applied</span>' : 
                        `<button class="btn btn-primary apply-btn" data-id="${internship.id}">
                            <i class="fas fa-paper-plane"></i> Apply Now
                        </button>`}
                </div>
            </div>
        `;

        // Add event listeners
        internshipModal.querySelector('.close-modal').addEventListener('click', closeModal);
        internshipModal.querySelector('.close-btn').addEventListener('click', closeModal);
        
        const applyBtn = internshipModal.querySelector('.apply-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                showApplyModal(internship);
            });
        }

        internshipModal.style.display = 'block';
    }

    // Show apply modal (Req 21)
    function showApplyModal(internship) {
        internshipModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Apply for ${internship.title}</h2>
                <p class="company-name">${internship.company}</p>
                
                <form id="applicationForm">
                    <div class="form-group">
                        <label for="cvUpload"><i class="fas fa-file-pdf"></i> Upload CV (Required)</label>
                        <input type="file" id="cvUpload" accept=".pdf,.doc,.docx" required>
                        <small>PDF or Word document</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="coverLetter"><i class="fas fa-file-alt"></i> Cover Letter (Optional)</label>
                        <input type="file" id="coverLetter" accept=".pdf,.doc,.docx">
                        <small>PDF or Word document</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="certificates"><i class="fas fa-certificate"></i> Certificates (Optional)</label>
                        <input type="file" id="certificates" accept=".pdf,.jpg,.png" multiple>
                        <small>Multiple files allowed</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="additionalInfo"><i class="fas fa-comment"></i> Additional Information</label>
                        <textarea id="additionalInfo" placeholder="Anything else you'd like to share..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline cancel-btn">Cancel</button>
                        <button type="submit" class="btn btn-primary submit-btn">
                            <i class="fas fa-paper-plane"></i> Submit Application
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Add event listeners
        internshipModal.querySelector('.close-modal').addEventListener('click', closeModal);
        internshipModal.querySelector('.cancel-btn').addEventListener('click', closeModal);
        
        document.getElementById('applicationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            submitApplication(internship);
        });

        internshipModal.style.display = 'block';
    }

    // Submit application (Req 21)
    function submitApplication(internship) {
        // In a real app, you would upload files to server here
        // For demo, we'll just store the application locally
        
        const application = {
            id: internship.id,
            title: internship.title,
            company: internship.company,
            appliedDate: new Date().toLocaleDateString(),
            status: "Pending",
            documents: {
                cv: document.getElementById('cvUpload').files[0]?.name || 'Not uploaded',
                coverLetter: document.getElementById('coverLetter').files[0]?.name || 'Not provided',
                certificates: document.getElementById('certificates').files.length > 0 ? 
                    Array.from(document.getElementById('certificates').files).map(f => f.name).join(', ') : 
                    'Not provided'
            }
        };

        // Add to applied internships
        if (!appliedInternships.some(app => app.id === internship.id)) {
            appliedInternships.push(application);
            localStorage.setItem('appliedInternships', JSON.stringify(appliedInternships));
        }

        // Show success message
        alert(`Application submitted successfully for ${internship.title} at ${internship.company}`);
        
        // Close modal and refresh view
        closeModal();
        filterInternships();
    }

    // Close modal
    function closeModal() {
        internshipModal.style.display = 'none';
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === internshipModal) {
            closeModal();
        }
    });

    // Initialize
    searchInput.addEventListener('input', filterInternships);
    filterIndustry.addEventListener('change', filterInternships);
    filterDuration.addEventListener('change', filterInternships);
    filterPaid.addEventListener('change', filterInternships);

    // Initial render
    filterInternships();
});
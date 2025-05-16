document.addEventListener('DOMContentLoaded', function() {
    // Load data from localStorage or initialize with dummy data
    let applications = JSON.parse(localStorage.getItem('appliedInternships')) || [
        {
            id: 1,
            title: "Software Engineer Intern",
            company: "TechCorp",
            status: "accepted",
            appliedDate: "2025-05-15",
            documents: {
                cv: "Farah_CV.pdf",
                coverLetter: "TechCorp_CL.pdf",
                certificates: "Python_Cert.pdf"
            }
        }
    ];

    let internships = JSON.parse(localStorage.getItem('studentInternships')) || [
        {
            id: 1,
            title: "Software Engineer Intern",
            company: "TechCorp",
            startDate: "2025-06-01",
            endDate: "2025-08-31",
            status: "completed",
            courses: ["Web Development", "Data Structures"],
            evaluation: null,
            report: null
        },
        {
            id: 2,
            title: "Business Analyst Intern",
            company: "FinancePlus",
            startDate: "2025-09-15",
            endDate: "",
            status: "current",
            courses: ["Business Intelligence"],
            evaluation: null,
            report: null
        }
    ];

    // DOM elements
    const applicationsList = document.getElementById('applicationsList');
    const internshipsList = document.getElementById('internshipsList');
    const evaluationModal = document.getElementById('evaluationModal');
    const reportModal = document.getElementById('reportModal');

    // Tab switching functionality
    function setupTabSwitching() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab') + '-tab';
                document.getElementById(tabId).classList.add('active');
                
                // Refresh the content when switching tabs
                if (btn.getAttribute('data-tab') === 'applications') {
                    renderApplications();
                } else {
                    renderInternships();
                }
            });
        });
    }

    // Render applications
    function renderApplications() {
        applicationsList.innerHTML = applications.map(app => `
            <div class="application-card" data-id="${app.id}">
                <div class="card-header">
                    <h3>${app.title}</h3>
                    <span class="status-badge ${app.status.toLowerCase()}">${app.status}</span>
                </div>
                <div class="card-body">
                    <p><strong>Company:</strong> ${app.company}</p>
                    <p><strong>Applied:</strong> ${app.appliedDate}</p>
                    <div class="card-actions">
                        <button class="btn btn-outline view-details">Details</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners
        document.querySelectorAll('.application-card .view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.application-card');
                const appId = parseInt(card.dataset.id);
                const application = applications.find(a => a.id === appId);
                showApplicationDetails(application);
            });
        });
    }

    // Render internships with clickable functionality
    function renderInternships(internshipsToRender = internships) {
    internshipsList.innerHTML = internshipsToRender.length > 0 ? 
        internshipsToRender.map(intern => `
            <div class="internship-card" data-id="${intern.id}">
                <div class="card-header">
                    <h3>${intern.title}</h3>
                    <span class="status-badge ${intern.status}">
                        ${intern.status === 'current' ? 'Current' : 'Completed'}
                    </span>
                </div>
                <div class="card-body">
                    <p><strong>Company:</strong> ${intern.company}</p>
                    <p><strong>Duration:</strong> ${intern.startDate} to ${intern.endDate || 'Present'}</p>
                    
                    ${intern.status === 'completed' ? `
                        <div class="relevant-courses">
                            <p><strong>Relevant Courses:</strong></p>
                            <ul>
                                ${intern.courses.map(course => `<li>${course}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="internship-actions">
                            <button class="btn btn-outline evaluate-btn" data-id="${intern.id}">
                                <i class="fas fa-star"></i> ${intern.evaluation ? 'View Evaluation' : 'Add Evaluation'}
                            </button>
                            <button class="btn btn-outline report-btn" data-id="${intern.id}">
                                <i class="fas fa-file-alt"></i> ${intern.report ? 'View Report' : 'Create Report'}
                            </button>
                        </div>
                    ` : `
                        <div class="internship-actions">
                            <button class="btn btn-outline view-btn" data-id="${intern.id}">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                        </div>
                    `}
                </div>
            </div>
        `).join('') : '<p class="no-results">No internships match your filters</p>';

    // Add event listeners
    addInternshipCardListeners();
}

    // Show internship details
    function showInternshipDetails(internship) {
        evaluationModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>${internship.title}</h2>
                <p class="company-name">${internship.company}</p>
                
                <div class="modal-section">
                    <h3><i class="fas fa-calendar-alt"></i> Internship Period</h3>
                    <p>${internship.startDate} to ${internship.endDate || 'Present'}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${internship.status}">
                        ${internship.status === 'current' ? 'Current' : 'Completed'}
                    </span></p>
                </div>
                
                ${internship.status === 'completed' ? `
                    <div class="modal-section">
                        <h3><i class="fas fa-star"></i> Evaluation</h3>
                        ${internship.evaluation ? `
                            <div class="evaluation-display">
                                <p><strong>Rating:</strong> ${'★'.repeat(internship.evaluation.rating)}${'☆'.repeat(5 - internship.evaluation.rating)}</p>
                                <p><strong>Recommend:</strong> ${internship.evaluation.recommends ? 'Yes' : 'No'}</p>
                                <p><strong>Comments:</strong> ${internship.evaluation.text}</p>
                            </div>
                        ` : '<p>No evaluation submitted yet.</p>'}
                    </div>
                    
                    <div class="modal-section">
                        <h3><i class="fas fa-file-alt"></i> Report</h3>
                        ${internship.report ? `
                            <p><strong>Title:</strong> ${internship.report.title}</p>
                            <p><strong>Status:</strong> ${internship.report.status}</p>
                            <button class="btn btn-outline view-report-btn">
                                <i class="fas fa-eye"></i> View Full Report
                            </button>
                            <button class="btn btn-outline download-btn">
                                <i class="fas fa-download"></i> Download PDF
                            </button>
                        ` : '<p>No report submitted yet.</p>'}
                    </div>
                ` : ''}
                
                <div class="modal-section">
                    <h3><i class="fas fa-book"></i> Relevant Courses</h3>
                    <ul class="course-list">
                        ${internship.courses.map(course => `<li>${course}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-outline close-btn">Close</button>
                </div>
            </div>
        `;

        // Add event listeners
        evaluationModal.querySelector('.close-modal').addEventListener('click', closeModals);
        evaluationModal.querySelector('.close-btn').addEventListener('click', closeModals);
        
        if (internship.report) {
            evaluationModal.querySelector('.view-report-btn')?.addEventListener('click', () => {
                showFullReport(internship);
            });
            
            evaluationModal.querySelector('.download-btn')?.addEventListener('click', () => {
                alert(`Downloading report: ${internship.report.title}.pdf`);
            });
        }

        evaluationModal.style.display = 'block';
    }

    // Close all modals
    function closeModals() {
        evaluationModal.style.display = 'none';
        reportModal.style.display = 'none';
    }

    // Initialize the page
    setupTabSwitching();
    renderApplications();
    renderInternships();

    // Make closeModals available globally
    window.closeModals = closeModals;
});
// Add these filter functions
function filterInternships() {
    const searchText = document.getElementById('internshipSearch').value.toLowerCase();
    const statusFilter = document.getElementById('internshipStatusFilter').value;
    const dateFilter = document.getElementById('internshipDateFilter').value;

    const filtered = internships.filter(internship => {
        // Search by title or company (Req 40)
        const matchesSearch = searchText === '' || 
                            internship.title.toLowerCase().includes(searchText) || 
                            internship.company.toLowerCase().includes(searchText);
        
        // Filter by status (Req 41)
        const matchesStatus = statusFilter === '' || internship.status === statusFilter;
        
        // Filter by date (Req 41)
        const matchesDate = dateFilter === '' || internship.startDate.includes(dateFilter);
        
        return matchesSearch && matchesStatus && matchesDate;
    });

    // Clear and re-render only if we have results
    if (filtered.length > 0) {
        renderInternships(filtered);
    } else {
        internshipsList.innerHTML = '<p class="no-results">No internships match your filters.</p>';
    }
}

// Update renderInternships to show courses (Req 45)
function renderInternships(internshipsToRender = internships) {
    internshipsList.innerHTML = internshipsToRender.map(intern => `
        <div class="internship-card" data-id="${intern.id}">
            <!-- ... existing card content ... -->
            ${intern.status === 'completed' ? `
                <div class="relevant-courses">
                    <h4>Relevant Courses:</h4>
                    <ul>
                        ${intern.courses.map(course => `<li>${course}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `).join('');
    
    // ... rest of existing renderInternships code ...
}

// Add evaluation form (Req 43)
function showEvaluationForm(internship) {
    evaluationModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeModals()">&times;</span>
            <h2>Evaluate ${internship.company}</h2>
            
            ${internship.evaluation ? `
                <div class="existing-evaluation">
                    <h3>Your Existing Evaluation</h3>
                    <p>Rating: ${'★'.repeat(internship.evaluation.rating)}${'☆'.repeat(5 - internship.evaluation.rating)}</p>
                    <p>Recommend: ${internship.evaluation.recommends ? 'Yes' : 'No'}</p>
                    <p>Comments: ${internship.evaluation.text}</p>
                    <button class="btn btn-danger" id="deleteEvaluation">Delete Evaluation</button>
                </div>
            ` : `
                <form id="evaluationForm">
                    <div class="form-group">
                        <label>Rating (1-5 stars)</label>
                        <div class="star-rating">
                            ${[1,2,3,4,5].map(i => `
                                <i class="far fa-star" data-rating="${i}"></i>
                            `).join('')}
                            <input type="hidden" id="ratingValue" value="0">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Would you recommend this company?</label>
                        <label class="switch">
                            <input type="checkbox" id="recommendToggle">
                            <span class="slider round"></span>
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label for="evaluationComments">Comments</label>
                        <textarea id="evaluationComments" rows="4"></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="closeModals()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Submit Evaluation</button>
                    </div>
                </form>
            `}
        </div>
    `;

    // Add star rating interaction
    if (!internship.evaluation) {
        const stars = evaluationModal.querySelectorAll('.fa-star');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating);
                document.getElementById('ratingValue').value = rating;
                stars.forEach((s, i) => {
                    s.classList.toggle('fas', i < rating);
                    s.classList.toggle('far', i >= rating);
                });
            });
        });

        document.getElementById('evaluationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            saveEvaluation(internship);
        });
    } else {
        document.getElementById('deleteEvaluation').addEventListener('click', function() {
            if (confirm('Are you sure you want to delete your evaluation?')) {
                deleteEvaluation(internship);
            }
        });
    }

    evaluationModal.style.display = 'block';
}

// Add report form (Req 44, 46, 47)
function showReportForm(internship) {
    reportModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeModals()">&times;</span>
            <h2>Internship Report</h2>
            <p>For ${internship.title} at ${internship.company}</p>
            
            <form id="reportForm">
                <div class="form-group">
                    <label for="reportTitle">Title</label>
                    <input type="text" id="reportTitle" value="${internship.report?.title || ''}">
                </div>
                
                <div class="form-group">
                    <label for="reportIntro">Introduction</label>
                    <textarea id="reportIntro" rows="4">${internship.report?.introduction || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="reportBody">Main Body</label>
                    <textarea id="reportBody" rows="8">${internship.report?.body || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Relevant Courses (Select all that apply)</label>
                    <div class="course-checkboxes">
                        ${courses.map(course => `
                            <label class="course-checkbox">
                                <input type="checkbox" name="course" value="${course}" 
                                    ${internship.courses?.includes(course) ? 'checked' : ''}>
                                ${course}
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="closeModals()">Cancel</button>
                    ${internship.report?.status === 'draft' ? `
                        <button type="submit" class="btn btn-primary">Save Draft</button>
                    ` : ''}
                    <button type="button" class="btn btn-success" id="finalizeReport">
                        ${internship.report ? 'Update' : 'Submit'} Final Report
                    </button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('reportForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveReport(internship, false); // Save as draft
    });

    document.getElementById('finalizeReport').addEventListener('click', function() {
        if (confirm('Are you sure you want to submit this as your final report? You cannot edit it after submission.')) {
            saveReport(internship, true); // Submit final report
        }
    });

    reportModal.style.display = 'block';
}

// Add supporting functions
function saveEvaluation(internship) {
    const evaluation = {
        rating: parseInt(document.getElementById('ratingValue').value),
        recommends: document.getElementById('recommendToggle').checked,
        text: document.getElementById('evaluationComments').value,
        date: new Date().toLocaleDateString()
    };
    
    internship.evaluation = evaluation;
    localStorage.setItem('studentInternships', JSON.stringify(internships));
    closeModals();
    renderInternships();
}

function deleteEvaluation(internship) {
    internship.evaluation = null;
    localStorage.setItem('studentInternships', JSON.stringify(internships));
    closeModals();
    renderInternships();
}

function saveReport(internship, isFinal) {
    const report = {
        title: document.getElementById('reportTitle').value,
        introduction: document.getElementById('reportIntro').value,
        body: document.getElementById('reportBody').value,
        status: isFinal ? 'submitted' : 'draft',
        date: new Date().toLocaleDateString()
    };
    
    // Get selected courses
    const selectedCourses = Array.from(document.querySelectorAll('input[name="course"]:checked'))
                                .map(cb => cb.value);
    internship.courses = selectedCourses;
    
    internship.report = report;
    localStorage.setItem('studentInternships', JSON.stringify(internships));
    closeModals();
    renderInternships();
}
document.addEventListener('DOMContentLoaded', function() {
    // Sample data - would come from backend in real app
    const courses = [
        "Business Intelligence",
        "Database Systems",
        "Enterprise Systems",
        "Web Development",
        "Data Structures",
        "Software Engineering",
        "Project Management",
        "Data Mining",
        "IT Security",
        "Cloud Computing"
    ];

    // Load or initialize data
    let applications = JSON.parse(localStorage.getItem('appliedInternships')) || [
        {
            id: 1,
            title: "PwC Egypt - Tax Internship",
            company: "PwC",
            status: "pending",
            appliedDate: "April 25, 2025"
        },
        {
            id: 2,
            title: "EY - Advisory Internship",
            company: "EY",
            status: "accepted",
            appliedDate: "March 10, 2025"
        }
    ];

    let internships = JSON.parse(localStorage.getItem('studentInternships')) || [
        {
            id: 1,
            title: "Deloitte Egypt - Audit Internship",
            company: "Deloitte",
            startDate: "July 2024",
            endDate: "September 2024",
            status: "completed",
            courses: ["Accounting Principles", "Auditing"],
            evaluation: null,
            report: null
        },
        {
            id: 2,
            title: "GUC Accounting Office - Summer Assistant",
            company: "GUC",
            startDate: "August 2023",
            endDate: "August 2023",
            status: "completed",
            courses: ["Financial Accounting"],
            evaluation: {
                rating: 4,
                recommends: true,
                comments: "Great learning experience with supportive mentors.",
                date: "2023-09-15"
            },
            report: {
                title: "Summer 2023 Accounting Internship Report",
                introduction: "This report covers my internship at GUC Accounting Office...",
                body: "During my internship, I assisted with various accounting tasks...",
                status: "submitted",
                date: "2023-09-10"
            }
        }
    ];

    // DOM elements
    const applicationsList = document.getElementById('applicationsList');
    const internshipsList = document.getElementById('internshipsList');
    const evaluationModal = document.getElementById('evaluationModal');
    const reportModal = document.getElementById('reportModal');

    // Initialize
    setupTabSwitching();
    renderApplications();
    renderInternships();
    setupFilters();

    // Tab switching
    function setupTabSwitching() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
            });
        });
    }

    // Filter setup
    function setupFilters() {
        document.getElementById('internshipSearch').addEventListener('input', filterInternships);
        document.getElementById('internshipStatusFilter').addEventListener('change', filterInternships);
        document.getElementById('internshipDateFilter').addEventListener('change', filterInternships);
    }

    // Filter internships
    function filterInternships() {
        const searchText = document.getElementById('internshipSearch').value.toLowerCase();
        const statusFilter = document.getElementById('internshipStatusFilter').value;
        const dateFilter = document.getElementById('internshipDateFilter').value;

        const filtered = internships.filter(internship => {
            const matchesSearch = searchText === '' || 
                               internship.title.toLowerCase().includes(searchText) || 
                               internship.company.toLowerCase().includes(searchText);
            const matchesStatus = statusFilter === '' || internship.status === statusFilter;
            const matchesDate = dateFilter === '' || internship.startDate.includes(dateFilter);
            
            return matchesSearch && matchesStatus && matchesDate;
        });

        renderInternships(filtered);
    }

    // Render applications
    function renderApplications() {
        applicationsList.innerHTML = applications.map(app => `
            <div class="application-card" data-id="${app.id}">
                <h3>${app.title}</h3>
                <p><strong>Status:</strong> <span class="status-badge ${app.status}">${app.status}</span></p>
                <p><strong>Applied On:</strong> ${app.appliedDate}</p>
            </div>
        `).join('');
    }

    // Render internships (Req 45 - shows courses)
    function renderInternships(internshipsToRender = internships) {
        internshipsList.innerHTML = internshipsToRender.length > 0 ? 
            internshipsToRender.map(intern => `
                <div class="internship-card" data-id="${intern.id}">
                    <div class="card-header">
                        <h3>${intern.title}</h3>
                        <span class="status-badge ${intern.status}">
                            ${intern.status === 'current' ? 'Current' : 'Completed'}
                        </span>
                    </div>
                    <div class="card-body">
                        <p><strong>Company:</strong> ${intern.company}</p>
                        <p><strong>Duration:</strong> ${intern.startDate} to ${intern.endDate || 'Present'}</p>
                        
                        ${intern.status === 'completed' ? `
                            <div class="relevant-courses">
                                <p><strong>Relevant Courses:</strong></p>
                                <ul>
                                    ${intern.courses.map(course => `<li>${course}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="internship-actions">
                                <button class="btn btn-outline evaluate-btn">
                                    <i class="fas fa-star"></i> ${intern.evaluation ? 'View Evaluation' : 'Add Evaluation'}
                                </button>
                                <button class="btn btn-outline report-btn">
                                    <i class="fas fa-file-alt"></i> ${intern.report ? 'View Report' : 'Create Report'}
                                </button>
                            </div>
                        ` : `
                            <div class="internship-actions">
                                <button class="btn btn-outline view-btn">
                                    <i class="fas fa-eye"></i> View Details
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            `).join('') : '<p class="no-results">No internships match your filters</p>';

        // Add event listeners
        addInternshipCardListeners();
    }

    // Add event listeners to internship cards
    function addInternshipCardListeners() {
    // Evaluate button
    document.querySelectorAll('.evaluate-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click from triggering
            const internId = parseInt(this.dataset.id);
            const internship = internships.find(i => i.id === internId);
            showEvaluationForm(internship);
        });
    });

    // Report button
    document.querySelectorAll('.report-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const internId = parseInt(this.dataset.id);
            const internship = internships.find(i => i.id === internId);
            showReportForm(internship);
        });
    });

    // View button
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const internId = parseInt(this.dataset.id);
            const internship = internships.find(i => i.id === internId);
            showInternshipDetails(internship);
        });
    });

    // Card click
    document.querySelectorAll('.internship-card').forEach(card => {
        card.addEventListener('click', function() {
            const internId = parseInt(this.dataset.id);
            const internship = internships.find(i => i.id === internId);
            showInternshipDetails(internship);
        });
    });
}

    // Show evaluation form (Req 43)
    function showEvaluationForm(internship) {
        evaluationModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="closeModals()">&times;</span>
                <h2>${internship.evaluation ? 'Your Evaluation' : 'Evaluate'} ${internship.company}</h2>
                
                ${internship.evaluation ? `
                    <div class="existing-evaluation">
                        <p><strong>Rating:</strong> ${'★'.repeat(internship.evaluation.rating)}${'☆'.repeat(5 - internship.evaluation.rating)}</p>
                        <p><strong>Recommend to others:</strong> ${internship.evaluation.recommends ? 'Yes' : 'No'}</p>
                        <p><strong>Comments:</strong> ${internship.evaluation.comments}</p>
                        <p><em>Submitted on ${internship.evaluation.date}</em></p>
                        
                        <div class="modal-actions">
                            <button class="btn btn-outline" onclick="closeModals()">Close</button>
                            <button class="btn btn-danger" id="deleteEvaluation">Delete Evaluation</button>
                        </div>
                    </div>
                ` : `
                    <form id="evaluationForm">
                        <div class="form-group">
                            <label>Rating (1-5 stars)</label>
                            <div class="star-rating">
                                ${[1,2,3,4,5].map(i => `<i class="far fa-star" data-rating="${i}"></i>`).join('')}
                                <input type="hidden" id="ratingValue" value="0">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Would you recommend this company to other students?</label>
                            <label class="switch">
                                <input type="checkbox" id="recommendToggle">
                                <span class="slider round"></span>
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label for="evaluationComments">Your Comments</label>
                            <textarea id="evaluationComments" rows="4" placeholder="Share your experience..."></textarea>
                        </div>
                        
                        <div class="modal-actions">
                            <button type="button" class="btn btn-outline" onclick="closeModals()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Submit Evaluation</button>
                        </div>
                    </form>
                `}
            </div>
        `;

        if (internship.evaluation) {
            document.getElementById('deleteEvaluation').addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this evaluation?')) {
                    deleteEvaluation(internship);
                }
            });
        } else {
            // Star rating interaction
            const stars = evaluationModal.querySelectorAll('.star-rating i');
            stars.forEach(star => {
                star.addEventListener('click', function() {
                    const rating = parseInt(this.dataset.rating);
                    document.getElementById('ratingValue').value = rating;
                    stars.forEach((s, i) => {
                        s.classList.toggle('fas', i < rating);
                        s.classList.toggle('far', i >= rating);
                    });
                });
            });

            // Form submission
            document.getElementById('evaluationForm').addEventListener('submit', function(e) {
                e.preventDefault();
                submitEvaluation(internship);
            });
        }

        evaluationModal.style.display = 'block';
    }

    // Submit evaluation (Req 43)
    function submitEvaluation(internship) {
        const evaluation = {
            rating: parseInt(document.getElementById('ratingValue').value),
            recommends: document.getElementById('recommendToggle').checked,
            comments: document.getElementById('evaluationComments').value,
            date: new Date().toLocaleDateString()
        };

        internship.evaluation = evaluation;
        saveData();
        closeModals();
        renderInternships();
    }

    // Delete evaluation
    function deleteEvaluation(internship) {
        internship.evaluation = null;
        saveData();
        closeModals();
        renderInternships();
    }

    // Show report form (Req 44, 46, 47)
    function showReportForm(internship) {
        reportModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="closeModals()">&times;</span>
                <h2>${internship.report ? 'Internship Report' : 'Create Report'}</h2>
                <p>For ${internship.title} at ${internship.company}</p>
                
                <form id="reportForm">
                    <div class="form-group">
                        <label for="reportTitle">Report Title</label>
                        <input type="text" id="reportTitle" 
                            value="${internship.report?.title || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="reportIntro">Introduction</label>
                        <textarea id="reportIntro" rows="4" required>${internship.report?.introduction || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="reportBody">Main Body</label>
                        <textarea id="reportBody" rows="8" required>${internship.report?.body || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Courses that helped during internship (Select all that apply)</label>
                        <div class="course-checkboxes">
                            ${courses.map(course => `
                                <label class="course-checkbox">
                                    <input type="checkbox" name="course" value="${course}"
                                        ${internship.courses.includes(course) ? 'checked' : ''}>
                                    ${course}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="btn btn-outline" onclick="closeModals()">
                            ${internship.report ? 'Close' : 'Cancel'}
                        </button>
                        ${!internship.report || internship.report.status === 'draft' ? `
                            <button type="submit" class="btn btn-primary" id="saveDraft">
                                ${internship.report ? 'Update Draft' : 'Save Draft'}
                            </button>
                        ` : ''}
                        <button type="button" class="btn btn-success" id="submitReport">
                            ${internship.report ? 'View Final Report' : 'Submit Final Report'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Form submission for draft
        document.getElementById('reportForm').addEventListener('submit', function(e) {
            e.preventDefault();
            saveReport(internship, false); // Save as draft
        });

        // Final submission/view
        document.getElementById('submitReport').addEventListener('click', function() {
            if (internship.report?.status === 'submitted') {
                // View final report
                showFinalReport(internship);
            } else {
                // Submit final report
                if (confirm('Are you sure you want to submit this as your final report? You cannot edit it after submission.')) {
                    saveReport(internship, true);
                }
            }
        });

        reportModal.style.display = 'block';
    }

    // Save report (Req 44, 46, 47)
    function saveReport(internship, isFinal) {
        // Get selected courses (Req 46)
        const selectedCourses = Array.from(
            document.querySelectorAll('input[name="course"]:checked')
        ).map(cb => cb.value);

        const report = {
            title: document.getElementById('reportTitle').value,
            introduction: document.getElementById('reportIntro').value,
            body: document.getElementById('reportBody').value,
            status: isFinal ? 'submitted' : 'draft',
            date: new Date().toLocaleDateString()
        };

        // Update internship data
        internship.report = report;
        internship.courses = selectedCourses;
        
        saveData();
        closeModals();
        renderInternships();
    }

    // Show final report view
    function showFinalReport(internship) {
        reportModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="closeModals()">&times;</span>
                <h2>${internship.report.title}</h2>
                <p><em>Submitted on ${internship.report.date}</em></p>
                
                <div class="report-view">
                    <h3>Introduction</h3>
                    <p>${internship.report.introduction}</p>
                    
                    <h3>Main Body</h3>
                    <p>${internship.report.body}</p>
                    
                    <h3>Relevant Courses</h3>
                    <ul>
                        ${internship.courses.map(course => `<li>${course}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-outline" onclick="closeModals()">Close</button>
                    <button class="btn btn-primary" id="downloadReport">
                        <i class="fas fa-download"></i> Download PDF
                    </button>
                </div>
            </div>
        `;

        document.getElementById('downloadReport').addEventListener('click', () => {
            alert(`Downloading report: ${internship.report.title}.pdf`);
            // In real app, this would generate a PDF
        });

        reportModal.style.display = 'block';
    }

    // Save data to localStorage
    function saveData() {
        localStorage.setItem('studentInternships', JSON.stringify(internships));
    }

    // Close all modals
    function closeModals() {
        evaluationModal.style.display = 'none';
        reportModal.style.display = 'none';
    }

    // Make functions available globally
    window.closeModals = closeModals;
});
// Initialize event listeners for filters
// Add these at the end of your DOMContentLoaded event
document.getElementById('internshipSearch').addEventListener('input', filterInternships);
document.getElementById('internshipStatusFilter').addEventListener('change', filterInternships);
document.getElementById('internshipDateFilter').addEventListener('change', filterInternships);
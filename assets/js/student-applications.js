document.addEventListener('DOMContentLoaded', function() {
    // Sample data
    const applications = [
        {
            id: 1,
            title: "PwC Egypt - Tax Internship",
            company: "PwC",
            status: "Pending",
            appliedDate: "April 25, 2025"
        },
        {
            id: 2,
            title: "EY - Advisory Internship",
            company: "EY",
            status: "Accepted",
            appliedDate: "March 10, 2025"
        }
    ];

    const internships = [
        {
            id: 1,
            title: "Deloitte Egypt - Audit Internship",
            company: "Deloitte",
            duration: "July 2024 - September 2024",
            status: "completed",
            year: "2024",
            outcome: "Successfully Completed",
            evaluation: null,
            report: null
        },
        {
            id: 2,
            title: "GUC Accounting Office - Summer Assistant",
            company: "GUC",
            duration: "August 2023",
            status: "completed",
            year: "2023",
            outcome: "Report Submitted & Approved",
            evaluation: {
                rating: 4,
                learningExperience: "Great learning opportunity with hands-on experience.",
                supervisorSupport: "excellent",
                workEnvironment: "good",
                recommend: "yes",
                helpfulCourses: ["Financial Accounting", "Business Communication"],
                suggestions: "More structured training program would be beneficial."
            },
            report: {
                title: "Summer Internship Experience Report",
                intro: "This report summarizes my internship experience at the GUC Accounting Office...",
                body: "During my internship, I was exposed to various accounting processes...",
                conclusion: "Overall, this internship provided valuable practical experience...",
                submittedDate: "September 15, 2023"
            }
        },
        {
            id: 3,
            title: "Microsoft - Software Development Intern",
            company: "Microsoft",
            duration: "June 2025 - Present",
            status: "current",
            year: "2025",
            outcome: "In Progress",
            evaluation: null,
            report: null
        }
    ];

    const courses = [
        "Introduction to Programming",
        "Database Systems",
        "Web Development",
        "Financial Accounting",
        "Business Communication",
        "Data Structures",
        "Software Engineering",
        "Business Intelligence",
        "Project Management",
        "E-Commerce"
    ];

    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const searchInput = document.getElementById('internshipSearch');
    const filterStatus = document.getElementById('internshipStatusFilter');
    const filterDate = document.getElementById('internshipDateFilter');
    const applicationsList = document.getElementById('applicationsList');
    const internshipsList = document.getElementById('internshipsList');
    const evaluationModal = document.getElementById('evaluationModal');
    const successModal = document.getElementById('successModal');
    const reportModal = document.getElementById('reportModal');
    const closeModalButtons = document.querySelectorAll('.close-modal, .close-modal-btn');
    const closeSuccessModalButton = document.querySelector('.close-success-modal');
    const stars = document.querySelectorAll('.rating-stars i');
    const evaluationForm = document.getElementById('evaluationForm');
    const coursesChecklist = document.getElementById('coursesChecklist');
    const reportContent = document.getElementById('reportContent');
    const downloadPdfBtn = document.querySelector('.download-pdf-btn');

    // Initialize the page
    function init() {
        renderApplications();
        renderInternships();
        renderCoursesChecklist();
        setupEventListeners();
    }

    // Render applications list
    function renderApplications(filteredApplications = applications) {
        applicationsList.innerHTML = '';
        
        if (filteredApplications.length === 0) {
            applicationsList.innerHTML = '<p class="no-results">No applications found.</p>';
            return;
        }

        filteredApplications.forEach(app => {
            const appCard = document.createElement('div');
            appCard.className = 'application-card';
            appCard.innerHTML = `
                <h3>${app.title}</h3>
                <p><strong>Status:</strong> <span class="status-${app.status.toLowerCase()}">${app.status}</span></p>
                <p><strong>Applied On:</strong> ${app.appliedDate}</p>
            `;
            applicationsList.appendChild(appCard);
        });
    }

    // Render internships list
    function renderInternships(filteredInternships = internships) {
        internshipsList.innerHTML = '';
        
        if (filteredInternships.length === 0) {
            internshipsList.innerHTML = '<p class="no-results">No internships found.</p>';
            return;
        }

        filteredInternships.forEach(internship => {
            const internshipCard = document.createElement('div');
            internshipCard.className = 'internship-card';
            
            let actionsHTML = '';
            if (internship.status === 'completed') {
                actionsHTML = `
                    <div class="internship-actions">
                        <button class="btn btn-primary evaluate-btn" data-internship-id="${internship.id}">
                            ${internship.evaluation ? 'View/Update Evaluation' : 'Evaluate Internship'}
                        </button>
                        <button class="btn btn-secondary view-report-btn" data-internship-id="${internship.id}">
                            ${internship.report ? 'View Report' : 'Create Report'}
                        </button>
                        ${internship.evaluation ? `<button class="btn btn-danger delete-evaluation-btn" data-internship-id="${internship.id}">Delete Evaluation</button>` : ''}
                        ${internship.report ? `<button class="btn btn-danger delete-report-btn" data-internship-id="${internship.id}">Delete Report</button>` : ''}
                    </div>
                `;
            } else {
                actionsHTML = '<p class="current-internship">Current internship in progress</p>';
            }
            
            internshipCard.innerHTML = `
                <h3>${internship.title}</h3>
                <p><strong>Duration:</strong> ${internship.duration}</p>
                <p><strong>Outcome:</strong> ${internship.outcome}</p>
                ${actionsHTML}
            `;
            
            internshipsList.appendChild(internshipCard);
        });

        // Re-attach event listeners to new buttons
        attachDynamicEventListeners();
    }

    // Attach event listeners to dynamically created elements
    function attachDynamicEventListeners() {
        document.querySelectorAll('.evaluate-btn').forEach(btn => {
            btn.addEventListener('click', openEvaluationModal);
        });
        
        document.querySelectorAll('.view-report-btn').forEach(btn => {
            btn.addEventListener('click', openReportModal);
        });
        
        document.querySelectorAll('.delete-evaluation-btn').forEach(btn => {
            btn.addEventListener('click', deleteEvaluation);
        });
        
        document.querySelectorAll('.delete-report-btn').forEach(btn => {
            btn.addEventListener('click', deleteReport);
        });
    }

    // Render courses checklist
    function renderCoursesChecklist() {
        coursesChecklist.innerHTML = '';
        courses.forEach(course => {
            const courseItem = document.createElement('div');
            courseItem.className = 'course-checkbox';
            courseItem.innerHTML = `
                <label>
                    <input type="checkbox" name="helpfulCourses" value="${course}">
                    ${course}
                </label>
            `;
            coursesChecklist.appendChild(courseItem);
        });
    }

    // Filter internships
    function filterInternships() {
        const searchText = searchInput.value.toLowerCase();
        const selectedStatus = filterStatus.value;
        const selectedDate = filterDate.value;

        const filtered = internships.filter(internship => {
            const matchesSearch = internship.title.toLowerCase().includes(searchText) ||
                               internship.company.toLowerCase().includes(searchText);
            
            const matchesStatus = selectedStatus === 'all' || 
                                (selectedStatus === 'current' && internship.status === 'current') ||
                                (selectedStatus === 'completed' && internship.status === 'completed');
            
            const matchesDate = selectedDate === 'all' || internship.year === selectedDate;

            return matchesSearch && matchesStatus && matchesDate;
        });

        renderInternships(filtered);
    }

    // Open evaluation modal
    function openEvaluationModal(e) {
        const internshipId = parseInt(e.target.getAttribute('data-internship-id'));
        const internship = internships.find(i => i.id === internshipId);
        
        if (!internship) return;
        
        document.getElementById('internshipId').value = internshipId;
        
        // Pre-fill form if evaluation exists
        if (internship.evaluation) {
            document.getElementById('overallRating').value = internship.evaluation.rating;
            document.getElementById('learningExperience').value = internship.evaluation.learningExperience;
            document.getElementById('supervisorSupport').value = internship.evaluation.supervisorSupport;
            document.getElementById('workEnvironment').value = internship.evaluation.workEnvironment;
            document.querySelector(`input[name="recommendToOthers"][value="${internship.evaluation.recommend}"]`).checked = true;
            document.getElementById('suggestions').value = internship.evaluation.suggestions || '';
            
            // Set star rating
            stars.forEach((star, index) => {
                if (index < internship.evaluation.rating) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
            
            // Check helpful courses
            document.querySelectorAll('input[name="helpfulCourses"]').forEach(checkbox => {
                checkbox.checked = internship.evaluation.helpfulCourses.includes(checkbox.value);
            });
        } else {
            // Reset form if no evaluation exists
            evaluationForm.reset();
            stars.forEach(star => {
                star.classList.remove('fas');
                star.classList.add('far');
            });
        }
        
        evaluationModal.style.display = 'flex';
    }

    // Handle evaluation form submission
    function handleEvaluationSubmit(e) {
        e.preventDefault();
        
        // Validate required fields
        const rating = document.getElementById('overallRating').value;
        const learningExp = document.getElementById('learningExperience').value;
        const supervisor = document.getElementById('supervisorSupport').value;
        const workEnv = document.getElementById('workEnvironment').value;
        const recommend = document.querySelector('input[name="recommendToOthers"]:checked');
        
        if (!rating || !learningExp || !supervisor || !workEnv || !recommend) {
            alert('Please fill all required fields');
            return;
        }
        
        const internshipId = parseInt(document.getElementById('internshipId').value);
        const internship = internships.find(i => i.id === internshipId);
        
        if (!internship) return;
        
        // Get selected courses
        const helpfulCourses = [];
        document.querySelectorAll('input[name="helpfulCourses"]:checked').forEach(checkbox => {
            helpfulCourses.push(checkbox.value);
        });
        
        // Create evaluation object
        const evaluationData = {
            rating: parseInt(rating),
            learningExperience: learningExp,
            supervisorSupport: supervisor,
            workEnvironment: workEnv,
            recommend: recommend.value,
            helpfulCourses: helpfulCourses,
            suggestions: document.getElementById('suggestions').value || ''
        };
        
        // Save evaluation
        internship.evaluation = evaluationData;
        
        // Update the UI
        renderInternships();
        
        // Hide evaluation modal and show success modal
        evaluationModal.style.display = 'none';
        showSuccessMessage('Evaluation ' + (evaluationData.rating ? 'updated' : 'submitted') + ' successfully!');
        
        // Reset form
        evaluationForm.reset();
        stars.forEach(star => {
            star.classList.remove('fas');
            star.classList.add('far');
        });
    }

    // Delete evaluation
    function deleteEvaluation(e) {
        const internshipId = parseInt(e.target.getAttribute('data-internship-id'));
        const internship = internships.find(i => i.id === internshipId);
        
        if (!internship || !internship.evaluation) return;
        
        if (confirm('Are you sure you want to delete this evaluation?')) {
            internship.evaluation = null;
            renderInternships();
            showSuccessMessage('Evaluation deleted successfully!');
        }
    }

    // Open report modal
    function openReportModal(e) {
        const internshipId = parseInt(e.target.getAttribute('data-internship-id'));
        const internship = internships.find(i => i.id === internshipId);
        
        if (!internship) return;
        
        if (internship.report) {
            // Display existing report
            reportContent.innerHTML = `
                <div class="report-details">
                    <h3>${internship.report.title}</h3>
                    <p><strong>Submitted on:</strong> ${internship.report.submittedDate}</p>
                    <div class="report-section">
                        <h4>Introduction</h4>
                        <p>${internship.report.intro}</p>
                    </div>
                    <div class="report-section">
                        <h4>Body</h4>
                        <p>${internship.report.body}</p>
                    </div>
                    <div class="report-section">
                        <h4>Conclusion</h4>
                        <p>${internship.report.conclusion}</p>
                    </div>
                    <div class="report-actions">
                        <button class="btn btn-primary edit-report-btn" data-internship-id="${internshipId}">Edit Report</button>
                    </div>
                </div>
            `;
            
            // Add event listener for edit button
            document.querySelector('.edit-report-btn')?.addEventListener('click', () => {
                showReportForm(internship);
            });
        } else {
            // Show form to create new report
            showReportForm(internship);
        }
        
        reportModal.style.display = 'flex';
    }

    // Show report form
    function showReportForm(internship) {
        reportContent.innerHTML = `
            <form id="reportForm">
                <input type="hidden" name="internshipId" value="${internship.id}">
                <div class="form-group">
                    <label for="reportTitle">Report Title:</label>
                    <input type="text" id="reportTitle" name="title" required value="${internship.report?.title || ''}">
                </div>
                <div class="form-group">
                    <label for="reportIntro">Introduction:</label>
                    <textarea id="reportIntro" name="intro" rows="4" required>${internship.report?.intro || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="reportBody">Body:</label>
                    <textarea id="reportBody" name="body" rows="8" required>${internship.report?.body || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="reportConclusion">Conclusion:</label>
                    <textarea id="reportConclusion" name="conclusion" rows="4" required>${internship.report?.conclusion || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">${internship.report ? 'Update Report' : 'Submit Report'}</button>
                    <button type="button" class="btn btn-secondary close-modal-btn">Cancel</button>
                </div>
            </form>
        `;
        
        // Add event listener for report submission
        document.getElementById('reportForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            // In a real app, you would send this to your backend
            internship.report = {
                title: formData.get('title'),
                intro: formData.get('intro'),
                body: formData.get('body'),
                conclusion: formData.get('conclusion'),
                submittedDate: new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })
            };
            
            // Update the UI
            renderInternships();
            reportModal.style.display = 'none';
            
            // Show success message
            showSuccessMessage(internship.report ? 'Report updated successfully!' : 'Report submitted successfully!');
        });
    }

    // Delete report
    function deleteReport(e) {
        const internshipId = parseInt(e.target.getAttribute('data-internship-id'));
        const internship = internships.find(i => i.id === internshipId);
        
        if (!internship || !internship.report) return;
        
        if (confirm('Are you sure you want to delete this report?')) {
            internship.report = null;
            renderInternships();
            showSuccessMessage('Report deleted successfully!');
        }
    }

    // Show success message
    function showSuccessMessage(message) {
        successModal.querySelector('h2').textContent = message;
        successModal.querySelector('p').textContent = 'Your changes have been saved successfully.';
        successModal.style.display = 'flex';
    }

    // Setup event listeners
    function setupEventListeners() {
        // Tab switching
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
        
        // Search and filter
        searchInput.addEventListener('input', filterInternships);
        filterStatus.addEventListener('change', filterInternships);
        filterDate.addEventListener('change', filterInternships);
        
        // Close modals
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                evaluationModal.style.display = 'none';
                reportModal.style.display = 'none';
            });
        });
        
        closeSuccessModalButton.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
        
        // Star rating
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = star.getAttribute('data-rating');
                document.getElementById('overallRating').value = rating;
                
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
        });
        
        // Evaluation form submission
        evaluationForm.addEventListener('submit', handleEvaluationSubmit);
        
        // Download as PDF
        downloadPdfBtn?.addEventListener('click', function() {
            alert('PDF download functionality would be implemented here.');
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === evaluationModal) {
                evaluationModal.style.display = 'none';
            }
            if (e.target === successModal) {
                successModal.style.display = 'none';
            }
            if (e.target === reportModal) {
                reportModal.style.display = 'none';
            }
        });
        
        // Attach event listeners to initial elements
        attachDynamicEventListeners();
    }

    // Initialize the application
    init();
});
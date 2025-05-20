document.addEventListener('DOMContentLoaded', function() {
    // Sample data for demonstration
    const applicationsData = {
        app1: {
            id: "app1",
            name: "Ahmed Mohamed",
            major: "Computer Science, German University in Cairo",
            email: "ahmed.mohamed@guc.edu.eg",
            position: "Frontend Developer",
            date: "October 15, 2023",
            status: "pending",
            coverLetter: "Dear Hiring Manager,\n\nI am excited to apply for the Frontend Developer position at your company. With 2 years of experience in React and modern JavaScript frameworks, I believe I can contribute significantly to your team.\n\nIn my previous role at TechStart Inc., I developed several responsive web applications that improved user engagement by 40%. I'm particularly proud of the e-commerce dashboard I built using React and Redux, which is now used by over 50,000 monthly active users.\n\nI would welcome the opportunity to discuss how my skills and experience align with your needs. Thank you for your time and consideration.",
            skills: ["HTML", "CSS", "JavaScript", "React", "Redux", "TypeScript"],
            documents: [
                { name: "Ahmed_Mohamed_CV.pdf", type: "pdf" },
                { name: "Transcript_2023.pdf", type: "pdf" },
                { name: "Portfolio.pdf", type: "pdf" }
            ]
        },
        app2: {
            id: "app2",
            name: "Mariam Ali",
            major: "Data Science, German University in Cairo",
            email: "mariam.ali@guc.edu.eg",
            position: "Data Science",
            date: "October 10, 2023",
            status: "accepted",
            coverLetter: "Dear Hiring Team,\n\nI am writing to express my interest in the Data Science internship position. As a recent graduate with a strong foundation in machine learning and statistical analysis, I'm eager to apply my skills in a real-world setting.\n\nDuring my academic projects, I developed predictive models for customer behavior analysis that achieved 85% accuracy. I'm proficient in Python, Pandas, and Scikit-learn, and I've completed several online courses in deep learning and big data processing.\n\nWhat excites me most about this opportunity is the chance to work with your team on challenging data problems while continuing to learn from experienced professionals.",
            skills: ["Python", "Machine Learning", "Pandas", "SQL", "TensorFlow", "Data Visualization"],
            documents: [
                { name: "Mariam_Ali_CV.pdf", type: "pdf" },
                { name: "Recommendation_Letter.pdf", type: "pdf" },
                { name: "Research_Paper.pdf", type: "pdf" }
            ]
        },
        app3: {
            id: "app3",
            name: "Omar Hassan",
            major: "Computer Engineering, German University in Cairo",
            email: "omar.hassan@guc.edu.eg",
            position: "Backend Developer",
            date: "September 20, 2023",
            status: "rejected",
            coverLetter: "To whom it may concern,\n\nI am thrilled to apply for the Backend Developer internship. With a solid background in system architecture and database design, I'm confident I can contribute to your backend infrastructure.\n\nI've developed several RESTful APIs using Node.js and Express, and have experience with both SQL and NoSQL databases. My most recent project involved building a scalable microservice architecture that handled up to 10,000 requests per minute.\n\nI'm particularly interested in this position because of your company's reputation for technical excellence and your use of cutting-edge technologies.",
            skills: ["Node.js", "Express", "MongoDB", "Docker", "AWS", "REST APIs"],
            documents: [
                { name: "Omar_Hassan_Resume.pdf", type: "pdf" },
                { name: "Transcript.pdf", type: "pdf" },
                { name: "Certification_AWS.pdf", type: "pdf" }
            ]
        }
    };

    // DOM elements
    const modal = document.getElementById('application-modal');
    const viewButtons = document.querySelectorAll('.btn-view');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const statusFilterBtns = document.querySelectorAll('.status-filter-btn');
    const applications = document.querySelectorAll('.application-card');
    const postFilter = document.getElementById('post-filter');
    const searchInput = document.getElementById('search-input');

    // Initialize application cards
    applications.forEach((card, index) => {
        const appId = card.dataset.id || `app${index + 1}`;
        card.dataset.id = appId;
        
        if (!applicationsData[appId]) {
            console.error(`No data found for application ${appId}`);
            return;
        }
        
        card.dataset.status = applicationsData[appId].status;
        card.dataset.post = applicationsData[appId].position.toLowerCase().replace(' ', '-');
        
        // Set initial status badge
        const statusBadge = card.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.className = `status-badge ${applicationsData[appId].status}`;
            statusBadge.textContent = applicationsData[appId].status.charAt(0).toUpperCase() + 
                                     applicationsData[appId].status.slice(1);
        }
    });

    // View application details
    function setupViewButton(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.application-card');
            const applicationId = card.dataset.id;
            const application = applicationsData[applicationId];
            
            console.log(`Viewing application ${applicationId}`);
            
            if (!application) {
                console.error(`Application data not found for ID: ${applicationId}`);
                return;
            }

            // Populate modal with application data
            document.getElementById('modal-name').textContent = application.name;
            document.getElementById('modal-major').textContent = application.major;
            document.getElementById('modal-email').textContent = application.email;
            document.getElementById('modal-position').textContent = application.position;
            document.getElementById('modal-date').textContent = application.date;
            document.getElementById('modal-cover-letter').textContent = application.coverLetter;
            
            // Update status badge in modal
            const statusBadge = document.getElementById('modal-status');
            if (statusBadge) {
                statusBadge.className = `status-badge ${application.status}`;
                statusBadge.textContent = application.status.charAt(0).toUpperCase() + application.status.slice(1);
            }
            
            // Populate skills
            const skillsContainer = document.getElementById('modal-skills');
            if (skillsContainer) {
                skillsContainer.innerHTML = '';
                application.skills.forEach(skill => {
                    const skillTag = document.createElement('span');
                    skillTag.className = 'skill-tag';
                    skillTag.textContent = skill;
                    skillsContainer.appendChild(skillTag);
                });
            }
            
            // Populate documents
            const documentsContainer = document.getElementById('modal-documents');
            if (documentsContainer) {
                documentsContainer.innerHTML = '';
                application.documents.forEach(doc => {
                    const docItem = document.createElement('div');
                    docItem.className = 'document-item';
                    docItem.innerHTML = `
                        <i class="fas fa-file-${doc.type}"></i>
                        <div class="document-info">
                            <span class="document-name">${doc.name}</span>
                        </div>
                        <button class="btn btn-sm btn-primary download-btn">
                            <i class="fas fa-download"></i> Download
                        </button>
                    `;
                    documentsContainer.appendChild(docItem);
                });
            }
            
            // Store current application ID in modal
            modal.dataset.currentApp = applicationId;
            
            // Show modal
            modal.style.display = 'block';
        });
    }

    // Close modal
    function setupCloseModalButtons() {
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        });
        
        // Close when clicking outside modal
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Status change functions
    function updateApplicationStatus(card, newStatus) {
        const applicationId = card.dataset.id;
        const statusBadge = card.querySelector('.status-badge');
        
        // Update UI
        card.dataset.status = newStatus;
        if (statusBadge) {
            statusBadge.className = `status-badge ${newStatus}`;
            statusBadge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        }
        
        // Update data
        if (applicationsData[applicationId]) {
            applicationsData[applicationId].status = newStatus;
        }
        
        // Update action buttons
        updateActionButtons(card, newStatus);
        
        console.log(`Status updated to ${newStatus} for ${applicationId}`);
    }

    function updateActionButtons(card, status) {
        const actionsContainer = card.querySelector('.application-actions');
        if (!actionsContainer) return;
        
        let buttonsHTML = `
            <button class="btn-action btn-view">
                <i class="fas fa-eye"></i> View
            </button>
        `;
        
        // Add buttons based on status
        if (status === 'pending') {
            buttonsHTML += `
                <button class="btn-action btn-accept">
                    <i class="fas fa-check"></i> Accept
                </button>
                <button class="btn-action btn-reject">
                    <i class="fas fa-times"></i> Reject
                </button>
                <button class="btn-action btn-finalize">
                    <i class="fas fa-check-double"></i> Finalize
                </button>
            `;
        } else if (status === 'accepted') {
            buttonsHTML += `
                <button class="btn-action btn-start">
                    <i class="fas fa-user-check"></i> Start
                </button>
            `;
        } else if (status === 'current') {
            buttonsHTML += `
                <button class="btn-action btn-complete">
                    <i class="fas fa-graduation-cap"></i> Complete
                </button>
            `;
        }
        
        actionsContainer.innerHTML = buttonsHTML;
        attachButtonListeners(card);
    }

    function attachButtonListeners(card) {
        // View button
        card.querySelector('.btn-view')?.addEventListener('click', function(e) {
            e.preventDefault();
            setupViewButton(this);
            this.click();
        });
        
        // Accept button
        card.querySelector('.btn-accept')?.addEventListener('click', function(e) {
            e.preventDefault();
            updateApplicationStatus(card, 'accepted');
            alert('Application accepted!');
        });
        
        // Reject button
        card.querySelector('.btn-reject')?.addEventListener('click', function(e) {
            e.preventDefault();
            updateApplicationStatus(card, 'rejected');
            alert('Application rejected.');
        });
        
        // Finalize button
        card.querySelector('.btn-finalize')?.addEventListener('click', function(e) {
            e.preventDefault();
            updateApplicationStatus(card, 'finalized');
            alert('Application finalized.');
        });
        
        // Start button
        card.querySelector('.btn-start')?.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Move this applicant to Current Interns?')) {
                updateApplicationStatus(card, 'current');
                alert('Applicant moved to Current Interns');
            }
        });
        
        // Complete button
        card.querySelector('.btn-complete')?.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Mark this internship as completed?')) {
                updateApplicationStatus(card, 'completed');
                alert('Internship marked as completed');
            }
        });
        
        // Message button
        card.querySelector('.btn-message')?.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Message feature coming soon!');
        });
        
        // Feedback button
        card.querySelector('.btn-feedback')?.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Feedback feature coming soon!');
        });
    }

    // Modal action buttons
    function setupModalActions() {
        document.getElementById('modal-accept-btn')?.addEventListener('click', function(e) {
            e.preventDefault();
            const card = document.querySelector(`.application-card[data-id="${modal.dataset.currentApp}"]`);
            updateApplicationStatus(card, 'accepted');
            modal.style.display = 'none';
            alert('Application accepted!');
        });
        
        document.getElementById('modal-reject-btn')?.addEventListener('click', function(e) {
            e.preventDefault();
            const card = document.querySelector(`.application-card[data-id="${modal.dataset.currentApp}"]`);
            updateApplicationStatus(card, 'rejected');
            modal.style.display = 'none';
            alert('Application rejected.');
        });
        
        document.getElementById('modal-finalize-btn')?.addEventListener('click', function(e) {
            e.preventDefault();
            const card = document.querySelector(`.application-card[data-id="${modal.dataset.currentApp}"]`);
            updateApplicationStatus(card, 'finalized');
            modal.style.display = 'none';
            alert('Application finalized.');
        });
        
        document.getElementById('modal-start-btn')?.addEventListener('click', function(e) {
            e.preventDefault();
            const card = document.querySelector(`.application-card[data-id="${modal.dataset.currentApp}"]`);
            if (confirm('Move this applicant to Current Interns?')) {
                updateApplicationStatus(card, 'current');
                modal.style.display = 'none';
                alert('Applicant moved to Current Interns');
            }
        });
        
        document.getElementById('modal-complete-btn')?.addEventListener('click', function(e) {
            e.preventDefault();
            const card = document.querySelector(`.application-card[data-id="${modal.dataset.currentApp}"]`);
            if (confirm('Mark this internship as completed?')) {
                updateApplicationStatus(card, 'completed');
                modal.style.display = 'none';
                alert('Internship marked as completed');
            }
        });
    }

    // Filter applications by status
    function setupStatusFilters() {
        statusFilterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                statusFilterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const status = this.dataset.status;
                
                applications.forEach(app => {
                    const appStatus = app.dataset.status;
                    
                    if(status === 'all' || appStatus === status) {
                        app.style.display = 'block';
                    } else {
                        app.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Filter by internship post
    function setupPostFilter() {
        if (postFilter) {
            postFilter.addEventListener('change', function() {
                const selectedPost = this.value.toLowerCase();
                
                applications.forEach(app => {
                    const appPost = app.dataset.post ? app.dataset.post.toLowerCase() : '';
                    
                    if (selectedPost === 'all' || appPost.includes(selectedPost)) {
                        app.style.display = 'block';
                    } else {
                        app.style.display = 'none';
                    }
                });
            });
        }
    }
    
    // Search functionality
    function setupSearch() {
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                
                applications.forEach(app => {
                    const applicantName = app.querySelector('.applicant-name')?.textContent.toLowerCase() || '';
                    const applicantProgram = app.querySelector('.applicant-program')?.textContent.toLowerCase() || '';
                    const applicantEmail = app.querySelector('.application-meta span:nth-child(3)')?.textContent.toLowerCase() || '';
                    
                    if(searchTerm === '' || 
                       applicantName.includes(searchTerm) || 
                       applicantProgram.includes(searchTerm) || 
                       applicantEmail.includes(searchTerm)) {
                        app.style.display = 'block';
                    } else {
                        app.style.display = 'none';
                    }
                });
            });
        }
    }

    // Initialize all functionality
    function initialize() {
        // Setup view buttons
        viewButtons.forEach(button => {
            setupViewButton(button);
        });
        
        // Setup close modal buttons
        setupCloseModalButtons();
        
        // Initialize button listeners for all cards
        applications.forEach(card => {
            attachButtonListeners(card);
            updateActionButtons(card, card.dataset.status);
        });
        
        // Setup modal actions
        setupModalActions();
        
        // Setup filters
        setupStatusFilters();
        setupPostFilter();
        setupSearch();
        
        console.log('Application system initialized');
    }

    // Start the application
    initialize();
});
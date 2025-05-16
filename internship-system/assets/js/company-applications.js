// applications.js
document.addEventListener('DOMContentLoaded', function() {
    // Filter applications by status
    const statusFilterBtns = document.querySelectorAll('.status-filter-btn');
    const applications = document.querySelectorAll('.applications-table tbody tr');
    
    statusFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            statusFilterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const status = this.dataset.status;
            
            // Filter applications
            applications.forEach(app => {
                const appStatus = app.querySelector('.status-badge').className.replace('status-badge ', '');
                
                if (status === 'all' || appStatus === status) {
                    app.style.display = '';
                } else {
                    app.style.display = 'none';
                }
            });
        });
    });
    
    // Filter by internship post
    const postFilter = document.getElementById('post-filter');
    if (postFilter) {
        postFilter.addEventListener('change', function() {
            const selectedPost = this.value.toLowerCase();
            
            applications.forEach(app => {
                const appPost = app.querySelector('td:nth-child(2)').textContent.toLowerCase();
                
                if (selectedPost === 'all' || appPost.includes(selectedPost)) {
                    app.style.display = '';
                } else {
                    app.style.display = 'none';
                }
            });
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            applications.forEach(app => {
                const applicantName = app.querySelector('.applicant-name').textContent.toLowerCase();
                const applicantMeta = app.querySelector('.applicant-meta').textContent.toLowerCase();
                const appPost = app.querySelector('td:nth-child(2)').textContent.toLowerCase();
                
                if (applicantName.includes(searchTerm) || 
                    applicantMeta.includes(searchTerm) || 
                    appPost.includes(searchTerm)) {
                    app.style.display = '';
                } else {
                    app.style.display = 'none';
                }
            });
        });
    }
    
    // Initialize DataTables if needed
    if ($.fn.DataTable) {
        $('.applications-table').DataTable({
            responsive: true,
            dom: '<"top"f>rt<"bottom"lip><"clear">',
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Search applications..."
            }
        });
    }
    
    // Status change actions
    document.querySelectorAll('.accept-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const statusBadge = row.querySelector('.status-badge');
            
            statusBadge.className = 'status-badge accepted';
            statusBadge.textContent = 'Accepted';
            
            // Here you would add AJAX call to update status in backend
            alert('Application status changed to Accepted');
        });
    });
    
    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const statusBadge = row.querySelector('.status-badge');
            
            statusBadge.className = 'status-badge rejected';
            statusBadge.textContent = 'Rejected';
            
            // Here you would add AJAX call to update status in backend
            alert('Application status changed to Rejected');
        });
    });
    
    document.querySelectorAll('.finalize-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const statusBadge = row.querySelector('.status-badge');
            
            statusBadge.className = 'status-badge finalized';
            statusBadge.textContent = 'Finalized';
            
            // Here you would add AJAX call to update status in backend
            alert('Application status changed to Finalized');
        });
    });
});
// applications.js
document.addEventListener('DOMContentLoaded', function() {
    // Sample data for demonstration
    const applicationsData = {
        app1: {
            name: "Ahmed Mohamed",
            major: "Computer Science, German University in Cairo",
            email: "ahmed.mohamed@guc.edu.eg",
            position: "Frontend Developer",
            date: "October 15, 2023",
            status: "pending",
            coverLetter: "Dear Hiring Manager,\n\nI am excited to apply for the Frontend Developer position...",
            skills: ["HTML", "CSS", "JavaScript", "React"],
            documents: [
                { name: "Ahmed_Mohamed_CV.pdf", type: "pdf" },
                { name: "Transcript_2023.pdf", type: "pdf" }
            ]
        },
        app2: {
            name: "Mariam Ali",
            major: "Data Science, German University in Cairo",
            email: "mariam.ali@guc.edu.eg",
            position: "Data Science",
            date: "October 10, 2023",
            status: "accepted",
            coverLetter: "Dear Hiring Team,\n\nI am writing to express my interest in...",
            skills: ["Python", "Machine Learning", "Pandas", "SQL"],
            documents: [
                { name: "Mariam_Ali_CV.pdf", type: "pdf" },
                { name: "Recommendation_Letter.pdf", type: "pdf" }
            ]
        },
        app3: {
            name: "Omar Hassan",
            major: "Computer Engineering, German University in Cairo",
            email: "omar.hassan@guc.edu.eg",
            position: "Backend Developer",
            date: "September 20, 2023",
            status: "current",
            coverLetter: "To whom it may concern,\n\nI am thrilled to apply for...",
            skills: ["Node.js", "Python", "Django", "MySQL"],
            documents: [
                { name: "Omar_Hassan_Resume.pdf", type: "pdf" },
                { name: "Portfolio.pdf", type: "pdf" }
            ]
        }
    };

    // DOM elements
    const modal = document.getElementById('application-modal');
    const viewButtons = document.querySelectorAll('.view-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const statusFilterBtns = document.querySelectorAll('.status-filter-btn');
    const applications = document.querySelectorAll('.applications-table tbody tr');
    const postFilter = document.getElementById('post-filter');
    const searchInput = document.getElementById('search-input');

    // View application details
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const applicationId = this.closest('tr').dataset.id;
            const application = applicationsData[applicationId];
            
            // Populate modal with application data
            document.getElementById('modal-avatar').src = this.closest('tr').querySelector('.applicant-avatar').src;
            document.getElementById('modal-name').textContent = application.name;
            document.getElementById('modal-major').textContent = application.major;
            document.getElementById('modal-email').innerHTML = `<i class="fas fa-envelope"></i> ${application.email}`;
            document.getElementById('modal-position').textContent = application.position;
            document.getElementById('modal-date').textContent = application.date;
            document.getElementById('modal-cover-letter').textContent = application.coverLetter;
            
            // Update status badge
            const statusBadge = document.getElementById('modal-status');
            statusBadge.className = `status-badge ${application.status}`;
            statusBadge.textContent = application.status.charAt(0).toUpperCase() + application.status.slice(1);
            
            // Populate skills
            const skillsContainer = document.getElementById('modal-skills');
            skillsContainer.innerHTML = '';
            application.skills.forEach(skill => {
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.textContent = skill;
                skillsContainer.appendChild(skillTag);
            });
            
            // Populate documents
            const documentsContainer = document.getElementById('modal-documents');
            documentsContainer.innerHTML = '';
            application.documents.forEach(doc => {
                const docItem = document.createElement('div');
                docItem.className = 'document-item';
                docItem.innerHTML = `
                    <i class="fas fa-file-${doc.type}"></i>
                    <div class="document-info">
                        <span class="document-name">${doc.name}</span>
                    </div>
                    <button class="btn btn-sm btn-primary"><i class="fas fa-download"></i> Download</button>
                `;
                documentsContainer.appendChild(docItem);
            });
            
            // Show appropriate action buttons based on status
            document.getElementById('modal-start-btn').style.display = application.status === 'accepted' ? 'block' : 'none';
            document.getElementById('modal-complete-btn').style.display = application.status === 'current' ? 'block' : 'none';
            
            // Show modal
            modal.style.display = 'block';
        });
    });

    // Close modal
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    });

    // Status change actions (table buttons)
    document.querySelectorAll('.accept-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            updateApplicationStatus(this, 'accepted');
        });
    });
    
    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            updateApplicationStatus(this, 'rejected');
        });
    });
    
    document.querySelectorAll('.finalize-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            updateApplicationStatus(this, 'finalized');
        });
    });
    
    // Start internship
    document.querySelectorAll('.start-internship-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if(confirm('Move this applicant to Current Interns?')) {
                updateApplicationStatus(this, 'current');
                alert('Applicant moved to Current Interns');
            }
        });
    });
    
    // Complete internship
    document.querySelectorAll('.complete-internship-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if(confirm('Mark this internship as completed?')) {
                updateApplicationStatus(this, 'completed');
                alert('Internship marked as completed');
            }
        });
    });

    // Modal action buttons
    document.getElementById('modal-accept-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        updateModalStatus('accepted');
    });
    
    document.getElementById('modal-reject-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        updateModalStatus('rejected');
    });
    
    document.getElementById('modal-finalize-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        updateModalStatus('finalized');
    });
    
    document.getElementById('modal-start-btn')?.addEventListener('click', function() {
        if(confirm('Move this applicant to Current Interns?')) {
            updateModalStatus('current');
            alert('Applicant moved to Current Interns');
            modal.style.display = 'none';
        }
    });
    
    document.getElementById('modal-complete-btn')?.addEventListener('click', function() {
        if(confirm('Mark this internship as completed?')) {
            updateModalStatus('completed');
            alert('Internship marked as completed');
            modal.style.display = 'none';
        }
    });

    // Filter applications by status
    statusFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            statusFilterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const status = this.dataset.status;
            
            applications.forEach(app => {
                const appStatus = app.dataset.status;
                
                if(status === 'all' || appStatus === status) {
                    app.style.display = '';
                } else {
                    app.style.display = 'none';
                }
            });
        });
    });
    
    // Filter by internship post
    if (postFilter) {
        postFilter.addEventListener('change', function() {
            const selectedPost = this.value.toLowerCase();
            
            applications.forEach(app => {
                const appPost = app.dataset.post;
                
                if(selectedPost === 'all' || appPost.includes(selectedPost)) {
                    app.style.display = '';
                } else {
                    app.style.display = 'none';
                }
            });
        });
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            applications.forEach(app => {
                const applicantName = app.querySelector('.applicant-name').textContent.toLowerCase();
                const applicantMeta = app.querySelector('.applicant-meta').textContent.toLowerCase();
                const appPost = app.querySelector('td:nth-child(2)').textContent.toLowerCase();
                
                if(applicantName.includes(searchTerm) || 
                   applicantMeta.includes(searchTerm) || 
                   appPost.includes(searchTerm)) {
                    app.style.display = '';
                } else {
                    app.style.display = 'none';
                }
            });
        });
    }

    // Helper function to update application status
    function updateApplicationStatus(element, newStatus) {
        const row = element.closest('tr');
        const statusBadge = row.querySelector('.status-badge');
        const appId = row.dataset.id;
        
        // Update data attribute
        row.dataset.status = newStatus;
        
        // Update status badge
        statusBadge.className = `status-badge ${newStatus}`;
        statusBadge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).replace('-', ' ');
        
        // Update action buttons
        const actionsCell = row.querySelector('.actions-cell');
        actionsCell.innerHTML = '';
        
        if(newStatus === 'accepted') {
            actionsCell.innerHTML = `
                <button class="btn btn-sm btn-primary view-btn">View</button>
                <button class="btn btn-sm btn-success start-internship-btn"><i class="fas fa-user-check"></i> Start</button>
            `;
            // Add event listeners to new buttons
            actionsCell.querySelector('.view-btn').addEventListener('click', function() {
                document.querySelector(`tr[data-id="${appId}"] .view-btn`).click();
            });
            actionsCell.querySelector('.start-internship-btn').addEventListener('click', function() {
                if(confirm('Move this applicant to Current Interns?')) {
                    updateApplicationStatus(this, 'current');
                    alert('Applicant moved to Current Interns');
                }
            });
        } else if(newStatus === 'current') {
            actionsCell.innerHTML = `
                <button class="btn btn-sm btn-primary view-btn">View</button>
                <button class="btn btn-sm btn-warning complete-internship-btn"><i class="fas fa-graduation-cap"></i> Complete</button>
            `;
            // Add event listeners to new buttons
            actionsCell.querySelector('.view-btn').addEventListener('click', function() {
                document.querySelector(`tr[data-id="${appId}"] .view-btn`).click();
            });
            actionsCell.querySelector('.complete-internship-btn').addEventListener('click', function() {
                if(confirm('Mark this internship as completed?')) {
                    updateApplicationStatus(this, 'completed');
                    alert('Internship marked as completed');
                }
            });
        } else {
            actionsCell.innerHTML = `
                <button class="btn btn-sm btn-primary view-btn">View</button>
                <div class="dropdown">
                    <button class="btn btn-sm btn-secondary dropdown-toggle">Actions</button>
                    <div class="dropdown-menu">
                        <a href="#" class="dropdown-item accept-btn"><i class="fas fa-check"></i> Accept</a>
                        <a href="#" class="dropdown-item reject-btn"><i class="fas fa-times"></i> Reject</a>
                        <a href="#" class="dropdown-item finalize-btn"><i class="fas fa-check-double"></i> Finalize</a>
                    </div>
                </div>
            `;
            // Add event listeners to new buttons
            actionsCell.querySelector('.view-btn').addEventListener('click', function() {
                document.querySelector(`tr[data-id="${appId}"] .view-btn`).click();
            });
            actionsCell.querySelector('.accept-btn').addEventListener('click', function(e) {
                e.preventDefault();
                updateApplicationStatus(this, 'accepted');
            });
            actionsCell.querySelector('.reject-btn').addEventListener('click', function(e) {
                e.preventDefault();
                updateApplicationStatus(this, 'rejected');
            });
            actionsCell.querySelector('.finalize-btn').addEventListener('click', function(e) {
                e.preventDefault();
                updateApplicationStatus(this, 'finalized');
            });
        }
        
        // Update data object
        applicationsData[appId].status = newStatus;
        
        alert(`Application status changed to ${newStatus}`);
    }

    // Helper function to update status from modal
    function updateModalStatus(newStatus) {
        const appId = document.querySelector('.modal-content.wide-modal').getAttribute('data-app-id');
        const row = document.querySelector(`tr[data-id="${appId}"]`);
        
        if(row) {
            // Simulate click on the corresponding button in the table
            if(newStatus === 'accepted') {
                row.querySelector('.accept-btn').click();
            } else if(newStatus === 'rejected') {
                row.querySelector('.reject-btn').click();
            } else if(newStatus === 'finalized') {
                row.querySelector('.finalize-btn').click();
            } else if(newStatus === 'current') {
                row.querySelector('.start-internship-btn').click();
            } else if(newStatus === 'completed') {
                row.querySelector('.complete-internship-btn').click();
            }
        }
        
        // Update modal status badge
        const statusBadge = document.getElementById('modal-status');
        statusBadge.className = `status-badge ${newStatus}`;
        statusBadge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).replace('-', ' ');
        
        // Show appropriate action buttons
        document.getElementById('modal-start-btn').style.display = newStatus === 'accepted' ? 'block' : 'none';
        document.getElementById('modal-complete-btn').style.display = newStatus === 'current' ? 'block' : 'none';
    }
});
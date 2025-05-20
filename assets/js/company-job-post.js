document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const jobPostsTable = document.querySelector('.job-posts-table tbody');
    const newInternshipBtn = document.getElementById('new-internship-btn');
    const newInternshipModal = document.getElementById('new-internship-modal');
    const viewJobModal = document.getElementById('view-job-modal');
    const internshipForm = document.getElementById('internship-form');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const searchInput = document.querySelector('.search-box input');
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    
    // Enhanced Sample Data
    let jobPosts = [
        {
            id: 1,
            title: "Frontend Developer Intern",
            type: "Paid",
            duration: "3 months",
            applications: 15,
            status: "active",
            postedDate: "2023-10-10",
            salary: 800,
            skills: "HTML, CSS, JavaScript, React",
            description: "We are looking for a frontend developer intern to join our team..."
        },
        {
            id: 2,
            title: "Data Science Intern",
            type: "Paid",
            duration: "6 months",
            applications: 24,
            status: "active",
            postedDate: "2023-09-25",
            salary: 1000,
            skills: "Python, Pandas, NumPy, Machine Learning",
            description: "Join our data science team to work on real-world datasets..."
        },
        {
            id: 3,
            title: "Backend Developer Intern",
            type: "Unpaid",
            duration: "3 months",
            applications: 8,
            status: "closed",
            postedDate: "2023-08-15",
            salary: 0,
            skills: "Node.js, Express, MongoDB",
            description: "Opportunity to work on our backend infrastructure..."
        },
        {
            id: 4,
            title: "UX/UI Design Intern",
            type: "Paid",
            duration: "4 months",
            applications: 0,
            status: "draft",
            postedDate: "2023-10-18",
            salary: 700,
            skills: "Figma, Adobe XD, User Research",
            description: "Help design intuitive user interfaces for our products..."
        }
    ];

    // Initialize the page
    function init() {
        renderJobPosts();
        setupEventListeners();
        setupFilterListeners();
        
        // Convert static HTML rows to data objects
        convertStaticRowsToData();
    }

    // Set up filter event listeners
    function setupFilterListeners() {
        searchInput.addEventListener('input', filterJobPosts);
        statusFilter.addEventListener('change', filterJobPosts);
        dateFilter.addEventListener('change', sortJobPosts);
    }

    // Filter job posts based on search and filters
    function filterJobPosts() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        
        const filteredJobs = jobPosts.filter(job => {
            // Search term matching
            const matchesSearch = searchTerm === '' || 
                                job.title.toLowerCase().includes(searchTerm);
            
            // Status filter matching
            const matchesStatus = statusValue === '' || 
                                job.status === statusValue;
            
            return matchesSearch && matchesStatus;
        });
        
        renderJobPosts(filteredJobs);
    }

    // Sort job posts by date
    function sortJobPosts() {
        const sortValue = dateFilter.value;
        let sortedJobs = [...jobPosts];
        
        if (sortValue === 'newest') {
            sortedJobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        } else if (sortValue === 'oldest') {
            sortedJobs.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
        }
        
        renderJobPosts(sortedJobs);
    }

    // Convert existing HTML table rows to data objects
    function convertStaticRowsToData() {
        const rows = jobPostsTable.querySelectorAll('tr');
        rows.forEach(row => {
            if (!row.dataset.id) { // Skip if already has data-id
                const cells = row.cells;
                const existingJob = {
                    id: jobPosts.length + 1,
                    title: cells[0].textContent,
                    type: cells[1].textContent,
                    duration: cells[2].textContent,
                    applications: parseInt(cells[3].textContent),
                    status: cells[4].querySelector('.status-badge').textContent.toLowerCase(),
                    postedDate: cells[5].textContent,
                    salary: cells[1].textContent === 'Paid' ? 800 : 0,
                    skills: "Sample skills",
                    description: "Sample description"
                };
                jobPosts.push(existingJob);
                row.dataset.id = existingJob.id;
            }
        });
        renderJobPosts(); // Re-render with all jobs
    }

    // Render job posts to the table
    function renderJobPosts(jobs = jobPosts) {
        jobPostsTable.innerHTML = '';
        
        jobs.forEach(job => {
            const row = document.createElement('tr');
            row.dataset.id = job.id;
            row.innerHTML = `
                <td>${job.title}</td>
                <td>${job.type}</td>
                <td>${job.duration}</td>
                <td>${job.applications}</td>
                <td><span class="status-badge ${job.status}">${job.status.charAt(0).toUpperCase() + job.status.slice(1)}</span></td>
                <td>${job.postedDate}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-view">View</button>
                    <button class="btn btn-sm btn-secondary btn-edit">Edit</button>
                    <button class="btn btn-sm btn-danger btn-delete">Delete</button>
                </td>
            `;
            jobPostsTable.appendChild(row);
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // New internship button
        newInternshipBtn.addEventListener('click', () => {
            document.getElementById('job-id').value = ''; // Clear ID for new posts
            internshipForm.reset();
            newInternshipModal.style.display = 'flex';
        });

        // Form submission
        internshipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveJobPost();
        });

        // Table actions (using event delegation)
        jobPostsTable.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (!row || !row.dataset.id) return;
            
            const jobId = parseInt(row.dataset.id);
            const job = jobPosts.find(j => j.id === jobId);
            
            if (!job) return;
            
            if (e.target.classList.contains('btn-view')) {
                openViewModal(job);
            } 
            else if (e.target.classList.contains('btn-edit')) {
                openEditModal(job);
            }
            else if (e.target.classList.contains('btn-delete')) {
                deleteJobPost(jobId);
            }
        });

        // Close modals
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });
    }

    // Open view modal
    function openViewModal(job) {
        // Populate view modal with job data
        const modal = document.getElementById('view-job-modal');
        modal.querySelector('h3').textContent = job.title;
        
        // Update details section
        const details = modal.querySelector('.job-details');
        details.innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value"><span class="status-badge ${job.status}">${job.status.charAt(0).toUpperCase() + job.status.slice(1)}</span></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Posted on:</span>
                <span class="detail-value">${formatDate(job.postedDate)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${job.duration}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Type:</span>
                <span class="detail-value">${job.type}${job.type === 'Paid' ? ` (${job.salary} EGP/month)` : ''}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Applications:</span>
                <span class="detail-value">${job.applications}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Skills Required:</span>
                <span class="detail-value">${job.skills}</span>
            </div>
        `;
        
        // Update description section
        const description = modal.querySelector('.job-description');
        description.querySelector('p').textContent = job.description;
        
        modal.style.display = 'flex';
    }

    // Format date for display
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Open edit modal
    function openEditModal(job) {
        document.getElementById('job-title').value = job.title;
        document.getElementById('duration').value = parseInt(job.duration);
        document.getElementById('internship-type').value = job.type.toLowerCase();
        document.getElementById('salary').value = job.salary;
        document.getElementById('skills').value = job.skills;
        document.getElementById('description').value = job.description;
        document.getElementById('job-id').value = job.id;
        
        document.querySelector('#new-internship-modal h3').textContent = 'Edit Internship Post';
        newInternshipModal.style.display = 'flex';
    }

    // Save job post (create or update)
    function saveJobPost() {
        const jobId = document.getElementById('job-id').value;
        const title = document.getElementById('job-title').value;
        const duration = document.getElementById('duration').value;
        const type = document.getElementById('internship-type').value;
        const salary = document.getElementById('salary').value;
        const skills = document.getElementById('skills').value;
        const description = document.getElementById('description').value;
        
        const jobData = {
            id: jobId ? parseInt(jobId) : jobPosts.length + 1,
            title: title,
            type: type === 'paid' ? 'Paid' : 'Unpaid',
            duration: `${duration} months`,
            applications: jobId ? jobPosts.find(j => j.id === parseInt(jobId))?.applications || 0 : 0,
            status: jobId ? jobPosts.find(j => j.id === parseInt(jobId))?.status || 'active' : 'active',
            postedDate: jobId ? jobPosts.find(j => j.id === parseInt(jobId))?.postedDate : new Date().toISOString().split('T')[0],
            salary: parseInt(salary) || 0,
            skills: skills,
            description: description
        };
        
        if (jobId) {
            // Update existing job
            const index = jobPosts.findIndex(j => j.id === parseInt(jobId));
            if (index !== -1) {
                jobPosts[index] = jobData;
            }
        } else {
            // Add new job
            jobPosts.unshift(jobData);
        }
        
        newInternshipModal.style.display = 'none';
        renderJobPosts();
    }

    // Delete job post
    function deleteJobPost(jobId) {
        if (confirm('Are you sure you want to delete this job post?')) {
            jobPosts = jobPosts.filter(job => job.id !== jobId);
            renderJobPosts();
        }
    }

    // Initialize the page
    init();
});
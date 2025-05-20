document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('report-search');
    const statusFilter = document.getElementById('status-filter');
    const majorFilter = document.getElementById('major-filter');
    const cycleFilter = document.getElementById('cycle-filter');
    const resetBtn = document.getElementById('reset-filters');
    const reportsTable = document.getElementById('reports-table');
    const tbody = reportsTable.querySelector('tbody');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const refreshBtn = document.getElementById('refresh-reports-btn');
    const exportBtn = document.getElementById('export-reports-btn');
    const generateReportBtn = document.getElementById('generate-report-btn');
    
    const modal = document.getElementById('report-details-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Report data and pagination
    let currentReportId = null;
    let currentAction = null;
    let allReports = [];
    let filteredReports = [];
    const reportsPerPage = 10;
    let currentPage = 1;
    let totalPages = 1;

    // Sample report data
    const sampleReports = [
        {
            id: 1,
            studentName: "Ahmed Mohamed",
            studentId: "1001",
            major: "Computer Science",
            advisor: "Dr. Mohamed ElSayed",
            email: "ahmed.mohamed@student.guc.edu.eg",
            phone: "+201234567890",
            company: "Tech Solutions Inc.",
            position: "Software Developer Intern",
            startDate: "2024-06-01",
            endDate: "2024-08-31",
            supervisor: "John Smith",
            supervisorEmail: "john.smith@techsolutions.com",
            cycle: "Summer 2024",
            status: "pending",
            submitted: "2024-09-15",
            grade: "-",
            score: "85/100",
            reportContent: `<h5>1. Introduction</h5>
                <p>During my internship at Tech Solutions Inc., I worked as a Software Developer Intern in the web development team. The internship lasted for 12 weeks from June to August 2023. My main responsibilities included developing front-end components using React and assisting with backend API integration.</p>`,
            evaluationContent: `<h5>Company Evaluation</h5>
                <p><strong>Overall Performance:</strong> Excellent</p>
                <p><strong>Technical Skills:</strong> 9/10</p>
                <p><strong>Problem Solving:</strong> 8/10</p>
                <p><strong>Communication:</strong> 8/10</p>`,
            attachments: [
                { name: "Final_Report.pdf", type: "pdf" },
                { name: "Presentation_Slides.pptx", type: "presentation" }
            ]
        },
        {
            id: 2,
            studentName: "Mariam Hassan",
            studentId: "1002",
            major: "Business",
            advisor: "Dr. Ahmed Khalil",
            email: "mariam.hassan@student.guc.edu.eg",
            phone: "+201112223344",
            company: "Global Finance Corp",
            position: "Financial Analyst Intern",
            startDate: "2023-07-01",
            endDate: "2023-08-31",
            supervisor: "Sarah Johnson",
            supervisorEmail: "sarah.johnson@globalfinance.com",
            cycle: "Summer 2023",
            status: "accepted",
            submitted: "2023-09-10",
            grade: "A",
            score: "92/100",
            reportContent: `<h5>1. Introduction</h5>
                <p>My internship at Global Finance Corp as a Financial Analyst Intern provided me with valuable insights into the world of corporate finance.</p>`,
            evaluationContent: `<h5>Company Evaluation</h5>
                <p><strong>Overall Performance:</strong> Outstanding</p>
                <p><strong>Analytical Skills:</strong> 10/10</p>`,
            attachments: [
                { name: "Financial_Report.pdf", type: "pdf" }
            ]
        },
        {
            id: 3,
            studentName: "Omar Farouk",
            studentId: "1003",
            major: "Engineering",
            advisor: "Dr. Hany Kamal",
            email: "omar.farouk@student.guc.edu.eg",
            phone: "+201001122334",
            company: "Egyptian Engineering Group",
            position: "Civil Engineering Intern",
            startDate: "2024-01-15",
            endDate: "2024-02-28",
            supervisor: "Mohamed Ali",
            supervisorEmail: "m.ali@eeg-eg.com",
            cycle: "Winter 2024",
            status: "flagged",
            submitted: "2024-03-10",
            grade: "C",
            score: "65/100",
            reportContent: `<h5>1. Introduction</h5>
                <p>My internship at Egyptian Engineering Group provided hands-on experience in civil engineering projects.</p>`,
            evaluationContent: `<h5>Company Evaluation</h5>
                <p><strong>Overall Performance:</strong> Needs Improvement</p>`,
            attachments: [],
            comments: [
                {
                    author: "SCAD Office",
                    date: "2023-06-15 14:30",
                    text: "This report was flagged because the weekly hours reported don't match the company's records."
                },
                {
                    author: "Faculty Advisor",
                    date: "2023-06-18 09:15",
                    text: "Student has been notified to provide clarification on the hours discrepancy."
                }
            ]
        }
    ];

    // Initialize the page
    function init() {
        allReports = [...sampleReports];
        filteredReports = [...allReports];

        // Initialize charts and statistics
        initMiniCharts();
        initCycleStatistics();
        
        // Initialize the table
        filterReports();
        updatePagination();
        
        // Add event listeners
        setupEventListeners();
    }

    // Initialize mini charts
    function initMiniCharts() {
        window.miniStatusChart = new Chart(
            document.getElementById('miniStatusChart'),
            { 
                type: 'doughnut',
                data: getMiniStatusData(),
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    }
                }
            }
        );
    }

    // Initialize cycle statistics
    function initCycleStatistics() {
        const statsCycleFilter = document.getElementById('stats-cycle-filter');
        if (statsCycleFilter) {
            statsCycleFilter.addEventListener('change', function() {
                const cycle = this.value;
                updateStatusStatistics(cycle);
                updateTopCompanies(cycle);
                updateQuickStats(cycle);
                
                // Update cycle title indicators
                const cycleTitle = cycle === 'all' ? '' : `(${cycle})`;
                document.getElementById('cycle-stats-title').textContent = cycleTitle;
            });
        }
        updateStatusStatistics('all');
        updateTopCompanies('all');
        updateQuickStats('all');
    }

    // Update mini statistics
    function updateMiniStatistics() {
        window.miniStatusChart.data = getMiniStatusData();
        window.miniStatusChart.update();
        
        // Update top companies
        updateMiniTopCompanies();
        
        // Update quick stats
        updateQuickStats();
    }

    // Get status data for chart
    function getMiniStatusData() {
        const counts = {
            accepted: allReports.filter(r => r.status === 'accepted').length,
            pending: allReports.filter(r => r.status === 'pending').length,
            flagged: allReports.filter(r => r.status === 'flagged').length,
            rejected: allReports.filter(r => r.status === 'rejected').length
        };
        
        // Update summary numbers
        document.getElementById('mini-accepted-count').textContent = counts.accepted;
        document.getElementById('mini-pending-count').textContent = counts.pending;
        document.getElementById('mini-flagged-count').textContent = counts.flagged;
        document.getElementById('mini-rejected-count').textContent = counts.rejected;
        document.getElementById('total-reports').textContent = allReports.length;
        
        return {
            labels: ['Accepted', 'Pending', 'Flagged', 'Rejected'],
            datasets: [{
                data: [counts.accepted, counts.pending, counts.flagged, counts.rejected],
                backgroundColor: [
                    '#28a745',
                    '#ffc107',
                    '#fd7e14',
                    '#dc3545'
                ],
                borderWidth: 0
            }]
        };
    }

    // Update status statistics for a specific cycle
    function updateStatusStatistics(cycle) {
        const reports = cycle === 'all' ? allReports : allReports.filter(r => r.cycle === cycle);
        
        const counts = {
            accepted: reports.filter(r => r.status === 'accepted').length,
            pending: reports.filter(r => r.status === 'pending').length,
            flagged: reports.filter(r => r.status === 'flagged').length,
            rejected: reports.filter(r => r.status === 'rejected').length
        };
        
        // Update summary numbers
        document.getElementById('mini-accepted-count').textContent = counts.accepted;
        document.getElementById('mini-pending-count').textContent = counts.pending;
        document.getElementById('mini-flagged-count').textContent = counts.flagged;
        document.getElementById('mini-rejected-count').textContent = counts.rejected;
        document.getElementById('total-reports').textContent = reports.length;
        
        // Update chart if it exists
        if (window.miniStatusChart) {
            window.miniStatusChart.data = {
                labels: ['Accepted', 'Pending', 'Flagged', 'Rejected'],
                datasets: [{
                    data: [counts.accepted, counts.pending, counts.flagged, counts.rejected],
                    backgroundColor: [
                        '#28a745',
                        '#ffc107',
                        '#fd7e14',
                        '#dc3545'
                    ],
                    borderWidth: 0
                }]
            };
            window.miniStatusChart.update();
        }
    }

    // Update top companies for a specific cycle
    function updateTopCompanies(cycle) {
        const reports = cycle === 'all' ? allReports : allReports.filter(r => r.cycle === cycle);
        const companyMap = {};
        
        reports.forEach(report => {
            if (!companyMap[report.company]) {
                companyMap[report.company] = {
                    count: 0,
                    ratings: [],
                    name: report.company
                };
            }
            companyMap[report.company].count++;
            if (report.score) {
                const rating = parseInt(report.score.split('/')[0]);
                companyMap[report.company].ratings.push(rating);
            }
        });
        
        const companies = Object.values(companyMap);
        companies.sort((a, b) => b.count - a.count);
        
        const topCompaniesList = document.getElementById('mini-top-companies-list');
        if (topCompaniesList) {
            topCompaniesList.innerHTML = '';
            
            companies.slice(0, 5).forEach(company => {
                const avgRating = company.ratings.length ? 
                    (company.ratings.reduce((sum, r) => sum + r, 0) / company.ratings.length).toFixed(1) : 'N/A';
                
                const item = document.createElement('div');
                item.className = 'top-item-small';
                item.innerHTML = `
                    <div class="company-name">${company.name}</div>
                    <div class="company-stats">
                        <span class="internships" title="Internship count"><i class="fas fa-briefcase"></i> ${company.count}</span>
                        <span class="rating" title="Average rating"><i class="fas fa-star"></i> ${avgRating}</span>
                    </div>
                `;
                topCompaniesList.appendChild(item);
            });
        }
    }

    // Update quick stats for a specific cycle
    function updateQuickStats(cycle) {
        const reports = cycle === 'all' ? allReports : allReports.filter(r => r.cycle === cycle);
        
        // Calculate average review time (simplified - would come from backend in real app)
        const avgReviewTime = reports.length > 0 ? 2.5 : 0;
        if (document.getElementById('mini-review-time')) {
            document.getElementById('mini-review-time').textContent = avgReviewTime;
        }
        
        // Calculate completion rate
        const total = reports.length;
        const completed = reports.filter(r => r.status === 'accepted' || r.status === 'rejected').length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        if (document.getElementById('mini-completion-rate')) {
            document.getElementById('mini-completion-rate').textContent = `${completionRate}%`;
        }
        
        // Find top course
        const majors = [...new Set(reports.map(r => r.major))];
        const majorCounts = majors.map(major => ({
            major,
            count: reports.filter(r => r.major === major).length
        }));
        
        majorCounts.sort((a, b) => b.count - a.count);
        const topCourse = majorCounts.length > 0 ? majorCounts[0].major : '-';
        if (document.getElementById('mini-top-course')) {
            document.getElementById('mini-top-course').textContent = topCourse;
        }
    }

    // Update mini top companies list
    function updateMiniTopCompanies() {
        const companyMap = {};
        
        allReports.forEach(report => {
            if (!companyMap[report.company]) {
                companyMap[report.company] = { count: 0, name: report.company };
            }
            companyMap[report.company].count++;
        });
        
        const companies = Object.values(companyMap);
        companies.sort((a, b) => b.count - a.count);
        
        const topCompaniesList = document.getElementById('mini-top-companies-list');
        topCompaniesList.innerHTML = '';
        
        companies.slice(0, 5).forEach(company => {
            const item = document.createElement('div');
            item.className = 'top-item-small';
            item.innerHTML = `
                <span>${company.name}</span>
                <span>${company.count} <i class="fas fa-briefcase"></i></span>
            `;
            topCompaniesList.appendChild(item);
        });
    }

    // Set up event listeners
    function setupEventListeners() {
        // Filter events
        searchInput.addEventListener('input', filterReports);
        statusFilter.addEventListener('change', filterReports);
        majorFilter.addEventListener('change', filterReports);
        cycleFilter.addEventListener('change', filterReports);
        
        // Reset filters
        resetBtn.addEventListener('click', function() {
            searchInput.value = '';
            statusFilter.value = 'all';
            majorFilter.value = 'all';
            cycleFilter.value = 'all';
            filterReports();
        });
        
        // Pagination
        prevPageBtn.addEventListener('click', goToPrevPage);
        nextPageBtn.addEventListener('click', goToNextPage);
        
        // Refresh button
        refreshBtn.addEventListener('click', function() {
            filterReports();
            showToast('Reports refreshed successfully');
        });
        
        // Export button
        exportBtn.addEventListener('click', exportReports);
        
        // Generate report button
        generateReportBtn.addEventListener('click', generateAnalyticsReport);
        
        // Close modal buttons
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Update active tab button
                tabBtns.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
        
        // Status action buttons
        document.getElementById('btn-accept-report').addEventListener('click', acceptReport);
        document.getElementById('btn-flag-report').addEventListener('click', function() {
            currentAction = 'flag';
            showCommentForm();
        });
        document.getElementById('btn-reject-report').addEventListener('click', function() {
            currentAction = 'reject';
            showCommentForm();
        });
        
        // Comment submission
        document.getElementById('submit-comment').addEventListener('click', function() {
            submitComment(currentAction);
        });
        
        // Download report button
        document.getElementById('btn-download-report').addEventListener('click', downloadReport);
    }

    // Show comment form and status actions
    function showCommentForm() {
        const commentForm = document.getElementById('comment-form');
        const statusActions = document.querySelector('.status-actions');
        
        // Show both comment form and status actions
        commentForm.style.display = 'block';
        statusActions.style.display = 'block';
        
        // Focus on the comment textarea
        document.getElementById('new-comment').focus();
    }

    // Filter reports based on search and filter criteria
    function filterReports() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        const majorValue = majorFilter.value;
        const cycleValue = cycleFilter.value;
        
        filteredReports = allReports.filter(report => {
            const matchesSearch = 
                report.studentName.toLowerCase().includes(searchTerm) || 
                report.company.toLowerCase().includes(searchTerm) ||
                report.studentId.toString().includes(searchTerm);
            
            const matchesStatus = statusValue === 'all' || report.status === statusValue;
            const matchesMajor = majorValue === 'all' || report.major === majorValue;
            const matchesCycle = cycleValue === 'all' || report.cycle === cycleValue;
            
            return matchesSearch && matchesStatus && matchesMajor && matchesCycle;
        });
        
        currentPage = 1;
        updateTable();
        updatePagination();
        updateMiniStatistics();
    }
    
    // Update the reports table with filtered data
    function updateTable() {
        // Clear existing rows
        tbody.innerHTML = '';
        
        // Calculate pagination range
        const startIdx = (currentPage - 1) * reportsPerPage;
        const endIdx = Math.min(startIdx + reportsPerPage, filteredReports.length);
        const reportsToShow = filteredReports.slice(startIdx, endIdx);
        
        if (reportsToShow.length === 0) {
            // Show "no results" message
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="9" class="no-results">No reports found matching your criteria</td>`;
            tbody.appendChild(tr);
            return;
        }
        
        // Add rows for each report
        reportsToShow.forEach(report => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', report.id);
            tr.setAttribute('data-status', report.status);
            tr.setAttribute('data-major', report.major);
            
            // Format submitted date
            const submittedDate = new Date(report.submitted);
            const formattedDate = submittedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            tr.innerHTML = `
                <td>${report.studentName}</td>
                <td>${report.studentId}</td>
                <td>${report.major}</td>
                <td>${report.company}</td>
                <td>${report.cycle}</td>
                <td>${formattedDate}</td>
                <td><span class="status-badge ${report.status}">${report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span></td>
                <td>${report.grade}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-view-report">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            `;
            
            // Add click event to view report
            const viewBtn = tr.querySelector('.btn-view-report');
            viewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                viewReportDetails(report.id);
            });
            
            // Add click event to entire row
            tr.addEventListener('click', function() {
                viewReportDetails(report.id);
            });
            
            tbody.appendChild(tr);
        });
    }
    
    // Update pagination controls
    function updatePagination() {
        totalPages = Math.ceil(filteredReports.length / reportsPerPage);
        
        // Update page info
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        
        // Enable/disable pagination buttons
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    // Go to previous page
    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            updateTable();
            updatePagination();
        }
    }
    
    // Go to next page
    function goToNextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            updateTable();
            updatePagination();
        }
    }
    
    // View report details
    function viewReportDetails(reportId) {
        const report = allReports.find(r => r.id == reportId);
        if (!report) {
            showToast('Report not found', 'error');
            return;
        }
        
        currentReportId = reportId;
        
        // Update modal title
        document.getElementById('modal-report-title').textContent = 
            `Internship Report - ${report.studentName}`;
        
        // Update student info
        document.getElementById('detail-student-name').textContent = report.studentName;
        document.getElementById('detail-student-id').textContent = report.studentId;
        document.getElementById('detail-major').textContent = report.major;
        document.getElementById('detail-advisor').textContent = report.advisor;
        document.getElementById('detail-email').textContent = report.email;
        document.getElementById('detail-phone').textContent = report.phone;
        
        // Update internship info
        document.getElementById('detail-company').textContent = report.company;
        document.getElementById('detail-position').textContent = report.position;
        
        const startDate = new Date(report.startDate);
        const endDate = new Date(report.endDate);
        
        document.getElementById('detail-start-date').textContent = startDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('detail-end-date').textContent = endDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('detail-supervisor').textContent = report.supervisor;
        document.getElementById('detail-supervisor-email').textContent = report.supervisorEmail;
        
        // Update report metadata
        const statusBadge = document.getElementById('detail-status');
        statusBadge.textContent = report.status.charAt(0).toUpperCase() + report.status.slice(1);
        statusBadge.className = 'status-badge ' + report.status;
        
        const submittedDate = new Date(report.submitted);
        document.getElementById('detail-submitted').textContent = submittedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('detail-grade').textContent = report.grade;
        document.getElementById('detail-score').textContent = report.score;
        document.getElementById('detail-cycle').textContent = report.cycle;
        
        // Update report content
        document.getElementById('report-content-text').innerHTML = report.reportContent;
        document.getElementById('evaluation-content-text').innerHTML = report.evaluationContent;
        
        // Update attachments
        const attachmentsList = document.getElementById('attachments-list');
        attachmentsList.innerHTML = '';
        
        if (report.attachments && report.attachments.length > 0) {
            report.attachments.forEach(attachment => {
                let iconClass = 'fa-file-alt';
                if (attachment.type === 'pdf') iconClass = 'fa-file-pdf';
                if (attachment.type === 'presentation') iconClass = 'fa-file-powerpoint';
                
                const attachmentEl = document.createElement('a');
                attachmentEl.href = '#';
                attachmentEl.className = 'btn btn-sm btn-secondary';
                attachmentEl.innerHTML = `<i class="fas ${iconClass}"></i> ${attachment.name}`;
                attachmentsList.appendChild(attachmentEl);
            });
        } else {
            attachmentsList.innerHTML = '<p>No attachments available</p>';
        }
        
        // Update comments
        const commentsList = document.getElementById('comments-list');
        commentsList.innerHTML = '';
        
        if (report.comments && report.comments.length > 0) {
            report.comments.forEach(comment => {
                const commentItem = document.createElement('div');
                commentItem.className = 'comment-item';
                commentItem.innerHTML = `
                    <div class="comment-meta">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-date">${formatDate(comment.date)}</span>
                    </div>
                    <div class="comment-text">
                        ${comment.text}
                    </div>
                `;
                commentsList.appendChild(commentItem);
            });
        } else {
            commentsList.innerHTML = '<p>No comments available for this report.</p>';
        }
        
        // Show/hide comment form based on report status
        const commentForm = document.getElementById('comment-form');
        const statusActions = document.querySelector('.status-actions');
        
        if (report.status === 'flagged' || report.status === 'rejected') {
            commentForm.style.display = 'block';
            statusActions.style.display = 'none'; // Hide status actions for already flagged/rejected reports
        } else {
            commentForm.style.display = 'none';
            statusActions.style.display = 'none'; // Initially hidden for other statuses
        }
        
        // Reset to first tab
        tabBtns[0].click();
        
        // Open modal
        modal.style.display = 'flex';
    }

    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Accept report
    function acceptReport() {
        const report = allReports.find(r => r.id == currentReportId);
        
        if (report) {
            report.status = 'accepted';
            report.grade = 'A';
            
            // Update the table
            filterReports();
            
            // Update the modal
            const statusBadge = document.getElementById('detail-status');
            statusBadge.textContent = 'Accepted';
            statusBadge.className = 'status-badge accepted';
            document.getElementById('detail-grade').textContent = 'A';
            
            // Hide comment form and status actions
            document.getElementById('comment-form').style.display = 'none';
            document.querySelector('.status-actions').style.display = 'none';
            
            showToast('Report accepted successfully');
        }
    }

    // Submit new comment and update report status
    function submitComment(action) {
        const commentText = document.getElementById('new-comment').value.trim();
        if (!commentText) {
            showToast('Please enter a comment', 'error');
            return;
        }
        
        const report = allReports.find(r => r.id == currentReportId);
        if (!report) return;
        
        // Add comment to report
        if (!report.comments) report.comments = [];
        
        const newComment = {
            author: "SCAD Office",
            date: new Date().toISOString(),
            text: commentText
        };
        
        report.comments.push(newComment);
        
        // Update report status based on action
        if (action === 'flag') {
            report.status = 'flagged';
            report.grade = 'C';
        } else if (action === 'reject') {
            report.status = 'rejected';
            report.grade = 'F';
        }
        
        // Update UI
        const commentsList = document.getElementById('comments-list');
        if (commentsList.innerHTML === '<p>No comments available for this report.</p>') {
            commentsList.innerHTML = '';
        }
        
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.innerHTML = `
            <div class="comment-meta">
                <span class="comment-author">${newComment.author}</span>
                <span class="comment-date">${formatDate(newComment.date)}</span>
            </div>
            <div class="comment-text">
                ${newComment.text}
            </div>
        `;
        commentsList.appendChild(commentItem);
        
        // Update status badge
        const statusBadge = document.getElementById('detail-status');
        statusBadge.textContent = report.status.charAt(0).toUpperCase() + report.status.slice(1);
        statusBadge.className = 'status-badge ' + report.status;
        
        // Update grade
        document.getElementById('detail-grade').textContent = report.grade;
        
        // Clear the textarea
        document.getElementById('new-comment').value = '';
        
        // Hide status actions and keep comment form visible for flagged/rejected reports
        document.querySelector('.status-actions').style.display = 'none';
        
        // Update the table
        filterReports();
        
        // Scroll to the new comment
        commentItem.scrollIntoView({ behavior: 'smooth' });
        
        showToast(`Report ${action}ed with comment successfully`);
    }

    // Export reports
    function exportReports() {
        showToast('Exporting reports... This would download a CSV file in a real application.');
        
        // Simulate export (for demo purposes)
        setTimeout(() => {
            showToast('Export completed successfully');
        }, 1500);
    }
    
    // Generate analytics report
    function generateAnalyticsReport() {
        showToast('Generating analytics report...', 'info');
        
        // In a real implementation, this would generate a PDF report
        setTimeout(() => {
            showToast('Analytics report generated successfully. Would download PDF in production.', 'success');
        }, 2000);
    }
    
    // Download full report
    function downloadReport() {
        showToast('Preparing report download...', 'info');
        
        // In a real implementation, this would download the full report
        setTimeout(() => {
            showToast('Report download started. Would download PDF in production.', 'success');
        }, 1000);
    }
    
    // Show toast notification
    function showToast(message, type = 'success') {
        console.log(`${type.toUpperCase()}: ${message}`);
        alert(`${type.toUpperCase()}: ${message}`);
    }
    
    // Initialize the page
    init();
});
document.addEventListener('DOMContentLoaded', function() {
    // Sample data for companies
    const companies = [
        {
            id: 1,
            name: "Tech Solutions Inc.",
            industry: "Technology",
            size: "Large (300 employees)",
            email: "hr@techsolutions.com",
            applicationDate: "2023-03-15",
            status: "pending",
            taxDocument: "tax_document.pdf",
            additionalDocs: ["registration.doc", "license.jpg"]
        },
        {
            id: 2,
            name: "Financial Partners LLC",
            industry: "Finance",
            size: "Medium (75 employees)",
            email: "contact@financialpartners.com",
            applicationDate: "2023-03-10",
            status: "pending",
            taxDocument: "tax_document_finance.pdf",
            additionalDocs: ["registration.pdf", "certificate.pdf"]
        },
        {
            id: 3,
            name: "HealthCare Plus",
            industry: "Healthcare",
            size: "Corporate (1200 employees)",
            email: "info@healthcareplus.com",
            applicationDate: "2023-03-05",
            status: "pending",
            taxDocument: "tax_document_health.pdf",
            additionalDocs: ["license.pdf", "accreditation.pdf"]
        },
        {
            id: 4,
            name: "EduFuture",
            industry: "Education",
            size: "Small (40 employees)",
            email: "admin@edufuture.edu",
            applicationDate: "2023-02-28",
            status: "approved",
            taxDocument: "tax_document_edu.pdf",
            additionalDocs: ["registration.pdf"]
        },
        {
            id: 5,
            name: "Green Manufacturing",
            industry: "Manufacturing",
            size: "Large (450 employees)",
            email: "contact@greenmfg.com",
            applicationDate: "2023-02-20",
            status: "rejected",
            taxDocument: "tax_document_mfg.pdf",
            additionalDocs: ["license.pdf", "certificate.pdf", "permit.pdf"]
        }
    ];

    const tableBody = document.querySelector('.data-table tbody');
    const companySearch = document.getElementById('companySearch');
    const industryFilter = document.getElementById('industryFilter');
    const companyDetailsModal = document.getElementById('companyDetailsModal');
    const closeModal = document.querySelector('.close-modal');
    
    // Render companies table
    function renderCompanies(filteredCompanies = companies) {
        tableBody.innerHTML = '';
        
        filteredCompanies.forEach(company => {
            const row = document.createElement('tr');
            
            let statusBadge;
            if (company.status === 'approved') {
                statusBadge = '<span class="status-badge status-approved">Approved</span>';
            } else if (company.status === 'rejected') {
                statusBadge = '<span class="status-badge status-rejected">Rejected</span>';
            } else {
                statusBadge = '<span class="status-badge status-pending">Pending</span>';
            }
            
            row.innerHTML = `
                <td>${company.name}</td>
                <td>${company.industry}</td>
                <td>${company.size}</td>
                <td>${new Date(company.applicationDate).toLocaleDateString()}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" data-id="${company.id}">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to view buttons
        document.querySelectorAll('.action-btn.view').forEach(btn => {
            btn.addEventListener('click', function() {
                const companyId = parseInt(this.dataset.id);
                const company = companies.find(c => c.id === companyId);
                showCompanyDetails(company);
            });
        });
    }
    
    // Show company details in modal
    function showCompanyDetails(company) {
        document.getElementById('modalCompanyName').textContent = company.name;
        document.getElementById('modalCompanyIndustry').textContent = company.industry;
        document.getElementById('modalCompanySize').textContent = company.size;
        document.getElementById('modalCompanyEmail').textContent = company.email;
        document.getElementById('modalApplicationDate').textContent = new Date(company.applicationDate).toLocaleDateString();
        document.getElementById('modalTaxDoc').textContent = company.taxDocument;
        
        const additionalDocsContainer = document.getElementById('modalAdditionalDocs');
        additionalDocsContainer.innerHTML = '';
        
        company.additionalDocs.forEach(doc => {
            const fileExt = doc.split('.').pop().toLowerCase();
            let iconClass;
            
            if (fileExt === 'pdf') {
                iconClass = 'fas fa-file-pdf';
            } else if (['doc', 'docx'].includes(fileExt)) {
                iconClass = 'fas fa-file-word';
            } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
                iconClass = 'fas fa-file-image';
            } else {
                iconClass = 'fas fa-file-alt';
            }
            
            const docLink = document.createElement('a');
            docLink.href = '#';
            docLink.className = 'document-link';
            docLink.innerHTML = `<i class="${iconClass}"></i> ${doc}`;
            additionalDocsContainer.appendChild(docLink);
        });
        
        // Update action buttons based on status
        const approveBtn = document.getElementById('approveCompany');
        const rejectBtn = document.getElementById('rejectCompany');
        
        if (company.status === 'pending') {
            approveBtn.style.display = 'inline-block';
            rejectBtn.style.display = 'inline-block';
        } else if (company.status === 'approved') {
            approveBtn.style.display = 'none';
            rejectBtn.style.display = 'inline-block';
            rejectBtn.textContent = 'Revoke Approval';
        } else {
            approveBtn.style.display = 'inline-block';
            rejectBtn.style.display = 'none';
            approveBtn.textContent = 'Reconsider';
        }
        
        // Set data-id on buttons
        approveBtn.dataset.id = company.id;
        rejectBtn.dataset.id = company.id;
        
        companyDetailsModal.style.display = 'block';
    }
    
    // Close modal
    closeModal.addEventListener('click', function() {
        companyDetailsModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === companyDetailsModal) {
            companyDetailsModal.style.display = 'none';
        }
    });
    
    // Approve company
    document.getElementById('approveCompany').addEventListener('click', function() {
        const companyId = parseInt(this.dataset.id);
        const company = companies.find(c => c.id === companyId);
        company.status = 'approved';
        
        // In a real app, you would send this to the server
        alert(`Company ${company.name} has been approved. An email notification will be sent.`);
        
        renderCompanies();
        companyDetailsModal.style.display = 'none';
    });
    
    // Reject company
    document.getElementById('rejectCompany').addEventListener('click', function() {
        const companyId = parseInt(this.dataset.id);
        const company = companies.find(c => c.id === companyId);
        company.status = 'rejected';
        
        // In a real app, you would send this to the server
        alert(`Company ${company.name} has been rejected. An email notification will be sent.`);
        
        renderCompanies();
        companyDetailsModal.style.display = 'none';
    });
    
    // Search functionality
    companySearch.addEventListener('input', function() {
        filterCompanies();
    });
    
    // Filter functionality
    industryFilter.addEventListener('change', function() {
        filterCompanies();
    });
    
    function filterCompanies() {
        const searchTerm = companySearch.value.toLowerCase();
        const industry = industryFilter.value;
        
        const filtered = companies.filter(company => {
            const matchesSearch = company.name.toLowerCase().includes(searchTerm);
            const matchesIndustry = industry === '' || company.industry === industry;
            return matchesSearch && matchesIndustry;
        });
        
        renderCompanies(filtered);
    }
    
    // Initial render
    renderCompanies();
});
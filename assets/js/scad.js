class SCAD {
  constructor() {
    this.companies = [];
    this.loadCompanies();
  }

  loadCompanies() {
    const savedCompanies = localStorage.getItem('scadCompanies');
    if (savedCompanies) {
      this.companies = JSON.parse(savedCompanies);
    }
  }

  saveCompanies() {
    localStorage.setItem('scadCompanies', JSON.stringify(this.companies));
  }

  approveCompany(companyId) {
    const company = this.companies.find(c => c.id === companyId);
    if (company) {
      company.status = 'approved';
      company.approvalDate = new Date();
      this.saveCompanies();
      return true;
    }
    return false;
  }

  rejectCompany(companyId) {
    const company = this.companies.find(c => c.id === companyId);
    if (company) {
      company.status = 'rejected';
      this.saveCompanies();
      return true;
    }
    return false;
  }
}

// Initialize SCAD dashboard
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('scad-dashboard.html')) {
    const scad = new SCAD();
    
    // Render company applications
    const companiesContainer = document.getElementById('companiesContainer');
    
    if (companiesContainer) {
      scad.companies.forEach(company => {
        const companyCard = document.createElement('div');
        companyCard.className = 'company-card';
        companyCard.innerHTML = `
          <div class="company-header">
            <img src="${company.logo || 'assets/images/default-company.png'}" alt="${company.name}">
            <h3>${company.name}</h3>
            <span class="status-badge ${company.status}">${company.status}</span>
          </div>
          <div class="company-details">
            <p><strong>Industry:</strong> ${company.industry}</p>
            <p><strong>Size:</strong> ${company.size}</p>
            <p><strong>Applied:</strong> ${new Date(company.applicationDate).toLocaleDateString()}</p>
          </div>
          <div class="company-actions">
            <button class="btn btn-success" data-company="${company.id}" ${company.status !== 'pending' ? 'disabled' : ''}>
              Approve
            </button>
            <button class="btn btn-danger" data-company="${company.id}" ${company.status !== 'pending' ? 'disabled' : ''}>
              Reject
            </button>
            <a href="company-details.html?id=${company.id}" class="btn btn-outline">
              View Details
            </a>
          </div>
        `;
        
        companiesContainer.appendChild(companyCard);
      });
      
      // Add event listeners to action buttons
      document.querySelectorAll('.btn-success[data-company]').forEach(btn => {
        btn.addEventListener('click', function() {
          const companyId = parseInt(this.dataset.company);
          if (scad.approveCompany(companyId)) {
            alert('Company approved successfully!');
            window.location.reload();
          }
        });
      });
      
      document.querySelectorAll('.btn-danger[data-company]').forEach(btn => {
        btn.addEventListener('click', function() {
          const companyId = parseInt(this.dataset.company);
          if (scad.rejectCompany(companyId)) {
            alert('Company rejected!');
            window.location.reload();
          }
        });
      });
    }
  }
});
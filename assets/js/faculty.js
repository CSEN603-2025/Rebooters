class Faculty {
  constructor() {
    this.reports = [];
    this.loadReports();
  }

  loadReports() {
    const savedReports = localStorage.getItem('facultyReports');
    if (savedReports) {
      this.reports = JSON.parse(savedReports);
    }
  }

  saveReports() {
    localStorage.setItem('facultyReports', JSON.stringify(this.reports));
  }

  evaluateReport(reportId, status, comments = '') {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      report.status = status;
      report.comments = comments;
      report.evaluatedDate = new Date();
      this.saveReports();
      return true;
    }
    return false;
  }
}

// Initialize faculty dashboard
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('faculty-dashboard.html')) {
    const faculty = new Faculty();
    
    // Render reports for evaluation
    const reportsContainer = document.getElementById('reportsContainer');
    
    if (reportsContainer) {
      faculty.reports.forEach(report => {
        const reportCard = document.createElement('div');
        reportCard.className = 'report-card';
        reportCard.innerHTML = `
          <h3>${report.title}</h3>
          <p><strong>Student:</strong> ${report.studentName}</p>
          <p><strong>Company:</strong> ${report.company}</p>
          <p><strong>Submitted:</strong> ${new Date(report.submittedDate).toLocaleDateString()}</p>
          <div class="status-badge ${report.status}">${report.status}</div>
          <a href="report-details.html?id=${report.id}" class="btn btn-primary">
            Evaluate Report
          </a>
        `;
        
        reportsContainer.appendChild(reportCard);
      });
    }
  }
});
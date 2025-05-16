class Student {
  constructor() {
    this.applications = [];
    this.loadApplications();
  }

  loadApplications() {
    const savedApps = localStorage.getItem('studentApplications');
    if (savedApps) {
      this.applications = JSON.parse(savedApps);
    }
  }

  saveApplications() {
    localStorage.setItem('studentApplications', JSON.stringify(this.applications));
  }

  applyToJob(jobId, documents = []) {
    if (!this.applications.some(app => app.jobId === jobId)) {
      this.applications.push({
        jobId,
        status: 'pending',
        appliedDate: new Date(),
        documents
      });
      this.saveApplications();
      return true;
    }
    return false;
  }

  getApplications() {
    return this.applications;
  }
}

// Initialize student dashboard
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('student-dashboard.html')) {
    const student = new Student();
    const company = new Company(); // From company.js
    
    // Render available internships
    const jobs = company.getJobPosts();
    const internshipsContainer = document.getElementById('internshipsContainer');
    
    if (internshipsContainer) {
      jobs.forEach(job => {
        const isApplied = student.applications.some(app => app.jobId === job.id);
        
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
          <h3>${job.title}</h3>
          <p>${job.description.substring(0, 100)}...</p>
          <div class="job-meta">
            <span><i class="fas fa-clock"></i> ${job.duration} months</span>
            <span><i class="fas fa-money-bill-wave"></i> ${job.isPaid ? `$${job.salary}/month` : 'Unpaid'}</span>
            <span><i class="fas fa-building"></i> ${job.company || 'Tech Company'}</span>
          </div>
          <button class="btn ${isApplied ? 'btn-disabled' : 'btn-primary'}" 
                  data-job="${job.id}" ${isApplied ? 'disabled' : ''}>
            ${isApplied ? 'Applied' : 'Apply Now'}
          </button>
        `;
        
        internshipsContainer.appendChild(jobCard);
      });
      
      // Add event listeners to apply buttons
      document.querySelectorAll('.btn[data-job]').forEach(btn => {
        btn.addEventListener('click', function() {
          const jobId = parseInt(this.dataset.job);
          if (student.applyToJob(jobId)) {
            alert('Application submitted successfully!');
            this.textContent = 'Applied';
            this.disabled = true;
            this.classList.remove('btn-primary');
            this.classList.add('btn-disabled');
          }
        });
      });
    }
  }
});
class ProStudent extends Student {
  constructor() {
    super();
    this.isPro = this.checkProStatus();
  }

  checkProStatus() {
    // Check if student has completed 3 months of internships
    const totalDuration = this.applications
      .filter(app => app.status === 'completed')
      .reduce((sum, app) => sum + (app.duration || 0), 0);
    
    return totalDuration >= 3;
  }

  getOnlineAssessments() {
    return [
      { id: 1, title: 'Technical Skills Assessment', duration: '60 mins' },
      { id: 2, title: 'Soft Skills Evaluation', duration: '45 mins' },
      { id: 3, title: 'Career Aptitude Test', duration: '30 mins' }
    ];
  }
}

// Check for PRO student in dashboard
if (window.location.search.includes('pro=true')) {
  const proStudent = new ProStudent();
  
  // Add PRO badge to UI
  const profileSection = document.querySelector('.user-profile');
  if (profileSection && proStudent.isPro) {
    const proBadge = document.createElement('div');
    proBadge.className = 'pro-badge';
    proBadge.innerHTML = '<i class="fas fa-certificate"></i> PRO Student';
    profileSection.appendChild(proBadge);
  }
  
  // Add PRO features
  if (document.getElementById('proFeatures')) {
    const assessments = proStudent.getOnlineAssessments();
    const assessmentsList = document.getElementById('assessmentsList');
    
    assessments.forEach(assessment => {
      const item = document.createElement('div');
      item.className = 'assessment-item';
      item.innerHTML = `
        <h4>${assessment.title}</h4>
        <p>Duration: ${assessment.duration}</p>
        <button class="btn btn-primary" data-assessment="${assessment.id}">
          Start Assessment
        </button>
      `;
      assessmentsList.appendChild(item);
    });
  }
}
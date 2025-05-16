class JobPost {
  constructor(title, description, duration, isPaid, salary, skills) {
    this.id = Date.now();
    this.title = title;
    this.description = description;
    this.duration = duration;
    this.isPaid = isPaid;
    this.salary = salary;
    this.skills = skills;
    this.postedDate = new Date();
    this.applications = [];
  }
}

class Company {
  constructor() {
    this.jobPosts = [];
    this.loadJobs();
  }

  loadJobs() {
    const savedJobs = localStorage.getItem('companyJobs');
    if (savedJobs) {
      this.jobPosts = JSON.parse(savedJobs);
    }
  }

  saveJobs() {
    localStorage.setItem('companyJobs', JSON.stringify(this.jobPosts));
  }

  createJobPost(title, description, duration, isPaid, salary, skills) {
    const job = new JobPost(title, description, duration, isPaid, salary, skills);
    this.jobPosts.push(job);
    this.saveJobs();
    return job;
  }

  getJobPosts() {
    return this.jobPosts;
  }

  getJobById(id) {
    return this.jobPosts.find(job => job.id === id);
  }
}

// Initialize company dashboard
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('company-dashboard.html')) {
    const company = new Company();
    
    // Render job posts
    const jobs = company.getJobPosts();
    const jobsContainer = document.getElementById('jobsContainer');
    
    if (jobsContainer) {
      jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
          <h3>${job.title}</h3>
          <p>${job.description.substring(0, 100)}...</p>
          <div class="job-meta">
            <span>${job.duration} months</span>
            <span>${job.isPaid ? `$${job.salary}/month` : 'Unpaid'}</span>
          </div>
          <a href="job-details.html?id=${job.id}" class="btn btn-primary">View Details</a>
        `;
        jobsContainer.appendChild(jobCard);
      });
    }
  }
}); 
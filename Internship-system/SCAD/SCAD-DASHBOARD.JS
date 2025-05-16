document.addEventListener("DOMContentLoaded", () => {
  loadCompanies();
  loadStudents();
  loadReports();
  loadEvaluations();
  loadStatistics();
  loadWorkshops();
});

// ---------------- Companies ----------------
function loadCompanies() {
  const list = document.getElementById("companiesList");
  list.innerHTML = "";
  dummyCompanies.forEach(company => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${company.name}</strong> (${company.industry}) 
      <button onclick="viewCompany('${company.id}')">View</button>
      <button onclick="updateCompanyStatus('${company.id}', 'accepted')">Accept</button>
      <button onclick="updateCompanyStatus('${company.id}', 'rejected')">Reject</button>
    `;
    list.appendChild(div);
  });
}

function updateCompanyStatus(id, status) {
  alert(`Company ${id} ${status}`);
}

function viewCompany(id) {
  const company = dummyCompanies.find(c => c.id === id);
  alert(`Details:\n${JSON.stringify(company, null, 2)}`);
}

// ---------------- Internship Cycle ----------------
function saveCycleDates() {
  const start = document.getElementById("cycleStart").value;
  const end = document.getElementById("cycleEnd").value;
  alert(`Cycle set from ${start} to ${end}`);
}

// ---------------- Students ----------------
function loadStudents() {
  const list = document.getElementById("studentsList");
  list.innerHTML = "";
  dummyStudents.forEach(student => {
    const div = document.createElement("div");
    div.innerHTML = `
      ${student.name} - ${student.status}
      <button onclick="viewStudent('${student.id}')">Profile</button>
    `;
    list.appendChild(div);
  });
}

function viewStudent(id) {
  const student = dummyStudents.find(s => s.id === id);
  alert(`Student:\n${JSON.stringify(student, null, 2)}`);
}

// ---------------- Reports ----------------
function loadReports() {
  const list = document.getElementById("reportsList");
  list.innerHTML = "";
  dummyReports.forEach(report => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${report.student}</strong> (${report.major}) - ${report.status}
      <button onclick="viewReport('${report.id}')">Details</button>
    `;
    list.appendChild(div);
  });
}

function viewReport(id) {
  const report = dummyReports.find(r => r.id === id);
  document.getElementById("reportDetails").innerText = JSON.stringify(report, null, 2);
}

// ---------------- Evaluations ----------------
function loadEvaluations() {
  const evalDiv = document.getElementById("evaluationDetails");
  evalDiv.innerText = JSON.stringify(dummyEvaluations[0], null, 2);
}

// ---------------- Statistics ----------------
function loadStatistics() {
  document.getElementById("statistics").innerText = `
    Accepted: 5, Rejected: 2, Flagged: 1
    Avg Review Time: 3 days
    Most Used Course: CSEN 601
    Top Rated Company: XYZ Ltd.
  `;
}

function generateStatsReport() {
  document.getElementById("generatedReport").innerText = "PDF/Report would be generated here!";
}

// ---------------- Workshops ----------------
function loadWorkshops() {
  const list = document.getElementById("workshopsList");
  list.innerHTML = "";
  dummyWorkshops.forEach(w => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${w.name}</strong> (${w.date})<br>
      ${w.description}<br>
      <button>Edit</button> <button>Delete</button>
    `;
    list.appendChild(div);
  });
}

function addWorkshop() {
  alert("Add workshop modal would open");
}

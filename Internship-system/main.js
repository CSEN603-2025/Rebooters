document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Dummy role-based logic (you can improve this)
  if (email.includes("scad")) {
    window.location.href = "scad/scad.html";
  } else if (email.includes("faculty")) {
    window.location.href = "faculty/faculty.html";
  } else {
    alert("Invalid credentials or role not recognized.");
  }
});
// Helper: Load JSON data (mock fetch)
async function loadJSON(path) {
  const response = await fetch(path);
  return response.json();
}

let reports = [];
let evaluations = [];

async function initSCADFacultyApp() {
  reports = await loadJSON('data/reports.json');
  evaluations = await loadJSON('data/evaluations.json');
  renderReportList();
  renderStatistics();
}

// Render reports list filtered
function renderReportList() {
  const filterMajor = document.getElementById('filterMajor').value;
  const filterStatus = document.getElementById('filterStatus').value;
  const listDiv = document.getElementById('reportList');

  let filtered = reports.filter(r =>
    (filterMajor === '' || r.major === filterMajor) &&
    (filterStatus === '' || r.status === filterStatus)
  );

  listDiv.innerHTML = filtered.length === 0 ? '<p>No reports found.</p>' : '';

  filtered.forEach(report => {
    const div = document.createElement('div');
    div.textContent = `ID:${report.id} - ${report.studentName} (${report.major}) - Status: ${report.status}`;
    div.style.cursor = 'pointer';
    div.onclick = () => showReportDetails(report.id);
    listDiv.appendChild(div);
  });
}

// Show report details + status update options if Faculty
function showReportDetails(reportId) {
  const report = reports.find(r => r.id === reportId);
  if (!report) return;

  const detailsDiv = document.getElementById('reportDetails');
  detailsDiv.innerHTML = `
    <p><strong>Student:</strong> ${report.studentName}</p>
    <p><strong>Major:</strong> ${report.major}</p>
    <p><strong>Status:</strong> ${report.status}</p>
    <p><strong>Details:</strong> ${report.details}</p>
    <p><strong>Flag Reason:</strong> ${report.flagReason || 'N/A'}</p>
    <p><strong>Clarification:</strong> ${report.clarification || 'N/A'}</p>

    <label>Update Status:
      <select id="updateStatusSelect">
        <option value="pending" ${report.status === 'pending' ? 'selected' : ''}>Pending</option>
        <option value="flagged" ${report.status === 'flagged' ? 'selected' : ''}>Flagged</option>
        <option value="rejected" ${report.status === 'rejected' ? 'selected' : ''}>Rejected</option>
        <option value="accepted" ${report.status === 'accepted' ? 'selected' : ''}>Accepted</option>
      </select>
    </label><br><br>

    <label>Clarification (if flagged/rejected):
      <textarea id="clarificationInput">${report.clarification || ''}</textarea>
    </label><br><br>

    <button id="saveReportBtn">Save</button>
  `;

  document.getElementById('saveReportBtn').onclick = () => {
    const newStatus = document.getElementById('updateStatusSelect').value;
    const newClarification = document.getElementById('clarificationInput').value;

    // Update report in array
    report.status = newStatus;
    if (newStatus === 'flagged' || newStatus === 'rejected') {
      report.clarification = newClarification;
    } else {
      report.clarification = '';
    }
    alert('Report updated!');
    renderReportList();
    showReportDetails(report.id);
  };
}

// Show evaluation report details
function showEvaluationDetails(evaluationId) {
  const evalReport = evaluations.find(e => e.id === evaluationId);
  if (!evalReport) return;
  const evalDiv = document.getElementById('evaluationDetails');
  evalDiv.innerHTML = `
    <p><strong>Student:</strong> ${evalReport.studentName}</p>
    <p><strong>Company:</strong> ${evalReport.companyName}</p>
    <p><strong>Supervisor:</strong> ${evalReport.supervisor}</p>
    <p><strong>Start Date:</strong> ${evalReport.startDate}</p>
    <p><strong>End Date:</strong> ${evalReport.endDate}</p>
    <p><strong>Details:</strong> ${evalReport.details}</p>
  `;
}

// Render real-time statistics (basic demo)
function renderStatistics() {
  const statsDiv = document.getElementById('statistics');
  const total = reports.length;
  const accepted = reports.filter(r => r.status === 'accepted').length;
  const rejected = reports.filter(r => r.status === 'rejected').length;
  const flagged = reports.filter(r => r.status === 'flagged').length;

  statsDiv.innerHTML = `
    <p>Total Reports: ${total}</p>
    <p>Accepted: ${accepted}</p>
    <p>Rejected: ${rejected}</p>
    <p>Flagged: ${flagged}</p>
  `;
}

// Generate a simple report for statistics
document.getElementById('generateStatsReportBtn').onclick = () => {
  const reportText = `
    Internship Reports Stats:
    - Total: ${reports.length}
    - Accepted: ${reports.filter(r => r.status === 'accepted').length}
    - Rejected: ${reports.filter(r => r.status === 'rejected').length}
    - Flagged: ${reports.filter(r => r.status === 'flagged').length}
  `;

  document.getElementById('generatedReport').textContent = reportText;
};

// Filter inputs event listeners
document.getElementById('filterMajor').addEventListener('change', renderReportList);
document.getElementById('filterStatus').addEventListener('change', renderReportList);

// Show the SCAD/Faculty app after login (demo)
document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  // TODO: Add real login validation
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('scadFacultyApp').style.display = 'block';
  initSCADFacultyApp();
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  if (email.includes("scad")) {
    window.location.href = "SCAD/scad-dashboard.html";
  } else {
    alert("Not SCAD");
  }
});

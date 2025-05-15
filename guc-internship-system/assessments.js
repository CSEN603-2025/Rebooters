function checkAndValidateProBadge() {
    const user = localStorage.getItem('userEmail');
    if (!user) return false;

    // Clear any potentially incorrect profile data
    const profile = JSON.parse(localStorage.getItem('profile_' + user)) || {};
    
    // Get internships data to validate PRO badge
    const myInternships = JSON.parse(localStorage.getItem('myInternships')) || [];
    const completedInternships = myInternships.filter(internship => internship.status === "complete");
    
    // Calculate total duration of completed internships
    let totalDuration = 0;
    completedInternships.forEach(internship => {
        if (!isNaN(parseInt(internship.duration, 10))) {
            totalDuration += parseInt(internship.duration, 10);
        }
    });

    // Only set proBadge to true if they have completed 3 months of internships
    profile.proBadge = totalDuration >= 3;
    
    // Save the validated profile back to localStorage
    localStorage.setItem('profile_' + user, JSON.stringify(profile));
    
    return profile.proBadge;
}

const assessments = [
    {
        id: 1,
        title: "JavaScript Basics",
        description: "Test your JS fundamentals.",
        type: "Technical",
        duration: 30,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        status: "available",
        questions: [
            {
                id: 1,
                type: "multiple-choice",
                question: "What is the output of: console.log(typeof [])?",
                options: ["array", "object", "undefined", "null"],
                correctAnswer: "object"
            },
            {
                id: 2,
                type: "multiple-choice",
                question: "Which method adds an element to the end of an array?",
                options: ["push()", "pop()", "shift()", "unshift()"],
                correctAnswer: "push()"
            },
            {
                id: 3,
                type: "coding",
                question: "Write a function that reverses a string without using the built-in reverse() method."
            }
        ]
    },
    {
        id: 2,
        title: "Data Structures",
        description: "Assess your data structure knowledge.",
        type: "Technical",
        duration: 45,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        status: "available",
        questions: [
            {
                id: 1,
                type: "multiple-choice",
                question: "Which data structure follows LIFO principle?",
                options: ["Queue", "Stack", "LinkedList", "Array"],
                correctAnswer: "Stack"
            },
            {
                id: 2,
                type: "multiple-choice",
                question: "What is the time complexity of searching in a binary search tree?",
                options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
                correctAnswer: "O(log n)"
            }
        ]
    },
    {
        id: 3,
        title: "Web Development",
        description: "Front-end and back-end basics.",
        type: "Technical",
        duration: 60,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        status: "available",
        questions: [
            {
                id: 1,
                type: "multiple-choice",
                question: "Which HTTP method is idempotent?",
                options: ["GET", "POST", "PATCH", "DELETE"],
                correctAnswer: "GET"
            },
            {
                id: 2,
                type: "multiple-choice",
                question: "What is the purpose of the DOCTYPE declaration?",
                options: [
                    "To link JavaScript files",
                    "To tell the browser which version of HTML the page is using",
                    "To define the document title",
                    "To import CSS styles"
                ],
                correctAnswer: "To tell the browser which version of HTML the page is using"
            }
        ]
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const assessmentList = document.getElementById('assessmentList');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const assessmentModal = document.getElementById('assessmentModal');
    const assessmentContent = document.getElementById('assessmentContent');
    
    // Validate PRO badge status before proceeding
    if (!checkAndValidateProBadge()) {
        return; // Exit if no valid PRO badge
    }
    
    // Save assessments to localStorage if not exists
    if (!localStorage.getItem('assessments')) {
        localStorage.setItem('assessments', JSON.stringify(assessments));
    }
    
    // Load and render assessments
    function loadAssessments() {
        const assessments = JSON.parse(localStorage.getItem('assessments')) || [];
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;
        
        const filteredAssessments = assessments.filter(assessment => {
            const matchesSearch = assessment.title.toLowerCase().includes(searchTerm);
            const matchesStatus = !status || assessment.status === status;
            return matchesSearch && matchesStatus;
        });
        
        renderAssessments(filteredAssessments);
    }
    
    function renderAssessments(assessments) {
        const assessmentGrid = document.querySelector('.assessment-grid');
        if (!assessmentGrid) return;

        assessmentGrid.innerHTML = assessments.map(assessment => `
            <div class="assessment-card">
                <h3>${assessment.title}</h3>
                <p class="description">${assessment.description}</p>
                <div class="assessment-details">
                    <p><strong>Type:</strong> ${assessment.type}</p>
                    <p><strong>Duration:</strong> ${assessment.duration} minutes</p>
                    <p><strong>Due Date:</strong> ${new Date(assessment.dueDate).toLocaleDateString()}</p>
                    <p><strong>Questions:</strong> ${assessment.questions.length}</p>
                    <p class="status ${assessment.status}"><strong>Status:</strong> ${assessment.status}</p>
                </div>
                <button onclick="takeAssessment(${assessment.id})" 
                        ${assessment.status === 'completed' ? 'disabled' : ''}>
                    ${assessment.status === 'completed' ? 'Completed' : 'Start Assessment'}
                </button>
            </div>
        `).join('');
    }
    
    // Event listeners
    searchInput.addEventListener('input', loadAssessments);
    statusFilter.addEventListener('change', loadAssessments);
    
    // Initial load
    loadAssessments();
});

// Make functions globally accessible
window.takeAssessment = function(id) {
    startAssessment(id);
};

window.startAssessment = function(assessmentId) {
    if (!checkAndValidateProBadge()) {
        alert('You need a PRO badge to take assessments. Complete 3 months of internships to earn your PRO badge.');
        return;
    }
    
    const assessments = JSON.parse(localStorage.getItem('assessments')) || [];
    const assessment = assessments.find(a => a.id === assessmentId);
    
    if (!assessment) return;
    
    const assessmentModal = document.getElementById('assessmentModal');
    const assessmentContent = document.getElementById('assessmentContent');
    
    assessmentContent.innerHTML = `
        <h2>${assessment.title}</h2>
        <form id="assessmentForm">
            ${assessment.questions.map((q, index) => `
                <div class="question">
                    <h3>Question ${index + 1}</h3>
                    <p>${q.question}</p>
                    ${renderQuestionInput(q, index)}
                </div>
            `).join('')}
            <button type="submit" class="submit-btn">Submit Assessment</button>
        </form>
    `;
    
    assessmentModal.style.display = 'block';
    
    // Handle form submission
    document.getElementById('assessmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const answers = assessment.questions.map((q, index) => {
            const answer = document.querySelector(`#answer-${index}`).value;
            return {
                questionId: q.id,
                answer: answer,
                isCorrect: q.type === 'multiple-choice' ? answer === q.correctAnswer : null
            };
        });
        
        // Save assessment results
        const results = {
            assessmentId,
            answers,
            completedAt: new Date().toISOString(),
            score: calculateScore(answers, assessment.questions)
        };
        
        let assessmentResults = JSON.parse(localStorage.getItem('assessmentResults')) || [];
        assessmentResults.push(results);
        localStorage.setItem('assessmentResults', JSON.stringify(assessmentResults));
        
        // Update assessment status
        const assessmentIndex = assessments.findIndex(a => a.id === assessmentId);
        if (assessmentIndex !== -1) {
            assessments[assessmentIndex].status = 'completed';
            localStorage.setItem('assessments', JSON.stringify(assessments));
        }
        
        // Show results
        showAssessmentResults(results, assessment);
    });
};

window.renderQuestionInput = function(question, index) {
    switch (question.type) {
        case 'multiple-choice':
            return `
                <div class="options">
                    ${question.options.map(option => `
                        <label>
                            <input type="radio" name="q${index}" id="answer-${index}" value="${option}">
                            ${option}
                        </label>
                    `).join('')}
                </div>
            `;
        case 'coding':
            return `
                <div class="code-editor">
                    <textarea id="answer-${index}" rows="10" 
                              placeholder="Write your code here..."></textarea>
                </div>
            `;
        default:
            return `
                <input type="text" id="answer-${index}" 
                       placeholder="Enter your answer...">
            `;
    }
};

window.calculateScore = function(answers, questions) {
    let correctAnswers = 0;
    let totalQuestions = questions.filter(q => q.type === 'multiple-choice').length;
    
    answers.forEach(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        if (question.type === 'multiple-choice' && answer.isCorrect) {
            correctAnswers++;
        }
    });
    
    return totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
};

window.showAssessmentResults = function(results, assessment) {
    const assessmentContent = document.getElementById('assessmentContent');
    const badgeLevel = getBadgeLevel(results.score);
    
    assessmentContent.innerHTML = `
        <h2>Assessment Results</h2>
        <div class="results-summary">
            <div class="score-display ${badgeLevel.toLowerCase()}">
                <h3>Your Score</h3>
                <div class="score-number">${Math.round(results.score)}%</div>
                <div class="badge-level">${badgeLevel} Badge</div>
            </div>
            <p><strong>Completed:</strong> ${new Date(results.completedAt).toLocaleString()}</p>
            <p><strong>Assessment:</strong> ${assessment.title}</p>
        </div>

        <div class="share-options">
            <h3>Share Your Achievement</h3>
            <label class="share-checkbox">
                <input type="checkbox" id="shareOnProfile" onchange="toggleScoreSharing(${results.assessmentId}, this.checked)">
                Display this score on my profile
            </label>
            <p class="share-note">Showing your assessment scores can help companies evaluate your skills!</p>
        </div>

        <div class="detailed-results">
            <h3>Detailed Breakdown</h3>
            ${results.answers.map((answer, index) => {
                const question = assessment.questions[index];
                return `
                    <div class="result-item ${answer.isCorrect ? 'correct' : 'incorrect'}">
                        <h4>Question ${index + 1}</h4>
                        <p class="question-text">${question.question}</p>
                        <div class="answer-details">
                            <p><strong>Your Answer:</strong> ${answer.answer}</p>
                            ${question.type === 'multiple-choice' ? `
                                <p><strong>Correct Answer:</strong> ${question.correctAnswer}</p>
                                <p class="result-status ${answer.isCorrect ? 'correct' : 'incorrect'}">
                                    ${answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                </p>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>

        <div class="action-buttons">
            <button onclick="closeAssessmentModal()" class="primary-btn">Close</button>
        </div>
    `;
};

window.closeAssessmentModal = function() {
    const assessmentModal = document.getElementById('assessmentModal');
    assessmentModal.style.display = 'none';
    loadAssessments(); // Refresh the assessment list
};

window.getBadgeLevel = function(score) {
    if (score >= 90) return 'Gold';
    if (score >= 75) return 'Silver';
    if (score >= 60) return 'Bronze';
    return 'No';
};

function toggleScoreSharing(assessmentId, isShared) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    let sharedScores = JSON.parse(localStorage.getItem('sharedAssessmentScores') || '[]');
    
    if (isShared) {
        // Add score to shared scores if not already present
        if (!sharedScores.some(score => score.assessmentId === assessmentId)) {
            const assessmentResults = JSON.parse(localStorage.getItem('assessmentResults') || '[]');
            const result = assessmentResults.find(r => r.assessmentId === assessmentId);
            
            if (result) {
                sharedScores.push({
                    assessmentId,
                    title: assessments.find(a => a.id === assessmentId)?.title || 'Unknown Assessment',
                    score: result.score,
                    completedAt: result.completedAt,
                    badgeLevel: getBadgeLevel(result.score)
                });
            }
        }
    } else {
        // Remove score from shared scores
        sharedScores = sharedScores.filter(score => score.assessmentId !== assessmentId);
    }

    localStorage.setItem('sharedAssessmentScores', JSON.stringify(sharedScores));
    updateProfile(currentUser, sharedScores);
    
    // Show confirmation notification
    showNotification(isShared ? 'Score added to your profile!' : 'Score removed from your profile');
}

function viewAllScores() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const assessmentResults = JSON.parse(localStorage.getItem('assessmentResults') || '[]');
    const userResults = assessmentResults.filter(result => result.userId === currentUser);

    const assessmentContent = document.getElementById('assessmentContent');
    
    assessmentContent.innerHTML = `
        <h2>My Assessment Scores</h2>
        <div class="scores-summary">
            ${userResults.length > 0 ? `
                <div class="scores-grid">
                    ${userResults.map(result => {
                        const assessment = assessments.find(a => a.id === result.assessmentId);
                        const badgeLevel = getBadgeLevel(result.score);
                        return `
                            <div class="score-card ${badgeLevel.toLowerCase()}-badge">
                                <h3>${assessment?.title || 'Unknown Assessment'}</h3>
                                <div class="score-info">
                                    <div class="score-number">${Math.round(result.score)}%</div>
                                    <div class="badge-level">${badgeLevel} Badge</div>
                                </div>
                                <p class="completion-date">
                                    Completed: ${new Date(result.completedAt).toLocaleDateString()}
                                </p>
                                <label class="share-checkbox">
                                    <input type="checkbox" 
                                           onchange="toggleScoreSharing(${result.assessmentId}, this.checked)"
                                           ${isScoreShared(result.assessmentId) ? 'checked' : ''}>
                                    Show on Profile
                                </label>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : '<p>You haven\'t completed any assessments yet.</p>'}
        </div>
        <button onclick="closeAssessmentModal()" class="primary-btn">Close</button>
    `;
}

function isScoreShared(assessmentId) {
    const sharedScores = JSON.parse(localStorage.getItem('sharedAssessmentScores') || '[]');
    return sharedScores.some(score => score.assessmentId === assessmentId);
}

function updateProfile(userId, sharedScores) {
    const profile = JSON.parse(localStorage.getItem(`profile_${userId}`) || '{}');
    profile.assessmentScores = sharedScores;
    localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function renderAssessmentList() {
    const listDiv = document.getElementById('assessmentList');
    if (!assessments || assessments.length === 0) {
        listDiv.innerHTML = "<p>No assessments available at this time.</p>";
        return;
    }
    listDiv.innerHTML = `
        <h2>Available Online Assessments</h2>
        <ul>
            ${assessments.map(a => `
                <li>
                    <strong>${a.title}</strong><br>
                    <span>${a.description}</span>
                    <button onclick="takeAssessment(${a.id})">Take Assessment</button>
                </li>
            `).join('')}
        </ul>
    `;
} 

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('workshop-search');
    const statusFilter = document.getElementById('status-filter');
    const resetBtn = document.getElementById('reset-filters');
    const workshopsTable = document.getElementById('workshops-table');
    const tbody = workshopsTable.querySelector('tbody');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const addWorkshopBtn = document.getElementById('add-workshop-btn');
    
    const modal = document.getElementById('workshop-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const saveWorkshopBtn = document.getElementById('save-workshop-btn');
    const deleteWorkshopBtn = document.getElementById('delete-workshop-btn');
    const workshopForm = document.getElementById('workshop-form');
    
    // Workshop data and pagination
    let allWorkshops = [];
    let filteredWorkshops = [];
    const workshopsPerPage = 10;
    let currentPage = 1;
    let totalPages = 1;
    let currentWorkshopId = null;
    let isEditMode = false;

    // Initialize date/time pickers
    flatpickr(".datetime-picker", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        time_24hr: true
    });

    // Initialize the page
    function init() {
        // Sample workshop data
        const sampleWorkshops = [
            {
                id: 1,
                name: "Resume Writing Workshop",
                link: "https://zoom.us/j/123456789",
                startDateTime: "2024-06-15 14:00",
                endDateTime: "2024-06-15 16:00",
                description: "Learn how to craft the perfect resume for internship applications",
                speakerName: "Dr. Sarah Johnson",
                speakerBio: "Career counselor with 10+ years experience in student development",
                agenda: "1. Resume structure\n2. Action verbs\n3. Tailoring for specific jobs\n4. Common mistakes",
                materials: [],
                status: "upcoming"
            },
            {
                id: 2,
                name: "Interview Preparation",
                link: "https://zoom.us/j/987654321",
                startDateTime: "2024-05-20 10:00",
                endDateTime: "2024-05-20 12:00",
                description: "Master the art of interviewing for internships",
                speakerName: "Mr. Ahmed Mohamed",
                speakerBio: "HR Manager at Tech Solutions Inc. with 8 years hiring experience",
                agenda: "1. Common questions\n2. STAR method\n3. Body language\n4. Follow-up etiquette",
                materials: [],
                status: "completed"
            },
            {
                id: 3,
                name: "Professional Networking",
                link: "https://zoom.us/j/555555555",
                startDateTime: "2024-06-01 15:00",
                endDateTime: "2024-06-01 17:00",
                description: "Build your professional network for career success",
                speakerName: "Ms. Mariam Hassan",
                speakerBio: "LinkedIn expert and career coach",
                agenda: "1. LinkedIn optimization\n2. Networking events\n3. Informational interviews\n4. Follow-up strategies",
                materials: [],
                status: "upcoming"
            }
        ];
        
        allWorkshops = [...sampleWorkshops];
        filteredWorkshops = [...allWorkshops];
        
        // Initialize the table
        filterWorkshops();
        updatePagination();
        
        // Add event listeners
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Filter events
        searchInput.addEventListener('input', filterWorkshops);
        statusFilter.addEventListener('change', filterWorkshops);
        
        // Reset filters
        resetBtn.addEventListener('click', function() {
            searchInput.value = '';
            statusFilter.value = 'all';
            filterWorkshops();
        });
        
        // Pagination
        prevPageBtn.addEventListener('click', goToPrevPage);
        nextPageBtn.addEventListener('click', goToNextPage);
        
        // Add workshop button
        addWorkshopBtn.addEventListener('click', function() {
            isEditMode = false;
            currentWorkshopId = null;
            showWorkshopModal();
        });
        
        // Close modal buttons
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                modal.style.display = 'none';
                workshopForm.reset();
            });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                workshopForm.reset();
            }
        });
        
        // Save workshop button
        saveWorkshopBtn.addEventListener('click', saveWorkshop);
        
        // Delete workshop button
        deleteWorkshopBtn.addEventListener('click', deleteWorkshop);
    }
    
    // Filter workshops based on search and filter criteria
    function filterWorkshops() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        
        filteredWorkshops = allWorkshops.filter(workshop => {
            const matchesSearch = 
                workshop.name.toLowerCase().includes(searchTerm) || 
                workshop.speakerName.toLowerCase().includes(searchTerm) ||
                workshop.description.toLowerCase().includes(searchTerm);
            
            const matchesStatus = statusValue === 'all' || workshop.status === statusValue;
            
            return matchesSearch && matchesStatus;
        });
        
        currentPage = 1;
        updateTable();
        updatePagination();
    }
    
    // Update the workshops table with filtered data
    function updateTable() {
        // Clear existing rows
        tbody.innerHTML = '';
        
        // Calculate pagination range
        const startIdx = (currentPage - 1) * workshopsPerPage;
        const endIdx = Math.min(startIdx + workshopsPerPage, filteredWorkshops.length);
        const workshopsToShow = filteredWorkshops.slice(startIdx, endIdx);
        
        if (workshopsToShow.length === 0) {
            // Show "no results" message
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="5" class="no-results">No workshops found matching your criteria</td>`;
            tbody.appendChild(tr);
            return;
        }
        
        // Add rows for each workshop
        workshopsToShow.forEach(workshop => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', workshop.id);
            
            // Format date and time
            const startDate = new Date(workshop.startDateTime);
            const endDate = new Date(workshop.endDateTime);
            
            const formattedDate = startDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
            
            const formattedTime = `${startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            
            tr.innerHTML = `
                <td>
                    <strong>${workshop.name}</strong>
                    <div class="workshop-description">${workshop.description}</div>
                </td>
                <td>
                    <div class="workshop-date">${formattedDate}</div>
                    <div class="workshop-time">${formattedTime}</div>
                </td>
                <td>${workshop.speakerName}</td>
                <td><span class="status-badge ${workshop.status}">${workshop.status.charAt(0).toUpperCase() + workshop.status.slice(1)}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary btn-view-workshop">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-secondary btn-edit-workshop">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </td>
            `;
            
            // Add click event to view button
            const viewBtn = tr.querySelector('.btn-view-workshop');
            viewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                viewWorkshopDetails(workshop.id);
            });
            
            // Add click event to edit button
            const editBtn = tr.querySelector('.btn-edit-workshop');
            editBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                editWorkshop(workshop.id);
            });
            
            // Add click event to entire row
            tr.addEventListener('click', function() {
                viewWorkshopDetails(workshop.id);
            });
            
            tbody.appendChild(tr);
        });
        
        // Update workshop statuses based on current date/time
        updateWorkshopStatuses();
    }
    
    // Update workshop statuses (upcoming, ongoing, completed)
    function updateWorkshopStatuses() {
        const now = new Date();
        
        allWorkshops.forEach(workshop => {
            const startDate = new Date(workshop.startDateTime);
            const endDate = new Date(workshop.endDateTime);
            
            if (now < startDate) {
                workshop.status = 'upcoming';
            } else if (now >= startDate && now <= endDate) {
                workshop.status = 'ongoing';
            } else {
                workshop.status = 'completed';
            }
        });
        
        // Refresh the table if we're filtering by status
        if (statusFilter.value !== 'all') {
            filterWorkshops();
        }
    }
    
    // Update pagination controls
    function updatePagination() {
        totalPages = Math.ceil(filteredWorkshops.length / workshopsPerPage);
        
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
    
    // Show workshop modal
    function showWorkshopModal() {
        document.getElementById('modal-workshop-title').textContent = 
            isEditMode ? 'Edit Workshop' : 'Add New Workshop';
        
        deleteWorkshopBtn.style.display = isEditMode ? 'inline-block' : 'none';
        modal.style.display = 'flex';
    }
    
    // View workshop details
    function viewWorkshopDetails(workshopId) {
        const workshop = allWorkshops.find(w => w.id == workshopId);
        if (!workshop) return;
        
        // Format agenda items
        const agendaItems = workshop.agenda.split('\n')
            .map(item => `<li>${item}</li>`)
            .join('');
        
        // Create modal content
        const modalContent = `
            <div class="workshop-details">
                <h4>${workshop.name}</h4>
                <p><strong>Meeting Link:</strong> <a href="${workshop.link}" target="_blank">${workshop.link}</a></p>
                
                <div class="workshop-time">
                    <p><strong>Date:</strong> ${new Date(workshop.startDateTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Time:</strong> ${new Date(workshop.startDateTime).toLocaleTimeString()} - ${new Date(workshop.endDateTime).toLocaleTimeString()}</p>
                </div>
                
                <div class="workshop-description">
                    <h5>Description</h5>
                    <p>${workshop.description}</p>
                </div>
                
                <div class="workshop-speaker">
                    <h5>Speaker</h5>
                    <p><strong>${workshop.speakerName}</strong></p>
                    <p>${workshop.speakerBio}</p>
                </div>
                
                <div class="workshop-agenda">
                    <h5>Agenda</h5>
                    <ul>${agendaItems}</ul>
                </div>
                
                ${workshop.materials.length > 0 ? `
                <div class="workshop-materials">
                    <h5>Materials</h5>
                    <div class="materials-list">
                        ${workshop.materials.map(material => `
                            <a href="#" class="material-item">
                                <i class="fas fa-file-pdf"></i> ${material.name}
                            </a>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        // Show in a modal or dedicated view page
        alert(workshop.name); // Simplified for this example - replace with actual modal implementation
    }
    
    // Edit workshop
    function editWorkshop(workshopId) {
        const workshop = allWorkshops.find(w => w.id == workshopId);
        if (!workshop) return;
        
        isEditMode = true;
        currentWorkshopId = workshopId;
        
        // Fill the form with workshop data
        document.getElementById('workshop-id').value = workshop.id;
        document.getElementById('workshop-name').value = workshop.name;
        document.getElementById('workshop-link').value = workshop.link;
        document.getElementById('start-datetime').value = workshop.startDateTime;
        document.getElementById('end-datetime').value = workshop.endDateTime;
        document.getElementById('workshop-description').value = workshop.description;
        document.getElementById('speaker-name').value = workshop.speakerName;
        document.getElementById('speaker-bio').value = workshop.speakerBio;
        document.getElementById('workshop-agenda').value = workshop.agenda;
        
        showWorkshopModal();
    }
    
    // Save workshop (create or update)
    function saveWorkshop() {
        // Validate form
        if (!workshopForm.checkValidity()) {
            workshopForm.reportValidity();
            return;
        }
        
        const workshopData = {
            id: isEditMode ? currentWorkshopId : allWorkshops.length > 0 ? Math.max(...allWorkshops.map(w => w.id)) + 1 : 1,
            name: document.getElementById('workshop-name').value,
            link: document.getElementById('workshop-link').value,
            startDateTime: document.getElementById('start-datetime').value,
            endDateTime: document.getElementById('end-datetime').value,
            description: document.getElementById('workshop-description').value,
            speakerName: document.getElementById('speaker-name').value,
            speakerBio: document.getElementById('speaker-bio').value,
            agenda: document.getElementById('workshop-agenda').value,
            materials: [] // Handle file uploads in a real implementation
        };
        
        if (isEditMode) {
            // Update existing workshop
            const index = allWorkshops.findIndex(w => w.id == currentWorkshopId);
            if (index !== -1) {
                allWorkshops[index] = workshopData;
                showToast('Workshop updated successfully');
            }
        } else {
            // Add new workshop
            allWorkshops.push(workshopData);
            showToast('Workshop created successfully');
        }
        
        // Close modal and refresh table
        modal.style.display = 'none';
        workshopForm.reset();
        filterWorkshops();
    }
    
    // Delete workshop
    function deleteWorkshop() {
        if (!confirm('Are you sure you want to delete this workshop?')) return;
        
        allWorkshops = allWorkshops.filter(w => w.id != currentWorkshopId);
        
        // Close modal and refresh table
        modal.style.display = 'none';
        workshopForm.reset();
        filterWorkshops();
        
        showToast('Workshop deleted successfully');
    }
    
    // Show toast notification
    function showToast(message, type = 'success') {
        console.log(`${type.toUpperCase()}: ${message}`);
        alert(`${type.toUpperCase()}: ${message}`);
    }
    
    // Initialize the page
    init();
});
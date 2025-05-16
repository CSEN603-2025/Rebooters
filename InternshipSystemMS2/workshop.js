document.addEventListener('DOMContentLoaded', function() {
    const workshopList = document.getElementById('workshopList');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const workshopDetails = document.getElementById('workshopDetails');
    const workshopContent = document.getElementById('workshopContent');
    
    // Sample workshop data
    const workshops = [
        {
            id: 1,
            title: "Career Development Workshop",
            category: "career",
            date: "2024-03-15",
            time: "14:00",
            duration: "2 hours",
            location: "Room 101",
            capacity: 30,
            registered: 15,
            description: "Learn essential skills for career development and job search strategies."
        },
        // Add more workshops...
    ];
    
    // Save workshops to localStorage if not exists
    if (!localStorage.getItem('workshops')) {
        localStorage.setItem('workshops', JSON.stringify(workshops));
    }
    
    // Load and render workshops
    function loadWorkshops() {
        const workshops = JSON.parse(localStorage.getItem('workshops')) || [];
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        
        const filteredWorkshops = workshops.filter(workshop => {
            const matchesSearch = workshop.title.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || workshop.category === category;
            return matchesSearch && matchesCategory;
        });
        
        renderWorkshops(filteredWorkshops);
    }
    
    function renderWorkshops(workshops) {
        workshopList.innerHTML = workshops.map(workshop => `
            <div class="workshop-card">
                <h3>${workshop.title}</h3>
                <p><strong>Date:</strong> ${new Date(workshop.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${workshop.time}</p>
                <p><strong>Duration:</strong> ${workshop.duration}</p>
                <p><strong>Location:</strong> ${workshop.location}</p>
                <p><strong>Spots:</strong> ${workshop.registered}/${workshop.capacity}</p>
                <button onclick="showWorkshopDetails(${workshop.id})">View Details</button>
                <button onclick="registerForWorkshop(${workshop.id})" 
                        ${workshop.registered >= workshop.capacity ? 'disabled' : ''}>
                    Register
                </button>
            </div>
        `).join('');
    }
    
    // Event listeners
    searchInput.addEventListener('input', loadWorkshops);
    categoryFilter.addEventListener('change', loadWorkshops);
    
    // Initial load
    loadWorkshops();
});

function showWorkshopDetails(workshopId) {
    const workshops = JSON.parse(localStorage.getItem('workshops')) || [];
    const workshop = workshops.find(w => w.id === workshopId);
    
    if (!workshop) return;
    
    const workshopDetails = document.getElementById('workshopDetails');
    const workshopContent = document.getElementById('workshopContent');
    
    workshopContent.innerHTML = `
        <h2>${workshop.title}</h2>
        <p><strong>Category:</strong> ${workshop.category}</p>
        <p><strong>Date:</strong> ${new Date(workshop.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${workshop.time}</p>
        <p><strong>Duration:</strong> ${workshop.duration}</p>
        <p><strong>Location:</strong> ${workshop.location}</p>
        <p><strong>Description:</strong> ${workshop.description}</p>
        <p><strong>Available Spots:</strong> ${workshop.capacity - workshop.registered}</p>
    `;
    
    workshopDetails.style.display = 'block';
}

function registerForWorkshop(workshopId) {
    const workshops = JSON.parse(localStorage.getItem('workshops')) || [];
    const workshop = workshops.find(w => w.id === workshopId);
    
    if (!workshop || workshop.registered >= workshop.capacity) {
        alert('Workshop is full!');
        return;
    }
    
    // Get user's registered workshops
    const userWorkshops = JSON.parse(localStorage.getItem('userWorkshops')) || [];
    
    // Check if already registered
    if (userWorkshops.includes(workshopId)) {
        alert('You are already registered for this workshop!');
        return;
    }
    
    // Update workshop registration
    workshop.registered++;
    localStorage.setItem('workshops', JSON.stringify(workshops));
    
    // Add to user's workshops
    userWorkshops.push(workshopId);
    localStorage.setItem('userWorkshops', JSON.stringify(userWorkshops));
    
    // Reload workshops
    loadWorkshops();
    
    alert('Successfully registered for the workshop!');
} 
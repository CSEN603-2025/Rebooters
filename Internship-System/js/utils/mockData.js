const mockData = {
    // Users
    users: [
        {
            id: 1,
            email: "student@guc.edu.eg",
            password: "student123",
            role: "student",
            name: "Ahmed Mohamed",
            major: "Computer Science",
            semester: 8,
            jobInterests: ["Web Development", "AI"],
            applications: [101, 102]
        },
        // Add all other roles...
    ],
    
    // Companies
    companies: [
        {
            id: 1,
            name: "Tech Solutions Inc.",
            industry: "IT",
            size: "medium",
            email: "hr@techsolutions.com",
            status: "approved",
            logo: "assets/images/logos/company-logos/tech-solutions.png",
            documents: ["assets/documents/company1-tax.pdf"],
            internships: [201, 202]
        }
    ],
    
    // Internships
    internships: [
        {
            id: 201,
            companyId: 1,
            title: "Frontend Developer Intern",
            description: "Develop modern web applications...",
            duration: "3 months",
            paid: true,
            salary: "3000 EGP",
            skills: ["HTML", "CSS", "JavaScript"],
            status: "active",
            applications: [101, 103]
        }
    ],
    
    // Applications
    applications: [
        {
            id: 101,
            internshipId: 201,
            studentId: 1,
            status: "pending",
            documents: ["assets/documents/student1-cv.pdf"],
            dateApplied: "2023-05-15"
        }
    ],
    
    // Reports
    reports: [
        {
            id: 301,
            studentId: 1,
            internshipId: 201,
            title: "My Summer Internship Experience",
            status: "submitted",
            courses: ["CSEN 701", "CSEN 702"],
            evaluation: "Great learning experience...",
            companyRating: 4.5
        }
    ],
    
    // Add all other entities from requirements...
    workshops: [],
    evaluations: [],
    notifications: []
};
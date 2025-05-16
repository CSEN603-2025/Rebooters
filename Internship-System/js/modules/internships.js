function loadInternships() {
    const table = document.querySelector('#internshipTable');
    const internships = [
        { title: 'Software Intern', company: 'Valeo', status: 'Open' },
        { title: 'Data Analyst', company: 'Vodafone', status: 'Closed' }
    ];

    internships.forEach(int => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${int.title}</td><td>${int.company}</td><td>${int.status}</td>`;
        table.appendChild(row);
    });
}

function loadApplications() {
    const list = document.querySelector('#applicationsList');
    const apps = ['Internship A', 'Internship B'];

    apps.forEach(app => {
        const li = document.createElement('li');
        li.textContent = app;
        list.appendChild(li);
    });
}


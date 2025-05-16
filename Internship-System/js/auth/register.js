document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#registerBtn').addEventListener('click', () => {
        const companyName = document.querySelector('#companyName').value;
        const email = document.querySelector('#email').value;

        if (companyName && email) {
            alert('Company registered (dummy).');
        } else {
            alert('Please complete all fields.');
        }
    });
});

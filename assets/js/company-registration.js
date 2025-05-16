document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const registerBtn = document.getElementById('register-company-btn');
    const registerModal = document.getElementById('company-registration-modal');
    const registerForm = document.getElementById('company-registration-form');
    const logoInput = document.getElementById('reg-company-logo');
    const logoPreview = document.getElementById('reg-logo-preview');
    const previewImage = document.getElementById('reg-preview-image');
    const removeLogoBtn = document.getElementById('reg-remove-logo');
    const logoFileName = document.getElementById('logo-file-name');
    const docsInput = document.getElementById('reg-verification-docs');
    const docsFileName = document.getElementById('docs-file-name');
    
    // Open registration modal
    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        registerModal.style.display = 'flex';
    });
    
    // Close modal when clicking X or cancel
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            registerModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    registerModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
    
    // Logo upload preview
    logoInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            
            // Validate file
            if (!file.type.match('image.*')) {
                alert('Please select an image file (JPEG, PNG)');
                return;
            }
            
            if (file.size > 2 * 1024 * 1024) {
                alert('File size should not exceed 2MB');
                return;
            }
            
            // Update file name display
            logoFileName.textContent = file.name;
            
            // Show preview
            const reader = new FileReader();
            reader.onload = function(event) {
                previewImage.src = event.target.result;
                logoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Remove logo
    removeLogoBtn.addEventListener('click', function() {
        logoInput.value = '';
        previewImage.src = '#';
        logoPreview.style.display = 'none';
        logoFileName.textContent = 'Choose file (max 2MB)';
    });
    
    // Document upload display
    docsInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const files = e.target.files;
            if (files.length === 1) {
                docsFileName.textContent = files[0].name;
            } else {
                docsFileName.textContent = `${files.length} files selected`;
            }
        }
    });
    
    // Form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        const companyName = document.getElementById('reg-company-name').value.trim();
        const companyEmail = document.getElementById('reg-company-email').value.trim();
        const industry = document.getElementById('reg-company-industry').value;
        const size = document.getElementById('reg-company-size').value;
        const hasLogo = logoInput.files.length > 0;
        const hasDocs = docsInput.files.length > 0;
        
        if (!companyName || !companyEmail || !industry || !size || !hasDocs) {
            alert('Please fill in all required fields and upload verification documents');
            return;
        }
        
        // In a real app, you would send this data to your backend
        const formData = {
            companyName,
            companyEmail,
            industry,
            size,
            hasLogo,
            docsCount: docsInput.files.length
        };
        
        console.log('Company registration data:', formData);
        
        // Show success message
        alert('Company registration submitted successfully! Your application will be reviewed by the SCAD office.');
        
        // Close modal and reset form
        registerModal.style.display = 'none';
        this.reset();
        previewImage.src = '#';
        logoPreview.style.display = 'none';
        logoFileName.textContent = 'Choose file (max 2MB)';
        docsFileName.textContent = 'Upload documents (PDF/Word/Image)';
        
        // In a real app, you would redirect to login or dashboard
        // window.location.href = 'company/dashboard.html';
    });
});
// Add this to your existing code
function adjustModalHeight() {
    const modal = document.getElementById('company-registration-modal');
    const modalContent = modal.querySelector('.modal-content');
    const windowHeight = window.innerHeight;
    
    if (modalContent.offsetHeight > windowHeight * 0.9) {
        modalContent.style.maxHeight = '90vh';
        modalContent.querySelector('.modal-body').style.overflowY = 'auto';
    } else {
        modalContent.style.maxHeight = 'none';
    }
}

// Call this when opening modal
document.getElementById('register-company-btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('company-registration-modal').style.display = 'flex';
    setTimeout(adjustModalHeight, 10); // Small delay to allow rendering
});

// And on window resize
window.addEventListener('resize', function() {
    if (document.getElementById('company-registration-modal').style.display === 'flex') {
        adjustModalHeight();
    }
});
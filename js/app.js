// Application Portal - JavaScript Functions
// Compatible with Power Apps/D365 environment standards

// Storage key for applications
const STORAGE_KEY = 'application_portal_data';
const PROFILE_KEY = 'application_portal_profile';

// Initialize application storage
function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        const initialData = {
            applications: [],
            nextId: 1
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
    
    if (!localStorage.getItem(PROFILE_KEY)) {
        const initialProfile = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            country: 'United States',
            city: 'New York',
            bio: 'Professional with experience in various fields...',
            memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
        };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(initialProfile));
    }
}

// Get all applications
function getAllApplications() {
    initializeStorage();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data.applications;
}

// Get application by ID
function getApplicationById(id) {
    const applications = getAllApplications();
    return applications.find(app => app.id === parseInt(id));
}

// Save application
function saveApplication(application) {
    initializeStorage();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    
    application.id = data.nextId;
    application.submittedDate = new Date().toISOString();
    application.status = 'pending';
    
    data.applications.push(application);
    data.nextId++;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return application.id;
}

// Remove application
function removeApplication(id) {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    data.applications = data.applications.filter(app => app.id !== parseInt(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Update application status
function updateStatus(id, status, notes) {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const application = data.applications.find(app => app.id === parseInt(id));
    
    if (application) {
        application.status = status;
        application.notes = notes;
        application.lastUpdated = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
}

// Submit application form
function submitApplication() {
    const application = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        applicationType: document.getElementById('applicationType').value,
        position: document.getElementById('position').value,
        description: document.getElementById('description').value,
        experience: document.getElementById('experience').value,
        expectedSalary: document.getElementById('expectedSalary').value,
        skills: document.getElementById('skills').value,
        referenceSource: document.getElementById('referenceSource').value
    };

    // Validate
    if (application.description.length < 50) {
        showError('Description must be at least 50 characters long.');
        return;
    }

    try {
        const applicationId = saveApplication(application);
        document.getElementById('applicationId').textContent = applicationId;
        document.getElementById('successMessage').classList.remove('d-none');
        document.getElementById('errorMessage').classList.add('d-none');
        document.getElementById('applicationForm').reset();
        
        // Scroll to success message
        document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        showError('Error submitting application. Please try again.');
    }
}

// Load applications for user view
function loadApplications() {
    const applications = getAllApplications();
    const tbody = document.getElementById('applicationsTableBody');
    const noApplicationsDiv = document.getElementById('noApplications');
    const table = document.getElementById('applicationsTable');

    // Apply filters
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';

    let filteredApps = applications.filter(app => {
        const matchesSearch = !searchTerm || 
            app.position.toLowerCase().includes(searchTerm) ||
            app.firstName.toLowerCase().includes(searchTerm) ||
            app.lastName.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || app.status === statusFilter;
        const matchesType = !typeFilter || app.applicationType === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
    });

    if (filteredApps.length === 0) {
        tbody.innerHTML = '';
        table.classList.add('d-none');
        noApplicationsDiv.classList.remove('d-none');
        return;
    }

    table.classList.remove('d-none');
    noApplicationsDiv.classList.add('d-none');

    tbody.innerHTML = filteredApps.map(app => `
        <tr>
            <td>${app.id}</td>
            <td><span class="badge bg-secondary">${formatApplicationType(app.applicationType)}</span></td>
            <td>${app.position}</td>
            <td>${formatDate(app.submittedDate)}</td>
            <td><span class="status-badge status-${app.status}">${formatStatus(app.status)}</span></td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="viewApplication(${app.id})">
                    <i class="bi bi-eye"></i> View
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteApplication(${app.id})">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Load applications for admin view
function loadAdminApplications() {
    const applications = getAllApplications();
    const tbody = document.getElementById('adminApplicationsTableBody');

    // Apply filters
    const searchTerm = document.getElementById('adminSearchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('adminStatusFilter')?.value || '';
    const typeFilter = document.getElementById('adminTypeFilter')?.value || '';

    let filteredApps = applications.filter(app => {
        const matchesSearch = !searchTerm || 
            app.position.toLowerCase().includes(searchTerm) ||
            app.firstName.toLowerCase().includes(searchTerm) ||
            app.lastName.toLowerCase().includes(searchTerm) ||
            app.email.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || app.status === statusFilter;
        const matchesType = !typeFilter || app.applicationType === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
    });

    tbody.innerHTML = filteredApps.map(app => `
        <tr>
            <td>${app.id}</td>
            <td>${app.firstName} ${app.lastName}</td>
            <td><span class="badge bg-secondary">${formatApplicationType(app.applicationType)}</span></td>
            <td>${app.position}</td>
            <td>${formatDate(app.submittedDate)}</td>
            <td><span class="status-badge status-${app.status}">${formatStatus(app.status)}</span></td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-primary" onclick="viewAdminApplication(${app.id})">
                    <i class="bi bi-eye"></i> View
                </button>
                <button class="btn btn-sm btn-warning" onclick="showUpdateStatusModal(${app.id})">
                    <i class="bi bi-pencil"></i> Update
                </button>
            </td>
        </tr>
    `).join('');
}

// Update statistics on home page
function updateStatistics() {
    const applications = getAllApplications();
    
    const total = applications.length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const review = applications.filter(app => app.status === 'under_review').length;

    document.getElementById('totalApplications').textContent = total;
    document.getElementById('approvedApplications').textContent = approved;
    document.getElementById('pendingApplications').textContent = pending;
    document.getElementById('reviewApplications').textContent = review;
}

// Update admin statistics
function updateAdminStatistics() {
    const applications = getAllApplications();
    
    const total = applications.length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const review = applications.filter(app => app.status === 'under_review').length;

    document.getElementById('adminTotalApplications').textContent = total;
    document.getElementById('adminApprovedApplications').textContent = approved;
    document.getElementById('adminPendingApplications').textContent = pending;
    document.getElementById('adminReviewApplications').textContent = review;
}

// Show application modal
function showApplicationModal(application) {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6 mb-3">
                <strong>Application ID:</strong>
                <p>${application.id}</p>
            </div>
            <div class="col-md-6 mb-3">
                <strong>Status:</strong>
                <p><span class="status-badge status-${application.status}">${formatStatus(application.status)}</span></p>
            </div>
        </div>
        <hr>
        <h6>Personal Information</h6>
        <div class="row">
            <div class="col-md-6 mb-3">
                <strong>Name:</strong>
                <p>${application.firstName} ${application.lastName}</p>
            </div>
            <div class="col-md-6 mb-3">
                <strong>Email:</strong>
                <p>${application.email}</p>
            </div>
            <div class="col-md-6 mb-3">
                <strong>Phone:</strong>
                <p>${application.phone}</p>
            </div>
        </div>
        <hr>
        <h6>Application Details</h6>
        <div class="row">
            <div class="col-md-6 mb-3">
                <strong>Type:</strong>
                <p>${formatApplicationType(application.applicationType)}</p>
            </div>
            <div class="col-md-6 mb-3">
                <strong>Position/Program:</strong>
                <p>${application.position}</p>
            </div>
            <div class="col-md-6 mb-3">
                <strong>Experience:</strong>
                <p>${application.experience || 'N/A'} years</p>
            </div>
            <div class="col-md-6 mb-3">
                <strong>Expected Salary:</strong>
                <p>${application.expectedSalary ? '$' + application.expectedSalary : 'N/A'}</p>
            </div>
        </div>
        <div class="mb-3">
            <strong>Description/Cover Letter:</strong>
            <p>${application.description}</p>
        </div>
        <div class="mb-3">
            <strong>Skills:</strong>
            <p>${application.skills || 'N/A'}</p>
        </div>
        <div class="mb-3">
            <strong>Reference Source:</strong>
            <p>${application.referenceSource ? formatApplicationType(application.referenceSource) : 'N/A'}</p>
        </div>
        <div class="mb-3">
            <strong>Submitted Date:</strong>
            <p>${formatDate(application.submittedDate)}</p>
        </div>
        ${application.notes ? `
        <div class="mb-3">
            <strong>Admin Notes:</strong>
            <p>${application.notes}</p>
        </div>
        ` : ''}
    `;

    const modal = new bootstrap.Modal(document.getElementById('applicationModal'));
    modal.show();
}

// Show admin application modal
function showAdminApplicationModal(application) {
    const modalBody = document.getElementById('adminModalBody');
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6 mb-3">
                <strong>Application ID:</strong>
                <p>${application.id}</p>
            </div>
            <div class="col-md-6 mb-3">
                <strong>Status:</strong>
                <p><span class="status-badge status-${application.status}">${formatStatus(application.status)}</span></p>
            </div>
        </div>
        <hr>
        <h6>Personal Information</h6>
        <div class="row">
            <div class="col-md-6 mb-3">
                <strong>Name:</strong>
                <p>${application.firstName} ${application.lastName}</p>
            </div>
            <div class="col-md-6 mb-3">
                <strong>Email:</strong>
                <p>${application.email}</p>
            </div>
            <div class="col-md-6 mb-3">
                <strong>Phone:</strong>
                <p>${application.phone}</p>
            </div>
        </div>
        <hr>
        <h6>Application Details</h6>
        <div class="row">
            <div class="col-md-6 mb-3">
                <strong>Type:</strong>
                <p>${formatApplicationType(application.applicationType)}</p>
            </div>
            <div class="col-md-6 mb-3">
                <strong>Position/Program:</strong>
                <p>${application.position}</p>
            </div>
            <div class="col-md-6 mb-3">
                <strong>Experience:</strong>
                <p>${application.experience || 'N/A'} years</p>
            </div>
            <div class="col-md-6 mb-3">
                <strong>Expected Salary:</strong>
                <p>${application.expectedSalary ? '$' + application.expectedSalary : 'N/A'}</p>
            </div>
        </div>
        <div class="mb-3">
            <strong>Description/Cover Letter:</strong>
            <p>${application.description}</p>
        </div>
        <div class="mb-3">
            <strong>Skills:</strong>
            <p>${application.skills || 'N/A'}</p>
        </div>
        <div class="mb-3">
            <strong>Reference Source:</strong>
            <p>${application.referenceSource ? formatApplicationType(application.referenceSource) : 'N/A'}</p>
        </div>
        <div class="mb-3">
            <strong>Submitted Date:</strong>
            <p>${formatDate(application.submittedDate)}</p>
        </div>
        ${application.lastUpdated ? `
        <div class="mb-3">
            <strong>Last Updated:</strong>
            <p>${formatDate(application.lastUpdated)}</p>
        </div>
        ` : ''}
        ${application.notes ? `
        <div class="mb-3">
            <strong>Admin Notes:</strong>
            <p>${application.notes}</p>
        </div>
        ` : ''}
    `;

    const modal = new bootstrap.Modal(document.getElementById('adminApplicationModal'));
    modal.show();
}

// Profile functions
function loadProfileData() {
    const profile = JSON.parse(localStorage.getItem(PROFILE_KEY));
    
    document.getElementById('profileName').textContent = `${profile.firstName} ${profile.lastName}`;
    document.getElementById('profileEmail').textContent = profile.email;
    document.getElementById('displayFirstName').textContent = profile.firstName;
    document.getElementById('displayLastName').textContent = profile.lastName;
    document.getElementById('displayEmail').textContent = profile.email;
    document.getElementById('displayPhone').textContent = profile.phone;
    document.getElementById('displayCountry').textContent = profile.country;
    document.getElementById('displayCity').textContent = profile.city;
    document.getElementById('displayBio').textContent = profile.bio;
    document.getElementById('profileMemberSince').textContent = profile.memberSince;

    // Load form values
    document.getElementById('editFirstName').value = profile.firstName;
    document.getElementById('editLastName').value = profile.lastName;
    document.getElementById('editEmail').value = profile.email;
    document.getElementById('editPhone').value = profile.phone;
    document.getElementById('editCountry').value = profile.country;
    document.getElementById('editCity').value = profile.city;
    document.getElementById('editBio').value = profile.bio;

    // Update stats
    const applications = getAllApplications();
    document.getElementById('profileTotalApps').textContent = applications.length;
    document.getElementById('profileApprovedApps').textContent = 
        applications.filter(app => app.status === 'approved').length;
    document.getElementById('profilePendingApps').textContent = 
        applications.filter(app => app.status === 'pending').length;
}

function updateProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    alert('Profile updated successfully!');
}

function loadRecentApplications() {
    const applications = getAllApplications();
    const recentApps = applications.slice(-5).reverse(); // Last 5 applications
    const list = document.getElementById('recentApplicationsList');

    if (recentApps.length === 0) {
        list.innerHTML = '<p class="text-muted text-center">No applications yet.</p>';
        return;
    }

    list.innerHTML = recentApps.map(app => `
        <a href="#" class="list-group-item list-group-item-action" onclick="viewApplication(${app.id}); return false;">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${app.position}</h6>
                <small>${formatDate(app.submittedDate)}</small>
            </div>
            <p class="mb-1"><small>${formatApplicationType(app.applicationType)}</small></p>
            <small><span class="status-badge status-${app.status}">${formatStatus(app.status)}</span></small>
        </a>
    `).join('');
}

// Generate report
function generateReport() {
    const applications = getAllApplications();
    
    // Create CSV content
    let csvContent = 'ID,Applicant Name,Email,Type,Position,Status,Submitted Date\n';
    
    applications.forEach(app => {
        csvContent += `${app.id},"${app.firstName} ${app.lastName}",${app.email},${app.applicationType},${app.position},${app.status},${formatDate(app.submittedDate)}\n`;
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatStatus(status) {
    return status.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatApplicationType(type) {
    return type.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('d-none');
        errorDiv.scrollIntoView({ behavior: 'smooth' });
    } else {
        alert(message);
    }
}

// Initialize storage on page load
initializeStorage();

// API Base URL
const API_BASE = '/api';

// Global variables for charts
let bloodGroupChart = null;
let donationsChart = null;

// Current data storage
let currentData = {
    donors: [],
    patients: [],
    inventory: [],
    requests: [],
    donations: []
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM to be fully loaded
    setTimeout(() => {
        showSection('dashboard');
        loadDashboardData();
        setupEventListeners();
    }, 100);
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('donor-search').addEventListener('input', filterDonors);
    document.getElementById('donor-blood-filter').addEventListener('change', filterDonors);
    
    document.getElementById('patient-search').addEventListener('input', filterPatients);
    document.getElementById('patient-blood-filter').addEventListener('change', filterPatients);
    
    document.getElementById('inventory-search').addEventListener('input', filterInventory);
    document.getElementById('inventory-blood-filter').addEventListener('change', filterInventory);
    
    document.getElementById('request-search').addEventListener('input', filterRequests);
    document.getElementById('request-status-filter').addEventListener('change', filterRequests);
    
    document.getElementById('donation-search').addEventListener('input', filterDonations);
    document.getElementById('donation-blood-filter').addEventListener('change', filterDonations);
}

// Navigation
function showSection(sectionName) {
    try {
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            if (section) {
                section.classList.add('section-hidden');
            }
        });
        
        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('section-hidden');
        }
        
        // Update navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            if (btn) {
                btn.classList.remove('btn-primary');
                btn.classList.add('hover:bg-white', 'hover:bg-opacity-20');
            }
        });
        
        // Highlight active button
        const activeBtn = document.querySelector(`[onclick*="showSection('${sectionName}')"]`);
        if (activeBtn) {
            activeBtn.classList.add('btn-primary');
            activeBtn.classList.remove('hover:bg-white', 'hover:bg-opacity-20');
        }
    } catch (error) {
        console.error('Error in showSection:', error);
    }
    
    // Load section data
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'donors':
            loadDonors();
            break;
        case 'patients':
            loadPatients();
            break;
        case 'inventory':
            loadInventory();
            break;
        case 'requests':
            loadRequests();
            break;
        case 'donations':
            loadDonations();
            break;
    }
}

// API Functions
async function fetchAPI(endpoint, method = 'GET', data = null) {
    try {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            config.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'API request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        showNotification(error.message, 'error');
        throw error;
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        const stats = await fetchAPI('/dashboard-stats');
        updateMetricCards(stats.summary_cards);
        updateCharts(stats.charts);
        updateAlerts(stats.alerts);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function updateMetricCards(data) {
    document.getElementById('total-donors').textContent = data.total_donors;
    document.getElementById('total-patients').textContent = data.total_patients;
    document.getElementById('total-blood-units').textContent = data.total_blood_units;
    document.getElementById('pending-requests').textContent = data.pending_requests;
    document.getElementById('critical-requests').textContent = data.critical_requests;
    document.getElementById('recent-donations').textContent = data.recent_donations;
}

function updateCharts(data) {
    // Blood Group Distribution Chart
    const bloodGroupCtx = document.getElementById('bloodGroupChart').getContext('2d');
    
    if (bloodGroupChart) {
        bloodGroupChart.destroy();
    }
    
    const bloodGroups = Object.keys(data.blood_group_distribution);
    const bloodGroupValues = Object.values(data.blood_group_distribution);
    
    bloodGroupChart = new Chart(bloodGroupCtx, {
        type: 'doughnut',
        data: {
            labels: bloodGroups,
            datasets: [{
                data: bloodGroupValues,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ],
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: { size: 12 }
                    }
                }
            }
        }
    });
    
    // Monthly Donations Chart
    const donationsCtx = document.getElementById('donationsChart').getContext('2d');
    
    if (donationsChart) {
        donationsChart.destroy();
    }
    
    const months = data.monthly_donations.map(item => item.month.split(' ')[0]);
    const donations = data.monthly_donations.map(item => item.donations);
    
    donationsChart = new Chart(donationsCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Donations',
                data: donations,
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                x: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        }
    });
}

function updateAlerts(alerts) {
    // Low Stock Alerts
    const lowStockContainer = document.getElementById('low-stock-alerts');
    lowStockContainer.innerHTML = '';
    
    if (alerts.low_stock.length === 0) {
        lowStockContainer.innerHTML = '<p class="text-white text-opacity-70">No low stock alerts</p>';
    } else {
        alerts.low_stock.forEach(item => {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert-low-stock text-white p-3 rounded-lg';
            alertDiv.innerHTML = `
                <div class="flex justify-between items-center">
                    <span><strong>${item.blood_group}</strong> - Only ${item.units_available} units left</span>
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
            `;
            lowStockContainer.appendChild(alertDiv);
        });
    }
    
    // Expiry Alerts
    const expiryContainer = document.getElementById('expiry-alerts');
    expiryContainer.innerHTML = '';
    
    if (alerts.expiry_alerts.length === 0) {
        expiryContainer.innerHTML = '<p class="text-white text-opacity-70">No expiry alerts</p>';
    } else {
        alerts.expiry_alerts.forEach(item => {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert-expiry text-white p-3 rounded-lg';
            const expiryDate = new Date(item.expiry_date).toLocaleDateString();
            alertDiv.innerHTML = `
                <div class="flex justify-between items-center">
                    <span><strong>${item.blood_group}</strong> - Expires ${expiryDate}</span>
                    <i class="fas fa-calendar-times"></i>
                </div>
            `;
            expiryContainer.appendChild(alertDiv);
        });
    }
}

// Donor Functions
async function loadDonors() {
    try {
        const response = await fetchAPI('/donors');
        currentData.donors = response.donors;
        displayDonors(currentData.donors);
    } catch (error) {
        console.error('Error loading donors:', error);
    }
}

function displayDonors(donors) {
    const tbody = document.getElementById('donors-table-body');
    tbody.innerHTML = '';
    
    donors.forEach(donor => {
        const row = document.createElement('tr');
        row.className = 'border-b border-white border-opacity-20 hover:bg-white hover:bg-opacity-10 transition-colors';
        
        const lastDonation = donor.last_donation_date 
            ? new Date(donor.last_donation_date).toLocaleDateString()
            : 'Never';
        
        row.innerHTML = `
            <td class="px-4 py-3">${donor.name}</td>
            <td class="px-4 py-3">${donor.age}</td>
            <td class="px-4 py-3">
                <span class="bg-red-500 text-white px-2 py-1 rounded-full text-sm">${donor.blood_group}</span>
            </td>
            <td class="px-4 py-3">${donor.contact}</td>
            <td class="px-4 py-3">${donor.location}</td>
            <td class="px-4 py-3">${lastDonation}</td>
            <td class="px-4 py-3">
                <button onclick="editDonor(${donor.id})" class="text-blue-400 hover:text-blue-300 mr-2">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteDonor(${donor.id})" class="text-red-400 hover:text-red-300">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterDonors() {
    const searchTerm = document.getElementById('donor-search').value.toLowerCase();
    const bloodGroupFilter = document.getElementById('donor-blood-filter').value;
    
    const filtered = currentData.donors.filter(donor => {
        const matchesSearch = donor.name.toLowerCase().includes(searchTerm) ||
                            donor.contact.includes(searchTerm) ||
                            donor.location.toLowerCase().includes(searchTerm);
        const matchesBloodGroup = !bloodGroupFilter || donor.blood_group === bloodGroupFilter;
        
        return matchesSearch && matchesBloodGroup;
    });
    
    displayDonors(filtered);
}

function showAddDonorForm() {
    document.getElementById('modal-title').textContent = 'Add New Donor';
    document.getElementById('modal-content').innerHTML = `
        <form id="donor-form" onsubmit="saveDonor(event)">
            <div class="space-y-4">
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Name</label>
                    <input type="text" name="name" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-white text-sm font-medium mb-1">Age</label>
                        <input type="number" name="age" min="18" max="65" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-white text-sm font-medium mb-1">Gender</label>
                        <select name="gender" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Blood Group</label>
                    <select name="blood_group" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Contact</label>
                    <input type="tel" name="contact" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Location</label>
                    <input type="text" name="location" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Last Donation Date (Optional)</label>
                    <input type="date" name="last_donation_date" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            <div class="flex justify-end space-x-4 mt-6">
                <button type="button" onclick="closeModal()" class="px-4 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors">
                    Cancel
                </button>
                <button type="submit" class="btn-primary px-4 py-2 text-white rounded-lg">
                    Add Donor
                </button>
            </div>
        </form>
    `;
    showModal();
}

async function saveDonor(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await fetchAPI('/donors', 'POST', data);
        showNotification('Donor added successfully!', 'success');
        closeModal();
        loadDonors();
    } catch (error) {
        console.error('Error saving donor:', error);
    }
}

async function deleteDonor(id) {
    if (confirm('Are you sure you want to delete this donor?')) {
        try {
            await fetchAPI(`/donors/${id}`, 'DELETE');
            showNotification('Donor deleted successfully!', 'success');
            loadDonors();
        } catch (error) {
            console.error('Error deleting donor:', error);
        }
    }
}

// Patient Functions
async function loadPatients() {
    try {
        const response = await fetchAPI('/patients');
        currentData.patients = response.patients;
        displayPatients(currentData.patients);
    } catch (error) {
        console.error('Error loading patients:', error);
    }
}

function displayPatients(patients) {
    const tbody = document.getElementById('patients-table-body');
    tbody.innerHTML = '';
    
    patients.forEach(patient => {
        const row = document.createElement('tr');
        row.className = 'border-b border-white border-opacity-20 hover:bg-white hover:bg-opacity-10 transition-colors';
        
        row.innerHTML = `
            <td class="px-4 py-3">${patient.name}</td>
            <td class="px-4 py-3">${patient.age}</td>
            <td class="px-4 py-3">
                <span class="bg-red-500 text-white px-2 py-1 rounded-full text-sm">${patient.blood_group}</span>
            </td>
            <td class="px-4 py-3">${patient.contact}</td>
            <td class="px-4 py-3">${patient.location}</td>
            <td class="px-4 py-3">${patient.units_needed}</td>
            <td class="px-4 py-3">
                <button onclick="editPatient(${patient.id})" class="text-blue-400 hover:text-blue-300 mr-2">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deletePatient(${patient.id})" class="text-red-400 hover:text-red-300">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterPatients() {
    const searchTerm = document.getElementById('patient-search').value.toLowerCase();
    const bloodGroupFilter = document.getElementById('patient-blood-filter').value;
    
    const filtered = currentData.patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm) ||
                            patient.contact.includes(searchTerm) ||
                            patient.location.toLowerCase().includes(searchTerm);
        const matchesBloodGroup = !bloodGroupFilter || patient.blood_group === bloodGroupFilter;
        
        return matchesSearch && matchesBloodGroup;
    });
    
    displayPatients(filtered);
}

function showAddPatientForm() {
    document.getElementById('modal-title').textContent = 'Add New Patient';
    document.getElementById('modal-content').innerHTML = `
        <form id="patient-form" onsubmit="savePatient(event)">
            <div class="space-y-4">
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Name</label>
                    <input type="text" name="name" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-white text-sm font-medium mb-1">Age</label>
                        <input type="number" name="age" min="1" max="120" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-white text-sm font-medium mb-1">Blood Group</label>
                        <select name="blood_group" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Contact</label>
                    <input type="tel" name="contact" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Location</label>
                    <input type="text" name="location" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Units Needed</label>
                    <input type="number" name="units_needed" min="1" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            <div class="flex justify-end space-x-4 mt-6">
                <button type="button" onclick="closeModal()" class="px-4 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors">
                    Cancel
                </button>
                <button type="submit" class="btn-primary px-4 py-2 text-white rounded-lg">
                    Add Patient
                </button>
            </div>
        </form>
    `;
    showModal();
}

async function savePatient(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await fetchAPI('/patients', 'POST', data);
        showNotification('Patient added successfully!', 'success');
        closeModal();
        loadPatients();
    } catch (error) {
        console.error('Error saving patient:', error);
    }
}

async function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
        try {
            await fetchAPI(`/patients/${id}`, 'DELETE');
            showNotification('Patient deleted successfully!', 'success');
            loadPatients();
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    }
}

// Inventory Functions
async function loadInventory() {
    try {
        const response = await fetchAPI('/inventory');
        currentData.inventory = response.inventory;
        displayInventory(currentData.inventory);
    } catch (error) {
        console.error('Error loading inventory:', error);
    }
}

function displayInventory(inventory) {
    const tbody = document.getElementById('inventory-table-body');
    tbody.innerHTML = '';
    
    inventory.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'border-b border-white border-opacity-20 hover:bg-white hover:bg-opacity-10 transition-colors';
        
        const expiryDate = new Date(item.expiry_date);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        let statusClass = 'bg-green-500';
        let statusText = 'Good';
        
        if (daysUntilExpiry <= 7) {
            statusClass = 'bg-red-500';
            statusText = 'Expiring Soon';
        } else if (item.units_available < 10) {
            statusClass = 'bg-yellow-500';
            statusText = 'Low Stock';
        }
        
        row.innerHTML = `
            <td class="px-4 py-3">
                <span class="bg-red-500 text-white px-2 py-1 rounded-full text-sm">${item.blood_group}</span>
            </td>
            <td class="px-4 py-3">${item.units_available}</td>
            <td class="px-4 py-3">${expiryDate.toLocaleDateString()}</td>
            <td class="px-4 py-3">
                <span class="${statusClass} text-white px-2 py-1 rounded-full text-sm">${statusText}</span>
            </td>
            <td class="px-4 py-3">
                <button onclick="editInventory(${item.id})" class="text-blue-400 hover:text-blue-300 mr-2">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteInventory(${item.id})" class="text-red-400 hover:text-red-300">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterInventory() {
    const searchTerm = document.getElementById('inventory-search').value.toLowerCase();
    const bloodGroupFilter = document.getElementById('inventory-blood-filter').value;
    
    const filtered = currentData.inventory.filter(item => {
        const matchesSearch = item.blood_group.toLowerCase().includes(searchTerm);
        const matchesBloodGroup = !bloodGroupFilter || item.blood_group === bloodGroupFilter;
        
        return matchesSearch && matchesBloodGroup;
    });
    
    displayInventory(filtered);
}

function showAddInventoryForm() {
    document.getElementById('modal-title').textContent = 'Add Blood Units';
    document.getElementById('modal-content').innerHTML = `
        <form id="inventory-form" onsubmit="saveInventory(event)">
            <div class="space-y-4">
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Blood Group</label>
                    <select name="blood_group" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Units Available</label>
                    <input type="number" name="units_available" min="1" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Expiry Date</label>
                    <input type="date" name="expiry_date" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            <div class="flex justify-end space-x-4 mt-6">
                <button type="button" onclick="closeModal()" class="px-4 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors">
                    Cancel
                </button>
                <button type="submit" class="btn-primary px-4 py-2 text-white rounded-lg">
                    Add Blood Units
                </button>
            </div>
        </form>
    `;
    showModal();
}

async function saveInventory(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await fetchAPI('/inventory', 'POST', data);
        showNotification('Blood units added successfully!', 'success');
        closeModal();
        loadInventory();
    } catch (error) {
        console.error('Error saving inventory:', error);
    }
}

async function deleteInventory(id) {
    if (confirm('Are you sure you want to delete this inventory item?')) {
        try {
            await fetchAPI(`/inventory/${id}`, 'DELETE');
            showNotification('Inventory item deleted successfully!', 'success');
            loadInventory();
        } catch (error) {
            console.error('Error deleting inventory:', error);
        }
    }
}

// Request Functions
async function loadRequests() {
    try {
        const response = await fetchAPI('/requests');
        currentData.requests = response.requests;
        displayRequests(currentData.requests);
    } catch (error) {
        console.error('Error loading requests:', error);
    }
}

function displayRequests(requests) {
    const tbody = document.getElementById('requests-table-body');
    tbody.innerHTML = '';
    
    requests.forEach(request => {
        const row = document.createElement('tr');
        row.className = 'border-b border-white border-opacity-20 hover:bg-white hover:bg-opacity-10 transition-colors';
        
        let priorityClass = 'bg-blue-500';
        let statusClass = 'bg-yellow-500';
        
        switch(request.priority) {
            case 'Critical': priorityClass = 'bg-red-500'; break;
            case 'High': priorityClass = 'bg-orange-500'; break;
            case 'Medium': priorityClass = 'bg-blue-500'; break;
            case 'Low': priorityClass = 'bg-green-500'; break;
        }
        
        switch(request.status) {
            case 'Pending': statusClass = 'bg-yellow-500'; break;
            case 'Approved': statusClass = 'bg-blue-500'; break;
            case 'Fulfilled': statusClass = 'bg-green-500'; break;
            case 'Rejected': statusClass = 'bg-red-500'; break;
        }
        
        row.innerHTML = `
            <td class="px-4 py-3">${request.patient_name}</td>
            <td class="px-4 py-3">
                <span class="bg-red-500 text-white px-2 py-1 rounded-full text-sm">${request.blood_group}</span>
            </td>
            <td class="px-4 py-3">${request.units_requested}</td>
            <td class="px-4 py-3">${new Date(request.date).toLocaleDateString()}</td>
            <td class="px-4 py-3">
                <span class="${priorityClass} text-white px-2 py-1 rounded-full text-sm">${request.priority}</span>
            </td>
            <td class="px-4 py-3">
                <span class="${statusClass} text-white px-2 py-1 rounded-full text-sm">${request.status}</span>
            </td>
            <td class="px-4 py-3">
                <button onclick="editRequest(${request.id})" class="text-blue-400 hover:text-blue-300 mr-2">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteRequest(${request.id})" class="text-red-400 hover:text-red-300">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterRequests() {
    const searchTerm = document.getElementById('request-search').value.toLowerCase();
    const statusFilter = document.getElementById('request-status-filter').value;
    
    const filtered = currentData.requests.filter(request => {
        const matchesSearch = request.patient_name.toLowerCase().includes(searchTerm) ||
                            request.blood_group.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || request.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    displayRequests(filtered);
}

function showAddRequestForm() {
    document.getElementById('modal-title').textContent = 'New Blood Request';
    document.getElementById('modal-content').innerHTML = `
        <form id="request-form" onsubmit="saveRequest(event)">
            <div class="space-y-4">
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Patient ID</label>
                    <input type="number" name="patient_id" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Patient Name</label>
                    <input type="text" name="patient_name" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Blood Group</label>
                    <select name="blood_group" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Units Requested</label>
                    <input type="number" name="units_requested" min="1" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-white text-sm font-medium mb-1">Priority</label>
                        <select name="priority" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="Low">Low</option>
                            <option value="Medium" selected>Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-white text-sm font-medium mb-1">Status</label>
                        <select name="status" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="Pending" selected>Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Fulfilled">Fulfilled</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="flex justify-end space-x-4 mt-6">
                <button type="button" onclick="closeModal()" class="px-4 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors">
                    Cancel
                </button>
                <button type="submit" class="btn-primary px-4 py-2 text-white rounded-lg">
                    Create Request
                </button>
            </div>
        </form>
    `;
    showModal();
}

async function saveRequest(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await fetchAPI('/requests', 'POST', data);
        showNotification('Blood request created successfully!', 'success');
        closeModal();
        loadRequests();
    } catch (error) {
        console.error('Error saving request:', error);
    }
}

async function deleteRequest(id) {
    if (confirm('Are you sure you want to delete this request?')) {
        try {
            await fetchAPI(`/requests/${id}`, 'DELETE');
            showNotification('Request deleted successfully!', 'success');
            loadRequests();
        } catch (error) {
            console.error('Error deleting request:', error);
        }
    }
}

// Donation Functions
async function loadDonations() {
    try {
        const response = await fetchAPI('/donation-records');
        currentData.donations = response.donation_records;
        displayDonations(currentData.donations);
    } catch (error) {
        console.error('Error loading donations:', error);
    }
}

function displayDonations(donations) {
    const tbody = document.getElementById('donations-table-body');
    tbody.innerHTML = '';
    
    donations.forEach(donation => {
        const row = document.createElement('tr');
        row.className = 'border-b border-white border-opacity-20 hover:bg-white hover:bg-opacity-10 transition-colors';
        
        row.innerHTML = `
            <td class="px-4 py-3">${donation.donor_name}</td>
            <td class="px-4 py-3">
                <span class="bg-red-500 text-white px-2 py-1 rounded-full text-sm">${donation.blood_group}</span>
            </td>
            <td class="px-4 py-3">${donation.units_donated}</td>
            <td class="px-4 py-3">${new Date(donation.date_of_donation).toLocaleDateString()}</td>
            <td class="px-4 py-3">
                <button onclick="editDonation(${donation.id})" class="text-blue-400 hover:text-blue-300 mr-2">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteDonation(${donation.id})" class="text-red-400 hover:text-red-300">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterDonations() {
    const searchTerm = document.getElementById('donation-search').value.toLowerCase();
    const bloodGroupFilter = document.getElementById('donation-blood-filter').value;
    
    const filtered = currentData.donations.filter(donation => {
        const matchesSearch = donation.donor_name.toLowerCase().includes(searchTerm) ||
                            donation.blood_group.toLowerCase().includes(searchTerm);
        const matchesBloodGroup = !bloodGroupFilter || donation.blood_group === bloodGroupFilter;
        
        return matchesSearch && matchesBloodGroup;
    });
    
    displayDonations(filtered);
}

function showAddDonationForm() {
    document.getElementById('modal-title').textContent = 'Record New Donation';
    document.getElementById('modal-content').innerHTML = `
        <form id="donation-form" onsubmit="saveDonation(event)">
            <div class="space-y-4">
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Donor ID</label>
                    <input type="number" name="donor_id" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Donor Name</label>
                    <input type="text" name="donor_name" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-white text-sm font-medium mb-1">Blood Group</label>
                        <select name="blood_group" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-white text-sm font-medium mb-1">Units Donated</label>
                        <input type="number" name="units_donated" min="1" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                <div>
                    <label class="block text-white text-sm font-medium mb-1">Donation Date</label>
                    <input type="date" name="date_of_donation" required class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            <div class="flex justify-end space-x-4 mt-6">
                <button type="button" onclick="closeModal()" class="px-4 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors">
                    Cancel
                </button>
                <button type="submit" class="btn-primary px-4 py-2 text-white rounded-lg">
                    Record Donation
                </button>
            </div>
        </form>
    `;
    showModal();
}

async function saveDonation(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await fetchAPI('/donation-records', 'POST', data);
        showNotification('Donation recorded successfully!', 'success');
        closeModal();
        loadDonations();
    } catch (error) {
        console.error('Error saving donation:', error);
    }
}

async function deleteDonation(id) {
    if (confirm('Are you sure you want to delete this donation record?')) {
        try {
            await fetchAPI(`/donation-records/${id}`, 'DELETE');
            showNotification('Donation record deleted successfully!', 'success');
            loadDonations();
        } catch (error) {
            console.error('Error deleting donation:', error);
        }
    }
}

// Utility Functions
function showModal() {
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function exportToCSV(type) {
    let data = [];
    let filename = '';
    
    switch(type) {
        case 'donors':
            data = currentData.donors;
            filename = 'donors.csv';
            break;
        case 'inventory':
            data = currentData.inventory;
            filename = 'inventory.csv';
            break;
        case 'requests':
            data = currentData.requests;
            filename = 'requests.csv';
            break;
        case 'patients':
            data = currentData.patients;
            filename = 'patients.csv';
            break;
        case 'donations':
            data = currentData.donations;
            filename = 'donations.csv';
            break;
    }
    
    if (data.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }
    
    // Convert to CSV
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\\n');
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification(`${filename} downloaded successfully!`, 'success');
}
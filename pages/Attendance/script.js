// Initialize data from localStorage
let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
let currentSort = { column: null, ascending: true };
let filteredData = [...attendanceData];
let currentPage = 1;
const recordsPerPage = 10;
let editingIndex = null;

// Set today's date as default in the date input
document.getElementById('attendanceDate').valueAsDate = new Date();
document.getElementById('filterDateFrom').valueAsDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
document.getElementById('filterDateTo').valueAsDate = new Date();

// Event Listeners
document.getElementById('attendanceForm').addEventListener('submit', addAttendance);
document.getElementById('filterBtn').addEventListener('click', applyFilters);
document.getElementById('resetFilterBtn').addEventListener('click', resetFilters);
document.getElementById('searchEmployee').addEventListener('input', applyFilters);
document.getElementById('filterStatus').addEventListener('change', applyFilters);
document.getElementById('filterDateFrom').addEventListener('change', applyFilters);
document.getElementById('filterDateTo').addEventListener('change', applyFilters);
document.getElementById('printBtn').addEventListener('click', printTable);
document.getElementById('editForm').addEventListener('submit', updateAttendance);

// Close modal when clicking X
document.querySelector('.close').addEventListener('click', closeEditModal);
window.addEventListener('click', function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeEditModal();
    }
});

// Add Attendance Record
function addAttendance(e) {
    e.preventDefault();

    const name = document.getElementById('employeeName').value.trim();
    const id = document.getElementById('employeeId').value.trim();
    const date = document.getElementById('attendanceDate').value;
    const status = document.getElementById('attendanceStatus').value;
    const remarks = document.getElementById('remarks').value.trim();

    if (!name || !id || !date || !status) {
        alert('Please fill all required fields!');
        return;
    }

    const record = {
        id: Date.now(),
        name,
        employeeId: id,
        date,
        status,
        remarks,
        timestamp: new Date().toLocaleString()
    };

    attendanceData.push(record);
    saveToLocalStorage();
    displayAttendance();
    document.getElementById('attendanceForm').reset();
    document.getElementById('attendanceDate').valueAsDate = new Date();
    alert('Record added successfully!');
}

// Display Attendance Table
function displayAttendance() {
    const tbody = document.getElementById('attendanceTableBody');
    const noRecordsMsg = document.getElementById('noRecordsMsg');
    const table = document.getElementById('attendanceTable');

    // Calculate pagination
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    if (paginatedData.length === 0) {
        tbody.innerHTML = '';
        noRecordsMsg.style.display = 'block';
        table.style.display = 'none';
        updateSummary();
        return;
    }

    noRecordsMsg.style.display = 'none';
    table.style.display = 'table';

    tbody.innerHTML = paginatedData.map((record, index) => {
        const statusClass = `status-${record.status.toLowerCase()}`;
        const originalIndex = attendanceData.findIndex(r => r.id === record.id);
        
        return `
            <tr>
                <td>${record.name}</td>
                <td>${record.employeeId}</td>
                <td>${formatDate(record.date)}</td>
                <td><span class="status-badge ${statusClass}">${record.status}</span></td>
                <td>${record.remarks || '-'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-edit" onclick="openEditModal(${originalIndex})">Edit</button>
                        <button class="btn btn-delete" onclick="deleteRecord(${originalIndex})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    updatePagination();
    updateSummary();
}

// Apply Filters
function applyFilters() {
    const searchValue = document.getElementById('searchEmployee').value.toLowerCase();
    const statusValue = document.getElementById('filterStatus').value;
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;

    filteredData = attendanceData.filter(record => {
        const matchesSearch = record.name.toLowerCase().includes(searchValue) || 
                             record.employeeId.toLowerCase().includes(searchValue);
        const matchesStatus = !statusValue || record.status === statusValue;
        const matchesDateFrom = !dateFrom || record.date >= dateFrom;
        const matchesDateTo = !dateTo || record.date <= dateTo;

        return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });

    currentPage = 1;
    displayAttendance();
}

// Reset Filters
function resetFilters() {
    document.getElementById('searchEmployee').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterDateFrom').valueAsDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    document.getElementById('filterDateTo').valueAsDate = new Date();
    filteredData = [...attendanceData];
    currentPage = 1;
    displayAttendance();
}

// Sort Table
function sortTable(columnIndex) {
    const columnNames = ['name', 'employeeId', 'date', 'status'];
    const columnName = columnNames[columnIndex];

    if (currentSort.column === columnName) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.column = columnName;
        currentSort.ascending = true;
    }

    filteredData.sort((a, b) => {
        let aValue = a[columnName];
        let bValue = b[columnName];

        if (columnName === 'date') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        } else {
            aValue = aValue.toString().toLowerCase();
            bValue = bValue.toString().toLowerCase();
        }

        if (aValue < bValue) return currentSort.ascending ? -1 : 1;
        if (aValue > bValue) return currentSort.ascending ? 1 : -1;
        return 0;
    });

    currentPage = 1;
    displayAttendance();
}

// Open Edit Modal
function openEditModal(index) {
    editingIndex = index;
    const record = attendanceData[index];

    document.getElementById('editEmployeeName').value = record.name;
    document.getElementById('editEmployeeId').value = record.employeeId;
    document.getElementById('editDate').value = record.date;
    document.getElementById('editStatus').value = record.status;
    document.getElementById('editRemarks').value = record.remarks || '';

    document.getElementById('editModal').style.display = 'block';
}

// Close Edit Modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    editingIndex = null;
}

// Update Attendance Record
function updateAttendance(e) {
    e.preventDefault();

    if (editingIndex === null) return;

    attendanceData[editingIndex] = {
        ...attendanceData[editingIndex],
        name: document.getElementById('editEmployeeName').value.trim(),
        employeeId: document.getElementById('editEmployeeId').value.trim(),
        date: document.getElementById('editDate').value,
        status: document.getElementById('editStatus').value,
        remarks: document.getElementById('editRemarks').value.trim()
    };

    saveToLocalStorage();
    closeEditModal();
    applyFilters();
    alert('Record updated successfully!');
}

// Delete Record
function deleteRecord(index) {
    if (confirm('Are you sure you want to delete this record?')) {
        attendanceData.splice(index, 1);
        saveToLocalStorage();
        applyFilters();
        alert('Record deleted successfully!');
    }
}

// Update Summary
function updateSummary() {
    const present = filteredData.filter(r => r.status === 'Present').length;
    const absent = filteredData.filter(r => r.status === 'Absent').length;
    const late = filteredData.filter(r => r.status === 'Late').length;

    document.getElementById('totalPresent').textContent = present;
    document.getElementById('totalAbsent').textContent = absent;
    document.getElementById('totalLate').textContent = late;
    document.getElementById('totalEmployees').textContent = attendanceData.length;
}

// Pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    const paginationDiv = document.getElementById('pagination');

    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }

    let html = '';

    // Previous Button
    if (currentPage > 1) {
        html += `<button onclick="goToPage(${currentPage - 1})">← Previous</button>`;
    }

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            html += `<span class="active">${i}</span>`;
        } else if (i <= 3 || i >= totalPages - 2 || Math.abs(i - currentPage) <= 1) {
            html += `<button onclick="goToPage(${i})">${i}</button>`;
        } else if (i === 4 || i === totalPages - 3) {
            html += `<span>...</span>`;
        }
    }

    // Next Button
    if (currentPage < totalPages) {
        html += `<button onclick="goToPage(${currentPage + 1})">Next →</button>`;
    }

    paginationDiv.innerHTML = html;
}

// Go to Page
function goToPage(page) {
    currentPage = page;
    displayAttendance();
    window.scrollTo(0, 0);
}

// Print Table
function printTable() {
    const printWindow = window.open('', '_blank');
    const table = document.getElementById('attendanceTable').outerHTML;

    const style = `
        <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #667eea; color: white; }
            .status-present { background-color: #d4edda; }
            .status-absent { background-color: #f8d7da; }
            .status-late { background-color: #fff3cd; }
            h1 { color: #667eea; }
        </style>
    `;

    const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Attendance Report</title>
            ${style}
        </head>
        <body>
            <h1>Employee Attendance Report</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            ${table}
        </body>
        </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Save to LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
}

// Load data on page load
function loadSampleData() {
    // Only load sample data if no data exists
    if (attendanceData.length === 0) {
        const today = new Date();
        const sampleRecords = [
            { id: 1, name: 'Esther Mbuyu', employeeId: 'HR-001', date: today.toISOString().split('T')[0], status: 'Present', remarks: '' },
            { id: 2, name: 'Collince Carist', employeeId: 'IT-002', date: today.toISOString().split('T')[0], status: 'Absent', remarks: 'Sick leave' },
            { id: 3, name: 'Luchagula Nkwale', employeeId: 'FIN-003', date: today.toISOString().split('T')[0], status: 'Late', remarks: 'Traffic' }
        ];
        attendanceData = sampleRecords;
        saveToLocalStorage();
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    loadSampleData();
    filteredData = [...attendanceData];
    displayAttendance();
});

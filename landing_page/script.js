// Employee Management System - Dashboard Script

// Function to get total employees count
function getTotalEmployees() {
    // Check if employees are stored in localStorage
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    if (employees.length > 0) {
        return employees.length;
    }
    // Default hardcoded employees from employee list page
    return 4; // HR-001, IT-002, FIN003, OO-004
}

// Function to get total departments count
function getTotalDepartments() {
    // Check if departments are stored in localStorage
    const departments = JSON.parse(localStorage.getItem('departments')) || [];
    if (departments.length > 0) {
        return departments.length;
    }
    // Default hardcoded departments from department management page
    return 5; // Human Resources, IT, Finance, Marketing, Operations
}

// Function to calculate attendance rate
function getAttendanceRate() {
    const attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
    if (attendanceData.length === 0) {
        return 0;
    }
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Filter today's attendance records
    const todayRecords = attendanceData.filter(record => record.date === today);
    
    if (todayRecords.length === 0) {
        return 0;
    }
    
    // Count present records (Present or Late)
    const presentCount = todayRecords.filter(record => 
        record.status === 'Present' || record.status === 'Late'
    ).length;
    
    // Calculate percentage
    const rate = Math.round((presentCount / todayRecords.length) * 100);
    return rate;
}

// Function to get active tasks count
function getActiveTasks() {
    // Check if tasks are stored in localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (tasks.length > 0) {
        // Count tasks that are not completed
        return tasks.filter(task => 
            task.status !== 'Completed' && task.status !== 'completed'
        ).length;
    }
    // Default hardcoded tasks from tasks page
    // Active tasks: "Pending" and "In Progress" (2 tasks)
    return 2;
}

// Function to initialize sample data if not exists
function initializeSampleData() {
    // Initialize employees if not exists
    if (!localStorage.getItem('employees')) {
        const sampleEmployees = [
            { id: 'HR-001', name: 'Esther Mbuyu', email: 'esther.mbuyu@ems.com', department: 'Human Resources', position: 'HR Manager' },
            { id: 'IT-002', name: 'Collince Carist', email: 'collince.carist@ems.com', department: 'Information Technology', position: 'Software Developer' },
            { id: 'FIN003', name: 'Luchagula Nkwale', email: 'luchagula.nkwale@ems.com', department: 'Finance', position: 'Accountant' },
            { id: 'OO-004', name: 'Olga Msacky', email: 'olga.msacky@ems.com', department: 'Operations', position: 'Operations Officer' }
        ];
        localStorage.setItem('employees', JSON.stringify(sampleEmployees));
    }
    
    // Initialize departments if not exists
    if (!localStorage.getItem('departments')) {
        const sampleDepartments = [
            { id: 'D001', name: 'Human Resources', description: 'Manages employee relations, recruitment, and welfare', head: 'Esther Mbuyu' },
            { id: 'D002', name: 'Information Technology', description: 'Handles system development, maintenance, and IT support', head: 'Collince Carist' },
            { id: 'D003', name: 'Finance', description: 'Responsible for budgeting, payroll, and financial records', head: 'Luchagula Nkwale' },
            { id: 'D004', name: 'Marketing', description: 'Manages advertising, branding, and market research', head: 'Rezia Sanare' },
            { id: 'D005', name: 'Operations', description: 'Oversees daily business operations and logistics', head: 'Olga Msacky' }
        ];
        localStorage.setItem('departments', JSON.stringify(sampleDepartments));
    }
    
    // Initialize tasks if not exists
    if (!localStorage.getItem('tasks')) {
        const sampleTasks = [
            { title: 'Prepare Monthly Report', description: 'Compile and analyze monthly sales data', assignedTo: 'John Doe', status: 'Pending' },
            { title: 'System Maintenance', description: 'Update and test EMS modules', assignedTo: 'Mary Smith', status: 'In Progress' },
            { title: 'Employee Onboarding', description: 'Register new employees in the system', assignedTo: 'David Joseph', status: 'Completed' }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
    }
}

// Function to update dashboard statistics
function updateDashboardStats() {
    const totalEmployees = getTotalEmployees();
    const totalDepartments = getTotalDepartments();
    const attendanceRate = getAttendanceRate();
    const activeTasks = getActiveTasks();
    
    // Update DOM elements
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        statValues[0].textContent = totalEmployees;
        statValues[1].textContent = totalDepartments;
        statValues[2].textContent = attendanceRate + '%';
        statValues[3].textContent = activeTasks;
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sample data if needed
    initializeSampleData();
    
    // Update dashboard statistics
    updateDashboardStats();
    
    // Highlight active navigation link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.style.backgroundColor = '#f0f9f5';
            link.style.color = '#1f4037';
            link.style.borderLeftColor = '#1f4037';
        }
    });

    // Add click tracking for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const pageName = this.querySelector('.nav-text').textContent;
            console.log(`Navigating to: ${pageName}`);
        });
    });

    // Add smooth transitions to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.6s ease-out forwards';
    });

    // Add smooth transitions to action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.6s ease-out forwards';
    });

    // Sidebar scroll behavior
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.addEventListener('scroll', function() {
            // Add any scroll-based functionality here if needed
        });
    }
    
    // Refresh stats when page becomes visible (in case data was updated in another tab)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            updateDashboardStats();
        }
    });
});

// Add CSS animation for fadeInUp
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
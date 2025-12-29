// Employee Management System - Dashboard Script

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
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
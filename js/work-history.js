document.addEventListener('DOMContentLoaded', function() {
    const sortToggle = document.getElementById('sort-toggle');
    const sortIcon = document.getElementById('sort-icon');
    const roleContainer = document.querySelector('.role-container');
    
    function sortRoles(ascending = false) {
        const roles = Array.from(roleContainer.children);
        const sortedRoles = roles.sort((a, b) => {
            const dateA = parseDateString(a.querySelector('.duration').textContent);
            const dateB = parseDateString(b.querySelector('.duration').textContent);
            return ascending ? dateA - dateB : dateB - dateA;
        });

        // Clear and re-append in new order
        roleContainer.innerHTML = '';
        sortedRoles.forEach(role => roleContainer.appendChild(role));
        
        // Update icon and title
        sortIcon.className = ascending ? 'fas fa-sort-amount-down' : 'fas fa-sort-amount-up';
        sortIcon.title = ascending ? 'Oldest first' : 'Newest first';
    }

    function parseDateString(dateStr) {
        // Handle "Present"
        if (dateStr.includes('Present')) {
            return new Date().getTime();
        }
        
        // Extract years from strings like "2023 – Present" or "2019 – 2023"
        const years = dateStr.match(/\d{4}/g);
        if (!years) return 0;
        
        // Return the most recent year (end year or start year if only one)
        return new Date(years[years.length - 1], 0).getTime();
    }

    // Store initial order
    const initialOrder = Array.from(roleContainer.children);
    
    sortToggle.addEventListener('change', function() {
        if (this.checked) {
            // When checked, sort ascending (oldest first)
            sortRoles(true);
        } else {
            // When unchecked, restore original order
            roleContainer.innerHTML = '';
            initialOrder.forEach(role => roleContainer.appendChild(role.cloneNode(true)));
        }
    });
}); 
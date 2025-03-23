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
        
        // Extract the first date (start date)
        const match = dateStr.match(/(\w+)\s+(\d{4})/);
        if (!match) return 0;
        
        const month = {
            'January': 0, 'February': 1, 'March': 2, 'April': 3,
            'May': 4, 'June': 5, 'July': 6, 'August': 7,
            'September': 8, 'October': 9, 'November': 10, 'December': 11
        }[match[1]] || 0;
        
        return new Date(match[2], month).getTime();
    }

    sortToggle.addEventListener('change', function() {
        sortRoles(this.checked);
    });
}); 
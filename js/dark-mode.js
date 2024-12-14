// Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Create dark mode toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'dark-mode-toggle';
    toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
    toggleButton.setAttribute('aria-label', 'تبديل الوضع الليلي');
    document.body.appendChild(toggleButton);

    // Check for saved user preference, if any, load it
    const currentTheme = localStorage.getItem('theme') || 'light'; // Set light as default
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Add click event to button
    toggleButton.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
});

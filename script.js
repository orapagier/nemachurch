function showTab(tabName, event) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    } else {
        // If no event (programmatic call), find and activate the corresponding button
        const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }
    }

    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If programs tab (not speakers), fetch data
    if(tabName === "programs" && typeof fetchSpeakerData === "function") {
        fetchSpeakerData();
    }
}

function refreshPage() {
    window.location.reload();
}

// Helper function to format week string
function getWeekString(weekDateStr) {
    // Handle date range string (e.g., "2025-07-13 - 2025-07-19")
    let weekDate = weekDateStr.split(' - ')[0]; // Use start of week
    let date = new Date(weekDate);

    // Calculate the week number in the month
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let weekNum = Math.ceil((date.getDate() + firstDay.getDay()) / 7);

    const weekNames = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
    let weekName = weekNames[weekNum - 1] || `${weekNum}th`;

    let monthName = date.toLocaleString('default', { month: 'long' });
    let year = date.getFullYear();

    return `Speakers for the ${weekName} Week of ${monthName} ${year}`;
}

function fetchSpeakerData() {
    // Show loading indicator
    const refreshBtn = document.querySelector('.refresh-btn');
    const lastUpdated = document.getElementById('last-updated');
    
    if (refreshBtn) {
        refreshBtn.classList.add('loading');
        refreshBtn.textContent = 'Loading...';
    }
    
    if (lastUpdated) {
        lastUpdated.textContent = 'Loading...';
    }

    // Replace with your Apps Script web app URL
    fetch('https://script.google.com/macros/s/AKfycbwr1pUO0WnJX7vyPp6TpImnFgW8ycyOeRB4DpOyJ8g2wpQuAMSpztfwECQXtQxehijL/exec')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Update the week date display
            const weekDateElement = document.getElementById('week-date');
            if (weekDateElement && data.weekDate) {
                weekDateElement.textContent = getWeekString(data.weekDate);
            }

            // Update theme
            const themeElement = document.getElementById('weekly-theme');
            if (themeElement && data.weeklyTheme) {
                themeElement.textContent = 'Theme: ' + data.weeklyTheme;
            }

            // Update speaker names
            const speakers = [
                { id: 'midweek-speaker', data: data.midweekSpeaker },
                { id: 'ministerial-speaker', data: data.ministerialSpeaker },
                { id: 'vesper-speaker', data: data.vesperSpeaker },
                { id: 'divine-speaker', data: data.divineSpeaker }
            ];

            speakers.forEach(speaker => {
                const element = document.getElementById(speaker.id);
                if (element) {
                    element.textContent = speaker.data || 'Speaker TBA';
                }
            });

            // Update last updated timestamp
            if (lastUpdated) {
                lastUpdated.textContent = new Date().toLocaleString();
            }
        })
        .catch(error => {
            console.error('Error fetching speaker data:', error);
            
            // Show error message
            if (lastUpdated) {
                lastUpdated.textContent = 'Failed to load data';
            }
            
            // Reset speaker names to default if fetch fails
            const speakerIds = ['midweek-speaker', 'ministerial-speaker', 'vesper-speaker', 'divine-speaker'];
            speakerIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = 'Speaker TBA';
                }
            });
        })

}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Form submission handler
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            e.target.reset();
        });
    }

    // Tab navigation event listeners
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            const tabName = btn.getAttribute('data-tab');
            showTab(tabName, e);
        });
    });

    // Fetch speaker data on initial load
    fetchSpeakerData();
    
    // Auto-refresh speaker data every 5 minutes (300000ms)
    setInterval(fetchSpeakerData, 300000);
});

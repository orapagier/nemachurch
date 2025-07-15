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
    }

    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If speakers tab, fetch data
    if(tabName === "speakers" && typeof fetchSpeakerData === "function") {
        fetchSpeakerData();
    }
}

function refreshPage() {
    window.location.reload();
}

// --- ADDED HELPER FUNCTION ---
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

    return `${weekName} Week of ${monthName} ${year}`;
}

function fetchSpeakerData() {
    // Show loading indicator if desired
    document.getElementById('last-updated').textContent = 'Loading...';

    // Replace with your Apps Script web app URL
    fetch('https://script.google.com/macros/s/AKfycbwr1pUO0WnJX7vyPp6TpImnFgW8ycyOeRB4DpOyJ8g2wpQuAMSpztfwECQXtQxehijL/exec')
        .then(response => response.json())
        .then(data => {
            // --- MODIFIED LINE ---
            document.getElementById('week-date').textContent = getWeekString(data.weekDate);

            document.getElementById('weekly-theme').textContent = 'Theme: ' + data.weeklyTheme;
            document.getElementById('midweek-speaker').textContent = data.midweekSpeaker;
            document.getElementById('ministerial-speaker').textContent = data.ministerialSpeaker;
            document.getElementById('vesper-speaker').textContent = data.vesperSpeaker;
            document.getElementById('divine-speaker').textContent = data.divineSpeaker;
            document.getElementById('last-updated').textContent = new Date().toLocaleString();
        })
        .catch(error => {
            document.getElementById('last-updated').textContent = 'Failed to load!';
            console.error('Error fetching speaker data:', error);
        });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Form submission handler and tab event setup
document.addEventListener('DOMContentLoaded', () => {
    // Form handler
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            e.target.reset();
        });
    }

    // CTA smooth scroll
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            if (e.target.textContent === 'Learn More About Us') {
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
            }
        });
    }

    // Tab navigation event listeners
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            showTab(btn.getAttribute('data-tab'), e);
        });
    });

    // Fetch speaker data on load if needed
    if (typeof fetchSpeakerData === "function") {
        fetchSpeakerData();
    }
});

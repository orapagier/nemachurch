function showTab(tabName, event) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }

    // Scroll to top for better UX
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function refreshPage() {
    window.location.reload();
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

// Form submission handler
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            e.target.reset();
        });
    }

    // Add smooth scrolling to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            if (e.target.textContent === 'Learn More About Us') {
                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        });
    }

    
    function fetchSpeakerData() {
        // Show loading state
        document.querySelectorAll('.speaker-name').forEach(el => {
            el.classList.add('loading');
        });
        
        // Call your Google Apps Script web app
        // Replace with your actual web app URL
        const webAppUrl = 'https://script.google.com/macros/s/AKfycbxB0RRdWqMLB3EORJ0g6UlR00aJzLk05LzkCjQp-8qmuGZg2w-oylEkwaocIu1AUzAr/exec';
        
        fetch(webAppUrl)
            .then(response => response.json())
            .then(data => {
                updateSpeakerUI(data);
                document.getElementById('last-updated').textContent = new Date().toLocaleString();
            })
            .catch(error => {
                console.error('Error fetching speaker data:', error);
                document.querySelectorAll('.speaker-name').forEach(el => {
                    el.classList.remove('loading');
                    el.textContent = 'Error loading data';
                });
            });
    }
    
    function updateSpeakerUI(data) {
        // Remove loading state
        document.querySelectorAll('.speaker-name').forEach(el => {
            el.classList.remove('loading');
        });
        
        // Update all fields
        document.getElementById('week-date').textContent = data.weekDate || getCurrentWeekRange();
        document.getElementById('weekly-theme').textContent = `Theme: ${data.weeklyTheme || 'Theme TBA'}`;
        document.getElementById('midweek-speaker').textContent = data.midweekSpeaker || 'TBA';
        document.getElementById('ministerial-speaker').textContent = data.ministerialSpeaker || 'TBA';
        document.getElementById('vesper-speaker').textContent = data.vesperSpeaker || 'TBA';
        document.getElementById('divine-speaker').textContent = data.divineSpeaker || 'TBA';
    }
    
    // Helper function to format current week range
    function getCurrentWeekRange() {
        const today = new Date();
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - today.getDay());
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        
        const options = { month: 'short', day: 'numeric' };
        return `Week of ${sunday.toLocaleDateString('en-US', options)} - ${saturday.toLocaleDateString('en-US', options)}, ${today.getFullYear()}`;
    }
    
    // Call fetchSpeakerData when the page loads and when the speakers tab is shown
    document.addEventListener('DOMContentLoaded', () => {
        fetchSpeakerData();
        
        const speakersTabBtn = document.querySelector('.tab-btn[onclick="showTab(\'speakers\')"]');
        if (speakersTabBtn) {
            speakersTabBtn.addEventListener('click', () => {
                setTimeout(fetchSpeakerData, 100);
            });
        }
});






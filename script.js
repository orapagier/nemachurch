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

// Client-side JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully!');
    startCountdown();
});

function showComingSoon() {
    // You can replace this with a more sophisticated tooltip or notification
    console.log('Coming Soon!');
}

// Countdown Timer
function startCountdown() {
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    
    if (!minutesDisplay || !secondsDisplay) return;

    let timeLeft = 5 * 60; // 5 minutes in seconds

    const countdownTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        minutesDisplay.textContent = String(minutes).padStart(2, '0');
        secondsDisplay.textContent = String(seconds).padStart(2, '0');

        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            window.location.href = 'https://www.skool.com/ultra';
        }
        timeLeft--;
    }, 1000);
}

// Button click handler
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.getElementById('cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            window.location.href = 'https://www.skool.com/ultra';
        });
    }
}); 
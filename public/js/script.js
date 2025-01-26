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
    let timeLeft = 5 * 60; // 5 minutes in seconds

    const countdownTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            window.location.href = 'https://www.skool.com/ultra';
        }
        timeLeft--;
    }, 1000);
}

// Button click handler
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cta-button').addEventListener('click', () => {
        window.location.href = 'https://www.skool.com/ultra';
    });
}); 
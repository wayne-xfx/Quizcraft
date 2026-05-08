// DOM Elements
const displayEmailElement = document.getElementById('displayEmail');
const resendBtn = document.getElementById('resendBtn');
const resendStatus = document.getElementById('resendStatus');

// Cooldown Setting (in seconds)
const COOLDOWN_TIME = 60; 

// 1. Initialize the Page
document.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('resetEmail');

    if (savedEmail) {
        displayEmailElement.textContent = savedEmail;
    } else {
        displayEmailElement.textContent = 'your registered email';
    }

    // Optional: Start the cooldown immediately when the page loads!
    // Since they *just* asked for an email on the previous page, they shouldn't 
    // be able to immediately ask for another one the second this page loads.
    startCooldown(); 
});

// 2. Handle the "Resend Email" Button
resendBtn.addEventListener('click', () => {
    // Show a loading message
    resendStatus.textContent = 'Sending a new link...';
    resendStatus.className = 'statusMessage successText';
    resendBtn.disabled = true; // Lock immediately

    // BACKEND DEV: Replace this setTimeout with your actual API fetch
    setTimeout(() => {
        // Success state
        resendStatus.textContent = 'A new link has been sent to your inbox!';
        
        // Start the countdown timer so they can't spam it
        startCooldown();

    }, 1500); // Fakes a 1.5-second server delay
});

// 3. The Countdown Logic
function startCooldown() {
    let timeLeft = COOLDOWN_TIME;
    resendBtn.disabled = true; // Lock the button

    // Update the button text immediately
    resendBtn.textContent = `Resend Link (${timeLeft}s)`;

    // Create a timer that ticks every 1 second (1000ms)
    const timer = setInterval(() => {
        timeLeft--;
        resendBtn.textContent = `Resend Link (${timeLeft}s)`;

        // When the timer hits zero, unlock everything
        if (timeLeft <= 0) {
            clearInterval(timer); // Stop the clock
            resendBtn.disabled = false; // Unlock the button
            resendBtn.textContent = 'Resend Link'; // Reset the text
            resendStatus.textContent = ''; // Clear the success message
        }
    }, 1000);
}
// DOM Elements cached at the top for performance
const retryForm = document.getElementById('retryEmailForm');
const emailInput = document.getElementById('emailInput');
const retryBtn = document.getElementById('retryBtn');
const statusMessage = document.getElementById('retryStatusMessage');

retryForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Clear old messages and clean up the email text
    statusMessage.textContent = '';
    statusMessage.className = 'statusMessage';
    const userEmail = emailInput.value.trim(); 

    // 2. Simulate server loading state (Combined features!)
    retryBtn.disabled = true;
    emailInput.disabled = true;     // Locks the text box
    retryBtn.style.opacity = '0.5'; // Your visual opacity trick
    
    // Show a loading message
    statusMessage.textContent = 'Sending...';
    statusMessage.className = 'statusMessage successText';

    // 3. Mock API Call Delay
    setTimeout(() => {
        // Save the email to local storage so the next page can display it
        localStorage.setItem('resetEmail', userEmail);
        
        // Redirect to the Check Email page
        window.location.href = 'check-email.html';
    }, 1500); 
});
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

    /*
     * =========================================================
     * BACKEND NOTE: Retry Email API
     * 1. Remove this mock setTimeout.
     * 2. Implement a fetch() POST request to your auth endpoint.
     * 3. The backend should check if the email exists.
     * 4. On SUCCESS (200): Save userEmail to localStorage and 
     * redirect to '/check-email'.
     * 5. On FAILURE (404): Re-enable the button/input and 
     * show an error in the statusMessage.
     * =========================================================
     */

    // 3. Mock API Call Delay
    setTimeout(() => {
        // Save the email to local storage so the next page can display it
        localStorage.setItem('resetEmail', userEmail);
        
        // Redirect to the Check Email page using the clean Express route
        window.location.href = '/check-email';
    }, 1500); 
});
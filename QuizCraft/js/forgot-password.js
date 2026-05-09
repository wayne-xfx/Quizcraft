// DOM Elements cached at the top for performance
const resetForm = document.getElementById('resetForm');
const emailInput = document.getElementById('emailInput');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');

// Event Listeners
resetForm.addEventListener('submit', handleFormSubmit);

// Core Functions
function handleFormSubmit(event) {
    event.preventDefault();
    clearMessage();

    const userEmail = emailInput.value.trim();

    if (!isValidEmail(userEmail)) {
        displayMessage('Please enter a valid email format.', 'errorText');
        return;
    }

    setLoadingState(true);

    setTimeout(() => {
        executeMockBackendLogic(userEmail);
    }, 1500);
}

function executeMockBackendLogic(emailData) {
    /* ====================================================================
    BACKEND NOTE: Forgot Password Verification Logic
    1. Replace this mock function with a real fetch() POST request to 
       your API (e.g., /api/auth/forgot-password).
    2. Backend verifies if the email exists in the database.
    3. If Email NOT Found: Respond with a specific error so the JS 
       can redirect to '/email-not-found'.
    4. If Email Found: 
       - Generate a secure reset token.
       - Send the email via your mailing service (NodeMailer, etc.).
       - Respond with success so the JS can redirect to '/check-email'.
    ====================================================================
    */

    // --- PROTOTYPE TRIGGER ---
    // If you type this exact email, it tests the "Not Found" page
    if (emailData === 'fail@test.com') {
        setTimeout(() => {
            // Updated to clean route
            window.location.href = '/email-not-found';
        }, 1000);
        return; // Stops here!
    }

    // --- NORMAL SUCCESS ---
    localStorage.setItem('resetEmail', emailData);
    displayMessage('Sending...', 'successText');
    
    setTimeout(() => {
        // Updated to clean route
        window.location.href = '/check-email';
    }, 1000); 
}

// Utility Functions
function isValidEmail(emailString) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailString);
}

function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        emailInput.disabled = true;
    } else {
        submitBtn.disabled = false;
        emailInput.disabled = false;
    }
}

function displayMessage(text, className) {
    statusMessage.textContent = text;
    statusMessage.className = 'statusMessage ' + className;
}

function clearMessage() {
    statusMessage.textContent = '';
    statusMessage.className = 'statusMessage';
}
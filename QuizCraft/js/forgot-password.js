// DOM Elements
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
    // --- PROTOTYPE TRIGGER ---
    // If you type this exact email, it tests the "Not Found" page
    if (emailData === 'fail@test.com') {
        setTimeout(() => {
            window.location.href = 'email-not-found.html';
        }, 1000);
        return; // Stops here!
    }

    // --- NORMAL SUCCESS ---
    localStorage.setItem('resetEmail', emailData);
    displayMessage('Sending...', 'successText');
    
    setTimeout(() => {
        window.location.href = 'check-email.html';
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
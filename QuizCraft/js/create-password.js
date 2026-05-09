// DOM Elements
const form = document.getElementById('newPasswordForm');
const newPassInput = document.getElementById('newPass');
const confirmPassInput = document.getElementById('confirmPass');
const statusMessage = document.getElementById('passwordStatusMessage');
const submitBtn = document.getElementById('submitNewPassBtn');
const toggleButtons = document.querySelectorAll('.togglePassword');

// Checklist Elements
const reqLength = document.getElementById('reqLength');
const reqCases = document.getElementById('reqCases');
const reqNumber = document.getElementById('reqNumber');

// 1. Toggle Password Visibility (Eye Icon)
toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const isPassword = input.type === 'password';
        
        // Toggle input type
        input.type = isPassword ? 'text' : 'password';
        
        // Toggle SVG icon (Eye vs Eye-slash)
        if (isPassword) {
            this.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        } else {
            this.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
        }
    });
});

// 2. Real-time Password Validation
newPassInput.addEventListener('input', function() {
    const val = this.value;

    // Check Length (8+ chars)
    if (val.length >= 8) reqLength.classList.add('valid');
    else reqLength.classList.remove('valid');

    // Check Cases (Uppercase AND Lowercase)
    if (/[a-z]/.test(val) && /[A-Z]/.test(val)) reqCases.classList.add('valid');
    else reqCases.classList.remove('valid');

    // Check Number
    if (/\d/.test(val)) reqNumber.classList.add('valid');
    else reqNumber.classList.remove('valid');
});

// 3. Form Submission Handling
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    statusMessage.textContent = '';
    statusMessage.className = 'statusMessage';

    const pass1 = newPassInput.value;
    const pass2 = confirmPassInput.value;

    // --- CHECK 1: Do the passwords match? ---
    // (This now runs first)
    if (pass1 !== pass2) {
        statusMessage.textContent = 'Passwords do not match.';
        statusMessage.classList.add('errorText');
        return;
    }

    // --- CHECK 2: Are all requirements met? ---
    const isValid = pass1.length >= 8 && 
                    /[a-z]/.test(pass1) && 
                    /[A-Z]/.test(pass1) && 
                    /\d/.test(pass1);

    if (!isValid) {
        statusMessage.textContent = 'Please meet all password requirements.';
        statusMessage.classList.add('errorText');
        return;
    }

    /* ====================================================================
    BACKEND DEVELOPER CHECKLIST & WORKSPACE:
    
    1. EXTRACT TOKEN: 
       Grab the reset token from the URL parameters.
       Example: const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');
                
       (If token is missing/invalid, instantly redirect them to /login with an error).

    2. IDENTIFY USER:
       Retrieve the email from localStorage (used in front-end prototyping) OR 
       rely entirely on the secure token validation from your backend.
       Example: const userEmail = localStorage.getItem('resetEmail');

    3. API CALL (FETCH):
       Send a POST/PUT request to your endpoint (e.g., /api/auth/reset-password)
       Payload should include: { token: token, newPassword: pass1 }

    4. HANDLE RESPONSE:
       - SUCCESS: Clear localStorage, redirect to /reset-success
       - ERROR (Token Expired/Invalid): Show error, ask user to request a new link.
    ====================================================================
    */

    // MOCK SUBMISSION (Delete when connecting real backend)
    submitBtn.disabled = true;

    setTimeout(() => {
        // Clean up the mock data
        localStorage.removeItem('resetEmail');

        // Immediately redirect to success page using the clean Express route
        window.location.href = '/reset-success';
    }, 1500);
});
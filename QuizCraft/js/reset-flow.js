// =====================================================================
// 1. GLOBAL STATE & ROUTING
// =====================================================================
let globalUserEmail = ""; 

function switchView(viewId) {
    document.querySelectorAll('.flow-view').forEach(view => {
        view.classList.remove('active');
    });
    const targetView = document.getElementById(viewId);
    if(targetView) {
        targetView.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
        if (token === 'expired') {
            switchView('view-link-expired');
        } else {
            switchView('view-create-password');
        }
    }
});

function isValidEmail(emailString) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailString);
}


// =====================================================================
// 2. VIEW 1: FORGOT PASSWORD LOGIC
// =====================================================================
const forgotForm = document.getElementById('resetForm');

if (forgotForm) {
    // Look inside the form to avoid ID conflicts!
    const emailInput = forgotForm.querySelector('input[type="email"]');
    const submitBtn = forgotForm.querySelector('button[type="submit"]');
    const statusMessage = forgotForm.querySelector('.statusMessage');

    forgotForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        statusMessage.textContent = '';
        statusMessage.className = 'statusMessage';

        const userEmail = emailInput.value.trim();

        if (!isValidEmail(userEmail)) {
            statusMessage.textContent = 'Please enter a valid email format.';
            statusMessage.className = 'statusMessage errorText';
            return;
        }

        submitBtn.disabled = true;
        emailInput.disabled = true;
        statusMessage.textContent = 'Sending...';
        statusMessage.className = 'statusMessage successText';

        setTimeout(() => {
            submitBtn.disabled = false;
            emailInput.disabled = false;
            statusMessage.textContent = '';
            
            // --- PROTOTYPE TRIGGER ---
            if (userEmail === 'fail@test.com') {
                switchView('view-email-not-found');
            } else {
                // --- NORMAL SUCCESS ---
                globalUserEmail = userEmail;
                document.getElementById('displayEmail').textContent = globalUserEmail;
                switchView('view-check-email');
                startCooldown(); 
            }
        }, 1000);
    });
}


// =====================================================================
// 3. VIEW 3: EMAIL NOT FOUND (RETRY) LOGIC
// =====================================================================
const retryForm = document.getElementById('retryEmailForm');

if (retryForm) {
    // Look inside the form to avoid ID conflicts!
    const retryEmailInput = retryForm.querySelector('input[type="email"]');
    const retryBtn = retryForm.querySelector('button[type="submit"]');
    const retryStatusMessage = retryForm.querySelector('.statusMessage');

    retryForm.addEventListener('submit', function(e) {
        e.preventDefault();

        retryStatusMessage.textContent = '';
        retryStatusMessage.className = 'statusMessage';
        const userEmail = retryEmailInput.value.trim(); 

        retryBtn.disabled = true;
        retryEmailInput.disabled = true;
        
        retryStatusMessage.textContent = 'Sending...';
        retryStatusMessage.className = 'statusMessage successText';

        setTimeout(() => {
            retryBtn.disabled = false;
            retryEmailInput.disabled = false;
            retryStatusMessage.textContent = '';
            
            globalUserEmail = userEmail;
            document.getElementById('displayEmail').textContent = globalUserEmail;
            switchView('view-check-email');
            startCooldown();
        }, 1000); 
    });
}


// =====================================================================
// 4. VIEW 2: CHECK EMAIL (RESEND) LOGIC
// =====================================================================
const resendBtn = document.getElementById('resendBtn');
const resendStatus = document.getElementById('resendStatus');
const COOLDOWN_TIME = 60; 

if (resendBtn) {
    resendBtn.addEventListener('click', () => {
        resendStatus.textContent = 'Sending a new link...';
        resendStatus.className = 'statusMessage successText';
        resendBtn.disabled = true;

        setTimeout(() => {
            resendStatus.textContent = 'A new link has been sent to your inbox!';
            startCooldown();
        }, 1000);
    });
}

function startCooldown() {
    if (!resendBtn) return;
    let timeLeft = COOLDOWN_TIME;
    resendBtn.disabled = true;

    resendBtn.textContent = `Resend Link (${timeLeft}s)`;

    const timer = setInterval(() => {
        timeLeft--;
        resendBtn.textContent = `Resend Link (${timeLeft}s)`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            resendBtn.disabled = false;
            resendBtn.textContent = 'Resend Link';
            if(resendStatus) resendStatus.textContent = '';
        }
    }, 1000);
}


// =====================================================================
// 5. VIEW 5: CREATE NEW PASSWORD LOGIC
// =====================================================================
const newPasswordForm = document.getElementById('newPasswordForm');

if (newPasswordForm) {
    const newPassInput = document.getElementById('newPass');
    const confirmPassInput = document.getElementById('confirmPass');
    const passwordStatusMessage = document.getElementById('passwordStatusMessage');
    const submitNewPassBtn = document.getElementById('submitNewPassBtn');
    
    // Checklist Elements
    const reqLength = document.getElementById('reqLength');
    const reqCases = document.getElementById('reqCases');
    const reqNumber = document.getElementById('reqNumber');

    // Toggle Password Visibility
    document.querySelectorAll('.togglePassword').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const isPassword = input.type === 'password';
            
            input.type = isPassword ? 'text' : 'password';
            
            if (isPassword) {
                this.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
            } else {
                this.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
            }
        });
    });

    // Real-time Password Validation
    if (newPassInput) {
        newPassInput.addEventListener('input', function() {
            const val = this.value;

            if (val.length >= 8) reqLength.classList.add('valid');
            else reqLength.classList.remove('valid');

            if (/[a-z]/.test(val) && /[A-Z]/.test(val)) reqCases.classList.add('valid');
            else reqCases.classList.remove('valid');

            if (/\d/.test(val)) reqNumber.classList.add('valid');
            else reqNumber.classList.remove('valid');
        });
    }

    // Form Submission
    newPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        passwordStatusMessage.textContent = '';
        passwordStatusMessage.className = 'statusMessage';

        const pass1 = newPassInput.value;
        const pass2 = confirmPassInput.value;

        if (pass1 !== pass2) {
            passwordStatusMessage.textContent = 'Passwords do not match.';
            passwordStatusMessage.classList.add('errorText');
            return;
        }

        const isValid = pass1.length >= 8 && /[a-z]/.test(pass1) && /[A-Z]/.test(pass1) && /\d/.test(pass1);

        if (!isValid) {
            passwordStatusMessage.textContent = 'Please meet all password requirements.';
            passwordStatusMessage.classList.add('errorText');
            return;
        }

        submitNewPassBtn.disabled = true;

        setTimeout(() => {
            switchView('view-reset-success');
        }, 1000);
    });
}
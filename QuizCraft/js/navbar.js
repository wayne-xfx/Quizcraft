// --- 1. NAVBAR TEMPLATE ---
const navbarTemplate = `
    <nav class="top-navbar glass-panel">
        <div class="nav-left">
            <img src="../assets/icons/mini_logo.svg" alt="QuizCraft Logo" class="mini-logo">
        </div>
        
        <div class="nav-right">
            <button class="create-quiz-btn" id="openQuizModalBtn" aria-label="Create a Quiz">
                <img src="../assets/icons/create_quiz_button.svg" alt="" class="img-normal">
                <img src="../assets/icons/create_quiz_button_hover.svg" alt="" class="img-hover">
            </button>
            
            <div class="user-info">
                <span class="username">Karl Dave</span>
                <span class="email">karldave@example.com</span>
            </div>
            
            <a href="login.html" class="logout-btn">
                <img src="../assets/icons/logout_button.svg" alt="Logout" class="logout-icon">
            </a>
        </div>
    </nav>
`;

// --- 2. MODAL TEMPLATE ---
const modalTemplate = `
    <div id="quizTypeModal" class="modal-overlay">
        <div class="modal-content glass-panel">
            
            <button class="btn-back" id="closeModalBtn" aria-label="Go back">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FFF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 8 8 12 12 16"></polyline>
                    <line x1="16" y1="12" x2="8" y2="12"></line>
                </svg>
            </button>

            <div class="modal-options mt-4">
                <!-- Multiple Choice Card -->
                <div class="quiz-option-card" data-type="mcq">
                    <div class="option-icon">
                        <img src="../assets/icons/mcq_normal.svg" class="icon-normal">
                        <img src="../assets/icons/mcq_active.svg" class="icon-active">
                    </div>
                </div>

                <!-- Identification Card -->
                <div class="quiz-option-card" data-type="id">
                    <div class="option-icon">
                        <img src="../assets/icons/id_normal.svg" class="icon-normal">
                        <img src="../assets/icons/id_active.svg" class="icon-active">
                    </div>
                </div>
            </div>

            <div class="modal-footer mt-4" style="text-align: center;">
                <button class="btn-continue" id="continueBtn">Continue</button>
            </div>

        </div>
    </div>
`;

// --- 3. INJECT INTO DOM ---
// This adds both the navbar and the hidden modal to your page
document.getElementById('navbar-container').innerHTML = navbarTemplate + modalTemplate;


// --- 4. MODAL LOGIC ---
// Wait for the DOM to fully load the injected HTML
setTimeout(() => {
    const openModalBtn = document.getElementById('openQuizModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('quizTypeModal');
    const optionCards = document.querySelectorAll('.quiz-option-card');
    const continueBtn = document.getElementById('continueBtn');

    let selectedQuizType = null;

    // Open Modal
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modal.classList.add('show');
        });
    }

    // Close Modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            // Optional: reset selection when closed
            optionCards.forEach(c => c.classList.remove('active'));
            selectedQuizType = null;
        });
    }

    // Handle Card Selection (Active State)
    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove 'active' class from all cards
            optionCards.forEach(c => c.classList.remove('active'));
            
            // Add 'active' class to the clicked card
            card.classList.add('active');
            
            // Store the selected type (mcq or id)
            selectedQuizType = card.getAttribute('data-type');
        });
    });

    // Handle Continue Button Redirect
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            if (selectedQuizType === 'mcq') {
                window.location.href = 'create_quiz_mcq.html'; // Redirects to MCQ template
            } else if (selectedQuizType === 'id') {
                window.location.href = 'create_quiz_id.html';  // Redirects to ID template
            } else {
                // If they click continue without selecting a card
                alert('Please select a quiz type first!');
            }
        });
    }
}, 100); // Slight delay to ensure DOM injection is finished
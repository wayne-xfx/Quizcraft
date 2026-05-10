// --- LOGOUT MODAL LOGIC ---
const logoutTrigger = document.getElementById('logoutTrigger'); 
const logoutModal = document.getElementById('logoutModal');
const cancelLogout = document.getElementById('cancelLogout');
const confirmLogout = document.getElementById('confirmLogout');

document.addEventListener('click', (e) => {
    if (e.target.closest('.logout-btn')) {
        e.preventDefault(); 
        logoutModal.style.display = 'flex';
    }
});

cancelLogout.addEventListener('click', () => {
    logoutModal.style.display = 'none';
});

confirmLogout.addEventListener('click', () => {
    window.location.href = 'login';
});

// --- TAB SWITCHING LOGIC ---
const tabCommunity = document.getElementById('tab-community');
const tabMyQuizzes = document.getElementById('tab-my-quizzes');
const contentCommunity = document.getElementById('content-community');
const contentMyQuizzes = document.getElementById('content-my-quizzes');

tabCommunity.addEventListener('click', () => {
    tabCommunity.classList.add('active');
    tabMyQuizzes.classList.remove('active');
    
    contentCommunity.style.display = 'flex'; 
    contentMyQuizzes.style.display = 'none';
});

tabMyQuizzes.addEventListener('click', () => {
    tabMyQuizzes.classList.add('active');
    tabCommunity.classList.remove('active');
    
    contentMyQuizzes.style.display = 'block'; 
    contentCommunity.style.display = 'none';
});


// =====================================================================
// ⚠️ BACKEND REMINDER: Connect this function to your '/api/quizzes/my-quizzes' 
// endpoint to pull the user's specific data.
// =====================================================================
// --- RENDER DASHBOARD CARDS (BACKEND INTEGRATION) ---
async function fetchAndRenderMyQuizzes() {
    const emptyState = document.getElementById('my-quizzes-empty');
    const gridContainer = document.getElementById('my-quizzes-grid');
    // Assuming your backend dev will toggle pagination visibility when they hook it up
    const paginationControls = document.getElementById('my-quizzes-pagination');

    try {
        // 1. Fetch the user's quizzes from the database
        const response = await fetch('/api/quizzes/my-quizzes');
        const quizzes = await response.json();

        // 2. Check if the user has any saved quizzes
        if (quizzes.length > 0) {
            emptyState.style.display = 'none';
            gridContainer.style.display = 'grid';
            gridContainer.innerHTML = ''; 
            
            // Show pagination controls if needed later (hidden by default initially)
            // paginationControls.style.display = 'flex';

            // 3. STRICTLY LIMIT TO 8 CARDS (Prep for Pagination)
            const quizzesToDisplay = quizzes.slice(0, 8);

            // 4. Loop through the data and build the HTML cards
            quizzesToDisplay.forEach(quiz => {
                // Includes local fallback image and `<p>` tag for type matching the test file
                const cardHTML = `
                    <div class="quiz-card">
                        <img src="../assets/background.svg" alt="Quiz Thumbnail" class="quiz-card-img">
                        <div class="quiz-card-footer">
                            <div class="quiz-meta">
                                <h4>${quiz.title}</h4>
                                <p>${quiz.totalQuestions || 0} Questions</p>
                                <p>Creator: <span class="creator">${quiz.creator}</span></p>
                                <p>Type: <span class="quiz-type">${quiz.type || 'Unknown'}</span></p>
                            </div>
                            <button class="btn-view">View Quiz</button>
                        </div>
                    </div>
                `;
                gridContainer.insertAdjacentHTML('beforeend', cardHTML);
            });

        } else {
            emptyState.style.display = 'flex';
            gridContainer.style.display = 'none';
            if(paginationControls) paginationControls.style.display = 'none';
        }
    } catch (error) {
        console.error("Failed to load quizzes from backend:", error);
    }
}

document.addEventListener('DOMContentLoaded', fetchAndRenderMyQuizzes);

// --- VIEW QUIZ MODAL LOGIC ---
const viewQuizModal = document.getElementById('viewQuizModal');
const closeViewQuizBtn = document.getElementById('closeViewQuizBtn');

if(closeViewQuizBtn) {
    closeViewQuizBtn.addEventListener('click', () => {
        viewQuizModal.style.display = 'none';
    });
}

if(viewQuizModal) {
    viewQuizModal.addEventListener('click', (e) => {
        if (e.target === viewQuizModal) {
            viewQuizModal.style.display = 'none';
        }
    });
}

// Global click listener to catch dynamically rendered "View Quiz" buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-view')) {
        const card = e.target.closest('.quiz-card');
        
        // Extract data directly from the HTML elements inside the card
        const title = card.querySelector('h4').textContent;
        const questionsText = card.querySelector('.quiz-meta p:nth-child(2)').textContent;
        const creator = card.querySelector('.creator').textContent;
        
        // Check if quiz-type exists to prevent errors in case database does not have quiz type
        const typeEl = card.querySelector('.quiz-type');
        const quizType = typeEl ? typeEl.textContent : 'Unknown';
        
        const imgSrc = card.querySelector('img').src;
        
        const questionCount = questionsText.split(' ')[0];

        // Inject data into the modal
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-creator').textContent = creator;
        document.getElementById('modal-questions').textContent = questionCount;
        document.getElementById('modal-type').textContent = quizType;
        document.getElementById('modal-img').src = imgSrc;
        
        viewQuizModal.style.display = 'flex';
    }
});

// ---------------------------------------------------------------------
// --- TAKE QUIZ ROUTING LOGIC (MUST BE REMOVED WHEN INTEGRATING BACKEND) ---
// ---------------------------------------------------------------------
const btnTakeQuiz = document.querySelector('.btn-take-quiz');

if (btnTakeQuiz) {
    btnTakeQuiz.addEventListener('click', () => {
        // 1. Check the text inside the modal to see what type of quiz we are viewing
        const quizType = document.getElementById('modal-type').textContent.trim();

        // 2. Route the user to the correct template (using clean backend-ready URLs)
        if (quizType === 'Multiple Choice') {
            window.location.href = 'take_quiz_mcq';
        } else if (quizType === 'Identification') {
            window.location.href = 'take_quiz_id';
        } else {
            alert("Error: Unknown quiz type. Cannot start quiz.");
        }
    });
}

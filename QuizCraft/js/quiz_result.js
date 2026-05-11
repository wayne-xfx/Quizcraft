// =====================================================================
// ⚠️ BACKEND REMINDER: Replace this 'localStorage' mock with a direct 
// database fetch for the quiz attempt results.
// =====================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Grab the results from LocalStorage
    const resultData = JSON.parse(localStorage.getItem('recentQuizResult'));

    // Navigation and Action Buttons
    const btnBack = document.getElementById('btn-back-dashboard');
    const btnRetake = document.getElementById('btn-retake');
    const btnHistory = document.getElementById('btn-history');

    // Modal elements
    const retakeModal = document.getElementById('retakeModal');
    const confirmRetake = document.getElementById('confirmRetake');
    const cancelRetake = document.getElementById('cancelRetake');
    
    // NEW: Smart Review Modal elements
    const srModalOverlay = document.getElementById('smart-review-modal');
    const btnCloseSr = document.getElementById('btn-close-sr');

    // Setup basic navigation
    btnBack.addEventListener('click', () => window.location.href = 'dashboard');
    
    const btnViewHistory = document.getElementById('btn-history'); 

    if (btnViewHistory) {
        btnViewHistory.addEventListener('click', () => {
            window.location.href = 'quiz_history.html';
        });
    }    

    // --- RETAKE MODAL LOGIC ---
    if (btnRetake) {
        btnRetake.addEventListener('click', () => {
            retakeModal.style.display = 'flex';
        });
    }

    if (cancelRetake) {
        cancelRetake.addEventListener('click', () => {
            retakeModal.style.display = 'none';
        });
    }

    // --- SMART REVIEW MODAL LOGIC ---
    if (btnCloseSr) {
        btnCloseSr.addEventListener('click', () => {
            srModalOverlay.style.display = 'none';
        });
    }

    // Close when clicking outside the Smart Review modal
    if (srModalOverlay) {
        srModalOverlay.addEventListener('click', (e) => {
            if (e.target === srModalOverlay) {
                srModalOverlay.style.display = 'none';
            }
        });
    }

    // Safety check
    if (!resultData) {
        document.getElementById('qr-quiz-title').textContent = "Unknown Quiz";
        document.getElementById('qr-results-list').innerHTML = "<p style='color: white;'>No recent quiz data found.</p>";
        if(btnRetake) {
            btnRetake.textContent = "Exit Page";
            btnRetake.addEventListener('click', () => window.location.href = 'dashboard');
        }
        if(cancelRetake) cancelRetake.parentElement.innerHTML = ""; 
        return;
    }

    // Setup Header & Modal Confirm
    document.getElementById('qr-quiz-title').textContent = resultData.title;
    const retakeURL = resultData.returnUrl; 

    if (confirmRetake && retakeURL) {
        confirmRetake.addEventListener('click', () => {
            window.location.href = retakeURL;
        });
    }

    // ---------------------------------------------------------------------
    // --- PAGINATION & RENDERING LOGIC ---
    // ---------------------------------------------------------------------
    const itemsPerPage = 5;
    let currentPage = 1;
    const totalQuestions = resultData.questions.length;
    const totalPages = Math.ceil(totalQuestions / itemsPerPage);

    const listContainer = document.getElementById('qr-results-list');
    const paginationContainer = document.getElementById('qr-pagination-container');

    function renderList(page) {
        listContainer.innerHTML = '';
        
        // Calculate start and end indexes for slicing the array
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalQuestions);
        const pageData = resultData.questions.slice(startIndex, endIndex);

        pageData.forEach((q, index) => {
            // Keep the absolute question number correct (e.g., Q6, Q7)
            const absoluteQuestionNumber = startIndex + index + 1;
            // Get the true array index for the Smart Review button data attribute
            const trueArrayIndex = startIndex + index; 

            const iconSvg = q.isCorrect 
                ? `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
                : `<svg viewBox="0 0 24 24" fill="none" stroke="#ff4b4b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

            const userAnsColor = q.isCorrect ? '#00FFF6' : '#ff4b4b';

            // Notice the data-index attribute added to the button below!
            const cardHTML = `
                <div class="qr-result-card">
                    <div class="qr-card-left">
                        <div class="qr-icon">${iconSvg}</div>
                        <div class="qr-text">
                            <h4>Q${absoluteQuestionNumber}: ${q.question}</h4>
                            <p>Correct Answer: <span class="highlight-cyan">${q.correctAnswer}</span></p>
                            <p>User Answer: <span style="color: ${userAnsColor};">${q.userAnswer}</span></p>
                        </div>
                    </div>
                    <button class="qr-btn-smart" data-index="${trueArrayIndex}">Smart Review</button>
                </div>
            `;
            listContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // --- EVENT DELEGATION FOR SMART REVIEW BUTTONS ---
    // Because buttons are destroyed and recreated during pagination, we listen on the container.
    listContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('qr-btn-smart')) {
            const questionIndex = e.target.getAttribute('data-index');
            const specificQuestionData = resultData.questions[questionIndex];

            // Dynamically update the modal's title to match the clicked question
            if (specificQuestionData) {
                const topicHeader = document.querySelector('.sr-topic');
                if(topicHeader) topicHeader.textContent = `Review: ${specificQuestionData.question}`;
            }
            
            // Open the modal
            if (srModalOverlay) srModalOverlay.style.display = 'flex';
        }
    });

    function renderPagination() {
        paginationContainer.innerHTML = '';

        // Hide pagination completely if 5 or fewer questions
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';

        // 1. Previous Arrow Button (<)
        const prevBtn = document.createElement('button');
        prevBtn.className = 'qr-page-btn arrow-btn';
        prevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px; height:16px;"><path d="M15 18l-6-6 6-6"/></svg>`;
        
        if (currentPage === 1) {
            prevBtn.disabled = true;
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.addEventListener('click', () => {
                currentPage--;
                renderList(currentPage);
                renderPagination();
            });
        }
        paginationContainer.appendChild(prevBtn);

        // 2. Numbered Buttons
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `qr-page-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            
            btn.addEventListener('click', () => {
                currentPage = i;
                renderList(currentPage);
                renderPagination(); 
            });
            
            paginationContainer.appendChild(btn);
        }

        // 3. Next Arrow Button (>)
        const nextBtn = document.createElement('button');
        nextBtn.className = 'qr-page-btn arrow-btn';
        nextBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px; height:16px;"><path d="M9 18l6-6-6-6"/></svg>`;
        
        if (currentPage === totalPages) {
            nextBtn.disabled = true;
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.addEventListener('click', () => {
                currentPage++;
                renderList(currentPage);
                renderPagination();
            });
        }
        paginationContainer.appendChild(nextBtn);
    }
    
    // Initialize list and pagination
    renderList(currentPage);
    renderPagination();

    // ---------------------------------------------------------------------
    // --- CALCULATE SCORE (Based on all questions, not just the page) ---
    // ---------------------------------------------------------------------
    let correctAnswers = 0;
    resultData.questions.forEach(q => {
        if (q.isCorrect) correctAnswers++;
    });

    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const degrees = (percentage / 100) * 360;

    document.getElementById('qr-score-fraction').textContent = `${correctAnswers}/${totalQuestions}`;
    document.getElementById('qr-score-percent').textContent = `${percentage}%`;
    
    // Animates the circle drawing itself
    setTimeout(() => {
        const circle = document.getElementById('qr-score-circle');
        if(circle) circle.style.setProperty('--progress', `${degrees}deg`);
    }, 100);
});
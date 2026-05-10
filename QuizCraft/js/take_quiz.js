// =====================================================================
// ⚠️ BACKEND DEV NOTE: DUMMY DATA REMOVAL REQUIRED ⚠️
// Currently, this quiz uses hardcoded data for frontend testing.
// TO DO: 
// 1. Fetch the actual quiz questions from your database based on the quiz ID.
// 2. Determine 'quizType' dynamically from the fetched database record.
// 3. Map the fetched data to the 'activeQuestions' array structure below.
// =====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. DETERMINE QUIZ TYPE (Prototype URL parameter)
    const urlParams = new URLSearchParams(window.location.search);
    const quizType = urlParams.get('type') || 'mcq'; // Defaults to mcq

    // --- SIMULATED DATA ---
    const dummyMcqQuestions = [
        {
            question: "Which HTML tag is used to define an internal style sheet?",
            options: ["css", "style", "script", "link"],
            correctIndex: 1 
        },
        {
            question: "Which CSS property changes text color? This is a very long question to test text wrapping and responsiveness of the quiz interface.",
            options: ["text-style", "font-color", "color", "text-color"],
            correctIndex: 2
        }
    ];

    const dummyIdQuestions = [
        {
            question: "What does HTML stand for?",
            correctAnswer: "Hyper Text Markup Language" 
        },
        {
            question: "What is the capital of the Philippines?",
            correctAnswer: "Manila"
        }
    ];

    // Load the correct dataset based on the URL
    const activeQuestions = quizType === 'id' ? dummyIdQuestions : dummyMcqQuestions;

    // State Variables
    let currentIndex = 0;
    // ID uses empty strings "", MCQ uses null for unanswered
    let userAnswers = new Array(activeQuestions.length).fill(quizType === 'id' ? "" : null); 

    // DOM Elements
    const quizTitle = document.getElementById('qt-title');
    const questionText = document.getElementById('qt-question-text');
    const subText = document.getElementById('qt-subtext');
    const dynamicInputArea = document.getElementById('qt-dynamic-input-area');
    
    const progressFill = document.getElementById('qt-progress-fill');
    const progressText = document.getElementById('qt-progress-text');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const btnExit = document.getElementById('btn-exit');

    // Set Initial Title
    quizTitle.textContent = quizType === 'id' ? "Identification Test" : "Multiple Choice Test";

    // -------------------------------------------------------------
    // RENDER FUNCTION
    // -------------------------------------------------------------
    function renderQuestion(index) {
        const qData = activeQuestions[index];
        
        // 1. Update Text & Progress
        questionText.textContent = qData.question;
        subText.textContent = quizType === 'id' ? "Type your answer here:" : "Select your answer:";
        
        const currentQNum = index + 1;
        const totalQNum = activeQuestions.length;
        progressText.textContent = `${currentQNum} / ${totalQNum}`;
        progressFill.style.width = `${(currentQNum / totalQNum) * 100}%`;

        // 2. Handle Buttons
        btnPrev.style.display = index === 0 ? 'none' : 'inline-flex';
        btnNext.textContent = index === activeQuestions.length - 1 ? "Finish Quiz" : "Next";

        // 3. Inject Dynamic Inputs
        dynamicInputArea.innerHTML = ''; // Clear previous inputs

        if (quizType === 'id') {
            // --- INJECT IDENTIFICATION BOX ---
            dynamicInputArea.innerHTML = `
                <div class="qt-input-container">
                    <input type="text" class="qt-id-input" id="qt-answer-input" placeholder="Answer..." autocomplete="off">
                </div>
            `;
            
            const answerInput = document.getElementById('qt-answer-input');
            answerInput.value = userAnswers[index]; // Restore previous answer
            answerInput.focus(); // Auto-focus

            // Save on type
            answerInput.addEventListener('input', (e) => {
                userAnswers[currentIndex] = e.target.value;
            });

            // Allow 'Enter' to submit
            answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    btnNext.click();
                }
            });

        } else {
            // --- INJECT MULTIPLE CHOICE GRID ---
            const optionsList = document.createElement('div');
            optionsList.className = 'qt-options-list';

            qData.options.forEach((optionText, i) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'qt-option';
                
                if (userAnswers[index] === i) {
                    optionDiv.classList.add('selected');
                }
                
                const safeText = optionText.replace(/</g, "&lt;").replace(/>/g, "&gt;");

                optionDiv.innerHTML = `
                    <div class="qt-radio">
                        <div class="qt-radio-fill"></div>
                    </div>
                    <span>${safeText}</span>
                `;

                // Handle click selection
                optionDiv.addEventListener('click', () => {
                    optionsList.querySelectorAll('.qt-option').forEach(opt => opt.classList.remove('selected'));
                    optionDiv.classList.add('selected');
                    userAnswers[index] = i; 
                });

                optionsList.appendChild(optionDiv);
            });

            dynamicInputArea.appendChild(optionsList);
        }
    }

    // -------------------------------------------------------------
    // NAVIGATION CONTROLS
    // -------------------------------------------------------------
    
    // NEXT / FINISH BUTTON
    btnNext.addEventListener('click', () => {
        // Validation check
        const currentAnswer = userAnswers[currentIndex];
        if ((quizType === 'id' && currentAnswer.trim() === "") || (quizType === 'mcq' && currentAnswer === null)) {
            alert(quizType === 'id' ? "Please type an answer before proceeding." : "Please select an answer before proceeding.");
            return;
        }

        // Proceed or Finish
        if (currentIndex < activeQuestions.length - 1) {
            currentIndex++;
            renderQuestion(currentIndex);
        } else {
            submitQuiz();
        }
    });

    // PREVIOUS BUTTON
    btnPrev.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            renderQuestion(currentIndex);
        }
    });

    // EXIT BUTTON
    btnExit.addEventListener('click', () => {
        if(confirm("Are you sure you want to leave? Your progress will be lost.")) {
            window.location.href = 'dashboard.html';
        }
    });

    // -------------------------------------------------------------
    // SUBMISSION LOGIC
    // -------------------------------------------------------------
    function submitQuiz() {
        let formattedQuestions = [];

        if (quizType === 'id') {
            formattedQuestions = activeQuestions.map((q, i) => {
                const isMatch = userAnswers[i].trim().toLowerCase() === q.correctAnswer.toLowerCase();
                return {
                    question: q.question,
                    correctAnswer: q.correctAnswer, 
                    userAnswer: userAnswers[i] || "No Answer",
                    isCorrect: isMatch
                };
            });
        } else {
            formattedQuestions = activeQuestions.map((q, i) => {
                const isMatch = userAnswers[i] === q.correctIndex;
                return {
                    question: q.question,
                    correctAnswer: q.options[q.correctIndex], 
                    userAnswer: q.options[userAnswers[i]],
                    isCorrect: isMatch
                };
            });
        }

        const resultsToSave = {
            title: quizTitle.textContent,
            returnUrl: `take_quiz.html?type=${quizType}`,
            questions: formattedQuestions
        };
        
        localStorage.setItem('recentQuizResult', JSON.stringify(resultsToSave));
        window.location.href = 'quiz_result.html'; 
    }

    // Initialize first question on load
    renderQuestion(currentIndex);
});
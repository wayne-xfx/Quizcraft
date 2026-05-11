document.addEventListener('DOMContentLoaded', () => {
    
    // Helper function to prevent Cross-Site Scripting (XSS)
    function escapeHTML(str) {
        if (!str) return "";
        return String(str).replace(/[&<>"']/g, function(m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
        });
    }

    // -------------------------------------------------------------
    // 1. DETERMINE QUIZ ID & FETCH DATA
    // -------------------------------------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = parseInt(urlParams.get('id'));

    // MOCK DATABASE (Must match the IDs on your dashboard)
    const mockDatabase = [
        { 
            id: 1, title: "Hardware Anatomy", type: "Identification", privacy: "public",
            desc: "A fundamental quiz testing your knowledge of internal computer components.",
            questions: [
                { text: "What acts as the brain of the computer?", answer: "CPU" },
                { text: "What is the main circuit board called?", answer: "Motherboard" }
            ]
        },
        { 
            id: 2, title: "Networking 101", type: "Multiple Choice", privacy: "private",
            desc: "Test your knowledge on basic subnetting, IPs, and network topologies.",
            questions: [
                { text: "What port does HTTP use?", options: ["80", "443", "21", "22"], correctIndex: 0 },
                { text: "Which protocol is connection-oriented?", options: ["UDP", "IP", "TCP", "ICMP"], correctIndex: 2 }
            ]
        }
    ];

    const quizData = mockDatabase.find(q => q.id === quizId);

    if (!quizData) {
        alert("Quiz not found!");
        window.location.href = 'dashboard.html';
        return;
    }

    // Set quizType based on data ('id' or 'mcq')
    let quizType = quizData.type === 'Identification' ? 'id' : 'mcq';

    // PRE-FILL TOP CONFIG SECTION
    document.getElementById('display-quiz-title').textContent = quizData.title;
    document.getElementById('quiz-title').value = quizData.title;
    document.getElementById('quiz-description').value = quizData.desc || "";
    document.getElementById('quiz-privacy').value = quizData.privacy;

    // -------------------------------------------------------------
    // 2. THUMBNAIL UPLOAD LOGIC
    // -------------------------------------------------------------
    const fileInput = document.getElementById('thumbnail-upload');
    const iconTrigger = document.getElementById('icon-upload-trigger');
    const btnTrigger = document.getElementById('btn-upload-trigger');

    if (fileInput && iconTrigger && btnTrigger) {
        iconTrigger.addEventListener('click', () => fileInput.click());
        btnTrigger.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const fileName = e.target.files[0].name;
                const uploadTitle = document.querySelector('.upload-title');
                uploadTitle.textContent = fileName;
                uploadTitle.style.color = '#00FFF6';
            }
        });
    }

    // -------------------------------------------------------------
    // 3. DYNAMIC QUESTION CREATION & PRE-FILLING
    // -------------------------------------------------------------
    const btnAddQuestion = document.getElementById('add-question-btn');
    const questionsContainer = document.getElementById('questions-container');
    const emptyState = document.getElementById('empty-state');
    let questionCounter = 0;

    // A unified function to generate a question block. 
    // If 'qData' is provided, it pre-fills the data. If not, it creates a blank one.
    function generateQuestionBlock(qData = null) {
        questionCounter++;
        if (emptyState) emptyState.style.display = 'none';

        const questionBlock = document.createElement('div');
        questionBlock.className = 'question-block glass-panel mt-2';

        const prefilledText = qData ? escapeHTML(qData.text) : "";

        let questionHTML = `
            <div class="question-header">
                <h3 class="question-number">Question ${questionCounter}</h3>
                <button type="button" class="btn-remove">Remove</button>
            </div>
            <div class="form-group mt-2">
                <label>Question Text</label>
                <input type="text" class="custom-input" value="${prefilledText}" placeholder="Enter your question...">
            </div>
        `;

        if (quizType === 'id') {
            // IDENTIFICATION SPECIFIC INPUT
            const prefilledAnswer = qData ? escapeHTML(qData.answer) : "";
            questionHTML += `
            <div class="form-group mt-2">
                <label>Correct Answer</label>
                <input type="text" class="custom-input" value="${prefilledAnswer}" placeholder="Enter the exact correct answer...">
            </div>`;
        } else {
            // MULTIPLE CHOICE SPECIFIC INPUTS
            let optionsHTML = '';
            for (let i = 0; i < 4; i++) {
                const optText = (qData && qData.options) ? escapeHTML(qData.options[i]) : "";
                const isChecked = (qData && qData.correctIndex === i) ? 'checked' : '';
                
                // Dynamically sets placeholders A, B, C, D
                const placeholderLetter = String.fromCharCode(65 + i); 

                optionsHTML += `
                    <div class="mcq-option">
                        <input type="radio" name="q${questionCounter}-correct" class="mcq-radio" ${isChecked}>
                        <input type="text" class="custom-input" value="${optText}" placeholder="Option ${placeholderLetter}">
                    </div>
                `;
            }

            questionHTML += `
            <div class="form-group mt-2">
                <label>Answer Options <span class="label-subtext">(Click the circle of the correct answer)</span></label>
                <div class="mcq-grid mt-1">
                    ${optionsHTML}
                </div>
            </div>`;
        }

        questionBlock.innerHTML = questionHTML;

        // --- REMOVE BUTTON LOGIC ---
        const btnRemove = questionBlock.querySelector('.btn-remove');
        btnRemove.addEventListener('click', () => {
            questionBlock.remove();
            updateQuestionNumbers();
            if (questionsContainer.children.length === 0) {
                emptyState.style.display = 'flex'; 
                questionCounter = 0; 
            }
        });

        questionsContainer.appendChild(questionBlock);
    }

    // Helper to keep numbers/radio names in sync when deleting
    function updateQuestionNumbers() {
        const blocks = questionsContainer.querySelectorAll('.question-block');
        blocks.forEach((block, index) => {
            const newNum = index + 1;
            block.querySelector('.question-number').textContent = `Question ${newNum}`;
            
            if (quizType === 'mcq') {
                const radios = block.querySelectorAll('.mcq-radio');
                radios.forEach(radio => {
                    radio.name = `q${newNum}-correct`;
                });
            }
        });
        questionCounter = blocks.length; 
    }

    // -> 1. Pre-fill existing questions on load
    quizData.questions.forEach(q => generateQuestionBlock(q));

    // -> 2. Bind the "Add Question" button to create blank blocks
    if (btnAddQuestion) {
        btnAddQuestion.addEventListener('click', () => {
            generateQuestionBlock(null);
            
            // Auto-scroll to the newly added block
            questionsContainer.scrollTo({
                top: questionsContainer.scrollHeight,
                behavior: 'smooth'
            });
        });
    }

    // -------------------------------------------------------------
    // 4. CANCEL MODAL LOGIC
    // -------------------------------------------------------------
    const btnTriggerCancel = document.getElementById('btn-trigger-cancel');
    const cancelModalOverlay = document.getElementById('cancel-modal-overlay');
    const btnConfirmCancel = document.getElementById('btn-confirm-cancel');
    const btnCloseCancel = document.getElementById('btn-close-cancel');

    if (btnTriggerCancel && cancelModalOverlay) {
        btnTriggerCancel.addEventListener('click', () => cancelModalOverlay.style.display = 'flex');
        btnCloseCancel.addEventListener('click', () => cancelModalOverlay.style.display = 'none');
        btnConfirmCancel.addEventListener('click', () => window.location.href = 'dashboard.html'); 
    }

    // -------------------------------------------------------------
    // 5. SAVE QUIZ LOGIC 
    // -------------------------------------------------------------
    const btnSave = document.getElementById('btn-save-quiz');
    const saveModalOverlay = document.getElementById('save-modal-overlay');
    const btnConfirmSave = document.getElementById('btn-confirm-save');
    const btnCloseSave = document.getElementById('btn-close-save');

    if (btnSave && saveModalOverlay) {
        
        btnSave.addEventListener('click', () => {
            saveModalOverlay.style.display = 'flex';
        });

        btnCloseSave.addEventListener('click', () => {
            saveModalOverlay.style.display = 'none';
        });

        btnConfirmSave.addEventListener('click', async () => {
            saveModalOverlay.style.display = 'none';
            btnSave.textContent = "Saving...";

            const titleInput = document.getElementById('quiz-title').value;
            const quizTitle = titleInput.trim() !== '' ? escapeHTML(titleInput) : 'Untitled Quiz';
            const descInput = document.getElementById('quiz-description').value;
            const quizDesc = escapeHTML(descInput.trim()); 

            const typeString = quizType === 'id' ? 'Identification' : 'Multiple Choice';

            const quizPayload = {
                id: quizId,
                title: quizTitle,
                totalQuestions: questionCounter,
                description: quizDesc,
                type: typeString
            };

            // MOCK SUBMISSION LOGIC 
            console.log("Submitting Edits Payload:", quizPayload);
            
            setTimeout(() => {
                window.location.href = 'dashboard.html'; 
            }, 1000);
        });
    }
});
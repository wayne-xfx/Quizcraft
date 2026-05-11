document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. FAKE DATABASE
    // ==========================================
    let myQuizzes = [
        { id: 1, title: "Hardware Anatomy", creator: "Karl Dave", questions: 5, type: "Identification", desc: "...", img: "../assets/background.svg" },
        { id: 2, title: "Networking 101", creator: "Karl Dave", questions: 10, type: "Multiple Choice", desc: "...", img: "../assets/background.svg" },
        { id: 3, title: "Linux Terminal", creator: "Karl Dave", questions: 15, type: "Identification", desc: "...", img: "../assets/background.svg" },
        { id: 4, title: "Linux Terminal", creator: "Karl Dave", questions: 15, type: "Identification", desc: "...", img: "../assets/background.svg" },
        { id: 5, title: "Linux Terminal", creator: "Karl Dave", questions: 15, type: "Identification", desc: "...", img: "../assets/background.svg" },
        { id: 6, title: "Linux Terminal", creator: "Karl Dave", questions: 15, type: "Identification", desc: "...", img: "../assets/background.svg" },
        { id: 7, title: "Linux Terminal", creator: "Karl Dave", questions: 15, type: "Identification", desc: "...", img: "../assets/background.svg" },
        { id: 8, title: "Linux Terminal", creator: "Karl Dave", questions: 15, type: "Identification", desc: "...", img: "../assets/background.svg" },
        { id: 9, title: "Linux Terminal", creator: "Karl Dave", questions: 15, type: "Identification", desc: "...", img: "../assets/background.svg" },
        { id: 10, title: "Linux Terminal", creator: "Karl Dave", questions: 15, type: "Identification", desc: "...", img: "../assets/background.svg" },
        { id: 11, title: "Linux Terminal", creator: "Karl Dave", questions: 15, type: "Identification", desc: "...", img: "../assets/background.svg" },
        { id: 12, title: "Linux Terminal", creator: "Karl Dave", questions: 15, type: "Identification", desc: "...", img: "../assets/background.svg" }
    ];

    let currentActiveQuizId = null; 
    
    // --- PAGINATION STATE ---
    let currentPage = 1;
    const itemsPerPage = 8; // Limit to 8 cards per page

    // ==========================================
    // 2. DOM ELEMENTS
    // ==========================================
    const grid = document.getElementById('my-quizzes-grid');
    const emptyState = document.getElementById('my-quizzes-empty');
    const paginationWrapper = document.getElementById('my-quizzes-pagination');
    const pageInput = document.querySelector('.page-input');
    const pageTotal = document.querySelector('.page-total span');
    
    // Tabs & Content
    const tabCommunity = document.getElementById('tab-community');
    const tabMyQuizzes = document.getElementById('tab-my-quizzes');
    const contentCommunity = document.getElementById('content-community');
    const contentMyQuizzes = document.getElementById('content-my-quizzes');

    // Modals
    const viewQuizModal = document.getElementById('viewQuizModal');
    const editModal = document.getElementById('editModal');
    const deleteModal = document.getElementById('deleteModal');
    const logoutModal = document.getElementById('logoutModal');
    const loadingOverlay = document.getElementById('quiz-loading-overlay');

    // Buttons
    const btnCloseView = document.getElementById('closeViewQuizBtn');
    const btnEdit = document.querySelector('.edit-btn');
    const btnDelete = document.querySelector('.delete-btn');
    const btnTakeQuiz = document.querySelector('.btn-take-quiz');
    const confirmEdit = document.getElementById('confirmEdit');
    const cancelEdit = document.getElementById('cancelEdit');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmLogout = document.getElementById('confirmLogout');
    const cancelLogout = document.getElementById('cancelLogout');

    // ==========================================
    // 3. TAB SWITCHING LOGIC
    // ==========================================
    if (tabCommunity && tabMyQuizzes) {
        tabCommunity.addEventListener('click', () => {
            tabCommunity.classList.add('active');
            tabMyQuizzes.classList.remove('active');
            contentCommunity.style.display = 'block';
            contentMyQuizzes.style.display = 'none';
        });

        tabMyQuizzes.addEventListener('click', () => {
            tabMyQuizzes.classList.add('active');
            tabCommunity.classList.remove('active');
            contentMyQuizzes.style.display = 'block';
            contentCommunity.style.display = 'none';
        });
    }

    // ==========================================
    // 4. RENDER GRID LOGIC (WITH PAGINATION)
    // ==========================================
    function renderQuizzes() {
        if (myQuizzes.length === 0) {
            emptyState.style.display = 'flex';
            grid.style.display = 'none';
            if(paginationWrapper) paginationWrapper.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        grid.style.display = 'grid'; 
        if(paginationWrapper) paginationWrapper.style.display = 'flex';

        grid.innerHTML = ''; 

        // Calculate Pagination
        const totalPages = Math.ceil(myQuizzes.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = myQuizzes.slice(startIndex, endIndex);

        pageData.forEach(quiz => {
            const card = document.createElement('div');
            card.className = 'quiz-card'; 
            card.setAttribute('data-id', quiz.id); 
            card.innerHTML = `
                <img src="${quiz.img}" alt="Quiz Cover">
                <div class="quiz-card-content">
                    <h3 class="qc-title">${quiz.title}</h3>
                    <p class="qc-meta">${quiz.questions} Questions</p>
                    <p class="qc-creator">Creator: <span class="highlight-cyan">${quiz.creator}</span></p>
                </div>
            `;
            grid.appendChild(card);
        });

        // Update Pagination UI
        if(pageInput) pageInput.value = currentPage;
        if(pageTotal) pageTotal.textContent = totalPages;

        // Re-attach card listeners
        document.querySelectorAll('.quiz-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const quizId = parseInt(e.currentTarget.getAttribute('data-id'));
                openViewModal(quizId);
            });
        });
    }

    // --- Pagination Controls ---
    const prevBtn = document.querySelector('[aria-label="Previous Page"]');
    const nextBtn = document.querySelector('[aria-label="Next Page"]');
    const firstBtn = document.querySelector('[aria-label="First Page"]');
    const lastBtn = document.querySelector('[aria-label="Last Page"]');

    if(prevBtn) prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderQuizzes(); } });
    if(nextBtn) nextBtn.addEventListener('click', () => { const total = Math.ceil(myQuizzes.length / itemsPerPage); if (currentPage < total) { currentPage++; renderQuizzes(); } });
    if(firstBtn) firstBtn.addEventListener('click', () => { currentPage = 1; renderQuizzes(); });
    if(lastBtn) lastBtn.addEventListener('click', () => { currentPage = Math.ceil(myQuizzes.length / itemsPerPage); renderQuizzes(); });

    if(pageInput) {
        pageInput.addEventListener('change', (e) => {
            const total = Math.ceil(myQuizzes.length / itemsPerPage);
            let val = parseInt(e.target.value);
            if (val >= 1 && val <= total) { currentPage = val; renderQuizzes(); }
            else { e.target.value = currentPage; }
        });
    }

    // ==========================================
    // 5. VIEW MODAL LOGIC
    // ==========================================
    function openViewModal(id) {
        const quiz = myQuizzes.find(q => q.id === id);
        if (!quiz) return;
        currentActiveQuizId = id; 
        document.getElementById('modal-title').textContent = quiz.title;
        document.getElementById('modal-creator').textContent = quiz.creator;
        document.getElementById('modal-questions').textContent = quiz.questions;
        document.getElementById('modal-type').textContent = quiz.type;
        document.getElementById('modal-desc').textContent = quiz.desc;
        viewQuizModal.style.display = 'flex';
    }

    if (btnCloseView) {
        btnCloseView.addEventListener('click', () => { viewQuizModal.style.display = 'none'; currentActiveQuizId = null; });
    }

    if (viewQuizModal) {
        viewQuizModal.addEventListener('click', (e) => {
            if (e.target === viewQuizModal) { viewQuizModal.style.display = 'none'; currentActiveQuizId = null; }
        });
    }

    // ==========================================
    // 6. TAKE QUIZ (WITH LOADING SCREEN)
    // ==========================================
    if (btnTakeQuiz && loadingOverlay) {
        btnTakeQuiz.addEventListener('click', (e) => {
            e.preventDefault(); 
            const quizTypeLabel = document.getElementById('modal-type').textContent.trim();
            let typeParam = quizTypeLabel === 'Identification' ? 'id' : 'mcq';

            if (viewQuizModal) viewQuizModal.style.display = 'none';
            document.body.style.overflow = 'hidden';
            loadingOverlay.style.display = 'flex';

            setTimeout(() => { window.location.href = `take_quiz?type=${typeParam}`; }, 2000);
        });
    }

    // ==========================================
    // 7. EDIT & DELETE MODAL LOGIC
    // ==========================================
    if (btnEdit) btnEdit.addEventListener('click', () => editModal.style.display = 'flex');
    if (cancelEdit) cancelEdit.addEventListener('click', () => editModal.style.display = 'none');
    if (confirmEdit) {
        confirmEdit.addEventListener('click', () => {
            editModal.style.display = 'none'; 
            window.location.href = `edit_quiz.html?id=${currentActiveQuizId}`;
        });
    }
    
    if (btnDelete) btnDelete.addEventListener('click', () => deleteModal.style.display = 'flex');
    if (cancelDelete) cancelDelete.addEventListener('click', () => deleteModal.style.display = 'none');
    if (confirmDelete) {
        confirmDelete.addEventListener('click', () => {
            myQuizzes = myQuizzes.filter(q => q.id !== currentActiveQuizId);
            deleteModal.style.display = 'none';
            viewQuizModal.style.display = 'none';
            renderQuizzes(); 
            currentActiveQuizId = null;
        });
    }

    // ==========================================
    // 8. LOGOUT MODAL LOGIC
    // ==========================================
    if (cancelLogout) cancelLogout.addEventListener('click', () => logoutModal.style.display = 'none');
    if (confirmLogout) confirmLogout.addEventListener('click', () => window.location.href = 'index.html');

    // ==========================================
    // INITIALIZATION
    // ==========================================
    renderQuizzes();
    if (tabMyQuizzes) tabMyQuizzes.click();
});
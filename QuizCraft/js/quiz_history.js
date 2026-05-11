document.addEventListener('DOMContentLoaded', () => {

    // 1. BACK BUTTON LOGIC
    const btnBack = document.getElementById('btn-back-dashboard');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }

    // 2. MOCK HISTORY DATA
    // ⚠️ BACKEND NOTE: Replace this array with a fetch() call to the database
    const mockHistory = [
        { id: 1, username: "Karl Dave", date: "11/04/2026", score: 8, total: 10, percent: 80 },
        { id: 2, username: "Karl Dave", date: "11/03/2026", score: 5, total: 10, percent: 50 },
        { id: 3, username: "Karl Dave", date: "11/01/2026", score: 10, total: 10, percent: 100 },
        { id: 4, username: "Karl Dave", date: "10/28/2026", score: 7, total: 10, percent: 70 },
        { id: 5, username: "Karl Dave", date: "10/25/2026", score: 9, total: 10, percent: 90 },
        { id: 6, username: "Karl Dave", date: "10/20/2026", score: 4, total: 10, percent: 40 },
        { id: 7, username: "Karl Dave", date: "10/18/2026", score: 8, total: 10, percent: 80 },
        { id: 8, username: "Karl Dave", date: "10/15/2026", score: 6, total: 10, percent: 60 },
        { id: 9, username: "Karl Dave", date: "10/10/2026", score: 9, total: 10, percent: 90 },
        { id: 10, username: "Karl Dave", date: "10/05/2026", score: 7, total: 10, percent: 70 },
        { id: 11, username: "Karl Dave", date: "10/10/2026", score: 9, total: 10, percent: 90 },
        { id: 12, username: "Karl Dave", date: "10/05/2026", score: 7, total: 10, percent: 70 }
    ];

    // --- PAGINATION STATE ---
    let currentPage = 1;
    const itemsPerPage = 8;
    
    const historyGrid = document.getElementById('history-grid');
    const paginationContainer = document.querySelector('.qh-pagination-container');

    // 3. RENDER CARDS
    function renderHistoryCards() {
        historyGrid.innerHTML = ''; // Clear grid

        // Calculate the slice for the current page (e.g., indexes 0-9 for page 1)
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentItems = mockHistory.slice(startIndex, endIndex);

        currentItems.forEach(attempt => {
            const degrees = (attempt.percent / 100) * 360;

            const cardHTML = `
                <div class="qh-card">
                    <div class="qh-score-ring" style="background: conic-gradient(#00FFF6 ${degrees}deg, rgba(0, 255, 246, 0.1) 0deg);">
                        <div class="qh-score-inner">
                            ${attempt.score}/${attempt.total}
                        </div>
                    </div>

                    <div class="qh-card-info">
                        <span class="qh-username">${escapeHTML(attempt.username)}</span>
                        <span class="qh-date">Date Taken: ${escapeHTML(attempt.date)}</span>
                    </div>

                    <div class="qh-percent">${attempt.percent}%</div>
                </div>
            `;
            
            historyGrid.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Rebuild the buttons below the grid
        renderPagination();
    }

    // 4. RENDER PAGINATION BUTTONS
    function renderPagination() {
        if (!paginationContainer) return;

        const totalPages = Math.ceil(mockHistory.length / itemsPerPage);
        
        // Clear existing buttons
        paginationContainer.innerHTML = ''; 

        // Hide pagination completely if there are 10 or fewer items
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        } else {
            paginationContainer.style.display = 'flex';
        }

        // --- PREVIOUS ARROW ---
        const prevBtn = document.createElement('button');
        prevBtn.className = `qr-page-btn arrow-btn ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="#00FFF6" stroke="none" width="16" height="16" style="transform: rotate(180deg);">
                <polygon points="5 3 19 12 5 21"></polygon>
            </svg>`;
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderHistoryCards();
            }
        };
        paginationContainer.appendChild(prevBtn);

        // --- PAGE NUMBERS ---
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `qr-page-btn ${currentPage === i ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => {
                currentPage = i;
                renderHistoryCards();
            };
            paginationContainer.appendChild(pageBtn);
        }

        // --- NEXT ARROW ---
        const nextBtn = document.createElement('button');
        nextBtn.className = `qr-page-btn arrow-btn ${currentPage === totalPages ? 'disabled' : ''}`;
        nextBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="#00FFF6" stroke="none" width="16" height="16">
                <polygon points="5 3 19 12 5 21"></polygon>
            </svg>`;
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderHistoryCards();
            }
        };
        paginationContainer.appendChild(nextBtn);
    }

    // Initialize the first load
    renderHistoryCards();
});

// 5. ESCAPE HTML HELPER (Security)
function escapeHTML(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
}
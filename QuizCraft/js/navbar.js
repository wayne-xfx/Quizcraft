const navbarTemplate = `
    <nav class="top-navbar glass-panel">
        <div class="nav-left">
            <img src="../assets/icons/mini_logo.svg" alt="QuizCraft Logo" class="mini-logo">
        </div>
        
        <div class="nav-right">
            <button class="create-quiz-btn" aria-label="Create a Quiz">
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

// Insert the template into the DOM
document.getElementById('navbar-container').innerHTML = navbarTemplate;
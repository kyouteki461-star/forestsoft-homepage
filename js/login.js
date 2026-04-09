// Login functionality - Fixed click outside

(function() {
    'use strict';

    let tapCount = 0;
    let tapTimer = null;

    // Initialize
    function init() {
        console.log('Login script initializing...');

        // Check if already logged in
        if (localStorage.getItem('adminLoggedIn') === 'true') {
            showAdminLinks();
        }

        // Keyboard events
        document.addEventListener('keydown', handleKeyPress);

        // Click events for triple tap
        document.addEventListener('click', handleClick);

        // Form submission
        document.addEventListener('submit', handleLogin);

        // Click outside to close login form
        document.addEventListener('click', handleOutsideClick, true); // Use capture phase
    }

    function handleKeyPress(e) {
        // Alt+W to show login
        if (e.altKey && e.key === 'w') {
            e.preventDefault();
            showLoginForm();
        }
        // Alt+S to hide login
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            hideLoginForm();
        }
    }

    function handleClick(e) {
        // Don't count clicks on form or inputs
        if (e.target.closest('.login-form') ||
            e.target.tagName === 'INPUT' ||
            e.target.tagName === 'BUTTON' ||
            e.target.tagName === 'A') {
            return;
        }

        // Only trigger triple tap in footer area
        const footer = e.target.closest('footer') || e.target.closest('#footer') || e.target.closest('.footer');
        if (!footer) {
            return;
        }

        console.log('Footer click detected - tap count:', tapCount + 1);

        // Clear previous timer
        clearTimeout(tapTimer);

        // Increment count
        tapCount++;

        // Check for triple tap
        if (tapCount === 3) {
            console.log('TRIPLE TAP IN FOOTER!');
            showLoginForm();
            tapCount = 0; // Reset immediately
        } else {
            // Set timer to reset count
            tapTimer = setTimeout(() => {
                console.log('Resetting tap count');
                tapCount = 0;
            }, 1000);
        }
    }

    function handleOutsideClick(e) {
        const loginForm = document.querySelector('.login-form');

        // Check if clicking outside the login form
        if (loginForm && !loginForm.contains(e.target)) {
            console.log('Click outside login form - closing');
            e.preventDefault();
            e.stopPropagation();
            hideLoginForm();
        }
    }

    function handleLogin(e) {
        if (e.target.id === 'loginForm') {
            e.preventDefault();

            const username = e.target.querySelector('#username').value;
            const password = e.target.querySelector('#password').value;

            if (username === 'admin' && password === 'password') {
                localStorage.setItem('adminLoggedIn', 'true');
                hideLoginForm();
                showAdminLinks();

                // Clear form
                e.target.querySelector('#username').value = '';
                e.target.querySelector('#password').value = '';
            } else {
                alert('IDまたはパスワードが正しくありません');
            }
        }
    }

    // Show login form
    function showLoginForm() {
        console.log('Showing login form...');

        // Remove existing form
        const existing = document.querySelector('.login-overlay');
        if (existing) {
            existing.remove();
        }

        // Create form
        const overlay = document.createElement('div');
        overlay.className = 'login-overlay';
        overlay.innerHTML = `
            <div class="login-form">
                <h3>管理者ログイン</h3>
                <form id="loginForm">
                    <div class="form-group">
                        <label>ID:</label>
                        <input type="text" id="username" required autofocus>
                    </div>
                    <div class="form-group">
                        <label>パスワード:</label>
                        <input type="password" id="password" required>
                    </div>
                    <button type="submit" class="login-btn">ログイン</button>
                </form>
                <div style="margin-top: 10px; font-size: 12px; text-align: center; color: #666;">
                    <p>PC: Alt+W 表示 / Alt+S 閉じる</p>
                    <p>Mobile: Footerを3回タップ</p>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Focus on input
        setTimeout(() => {
            const input = document.getElementById('username');
            if (input) input.focus();
        }, 100);
    }

    // Hide login form
    function hideLoginForm() {
        console.log('Hiding login form...');
        const overlay = document.querySelector('.login-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Show admin links
    function showAdminLinks() {
        const footers = document.querySelectorAll('.footer-nav');
        footers.forEach(footer => {
            footer.classList.add('admin-visible');
        });
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
// Login functionality - Final version

// Use IIFE to avoid conflicts
(function() {
    'use strict';

    // Check if we already initialized
    if (window.LoginInitialized) {
        return;
    }
    window.LoginInitialized = true;

    let tapCount = 0;
    let tapTimer = null;

    // Initialize after DOM is ready
    function init() {
        console.log('Initializing login system...');

        // Check if user is already logged in
        if (localStorage.getItem('adminLoggedIn') === 'true') {
            showAdminLinks();
        }

        // Add keyboard listeners
        document.addEventListener('keydown', handleKeyPress);

        // Add click listeners for triple tap
        document.addEventListener('click', handleClick);

        // Use event delegation for login form
        document.addEventListener('submit', handleLoginSubmit);

        // Note: Removed click outside handler to avoid conflicts
    }

    function handleKeyPress(e) {
        // Prevent default for Alt+W and Alt+S
        if (e.altKey && e.key === 'w') {
            e.preventDefault();
            showLoginForm();
            return;
        }

        if (e.altKey && e.key === 's') {
            e.preventDefault();
            hideLoginForm();
            return;
        }
    }

    function handleClick(e) {
        // Triple tap detection - be more specific about targets
        const validTargets = [
            'BODY',
            'MAIN',
            'DIV.main',
            'DIV.content',
            'DIV.page-header',
            'DIV.news-list',
            'DIV.hero',
            'DIV.section',
            'DIV.test-area'
        ];

        const isTargetValid = validTargets.some(selector => {
            if (selector.startsWith('DIV.')) {
                return e.target.matches(selector) || e.target.classList.contains(selector.substring(4));
            }
            return e.target.tagName === selector;
        });

        if (isTargetValid) {
            clearTimeout(tapTimer);

            tapCount++;

            if (tapCount === 3) {
                showLoginForm();
                tapCount = 0;
            } else {
                tapTimer = setTimeout(() => {
                    tapCount = 0;
                }, 1000);
            }
        }
    }

    function handleLoginSubmit(e) {
        if (e.target && e.target.id === 'loginForm') {
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

    function showLoginForm() {
        // Remove existing form first
        const existing = document.querySelector('.login-overlay');
        if (existing) {
            existing.remove();
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'login-overlay';

        // Create form HTML
        const formHTML = `
            <div class="login-form">
                <h3>管理者ログイン</h3>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="username">ID:</label>
                        <input type="text" id="username" name="username" required autofocus>
                    </div>
                    <div class="form-group">
                        <label for="password">パスワード:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="login-btn">ログイン</button>
                </form>
                <div style="margin-top: 15px; font-size: 12px; color: #666; text-align: center;">
                    <p>PC: Alt+W 表示 / Alt+S 閉じる</p>
                    <p>Mobile: 3回タップ</p>
                </div>
            </div>
        `;

        overlay.innerHTML = formHTML;
        document.body.appendChild(overlay);

        // Focus on input after a short delay
        setTimeout(() => {
            const input = document.getElementById('username');
            if (input) input.focus();
        }, 100);

        // Log for debugging
        console.log('Login form shown');
    }

    function hideLoginForm() {
        const overlay = document.querySelector('.login-overlay');
        if (overlay) {
            overlay.remove();
            console.log('Login form hidden');
        }
    }

    function showAdminLinks() {
        const footers = document.querySelectorAll('.footer-nav');
        footers.forEach(footer => {
            footer.classList.add('admin-visible');
        });
        console.log('Admin links shown');
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
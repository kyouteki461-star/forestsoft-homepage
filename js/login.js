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

        // Add click listeners for triple tap (only on mobile)
        if (isMobile()) {
            console.log('Mobile device detected - enabling triple tap on empty areas');
            document.addEventListener('click', handleClick);
        }

        // Use event delegation for login form
        document.addEventListener('submit', handleLoginSubmit);

        // Handle click outside to close
        document.addEventListener('click', handleOutsideClick);
    }

    function isMobile() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        console.log('Mobile detection:', isMobile);
        return isMobile;
    }

    function handleKeyPress(e) {
        // Prevent default for Alt+W and Alt+S
        if (e.altKey && e.key.toLowerCase() === 'w') {
            e.preventDefault();
            console.log('Alt+W pressed');
            showLoginForm();
            return;
        }

        if (e.altKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            console.log('Alt+S pressed');
            hideLoginForm();
            return;
        }
    }

    function handleClick(e) {
        // Skip if clicking on interactive elements
        if (isInteractiveElement(e.target)) {
            console.log('Clicked on interactive element - skipping');
            tapCount = 0; // Reset count when clicking interactive elements
            return;
        }

        // Skip if clicking on login form
        if (e.target.closest('.login-form')) {
            return;
        }

        console.log('Click on empty area - target:', e.target.tagName, e.target.className);

        // Triple tap detection
        clearTimeout(tapTimer);

        tapCount++;
        console.log('Tap count:', tapCount);

        if (tapCount === 3) {
            console.log('TRIPLE TAP ON EMPTY AREA DETECTED!');
            showLoginForm();
            tapCount = 0;
        } else {
            tapTimer = setTimeout(() => {
                console.log('Reset tap count from', tapCount, 'to 0');
                tapCount = 0;
            }, 1000);
        }
    }

    function isInteractiveElement(element) {
        // Check if element is a button or link
        if (element.tagName === 'BUTTON' ||
            element.tagName === 'A' ||
            element.tagName === 'INPUT' ||
            element.tagName === 'SELECT' ||
            element.tagName === 'TEXTAREA') {
            return true;
        }

        // Check if element has clickable attributes
        if (element.role === 'button' ||
            element.getAttribute('role') === 'button' ||
            element.onclick !== null) {
            return true;
        }

        // Check if element is inside a navigation menu
        if (element.closest('nav') ||
            element.closest('.nav') ||
            element.closest('.menu')) {
            return true;
        }

        // Check common button/link classes
        const buttonClasses = ['btn', 'button', 'nav-link', 'menu-item', 'clickable'];
        const hasButtonClass = buttonClasses.some(cls =>
            element.classList.contains(cls) ||
            element.closest('.' + cls)
        );

        if (hasButtonClass) {
            return true;
        }

        return false;
    }

    function handleOutsideClick(e) {
        const loginOverlay = document.querySelector('.login-overlay');
        const loginForm = document.querySelector('.login-form');

        // Only if login form is visible
        if (!loginOverlay) return;

        // Check if clicking outside the login form
        if (!loginForm.contains(e.target)) {
            console.log('Click outside login form - closing');
            e.preventDefault();
            e.stopPropagation();
            hideLoginForm();
        }
    }

    function handleLoginSubmit(e) {
        // Check if the event is from our login form
        if (e.target && e.target.id === 'loginForm') {
            e.preventDefault();

            const username = e.target.querySelector('#username').value;
            const password = e.target.querySelector('#password').value;

            if (username === 'admin' && password === 'password') {
                console.log('Login successful');
                localStorage.setItem('adminLoggedIn', 'true');
                hideLoginForm();
                showAdminLinks();

                // Clear form
                e.target.querySelector('#username').value = '';
                e.target.querySelector('#password').value = '';
            } else {
                console.log('Login failed');
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
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Create form HTML
        const formHTML = `
            <div class="login-form" style="
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                min-width: 300px;
            ">
                <h3 style="margin: 0 0 1rem 0; color: #333;">管理者ログイン</h3>
                <form id="loginForm">
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #555; font-weight: 500;">ID:</label>
                        <input type="text" id="username" name="username" required autofocus style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; box-sizing: border-box;">
                    </div>
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #555; font-weight: 500;">パスワード:</label>
                        <input type="password" id="password" name="password" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; box-sizing: border-box;">
                    </div>
                    <button type="submit" class="login-btn" style="width: 100%; padding: 0.75rem; background-color: #2c5f2d; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer;">ログイン</button>
                </form>
                <div style="margin-top: 15px; font-size: 12px; color: #666; text-align: center;">
                    <p>PC: Alt+W 表示 / Alt+S 閉じる</p>
                    <p>Mobile: 空白エリアを3回タップ</p>
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
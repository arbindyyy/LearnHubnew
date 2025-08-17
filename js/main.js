// Shared utility function available to all calculator scripts
function formatCurrency(value) {
    if (typeof value !== 'number') return value;
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const categoryToggles = document.querySelectorAll('.category-toggle');

    // --- Core UI Logic (Sidebar, Modals, Themes, etc.) ---

    menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));

    categoryToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggle.parentElement.classList.toggle('open');
        });
    });

    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) sidebar.classList.remove('open');
        });
    });

    const themeBtn = document.getElementById('theme-toggle');
    const langBtn = document.getElementById('lang-toggle');
    const profileBtn = document.getElementById('profile-btn');
    const themeModal = document.getElementById('theme-modal');
    const langDropdown = document.getElementById('lang-dropdown');
    const profileModal = document.getElementById('profile-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const allModals = document.querySelectorAll('.modal');
    const allDropdowns = document.querySelectorAll('.dropdown-menu');

    function closeAllPopups() {
        modalOverlay.classList.remove('show');
        allModals.forEach(m => m.classList.remove('show'));
        allDropdowns.forEach(d => d.classList.remove('show'));
    }

    modalOverlay.addEventListener('click', closeAllPopups);
    document.querySelectorAll('.close-modal-btn').forEach(btn => btn.addEventListener('click', closeAllPopups));

    function setupPopupToggle(button, popup) {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isAlreadyOpen = popup.classList.contains('show');
            closeAllPopups();
            if (!isAlreadyOpen) {
                if (popup.classList.contains('modal')) {
                    modalOverlay.classList.add('show');
                }
                popup.classList.add('show');
            }
        });
    }

    setupPopupToggle(themeBtn, themeModal);
    setupPopupToggle(langBtn, langDropdown);
    setupPopupToggle(profileBtn, profileModal);

    document.body.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-menu') && !e.target.closest('.modal')) {
            closeAllPopups();
        }
    });
    allDropdowns.forEach(d => d.addEventListener('click', e => e.stopPropagation()));
    allModals.forEach(m => m.addEventListener('click', e => e.stopPropagation()));


    const modeButtons = document.querySelectorAll('.mode-switcher button');
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme', button.dataset.mode === 'dark');
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    const colorDots = document.querySelectorAll('.color-options .color-dot');
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            document.documentElement.style.setProperty('--primary-color', dot.dataset.color);
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
    });

    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    showSignupBtn.addEventListener('click', (e) => { e.preventDefault(); loginForm.style.display = 'none'; signupForm.style.display = 'flex'; });
    showLoginBtn.addEventListener('click', (e) => { e.preventDefault(); signupForm.style.display = 'none'; loginForm.style.display = 'flex'; });

    // --- Search Logic ---
    const searchBtn = document.getElementById('search-btn');
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('modal-search-input');
    const searchResultsContainer = document.getElementById('search-results-container');
    const allCalculatorLinks = document.querySelectorAll('.sidebar-menu .submenu a');

    setupPopupToggle(searchBtn, searchModal);
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        searchResultsContainer.innerHTML = '';
        if (query.length < 2) return;
        let count = 0;
        allCalculatorLinks.forEach(originalLink => {
            if (originalLink.textContent.toLowerCase().includes(query) && !originalLink.classList.contains('category-toggle')) {
                const resultLink = document.createElement('a');
                resultLink.href = originalLink.href;
                resultLink.textContent = originalLink.textContent;
                resultLink.addEventListener('click', (e) => {
                   e.preventDefault();
                   closeAllPopups();
                   loadCalculator(resultLink.textContent, resultLink.getAttribute('href'));
                   const parentCategory = document.querySelector(`.sidebar-menu a[href="${resultLink.getAttribute('href')}"]`).closest('.category');
                   if (parentCategory && !parentCategory.classList.contains('open')) {
                       parentCategory.classList.add('open');
                   }
                });
                searchResultsContainer.appendChild(resultLink);
                count++;
            }
        });
        if (count === 0) searchResultsContainer.innerHTML = '<p>No calculators found.</p>';
    });

    // --- Calculator Loading Logic ---
    const calculatorContainer = document.getElementById('calculator-container');
    const allCalcLinks = document.querySelectorAll('.sidebar-menu a[href^="#"]');
    let currentCalculator = null;

    function setActiveLink(targetLink) {
        allCalcLinks.forEach(link => link.classList.remove('active'));
        if (targetLink) targetLink.classList.add('active');
    }

    async function loadCalculator(name, id) {
        if (currentCalculator === id) return; // Don't reload the same calculator
        currentCalculator = id;

        const calcId = id.substring(1);
        const calculatorBodyId = `calculator-body-${calcId}`;

        const targetLink = document.querySelector(`.sidebar-menu a[href="${id}"]`);
        setActiveLink(targetLink);

        // Set up the basic structure for the calculator to load into
        calculatorContainer.innerHTML = `
            <div class="calculator-header"><h2>${name}</h2></div>
            <div class="calculator-body" id="${calculatorBodyId}"><p>Loading calculator...</p></div>`;

        try {
            // Dynamically import the script module for the calculator
            const module = await import(`../components/${calcId}/script.js`);
            if (module.init) {
                // The module's init function is responsible for populating the container
                module.init(calculatorBodyId);
            } else {
                throw new Error(`Calculator "${calcId}" does not have an init function.`);
            }

        } catch (error) {
            const calculatorBody = document.getElementById(calculatorBodyId);
            if(calculatorBody) calculatorBody.innerHTML = `<p>Error loading calculator: ${error.message}</p>`;
            console.error('Error loading calculator:', error);
        }

        try {
            history.pushState(null, null, id);
        } catch (e) {
            // Silently fail on environments that don't support pushState
        }
    }

    allCalcLinks.forEach(link => {
        if (!link.classList.contains('category-toggle')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                loadCalculator(link.textContent, link.getAttribute('href'));
            });
        }
    });

    if (window.location.hash && window.location.hash !== '#') {
        const initialLink = document.querySelector(`.sidebar-menu a[href="${window.location.hash}"]`);
        if (initialLink && !initialLink.classList.contains('category-toggle')) {
            loadCalculator(initialLink.textContent, window.location.hash);
            const parentCategory = initialLink.closest('.category');
            if (parentCategory && !parentCategory.classList.contains('open')) {
               parentCategory.classList.add('open');
           }
        }
    } else {
        // Load a default message or the first calculator
        calculatorContainer.innerHTML = `<h2>Welcome to the All-in-One Calculator!</h2><p>Select a calculator from the menu to get started.</p>`;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const categoryToggles = document.querySelectorAll('.category-toggle');

    // Toggle sidebar on mobile
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Accordion menu for categories
    categoryToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parentCategory = toggle.parentElement;
            parentCategory.classList.toggle('open');
        });
    });

    // Close sidebar when a link is clicked (on mobile)
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // --- Modal & Dropdown Logic ---

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
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', closeAllPopups);
    });

    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllPopups();
        modalOverlay.classList.add('show');
        themeModal.classList.add('show');
    });

    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllPopups();
        langDropdown.classList.toggle('show');
    });

    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllPopups();
        modalOverlay.classList.add('show');
        profileModal.classList.add('show');
    });

    document.body.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-menu')) {
            allDropdowns.forEach(d => d.classList.remove('show'));
        }
    });

    allDropdowns.forEach(d => d.addEventListener('click', e => e.stopPropagation()));


    // --- Theme Switcher Logic ---
    const modeButtons = document.querySelectorAll('.mode-switcher button');
    const colorDots = document.querySelectorAll('.color-options .color-dot');

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme', button.dataset.mode === 'dark');
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const newColor = dot.dataset.color;
            document.documentElement.style.setProperty('--primary-color', newColor);
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
    });


    // --- Login/Signup Form Toggle ---
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'flex';
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.style.display = 'none';
        loginForm.style.display = 'flex';
    });

    // --- Search Modal Logic ---
    const searchBtn = document.getElementById('search-btn');
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('modal-search-input');
    const searchResultsContainer = document.getElementById('search-results-container');
    const allCalculatorLinks = document.querySelectorAll('.sidebar-menu .submenu a');

    searchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllPopups();
        modalOverlay.classList.add('show');
        searchModal.classList.add('show');
        searchInput.focus();
        searchInput.value = '';
        searchResultsContainer.innerHTML = '';
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        searchResultsContainer.innerHTML = '';

        if (query.length < 2) {
            return;
        }

        let count = 0;
        allCalculatorLinks.forEach(originalLink => {
            const linkText = originalLink.textContent.toLowerCase();
            if (linkText.includes(query) && !originalLink.classList.contains('category-toggle')) {
                const resultLink = document.createElement('a');
                resultLink.href = originalLink.href;
                resultLink.textContent = originalLink.textContent;

                resultLink.addEventListener('click', (e) => {
                   e.preventDefault();
                   closeAllPopups();
                   loadCalculator(resultLink.textContent, resultLink.getAttribute('href'));
                   const parentCategory = document.querySelector(`.sidebar-menu a[href="${resultLink.getAttribute('href')}"]`).closest('.category');
                   if(parentCategory && !parentCategory.classList.contains('open')) {
                       parentCategory.classList.add('open');
                   }
                });
                searchResultsContainer.appendChild(resultLink);
                count++;
            }
        });

        if (count === 0) {
            searchResultsContainer.innerHTML = '<p>No calculators found.</p>';
        }
    });

    // --- Calculator Loading Logic ---
    const calculatorContainer = document.getElementById('calculator-container');
    const allCalcLinks = document.querySelectorAll('.sidebar-menu a[href^="#"]');

    function setActiveLink(targetLink) {
        allCalcLinks.forEach(link => {
            link.classList.remove('active');
        });
        if (targetLink) {
            targetLink.classList.add('active');
        }
    }

    async function loadCalculator(name, id) {
        const calcId = id.substring(1);

        calculatorContainer.innerHTML = `
            <div class="calculator-header">
                <h2>${name}</h2>
            </div>
            <div class="calculator-body" id="calculator-body-${calcId}">
                <p>Loading calculator...</p>
            </div>
        `;

        try {
            const response = await fetch(`calculators/${calcId}.html`);
            if (!response.ok) throw new Error('Calculator not found');

            const calculatorHTML = await response.text();
            const calculatorBody = document.getElementById(`calculator-body-${calcId}`);
            calculatorBody.innerHTML = calculatorHTML;

            // Attach event listeners based on the loaded calculator
            switch (id) {
                case '#mortgage-calculator':
                    document.getElementById('calculateMortgageBtn').addEventListener('click', calculateMortgage);
                    break;
                case '#amortization-calculator':
                    document.getElementById('calculateAmortizationBtn').addEventListener('click', calculateAmortization);
                    break;
                case '#mortgage-payoff-calculator':
                    document.getElementById('calculatePayoffBtn').addEventListener('click', calculateMortgagePayoff);
                    break;
                case '#house-affordability-calculator':
                    document.getElementById('calculateAffordabilityBtn').addEventListener('click', calculateHouseAffordability);
                    break;
                case '#rent-calculator':
                    document.getElementById('calculateRentBtn').addEventListener('click', calculateRentRatio);
                    break;
                case '#dti-ratio-calculator':
                    document.getElementById('calculateDtiBtn').addEventListener('click', calculateDtiRatio);
                    break;
                case '#down-payment-calculator':
                    document.getElementById('calculateDownPaymentBtn').addEventListener('click', calculateDownPayment);
                    break;
            }

        } catch (error) {
            document.getElementById(`calculator-body-${calcId}`).innerHTML = `<p>Error loading calculator. Please try again later.</p>`;
            console.error('Error loading calculator:', error);
        }

        try {
            history.pushState(null, null, id);
        } catch (e) {}

        const targetLink = document.querySelector(`.sidebar-menu a[href="${id}"]`);
        setActiveLink(targetLink);
    }

    allCalcLinks.forEach(link => {
        if (!link.classList.contains('category-toggle')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const calculatorName = link.textContent;
                const calculatorId = link.getAttribute('href');
                loadCalculator(calculatorName, calculatorId);
            });
        }
    });

    if(window.location.hash) {
        const initialLink = document.querySelector(`.sidebar-menu a[href="${window.location.hash}"]`);
        if(initialLink && !initialLink.classList.contains('category-toggle')){
            loadCalculator(initialLink.textContent, window.location.hash);
            const parentCategory = initialLink.closest('.category');
            if(parentCategory && !parentCategory.classList.contains('open')) {
               parentCategory.classList.add('open');
           }
        }
    }
});

export function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id ${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div class="calculator-form">
            <div class="form-group">
                <label for="currentBalance">Current Loan Balance ($)</label>
                <input type="number" id="currentBalance" placeholder="e.g., 280000">
            </div>
            <div class="form-group">
                <label for="interestRatePayoff">Interest Rate (%)</label>
                <input type="number" id="interestRatePayoff" step="0.01" placeholder="e.g., 5.5">
            </div>
            <div class="form-group">
                <label for="monthlyPaymentPayoff">Current Monthly Payment ($)</label>
                <input type="number" id="monthlyPaymentPayoff" step="0.01" placeholder="e.g., 1600">
            </div>
            <div class="form-group">
                <label for="extraPayment">Extra Monthly Payment ($)</label>
                <input type="number" id="extraPayment" step="0.01" placeholder="e.g., 200">
            </div>
            <button id="calculatePayoffBtn" class="calc-button">Calculate Payoff</button>
        </div>
        <div id="payoffResult" class="calculator-results"></div>
    `;

    function calculateMortgagePayoff() {
        const balance = parseFloat(document.getElementById('currentBalance').value);
        const rate = parseFloat(document.getElementById('interestRatePayoff').value);
        const monthlyPayment = parseFloat(document.getElementById('monthlyPaymentPayoff').value);
        const extraPayment = parseFloat(document.getElementById('extraPayment').value) || 0;
        const resultDiv = document.getElementById('payoffResult');

        if (isNaN(balance) || isNaN(rate) || isNaN(monthlyPayment) || balance <= 0 || rate < 0 || monthlyPayment <= 0) {
            resultDiv.innerHTML = '<p class="error">Please enter valid numbers for balance, rate, and payment.</p>';
            return;
        }

        const monthlyRate = rate / 100 / 12;

        // --- Scenario 1: Original Payoff ---
        let originalMonths = 0;
        let originalBalance = balance;
        let totalInterestPaidOriginal = 0;
        while (originalBalance > 0) {
            const interest = originalBalance * monthlyRate;
            if (monthlyPayment <= interest) {
                 resultDiv.innerHTML = '<p class="error">Monthly payment is too low to pay off the loan.</p>';
                 return;
            }
            const principal = monthlyPayment - interest;
            totalInterestPaidOriginal += interest;
            originalBalance -= principal;
            originalMonths++;
            if (originalMonths > 1000) {
                resultDiv.innerHTML = '<p class="error">Calculation exceeds maximum term.</p>';
                return;
            };
        }

        // --- Scenario 2: Accelerated Payoff ---
        let newMonths = 0;
        let newBalance = balance;
        let totalInterestPaidNew = 0;
        const newMonthlyPayment = monthlyPayment + extraPayment;
        while (newBalance > 0) {
            const interest = newBalance * monthlyRate;
            if (newMonthlyPayment <= interest) {
                 resultDiv.innerHTML = '<p class="error">With the extra payment, the monthly payment is still too low.</p>';
                 return;
            }
            const principal = newMonthlyPayment - interest;
            totalInterestPaidNew += interest;
            newBalance -= principal;
            newMonths++;
            if (newMonths > 1000) break; // Safety break
        }

        const interestSaved = totalInterestPaidOriginal - totalInterestPaidNew;
        const yearsSaved = Math.floor((originalMonths - newMonths) / 12);
        const monthsSaved = (originalMonths - newMonths) % 12;

        resultDiv.innerHTML = `
            <div class="result-item">
                <span>Payoff Time Saved</span>
                <span class="value">${yearsSaved} years, ${monthsSaved} months</span>
            </div>
            <div class="result-item">
                <span>Interest Saved</span>
                <span class="value">${formatCurrency(interestSaved)}</span>
            </div>
            <hr>
            <div class="result-item total">
                <span>New Payoff Term</span>
                <span class="value">${Math.floor(newMonths / 12)} years, ${newMonths % 12} months</span>
            </div>
        `;
    }

    document.getElementById('calculatePayoffBtn').addEventListener('click', calculateMortgagePayoff);
}

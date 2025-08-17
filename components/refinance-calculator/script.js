export function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id ${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div class="calculator-form-split">
            <div class="form-section">
                <h3>Current Loan</h3>
                <div class="form-group">
                    <label for="currentLoanBalanceRefi">Current Loan Balance ($)</label>
                    <input type="number" id="currentLoanBalanceRefi" placeholder="250000">
                </div>
                <div class="form-group">
                    <label for="currentInterestRateRefi">Current Interest Rate (%)</label>
                    <input type="number" id="currentInterestRateRefi" step="0.01" placeholder="6.5">
                </div>
                <div class="form-group">
                    <label for="currentMonthlyPaymentRefi">Current Monthly Payment ($)</label>
                    <input type="number" id="currentMonthlyPaymentRefi" step="0.01" placeholder="1580">
                </div>
            </div>
            <div class="form-section">
                <h3>New Loan</h3>
                <div class="form-group">
                    <label for="newInterestRateRefi">New Interest Rate (%)</label>
                    <input type="number" id="newInterestRateRefi" step="0.01" placeholder="5.0">
                </div>
                <div class="form-group">
                    <label for="newLoanTermRefi">New Loan Term (Years)</label>
                    <input type="number" id="newLoanTermRefi" placeholder="30">
                </div>
                <div class="form-group">
                    <label for="closingCostsRefi">Closing Costs ($)</label>
                    <input type="number" id="closingCostsRefi" step="0.01" placeholder="5000">
                </div>
            </div>
        </div>
        <div class="form-section-full">
            <button id="calculateRefinanceBtn" class="calc-button">Calculate Refinance Savings</button>
        </div>
        <div id="refinanceResult" class="calculator-results"></div>
    `;

    function calculateRefinance() {
        // --- Get All Input Values ---
        const currentBalance = parseFloat(document.getElementById('currentLoanBalanceRefi').value);
        const currentRate = parseFloat(document.getElementById('currentInterestRateRefi').value) / 100;
        const currentPayment = parseFloat(document.getElementById('currentMonthlyPaymentRefi').value);

        const newRate = parseFloat(document.getElementById('newInterestRateRefi').value) / 100;
        const newTerm = parseFloat(document.getElementById('newLoanTermRefi').value);
        const closingCosts = parseFloat(document.getElementById('closingCostsRefi').value) || 0;

        const resultDiv = document.getElementById('refinanceResult');

        // --- Validation ---
        if (isNaN(currentBalance) || isNaN(currentRate) || isNaN(currentPayment) || isNaN(newRate) || isNaN(newTerm)) {
            resultDiv.innerHTML = '<p class="error">Please fill in all fields with valid numbers.</p>';
            return;
        }

        // --- Calculations ---

        // 1. New Monthly Payment
        const newMonthlyRate = newRate / 12;
        const newNumberOfPayments = newTerm * 12;
        const newLoanAmount = currentBalance + closingCosts;
        const newMonthlyPayment = newLoanAmount * (newMonthlyRate * Math.pow(1 + newMonthlyRate, newNumberOfPayments)) / (Math.pow(1 + newMonthlyRate, newNumberOfPayments) - 1);

        const monthlySavings = currentPayment - newMonthlyPayment;

        // 2. Lifetime Savings
        // Total cost of old loan from this point forward
        let remainingOldMonths = 0;
        let tempBalanceOld = currentBalance;
        let totalOldCost = 0;
        while (tempBalanceOld > 0) {
            const interest = tempBalanceOld * (currentRate / 12);
             if (currentPayment <= interest) {
                resultDiv.innerHTML = '<p class="error">Current monthly payment is too low to cover interest. Cannot calculate remaining cost.</p>';
                return;
            }
            totalOldCost += currentPayment;
            const principal = currentPayment - interest;
            tempBalanceOld -= principal;
            remainingOldMonths++;
            if (remainingOldMonths > 1200) { // Increased safety break for long term loans
                 resultDiv.innerHTML = '<p class="error">Could not calculate remaining term of original loan within 100 years. Please check your inputs.</p>';
                return;
            }
        }

        // Total cost of new loan
        const totalNewCost = newMonthlyPayment * newNumberOfPayments;

        const lifetimeSavings = totalOldCost - (totalNewCost + closingCosts);

        // 3. Break-even point
        let breakEvenMonths = 0;
        if (monthlySavings > 0) {
            breakEvenMonths = Math.ceil(closingCosts / monthlySavings);
        }

        // --- Display Results ---
        resultDiv.innerHTML = `
            <div class="result-item">
                <span>New Monthly Payment</span>
                <span class="value">${formatCurrency(newMonthlyPayment)}</span>
            </div>
            <div class="result-item">
                <span>Monthly Savings</span>
                <span class="value">${formatCurrency(monthlySavings)}</span>
            </div>
            <div class="result-item total">
                <span>Estimated Lifetime Savings</span>
                <span class="value">${formatCurrency(lifetimeSavings)}</span>
            </div>
            <hr>
            ${monthlySavings > 0 ?
                `<p style="text-align: center; margin-top: 15px;">You will break even on the closing costs in approximately <strong>${breakEvenMonths} months</strong>.</p>` :
                '<p style="text-align: center; margin-top: 15px;">Your monthly payment will increase. Refinancing may not be beneficial unless you need to cash out equity.</p>'
            }
        `;
    }

    document.getElementById('calculateRefinanceBtn').addEventListener('click', calculateRefinance);
}

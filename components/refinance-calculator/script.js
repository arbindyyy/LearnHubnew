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
        totalOldCost += currentPayment;
        const interest = tempBalanceOld * (currentRate / 12);
        const principal = currentPayment - interest;
        tempBalanceOld -= principal;
        remainingOldMonths++;
        if (remainingOldMonths > 1000) break; // Safety
    }

    // Total cost of new loan
    const totalNewCost = newMonthlyPayment * newNumberOfPayments + closingCosts;

    const lifetimeSavings = totalOldCost - (newMonthlyPayment * newNumberOfPayments);

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
            <span>Lifetime Savings</span>
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

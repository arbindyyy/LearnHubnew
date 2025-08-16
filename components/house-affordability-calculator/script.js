function calculateHouseAffordability() {
    const annualIncome = parseFloat(document.getElementById('annualIncome').value);
    const monthlyDebts = parseFloat(document.getElementById('monthlyDebts').value) || 0;
    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRateAfford').value);
    const loanTerm = parseFloat(document.getElementById('loanTermAfford').value);
    const resultDiv = document.getElementById('affordabilityResult');

    if (isNaN(annualIncome) || isNaN(interestRate) || isNaN(loanTerm) || annualIncome <= 0 || interestRate <= 0 || loanTerm <= 0) {
        resultDiv.innerHTML = '<p class="error">Please enter valid numbers for income, rate, and term.</p>';
        return;
    }

    const monthlyIncome = annualIncome / 12;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Calculate max monthly payment based on 28/36 rule
    const maxPaymentFromIncome = monthlyIncome * 0.28;
    const maxPaymentFromDTI = (monthlyIncome * 0.36) - monthlyDebts;
    const maxMonthlyPayment = Math.min(maxPaymentFromIncome, maxPaymentFromDTI);

    if (maxMonthlyPayment <= 0) {
        resultDiv.innerHTML = '<p class="error">Your monthly debts are too high to afford a mortgage.</p>';
        return;
    }

    // Calculate max loan amount from the max monthly payment
    const maxLoanAmount = (maxMonthlyPayment / monthlyInterestRate) * (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

    const affordableHomePrice = maxLoanAmount + downPayment;

    resultDiv.innerHTML = `
        <div class="result-item total">
            <span>Affordable Home Price</span>
            <span class="value">${formatCurrency(affordableHomePrice)}</span>
        </div>
        <hr>
        <div class="result-item">
            <span>Estimated Monthly Payment</span>
            <span class="value">${formatCurrency(maxMonthlyPayment)}</span>
        </div>
        <div class="result-item">
            <span>Max Loan Amount</span>
            <span class="value">${formatCurrency(maxLoanAmount)}</span>
        </div>
        <div class="result-item">
            <span>Your Down Payment</span>
            <span class="value">${formatCurrency(downPayment)}</span>
        </div>
    `;
}

document.getElementById('calculateAffordabilityBtn').addEventListener('click', calculateHouseAffordability);

function formatCurrency(value) {
    if (typeof value !== 'number') return value;
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function generateAmortizationSchedule(loanAmount, monthlyInterestRate, numberOfPayments, monthlyPayment) {
    const scheduleDiv = document.getElementById('amortization-schedule');
    let remainingBalance = loanAmount;
    let tableHTML = `
        <div class="amortization-table-container">
            <table class="amortization-table">
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Total Payment</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
    `;

    for (let i = 1; i <= numberOfPayments; i++) {
        const interestForMonth = remainingBalance * monthlyInterestRate;
        const principalForMonth = monthlyPayment - interestForMonth;
        remainingBalance -= principalForMonth;

        tableHTML += `
            <tr>
                <td>${i}</td>
                <td>${formatCurrency(principalForMonth)}</td>
                <td>${formatCurrency(interestForMonth)}</td>
                <td>${formatCurrency(monthlyPayment)}</td>
                <td>${formatCurrency(Math.abs(remainingBalance))}</td>
            </tr>
        `;
    }

    tableHTML += `</tbody></table></div>`;
    scheduleDiv.innerHTML = tableHTML;
}

function calculateMortgage() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTerm = parseFloat(document.getElementById('loanTerm').value);
    const resultDiv = document.getElementById('mortgageResult');
    const scheduleDiv = document.getElementById('amortization-schedule');

    scheduleDiv.innerHTML = ''; // Clear previous schedule

    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm) || loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
        resultDiv.innerHTML = '<p class="error">Please enter valid positive numbers for all fields.</p>';
        return;
    }

    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    resultDiv.innerHTML = `
        <div class="result-item">
            <span>Monthly Payment</span>
            <span class="value">${formatCurrency(monthlyPayment)}</span>
        </div>
        <div class="result-item">
            <span>Total Principal Paid</span>
            <span class="value">${formatCurrency(loanAmount)}</span>
        </div>
        <div class="result-item">
            <span>Total Interest Paid</span>
            <span class="value">${formatCurrency(totalInterest)}</span>
        </div>
        <hr>
        <div class="result-item total">
            <span>Total Cost of Loan</span>
            <span class="value">${formatCurrency(totalPayment)}</span>
        </div>
        <div id="amortization-controls" style="text-align: center; margin-top: 20px;">
            <button id="showAmortizationBtn" class="calc-button secondary">Show Amortization Schedule</button>
        </div>
    `;

    document.getElementById('showAmortizationBtn').addEventListener('click', () => {
        generateAmortizationSchedule(loanAmount, monthlyInterestRate, numberOfPayments, monthlyPayment);
    });
}

function calculateAmortization() {
    const loanAmount = parseFloat(document.getElementById('loanAmountAmort').value);
    const interestRate = parseFloat(document.getElementById('interestRateAmort').value);
    const monthlyPayment = parseFloat(document.getElementById('monthlyPaymentAmort').value);
    const maxLoanTerm = parseFloat(document.getElementById('loanTermAmort').value);
    const scheduleDiv = document.getElementById('amortization-schedule');

    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(monthlyPayment) || isNaN(maxLoanTerm) || loanAmount <= 0 || interestRate < 0 || monthlyPayment <= 0 || maxLoanTerm <= 0) {
        scheduleDiv.innerHTML = '<p class="error">Please enter valid positive numbers for all fields.</p>';
        return;
    }

    const monthlyInterestRate = interestRate / 100 / 12;
    const firstMonthInterest = loanAmount * monthlyInterestRate;

    if (monthlyPayment <= firstMonthInterest) {
        scheduleDiv.innerHTML = '<p class="error">Monthly payment is too low. It must be greater than the first month\'s interest of ' + formatCurrency(firstMonthInterest) + '.</p>';
        return;
    }

    const maxNumberOfPayments = maxLoanTerm * 12;

    generateAmortizationSchedule(loanAmount, monthlyInterestRate, maxNumberOfPayments, monthlyPayment);
}

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

function calculateRentRatio() {
    const monthlyRent = parseFloat(document.getElementById('monthlyRent').value);
    const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value);
    const resultDiv = document.getElementById('rentResult');

    if (isNaN(monthlyRent) || isNaN(monthlyIncome) || monthlyRent <= 0 || monthlyIncome <= 0) {
        resultDiv.innerHTML = '<p class="error">Please enter valid positive numbers for rent and income.</p>';
        return;
    }

    const ratio = (monthlyRent / monthlyIncome) * 100;

    let advice = '';
    if (ratio < 30) {
        advice = 'This is generally considered an affordable rent-to-income ratio.';
    } else if (ratio >= 30 && ratio < 40) {
        advice = 'This ratio is manageable, but you should budget carefully.';
    } else {
        advice = 'This is a high rent-to-income ratio, which may be considered a financial burden.';
    }

    resultDiv.innerHTML = `
        <div class="result-item total">
            <span>Rent-to-Income Ratio</span>
            <span class="value">${ratio.toFixed(2)}%</span>
        </div>
        <p style="text-align: center; margin-top: 15px;">${advice}</p>
    `;
}

function calculateDtiRatio() {
    const monthlyDebt = parseFloat(document.getElementById('monthlyDebtDTI').value);
    const monthlyIncome = parseFloat(document.getElementById('monthlyIncomeDTI').value);
    const resultDiv = document.getElementById('dtiResult');

    if (isNaN(monthlyDebt) || isNaN(monthlyIncome) || monthlyDebt < 0 || monthlyIncome <= 0) {
        resultDiv.innerHTML = '<p class="error">Please enter valid positive numbers for debt and income.</p>';
        return;
    }

    const ratio = (monthlyDebt / monthlyIncome) * 100;

    let advice = '';
    if (ratio <= 36) {
        advice = '<strong>Favorable:</strong> A DTI of 36% or less is generally viewed as favorable by lenders.';
    } else if (ratio > 36 && ratio <= 43) {
        advice = '<strong>Manageable:</strong> While manageable, a DTI in this range may limit your borrowing options.';
    } else {
        advice = '<strong>High:</strong> A DTI above 43% is often considered high by lenders, making it difficult to qualify for new loans.';
    }

    resultDiv.innerHTML = `
        <div class="result-item total">
            <span>Debt-to-Income (DTI) Ratio</span>
            <span class="value">${ratio.toFixed(2)}%</span>
        </div>
        <p style="text-align: center; margin-top: 15px;">${advice}</p>
    `;
}

function calculateDownPayment() {
    const homePrice = parseFloat(document.getElementById('homePrice').value);
    const downPaymentPercent = parseFloat(document.getElementById('downPaymentPercent').value);
    const resultDiv = document.getElementById('downPaymentResult');

    if (isNaN(homePrice) || isNaN(downPaymentPercent) || homePrice <= 0 || downPaymentPercent < 0) {
        resultDiv.innerHTML = '<p class="error">Please enter a valid home price and down payment percentage.</p>';
        return;
    }

    const downPaymentAmount = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPaymentAmount;

    resultDiv.innerHTML = `
        <div class="result-item">
            <span>Down Payment Amount</span>
            <span class="value">${formatCurrency(downPaymentAmount)}</span>
        </div>
        <div class="result-item total">
            <span>Resulting Loan Amount</span>
            <span class="value">${formatCurrency(loanAmount)}</span>
        </div>
    `;
}

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

document.getElementById('calculateMortgageBtn').addEventListener('click', calculateMortgage);

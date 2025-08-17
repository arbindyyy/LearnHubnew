export function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id ${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div class="calculator-form">
            <div class="form-group">
                <label for="loanAmountAmort">Loan Amount ($)</label>
                <input type="number" id="loanAmountAmort" placeholder="e.g., 300000">
            </div>
            <div class="form-group">
                <label for="interestRateAmort">Interest Rate (%)</label>
                <input type="number" id="interestRateAmort" step="0.01" placeholder="e.g., 5.5">
            </div>
            <div class="form-group">
                <label for="monthlyPaymentAmort">Monthly Payment ($)</label>
                <input type="number" id="monthlyPaymentAmort" step="0.01" placeholder="e.g., 1600">
            </div>
             <div class="form-group">
                <label for="loanTermAmort">Max Loan Term (Years)</label>
                <input type="number" id="loanTermAmort" placeholder="e.g., 30">
            </div>
            <button id="calculateAmortizationBtn" class="calc-button">Generate Schedule</button>
        </div>
        <div id="amortization-schedule-standalone"></div>
    `;

    // Note: It's important that this calculator is self-contained.
    // So we are including the generateAmortizationSchedule function here as well.
    function generateAmortizationSchedule(loanAmount, monthlyInterestRate, maxNumberOfPayments, monthlyPayment) {
        const scheduleDiv = document.getElementById('amortization-schedule-standalone');
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

        let month = 0;
        while (remainingBalance > 0 && month < maxNumberOfPayments) {
            month++;
            const interestForMonth = remainingBalance * monthlyInterestRate;
            let principalForMonth = monthlyPayment - interestForMonth;

            if (remainingBalance < monthlyPayment) {
                principalForMonth = remainingBalance;
                monthlyPayment = remainingBalance + interestForMonth;
            }

            remainingBalance -= principalForMonth;

            tableHTML += `
                <tr>
                    <td>${month}</td>
                    <td>${formatCurrency(principalForMonth)}</td>
                    <td>${formatCurrency(interestForMonth)}</td>
                    <td>${formatCurrency(monthlyPayment)}</td>
                    <td>${formatCurrency(Math.abs(remainingBalance))}</td>
                </tr>
            `;

            if (remainingBalance <= 0) break;
        }

        tableHTML += `</tbody></table></div>`;
        scheduleDiv.innerHTML = tableHTML;
    }

    function calculateAmortization() {
        const loanAmount = parseFloat(document.getElementById('loanAmountAmort').value);
        const interestRate = parseFloat(document.getElementById('interestRateAmort').value);
        const monthlyPayment = parseFloat(document.getElementById('monthlyPaymentAmort').value);
        const maxLoanTerm = parseFloat(document.getElementById('loanTermAmort').value);
        const scheduleDiv = document.getElementById('amortization-schedule-standalone');

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

    document.getElementById('calculateAmortizationBtn').addEventListener('click', calculateAmortization);
}

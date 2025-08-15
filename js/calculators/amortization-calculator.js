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

document.getElementById('calculateAmortizationBtn').addEventListener('click', calculateAmortization);

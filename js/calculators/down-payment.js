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

document.getElementById('calculateDownPaymentBtn').addEventListener('click', calculateDownPayment);

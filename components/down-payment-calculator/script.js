export function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id ${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div class="calculator-form">
            <div class="form-group">
                <label for="homePrice">Home Price ($)</label>
                <input type="number" id="homePrice" placeholder="e.g., 350000">
            </div>
            <div class="form-group">
                <label for="downPaymentPercent">Down Payment (%)</label>
                <input type="number" id="downPaymentPercent" step="0.1" placeholder="e.g., 20">
            </div>
            <button id="calculateDownPaymentBtn" class="calc-button">Calculate Down Payment</button>
        </div>
        <div id="downPaymentResult" class="calculator-results"></div>
    `;

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
}

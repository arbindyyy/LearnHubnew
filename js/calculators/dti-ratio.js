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

document.getElementById('calculateDtiBtn').addEventListener('click', calculateDtiRatio);

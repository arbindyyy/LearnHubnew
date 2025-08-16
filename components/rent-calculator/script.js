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

document.getElementById('calculateRentBtn').addEventListener('click', calculateRentRatio);

function calculateRentVsBuy() {
    // --- Get All Input Values ---
    // Renting
    const monthlyRent = parseFloat(document.getElementById('monthlyRentRvB').value);
    const rentersInsurance = parseFloat(document.getElementById('rentersInsurance').value);
    const rentIncrease = parseFloat(document.getElementById('rentIncrease').value) / 100;

    // Buying
    const homePrice = parseFloat(document.getElementById('homePriceRvB').value);
    const downPaymentPercent = parseFloat(document.getElementById('downPaymentRvB').value) / 100;
    const interestRate = parseFloat(document.getElementById('interestRateRvB').value) / 100;
    const loanTerm = parseFloat(document.getElementById('loanTermRvB').value);
    const propertyTax = parseFloat(document.getElementById('propertyTax').value) / 100;
    const homeInsurance = parseFloat(document.getElementById('homeInsurance').value);
    const maintenance = parseFloat(document.getElementById('maintenance').value);

    // Assumptions
    const comparisonYears = parseFloat(document.getElementById('comparisonYears').value);
    const appreciation = parseFloat(document.getElementById('appreciation').value) / 100;
    const sellingCosts = parseFloat(document.getElementById('sellingCosts').value) / 100;

    const resultDiv = document.getElementById('rvbResult');

    // --- Validation ---
    if (isNaN(monthlyRent) || isNaN(homePrice) || isNaN(interestRate) || isNaN(loanTerm) || isNaN(comparisonYears)) {
        resultDiv.innerHTML = '<p class="error">Please fill in all required fields with valid numbers.</p>';
        return;
    }

    // --- Calculations ---

    // 1. Total Cost of Renting
    let totalRentCost = 0;
    let currentRent = monthlyRent;
    for (let year = 1; year <= comparisonYears; year++) {
        totalRentCost += (currentRent + rentersInsurance) * 12;
        currentRent *= (1 + rentIncrease); // Increase rent for the next year
    }

    // 2. Total Cost of Buying
    const downPaymentAmount = homePrice * downPaymentPercent;
    const loanAmount = homePrice - downPaymentAmount;
    const monthlyInterestRate = interestRate / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyMortgage = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    let totalBuyingCost = downPaymentAmount;
    let balance = loanAmount;
    let totalInterestPaid = 0;

    for (let i = 1; i <= comparisonYears * 12; i++) {
        const interest = balance * monthlyInterestRate;
        const principal = monthlyMortgage - interest;
        totalInterestPaid += interest;
        balance -= principal;
        totalBuyingCost += monthlyMortgage;
    }

    totalBuyingCost += (propertyTax * homePrice + homeInsurance + maintenance) * comparisonYears;

    // 3. Calculate Net Proceeds from Selling
    const futureHomeValue = homePrice * Math.pow(1 + appreciation, comparisonYears);
    const finalSellingCosts = futureHomeValue * sellingCosts;
    const netProceeds = futureHomeValue - balance - finalSellingCosts;

    // 4. Final Comparison
    const netBuyingCost = totalBuyingCost - netProceeds;
    const difference = totalRentCost - netBuyingCost;

    let advice = '';
    if (difference > 0) {
        advice = `Based on these numbers, <strong>buying appears to be ${formatCurrency(difference)} cheaper</strong> than renting over ${comparisonYears} years.`;
    } else {
        advice = `Based on these numbers, <strong>renting appears to be ${formatCurrency(Math.abs(difference))} cheaper</strong> than buying over ${comparisonYears} years.`;
    }

    resultDiv.innerHTML = `
        <div class="result-item total">
            <span>Net Cost of Renting</span>
            <span class="value">${formatCurrency(totalRentCost)}</span>
        </div>
        <div class="result-item total">
            <span>Net Cost of Buying</span>
            <span class="value">${formatCurrency(netBuyingCost)}</span>
        </div>
        <hr>
        <p style="text-align: center; margin-top: 15px; font-size: 18px;">${advice}</p>
        <div class="result-item">
            <span>Future Home Value</span>
            <span class="value">${formatCurrency(futureHomeValue)}</span>
        </div>
        <div class="result-item">
            <span>Equity after ${comparisonYears} years</span>
            <span class="value">${formatCurrency(futureHomeValue - balance)}</span>
        </div>
    `;
}

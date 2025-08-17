export function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id ${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div class="calculator-form-split">
            <!-- RENTING SIDE -->
            <div class="form-section">
                <h3>Renting Costs</h3>
                <div class="form-group">
                    <label for="monthlyRentRvB">Monthly Rent ($)</label>
                    <input type="number" id="monthlyRentRvB" value="2000">
                </div>
                <div class="form-group">
                    <label for="rentersInsurance">Renter's Insurance (Monthly, $)</label>
                    <input type="number" id="rentersInsurance" value="15">
                </div>
                <div class="form-group">
                    <label for="rentIncrease">Annual Rent Increase (%)</label>
                    <input type="number" id="rentIncrease" value="3">
                </div>
            </div>

            <!-- BUYING SIDE -->
            <div class="form-section">
                <h3>Buying Costs</h3>
                <div class="form-group">
                    <label for="homePriceRvB">Home Price ($)</label>
                    <input type="number" id="homePriceRvB" value="350000">
                </div>
                <div class="form-group">
                    <label for="downPaymentRvB">Down Payment (%)</label>
                    <input type="number" id="downPaymentRvB" value="20">
                </div>
                <div class="form-group">
                    <label for="interestRateRvB">Mortgage Interest Rate (%)</label>
                    <input type="number" id="interestRateRvB" step="0.01" value="5.5">
                </div>
                <div class="form-group">
                    <label for="loanTermRvB">Loan Term (Years)</label>
                    <input type="number" id="loanTermRvB" value="30">
                </div>
                <div class="form-group">
                    <label for="propertyTax">Annual Property Tax (%)</label>
                    <input type="number" id="propertyTax" step="0.01" value="1.2">
                </div>
                <div class="form-group">
                    <label for="homeInsurance">Annual Homeowner's Insurance ($)</label>
                    <input type="number" id="homeInsurance" step="0.01" value="1200">
                </div>
                <div class="form-group">
                    <label for="maintenance">Annual Maintenance ($)</label>
                    <input type="number" id="maintenance" step="0.01" value="3500">
                </div>
            </div>
        </div>
        <div class="form-section-full">
            <h3>Comparison Assumptions</h3>
            <div class="form-group">
                <label for="comparisonYears">How many years do you plan to stay?</label>
                <input type="number" id="comparisonYears" value="7">
            </div>
             <div class="form-group">
                <label for="appreciation">Annual Home Appreciation (%)</label>
                <input type="number" id="appreciation" step="0.01" value="4">
            </div>
            <div class="form-group">
                <label for="sellingCosts">Home Selling Costs (%)</label>
                <input type="number" id="sellingCosts" step="0.01" value="8">
            </div>
            <button id="calculateRvBtn" class="calc-button">Compare Rent vs. Buy</button>
        </div>
        <div id="rvbResult" class="calculator-results"></div>
    `;

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
        const propertyTaxRate = parseFloat(document.getElementById('propertyTax').value) / 100;
        const homeInsurance = parseFloat(document.getElementById('homeInsurance').value);
        const maintenance = parseFloat(document.getElementById('maintenance').value);

        // Assumptions
        const comparisonYears = parseFloat(document.getElementById('comparisonYears').value);
        const appreciation = parseFloat(document.getElementById('appreciation').value) / 100;
        const sellingCostsPercent = parseFloat(document.getElementById('sellingCosts').value) / 100;

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
            totalRentCost += (currentRent * 12) + rentersInsurance;
            currentRent *= (1 + rentIncrease); // Increase rent for the next year
        }

        // 2. Total Cost of Buying
        const downPaymentAmount = homePrice * downPaymentPercent;
        const loanAmount = homePrice - downPaymentAmount;
        const monthlyInterestRate = interestRate / 12;
        const numberOfPayments = loanTerm * 12;
        const monthlyMortgage = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

        const totalPaymentsMade = monthlyMortgage * (comparisonYears * 12);

        let balance = loanAmount;
        for (let i = 0; i < comparisonYears * 12; i++) {
             balance = balance * (1 + monthlyInterestRate) - monthlyMortgage;
        }

        const totalPropertyTax = (propertyTaxRate * homePrice) * comparisonYears;
        const totalInsurance = homeInsurance * comparisonYears;
        const totalMaintenance = maintenance * comparisonYears;

        const totalUpfrontAndOngoingCosts = downPaymentAmount + totalPaymentsMade + totalPropertyTax + totalInsurance + totalMaintenance;

        // 3. Calculate Net Proceeds from Selling
        const futureHomeValue = homePrice * Math.pow(1 + appreciation, comparisonYears);
        const sellingCostsAmount = futureHomeValue * sellingCostsPercent;
        const netEquity = futureHomeValue - balance - sellingCostsAmount;

        // 4. Final Comparison
        const netBuyingCost = totalUpfrontAndOngoingCosts - futureHomeValue + balance + sellingCostsAmount;
        const finalNetBuyingCost = downPaymentAmount + totalPaymentsMade + totalPropertyTax + totalInsurance + totalMaintenance - netEquity;

        const difference = totalRentCost - finalNetBuyingCost;

        let advice = '';
        if (difference > 0) {
            advice = `Based on these numbers, <strong>buying appears to be ${formatCurrency(difference)} cheaper</strong> than renting over ${comparisonYears} years.`;
        } else {
            advice = `Based on these numbers, <strong>renting appears to be ${formatCurrency(Math.abs(difference))} cheaper</strong> than buying over ${comparisonYears} years.`;
        }

        resultDiv.innerHTML = `
            <div class="result-item total">
                <span>Total Net Cost of Renting</span>
                <span class="value">${formatCurrency(totalRentCost)}</span>
            </div>
            <div class="result-item total">
                <span>Total Net Cost of Buying</span>
                <span class="value">${formatCurrency(finalNetBuyingCost)}</span>
            </div>
            <hr>
            <p style="text-align: center; margin-top: 15px; font-size: 18px;">${advice}</p>
            <div class="details-grid">
                <div>
                    <h4>Buying Details</h4>
                    <p>Future Home Value: ${formatCurrency(futureHomeValue)}</p>
                    <p>Remaining Loan Balance: ${formatCurrency(balance)}</p>
                    <p>Total Equity Built: ${formatCurrency(futureHomeValue - balance)}</p>
                    <p>Selling Costs: ${formatCurrency(sellingCostsAmount)}</p>
                    <p><strong>Net Gain/Loss from Home: ${formatCurrency(netEquity)}</strong></p>
                </div>
                 <div>
                    <h4>Cost Breakdown (Buying)</h4>
                    <p>Down Payment: ${formatCurrency(downPaymentAmount)}</p>
                    <p>Total Mortgage Payments: ${formatCurrency(totalPaymentsMade)}</p>
                    <p>Taxes, Insurance, Maint.: ${formatCurrency(totalPropertyTax + totalInsurance + totalMaintenance)}</p>
                </div>
            </div>
        `;
    }

    document.getElementById('calculateRvBtn').addEventListener('click', calculateRentVsBuy);
}

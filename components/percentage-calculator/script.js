export function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id ${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div class="calculator-form" id="percentage-calc-container">

            <!-- Standard Percentage -->
            <div class="form-section calc-group">
                <h4>Standard Percentage</h4>
                <p>What is P% of N?</p>
                <div class="form-group-inline">
                    <input type="number" id="perc-p1" placeholder="Percentage (%)">
                    <span class="static-text">of</span>
                    <input type="number" id="perc-n1" placeholder="Number">
                    <button id="calculate-perc1" class="calc-button small-btn">Calculate</button>
                </div>
                <div id="perc-result1" class="calculator-results small-res"></div>
            </div>

            <!-- Percentage Of -->
            <div class="form-section calc-group">
                <h4>Percentage Of</h4>
                <p>N1 is what percentage of N2?</p>
                <div class="form-group-inline">
                    <input type="number" id="perc-n2" placeholder="Number 1">
                    <span class="static-text">is what % of</span>
                    <input type="number" id="perc-n3" placeholder="Number 2">
                    <button id="calculate-perc2" class="calc-button small-btn">Calculate</button>
                </div>
                <div id="perc-result2" class="calculator-results small-res"></div>
            </div>

            <!-- Percentage Change -->
            <div class="form-section calc-group">
                <h4>Percentage Change</h4>
                <p>From N1 to N2</p>
                <div class="form-group-inline">
                     <span class="static-text">From</span>
                    <input type="number" id="perc-n4" placeholder="Number 1">
                     <span class="static-text">to</span>
                    <input type="number" id="perc-n5" placeholder="Number 2">
                    <button id="calculate-perc3" class="calc-button small-btn">Calculate</button>
                </div>
                <div id="perc-result3" class="calculator-results small-res"></div>
            </div>

        </div>
    `;

    // --- Event Listeners ---

    document.getElementById('calculate-perc1').addEventListener('click', () => {
        const p = parseFloat(document.getElementById('perc-p1').value);
        const n = parseFloat(document.getElementById('perc-n1').value);
        const resultDiv = document.getElementById('perc-result1');
        if (isNaN(p) || isNaN(n)) {
            resultDiv.innerHTML = '<p class="error">Invalid input</p>';
            return;
        }
        const result = (p / 100) * n;
        resultDiv.innerHTML = `<p>Result: <strong>${result.toLocaleString()}</strong></p>`;
    });

    document.getElementById('calculate-perc2').addEventListener('click', () => {
        const n1 = parseFloat(document.getElementById('perc-n2').value);
        const n2 = parseFloat(document.getElementById('perc-n3').value);
        const resultDiv = document.getElementById('perc-result2');
        if (isNaN(n1) || isNaN(n2) || n2 === 0) {
            resultDiv.innerHTML = '<p class="error">Invalid input (N2 cannot be zero)</p>';
            return;
        }
        const result = (n1 / n2) * 100;
        resultDiv.innerHTML = `<p>Result: <strong>${result.toLocaleString()}%</strong></p>`;
    });

    document.getElementById('calculate-perc3').addEventListener('click', () => {
        const n1 = parseFloat(document.getElementById('perc-n4').value);
        const n2 = parseFloat(document.getElementById('perc-n5').value);
        const resultDiv = document.getElementById('perc-result3');
        if (isNaN(n1) || isNaN(n2) || n1 === 0) {
            resultDiv.innerHTML = '<p class="error">Invalid input (From cannot be zero)</p>';
            return;
        }
        const result = ((n2 - n1) / n1) * 100;
        const changeType = result >= 0 ? 'Increase' : 'Decrease';
        resultDiv.innerHTML = `<p>Result: <strong>${Math.abs(result).toLocaleString()}% ${changeType}</strong></p>`;
    });
}

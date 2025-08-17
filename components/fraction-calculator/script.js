export function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id ${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div class="calculator-form" id="fraction-calc-container">
            <div class="form-group-inline fraction-group">
                <!-- Fraction 1 -->
                <div class="fraction-input">
                    <input type="number" id="frac-num1" placeholder="N">
                    <span class="fraction-bar"></span>
                    <input type="number" id="frac-den1" placeholder="D">
                </div>

                <!-- Operation -->
                <select id="frac-op" class="small-select">
                    <option value="add">+</option>
                    <option value="subtract">-</option>
                    <option value="multiply">×</option>
                    <option value="divide">÷</option>
                </select>

                <!-- Fraction 2 -->
                <div class="fraction-input">
                    <input type="number" id="frac-num2" placeholder="N">
                    <span class="fraction-bar"></span>
                    <input type="number" id="frac-den2" placeholder="D">
                </div>
            </div>
            <button id="calculate-fraction" class="calc-button">Calculate</button>
            <div id="fraction-result" class="calculator-results"></div>
        </div>
    `;

    // --- Helper function for GCD ---
    const gcd = (a, b) => {
        if (!b) return a;
        return gcd(b, a % b);
    };

    // --- Calculation Logic ---
    document.getElementById('calculate-fraction').addEventListener('click', () => {
        const num1 = parseInt(document.getElementById('frac-num1').value);
        const den1 = parseInt(document.getElementById('frac-den1').value);
        const num2 = parseInt(document.getElementById('frac-num2').value);
        const den2 = parseInt(document.getElementById('frac-den2').value);
        const op = document.getElementById('frac-op').value;
        const resultDiv = document.getElementById('fraction-result');

        if ([num1, den1, num2, den2].some(isNaN) || den1 === 0 || den2 === 0) {
            resultDiv.innerHTML = '<p class="error">Invalid input. Denominators cannot be zero.</p>';
            return;
        }

        let resNum, resDen;

        switch (op) {
            case 'add':
                resNum = num1 * den2 + num2 * den1;
                resDen = den1 * den2;
                break;
            case 'subtract':
                resNum = num1 * den2 - num2 * den1;
                resDen = den1 * den2;
                break;
            case 'multiply':
                resNum = num1 * num2;
                resDen = den1 * den2;
                break;
            case 'divide':
                if (num2 === 0) {
                    resultDiv.innerHTML = '<p class="error">Cannot divide by a zero fraction.</p>';
                    return;
                }
                resNum = num1 * den2;
                resDen = den1 * num2;
                break;
        }

        // Simplify the result
        if (resNum === 0) {
            resDen = 1;
        } else {
            const commonDivisor = gcd(Math.abs(resNum), Math.abs(resDen));
            resNum /= commonDivisor;
            resDen /= commonDivisor;
        }

        // Handle negative denominator
        if (resDen < 0) {
            resDen = -resDen;
            resNum = -resNum;
        }

        const decimalResult = (num1 / den1) + (op === 'add' ? (num2 / den2) : op === 'subtract' ? -(num2/den2) : op === 'multiply' ? (num2/den2) : 1/(num2/den2));

        resultDiv.innerHTML = `
            <div class="result-item total">
                <span>Resulting Fraction</span>
                <span class="value">${resNum} / ${resDen}</span>
            </div>
             <div class="result-item">
                <span>Decimal Equivalent</span>
                <span class="value">${(resNum / resDen).toLocaleString()}</span>
            </div>
        `;
    });
}

export function init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id ${containerId} not found.`);
        return;
    }

    container.innerHTML = `
        <div class="calculator-form scientific-calculator">
            <div class="sci-display-container">
                <input type="text" id="sci-display" readonly placeholder="0">
            </div>
            <div class="sci-buttons-grid">
                <!-- Row 1 -->
                <button class="sci-btn op" data-value="Math.sin(">sin</button>
                <button class="sci-btn op" data-value="Math.cos(">cos</button>
                <button class="sci-btn op" data-value="Math.tan(">tan</button>
                <button class="sci-btn op" data-value="Math.log10(">log</button>
                <button class="sci-btn op" data-value="Math.log(">ln</button>

                <!-- Row 2 -->
                <button class="sci-btn op" data-value="(">(</button>
                <button class="sci-btn op" data-value=")">)</button>
                <button class="sci-btn op" data-value="**2">x²</button>
                <button class="sci-btn op" data-value="Math.sqrt(">√</button>
                <button class="sci-btn op" data-value="**">^</button>

                <!-- Row 3 -->
                <button class="sci-btn num" data-value="7">7</button>
                <button class="sci-btn num" data-value="8">8</button>
                <button class="sci-btn num" data-value="9">9</button>
                <button class="sci-btn op" data-value="/">÷</button>
                <button class="sci-btn" id="sci-clear">C</button>

                <!-- Row 4 -->
                <button class="sci-btn num" data-value="4">4</button>
                <button class="sci-btn num" data-value="5">5</button>
                <button class="sci-btn num" data-value="6">6</button>
                <button class="sci-btn op" data-value="*">×</button>
                <button class="sci-btn" id="sci-backspace">⌫</button>

                <!-- Row 5 -->
                <button class="sci-btn num" data-value="1">1</button>
                <button class="sci-btn num" data-value="2">2</button>
                <button class="sci-btn num" data-value="3">3</button>
                <button class="sci-btn op" data-value="-">−</button>
                <button class="sci-btn equals" id="sci-equals" rowspan="2">=</button>

                <!-- Row 6 -->
                <button class="sci-btn num" data-value="0">0</button>
                <button class="sci-btn num" data-value=".">.</button>
                <button class="sci-btn op" data-value="Math.PI">π</button>
                <button class="sci-btn op" data-value="+">+</button>
            </div>
        </div>
    `;

    const display = document.getElementById('sci-display');
    const buttons = document.querySelectorAll('.sci-btn');
    let expression = '';

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.dataset.value;
            const id = button.id;

            if (id === 'sci-clear') {
                expression = '';
                display.value = '0';
            } else if (id === 'sci-backspace') {
                expression = expression.slice(0, -1);
                display.value = expression || '0';
            } else if (id === 'sci-equals') {
                try {
                    // Sanitize the expression to allow only safe characters
                    const sanitizedExpr = expression.replace(/[^0-9.()+\-*/%^~]|Math\.(sin|cos|tan|log10|log|sqrt|PI|E)|\*\*| /g, '');

                    if (sanitizedExpr !== expression) {
                        throw new Error("Invalid characters in expression.");
                    }

                    // Using Function constructor is safer than eval()
                    const calculate = new Function('return ' + expression);
                    const result = calculate();

                    if (isNaN(result) || !isFinite(result)) {
                        throw new Error("Invalid calculation");
                    }

                    display.value = result;
                    expression = result.toString();
                } catch (error) {
                    display.value = 'Error';
                    expression = '';
                }
            } else {
                expression += value;
                display.value = expression;
            }
        });
    });
}

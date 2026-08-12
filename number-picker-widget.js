/**
 * Number Picker Widget
 * Allows users to select their favorite number
 */

widgetEngine.register('number-picker', {
    
    // Default configuration
    defaults: {
        numbers: [7, 42, 99],
        title: '🎯 Pick Your Favorite Number',
        submitText: 'Submit My Choice',
        theme: 'default'
    },

    // HTML template
    template(options, state) {
        const numbersHtml = options.numbers
            .map(num => {
                const isSelected = state.selected === num;
                const selectedClass = isSelected ? 'selected' : '';
                return `
                    <button class="number-btn ${selectedClass}" data-number="${num}">
                        ${num}
                    </button>
                `;
            })
            .join('');

        let resultHtml = '';
        if (state.selected !== undefined) {
            resultHtml = `<div class="result">You selected: ${state.selected}</div>`;
        }
        if (state.submitted) {
            resultHtml = `<div class="result submitted">✅ Your favorite number is ${state.selected}!</div>`;
        }

        return `
            <div class="number-picker-widget">
                <h1>${options.title}</h1>
                <div class="numbers">
                    ${numbersHtml}
                </div>
                ${resultHtml}
                <button class="submit-btn" id="submitBtn" ${state.selected === undefined ? 'disabled' : ''}>
                    ${options.submitText}
                </button>
            </div>
        `;
    },

    // Event handlers
    events: {
        '.number-btn': function(e) {
            const num = parseInt(e.target.dataset.number);
            this.setState({ 
                selected: num,
                submitted: false
            });
        },
        '.submit-btn': function(e) {
            if (this.state.selected !== undefined) {
                this.setState({ submitted: true });
            }
        }
    },

    // Lifecycle hook
    onMount() {
        console.log('Number Picker Widget mounted');
    }
});

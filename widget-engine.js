/**
 * Universal Widget Engine
 * A lightweight framework for creating reusable, configurable widgets
 */

class WidgetEngine {
    constructor() {
        this.widgets = {};
    }

    /**
     * Register a widget type
     * @param {string} name - Widget identifier
     * @param {object} config - Widget configuration and methods
     */
    register(name, config) {
        this.widgets[name] = config;
        console.log(`✓ Widget registered: ${name}`);
    }

    /**
     * Create and mount a widget instance
     * @param {string} widgetType - Registered widget name
     * @param {string} containerId - Target container element ID
     * @param {object} options - Widget-specific options
     */
    mount(widgetType, containerId, options = {}) {
        if (!this.widgets[widgetType]) {
            console.error(`Widget type "${widgetType}" not registered`);
            return null;
        }

        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container "${containerId}" not found`);
            return null;
        }

        const widget = this.widgets[widgetType];
        const instance = new WidgetInstance(widget, container, options);
        
        instance.render();
        return instance;
    }
}

/**
 * Individual widget instance
 */
class WidgetInstance {
    constructor(config, container, options) {
        this.config = config;
        this.container = container;
        this.options = { ...config.defaults, ...options };
        this.state = {};
        this.listeners = {};
    }

    /**
     * Render the widget
     */
    render() {
        const html = this.config.template(this.options, this.state);
        this.container.innerHTML = html;
        this.attachEventListeners();
        
        if (this.config.onMount) {
            this.config.onMount.call(this);
        }
    }

    /**
     * Attach event listeners defined in the widget config
     */
    attachEventListeners() {
        if (!this.config.events) return;

        Object.keys(this.config.events).forEach(selector => {
            const handler = this.config.events[selector];
            const elements = this.container.querySelectorAll(selector);
            
            elements.forEach(el => {
                el.addEventListener('click', (e) => {
                    handler.call(this, e);
                });
            });
        });
    }

    /**
     * Update widget state and re-render
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
        
        // Emit change event
        if (this.listeners.change) {
            this.listeners.change(this.state);
        }
    }

    /**
     * Subscribe to widget events
     */
    on(event, callback) {
        this.listeners[event] = callback;
    }

    /**
     * Get current state
     */
    getState() {
        return this.state;
    }

    /**
     * Update configuration and re-render
     */
    setOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.render();
    }
}

// Create global instance
const widgetEngine = new WidgetEngine();

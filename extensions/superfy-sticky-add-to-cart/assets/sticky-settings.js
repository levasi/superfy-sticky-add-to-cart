/**
 * Sticky Bar Settings Loader
 * Fetches settings from the app proxy and applies them to the sticky bar
 */

class StickyBarSettings {
    constructor() {
        this.settings = null;
        this.loaded = false;
        this.callbacks = [];
        this.proxyUrl = '/apps/proxy/settings';
        this.metafieldsUrl = '/apps/proxy/metafields';
        console.log('StickyBarSettings initialized with proxy URL:', this.proxyUrl);
    }

    // Default settings fallback
    getDefaultSettings() {
        console.log('Using default settings');
        return {
            sticky_bar_color: '#fff',
            sticky_visibility: 'all',
            sticky_trigger: 'after-summary',
            sticky_content_display_image: true,
            sticky_content_display_title: true,
            sticky_content_display_price: true,
            sticky_content_display_quantity: true,
            sticky_bar_width: 'contained',
            sticky_max_width: '',
            sticky_max_width_unit: 'px',
            sticky_alignment: 'left',
            sticky_outer_spacing: '',
            sticky_outer_spacing_unit: 'px',
            sticky_inner_spacing: '16',
            sticky_inner_spacing_unit: 'px',
            sticky_background_color: '#FFFFFF',
            sticky_border_color: '#000000',
            sticky_product_name_color: '#141414',
            sticky_image_size: 'medium',
            sticky_quantity_color: '#141414',
            sticky_quantity_border_color: '#DFDFDF',
            sticky_button_behavior: 'add',
            sticky_button_text: 'Add to cart',
            sticky_enable_cart_icon: false,
            sticky_button_text_color: '#FFFFFF',
            sticky_button_bg_color: '#141414',
            sticky_custom_css: ''
        };
    }

    // Get a specific setting
    get(key) {
        const value = this.settings?.[key] || this.getDefaultSettings()[key];
        console.log(`Getting setting "${key}":`, value);
        return value;
    }

    // Get all settings
    getAll() {
        const settings = this.settings || this.getDefaultSettings();
        console.log('Getting all settings:', settings);
        return settings;
    }

    // Register a callback to be called when settings are loaded
    onLoad(callback) {
        console.log('Registering onLoad callback');
        if (this.loaded) {
            console.log('Settings already loaded, executing callback immediately');
            callback(this.settings);
        } else {
            console.log('Settings not loaded yet, adding callback to queue');
            this.callbacks.push(callback);
        }
    }

    // Check if sticky bar should be enabled
    isEnabled() {
        const visibility = this.get('sticky_visibility');
        const isEnabled = visibility === 'all' ||
            (visibility === 'mobile' && window.innerWidth <= 768) ||
            (visibility === 'desktop' && window.innerWidth > 768);

        console.log(`Sticky bar visibility check: ${visibility}, enabled: ${isEnabled}, window width: ${window.innerWidth}`);
        return isEnabled;
    }

    // Get CSS styles based on settings
    getStyles() {
        const settings = this.getAll();
        const styles = {
            backgroundColor: settings.sticky_background_color,
            borderColor: settings.sticky_border_color,
            color: settings.sticky_product_name_color,
            width: settings.sticky_bar_width === 'full' ? '100%' : 'auto',
            maxWidth: settings.sticky_max_width ? `${settings.sticky_max_width}${settings.sticky_max_width_unit}` : 'none',
            margin: settings.sticky_outer_spacing ? `${settings.sticky_outer_spacing}${settings.sticky_outer_spacing_unit}` : 'unset',
            padding: `${settings.sticky_inner_spacing}${settings.sticky_inner_spacing_unit}`,
            textAlign: settings.sticky_alignment,
            border: `1px solid ${settings.sticky_border_color}`,
            borderRadius: '4px'
        };

        console.log('Generated styles:', styles);
        return styles;
    }

    // Try to load settings from metafields as fallback
    async loadFromMetafields() {
        try {
            console.log('=== TRYING METAFIELDS FALLBACK ===');

            // Try to get settings from metafields
            const metafieldsResponse = await fetch('/apps/proxy/metafields', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-cache'
            });

            if (metafieldsResponse.ok) {
                const metafieldsSettings = await metafieldsResponse.json();
                console.log('Settings loaded from metafields:', metafieldsSettings);
                return metafieldsSettings;
            }

            console.log('Metafields fallback failed, response status:', metafieldsResponse.status);
            return null;
        } catch (error) {
            console.error('Metafields fallback error:', error);
            return null;
        }
    }

    // Load settings from app proxy
    async load() {
        if (this.loaded) {
            console.log('Settings already loaded, returning cached settings');
            return this.settings;
        }

        try {
            console.log('=== LOADING SETTINGS FROM APP PROXY ===');
            console.log('Fetching from URL:', this.proxyUrl);

            const response = await fetch(this.proxyUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-cache'
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const settings = await response.json();
            console.log('=== SETTINGS LOADED FROM APP PROXY ===');
            console.log(JSON.stringify(settings, null, 2));
            console.log('=== END SETTINGS LOAD ===');

            this.settings = settings;
            this.loaded = true;

            // Execute any pending callbacks
            console.log(`Executing ${this.callbacks.length} pending callbacks`);
            this.callbacks.forEach(callback => callback(this.settings));
            this.callbacks = [];

            return this.settings;
        } catch (error) {
            console.error('=== FAILED TO LOAD SETTINGS FROM APP PROXY ===');
            console.error('Error:', error);
            console.error('Error message:', error.message);
            console.error('Trying metafields fallback...');

            // Try metafields fallback
            const metafieldsSettings = await this.loadFromMetafields();
            if (metafieldsSettings) {
                console.log('Using settings from metafields fallback');
                this.settings = metafieldsSettings;
                this.loaded = true;

                // Execute any pending callbacks
                console.log(`Executing ${this.callbacks.length} pending callbacks with metafields settings`);
                this.callbacks.forEach(callback => callback(this.settings));
                this.callbacks = [];

                return this.settings;
            }

            console.log('All fallbacks failed, using default settings');

            // Return default settings if all methods fail
            this.settings = this.getDefaultSettings();
            this.loaded = true;

            // Execute any pending callbacks
            console.log(`Executing ${this.callbacks.length} pending callbacks with default settings`);
            this.callbacks.forEach(callback => callback(this.settings));
            this.callbacks = [];

            return this.settings;
        }
    }

    // Apply settings to the sticky bar
    applySettings() {
        console.log('=== APPLYING SETTINGS TO STICKY BAR ===');

        if (!this.isEnabled()) {
            console.log('Sticky bar disabled for current view');
            return;
        }

        const settings = this.getAll();
        const styles = this.getStyles();

        // Find the sticky bar element
        const stickyBar = document.querySelector('.sticky-add-to-cart-block');
        if (!stickyBar) {
            console.error('Sticky bar element not found');
            return;
        }

        console.log('Found sticky bar element:', stickyBar);

        // Apply styles
        console.log('Applying styles to sticky bar:', styles);
        Object.assign(stickyBar.style, styles);

        // Apply content display settings
        const imageElement = stickyBar.querySelector('.sticky-product-image');
        const titleElement = stickyBar.querySelector('.sticky-product-title');
        const priceElement = stickyBar.querySelector('.sticky-product-price');
        const quantityElement = stickyBar.querySelector('.sticky-quantity-selector');

        if (imageElement) {
            const display = settings.sticky_content_display_image ? 'block' : 'none';
            imageElement.style.display = display;
            console.log(`Image element display set to: ${display}`);
        }
        if (titleElement) {
            const display = settings.sticky_content_display_title ? 'block' : 'none';
            titleElement.style.display = display;
            console.log(`Title element display set to: ${display}`);
        }
        if (priceElement) {
            const display = settings.sticky_content_display_price ? 'block' : 'none';
            priceElement.style.display = display;
            console.log(`Price element display set to: ${display}`);
        }
        if (quantityElement) {
            const display = settings.sticky_content_display_quantity ? 'block' : 'none';
            quantityElement.style.display = display;
            console.log(`Quantity element display set to: ${display}`);
        }

        // Apply button settings
        const button = stickyBar.querySelector('.sticky-add-to-cart-btn');
        if (button) {
            button.textContent = settings.sticky_button_text;
            button.style.backgroundColor = settings.sticky_button_bg_color;
            button.style.color = settings.sticky_button_text_color;
            console.log(`Button updated: text="${settings.sticky_button_text}", bg="${settings.sticky_button_bg_color}", color="${settings.sticky_button_text_color}"`);
        }

        console.log('=== SETTINGS APPLIED SUCCESSFULLY ===');
    }
}

// Create global instance
console.log('Creating global StickyBarSettings instance');
window.StickyBarSettings = new StickyBarSettings();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing StickyBarSettings');
    window.StickyBarSettings.load().then(() => {
        console.log('Settings loaded, applying to sticky bar');
        window.StickyBarSettings.applySettings();
    });
});

// Re-apply settings on window resize (for responsive visibility)
window.addEventListener('resize', () => {
    if (window.StickyBarSettings.loaded) {
        console.log('Window resized, re-applying settings');
        window.StickyBarSettings.applySettings();
    }
}); 
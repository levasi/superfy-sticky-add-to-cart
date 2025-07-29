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
    }

    // Default settings fallback
    getDefaultSettings() {
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
            sticky_custom_css: '',
            sticky_border_radius: '12'
        };
    }

    // Get a specific setting
    get(key) {
        const value = this.settings?.[key] || this.getDefaultSettings()[key];
        return value;
    }

    // Get all settings
    getAll() {
        const settings = this.settings || this.getDefaultSettings();
        return settings;
    }

    // Register a callback to be called when settings are loaded
    onLoad(callback) {
        if (this.loaded) {
            callback(this.settings);
        } else {
            this.callbacks.push(callback);
        }
    }

    // Get CSS styles based on settings
    getStyles() {
        const settings = this.getAll();
        const isMobile = window.innerWidth <= 768;

        // Function to get setting with mobile override
        const getSettingWithMobileOverride = (desktopKey, mobileKey, defaultValue = '') => {
            if (isMobile && settings[mobileKey] !== undefined) {
                return settings[mobileKey];
            }
            return settings[desktopKey] !== undefined ? settings[desktopKey] : defaultValue;
        };

        // Calculate width and positioning based on bar width setting
        let width, maxWidth, left, right, transform;

        const barWidth = getSettingWithMobileOverride('sticky_bar_width', 'sticky_mobile_bar_width', 'contained');
        const maxWidthValue = getSettingWithMobileOverride('sticky_max_width', 'sticky_mobile_max_width', '');
        const maxWidthUnit = getSettingWithMobileOverride('sticky_max_width_unit', 'sticky_mobile_max_width_unit', 'px');
        const alignment = getSettingWithMobileOverride('sticky_alignment', 'sticky_mobile_alignment', 'left');
        const outerSpacing = getSettingWithMobileOverride('sticky_outer_spacing', 'sticky_mobile_outer_spacing', '');
        const outerSpacingUnit = getSettingWithMobileOverride('sticky_outer_spacing_unit', 'sticky_mobile_outer_spacing_unit', 'px');
        const innerSpacing = getSettingWithMobileOverride('sticky_inner_spacing', 'sticky_mobile_inner_spacing', '16');
        const innerSpacingUnit = getSettingWithMobileOverride('sticky_inner_spacing_unit', 'sticky_mobile_inner_spacing_unit', 'px');

        if (barWidth === 'full') {
            // Full width: spans the entire width with margins
            width = 'calc(100% - 40px)'; // Account for outer spacing
            maxWidth = 'none';
            left = '20px';
            right = '20px';
            transform = 'none';
        } else {
            // Contained width: respects max width and alignment
            maxWidth = maxWidthValue ? `${maxWidthValue}${maxWidthUnit}` : '600px';

            // Handle alignment for contained width
            if (alignment === 'left') {
                left = '20px';
                right = 'auto';
                transform = 'none';
            } else if (alignment === 'center') {
                left = '50%';
                right = 'auto';
                transform = 'translateX(-50%)';
            } else if (alignment === 'right') {
                left = 'auto';
                right = '20px';
                transform = 'none';
            }
        }

        const styles = {
            backgroundColor: getSettingWithMobileOverride('sticky_background_color', 'sticky_mobile_background_color', '#FFFFFF'),
            borderColor: getSettingWithMobileOverride('sticky_border_color', 'sticky_mobile_border_color', '#000000'),
            color: getSettingWithMobileOverride('sticky_product_name_color', 'sticky_mobile_product_name_color', '#141414'),
            width: width,
            maxWidth: maxWidth,
            left: left,
            right: right,
            transform: transform,
            margin: outerSpacing ? `${outerSpacing}${outerSpacingUnit}` : 'unset',
            padding: `${innerSpacing}${innerSpacingUnit}`,
            border: `1px solid ${getSettingWithMobileOverride('sticky_border_color', 'sticky_mobile_border_color', '#000000')}`,
            borderRadius: `${getSettingWithMobileOverride('sticky_border_radius', 'sticky_mobile_border_radius', '12')}px`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            position: 'fixed',
            bottom: '20px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        };

        return styles;
    }

    // Try to load settings from metafields as fallback
    async loadFromMetafields() {
        try {
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
                return metafieldsSettings;
            }

            return null;
        } catch (error) {
            console.error('Metafields fallback error:', error);
            return null;
        }
    }

    // Load settings and apply them
    async load() {
        try {
            console.log('Loading sticky bar settings...');

            // Try to load from app proxy first
            const response = await fetch(`${this.proxyUrl}?t=${Date.now()}`);

            if (response.ok) {
                const data = await response.json();
                console.log('Settings loaded from app proxy:', data);

                // Extract and log mobile settings
                const mobileSettings = {};
                for (const [key, value] of Object.entries(data)) {
                    if (key.startsWith('sticky_mobile_')) {
                        mobileSettings[key] = value;
                    }
                }

                console.log('📱 MOBILE SETTINGS FOUND:');
                console.log('Number of mobile settings:', Object.keys(mobileSettings).length);
                console.table(mobileSettings);

                this.settings = data;
            } else {
                console.log('App proxy failed, trying metafields...');
                // Fallback to metafields
                await this.loadFromMetafields();
            }

            this.loaded = true;

            // Apply settings
            this.applySettings();

            // Call all registered callbacks
            this.callbacks.forEach(callback => callback(this.settings));
            this.callbacks = [];

        } catch (error) {
            console.error('Error loading sticky bar settings:', error);
            // Apply default settings on error
            this.settings = this.getDefaultSettings();
            this.loaded = true;
            this.applySettings();
        }
    }

    // Apply settings to the sticky bar
    applySettings() {
        const settings = this.getAll();
        const isMobile = window.innerWidth <= 768;

        // Function to get setting with mobile override
        const getSettingWithMobileOverride = (desktopKey, mobileKey, defaultValue = '') => {
            if (isMobile && settings[mobileKey] !== undefined) {
                return settings[mobileKey];
            }
            return settings[desktopKey] !== undefined ? settings[desktopKey] : defaultValue;
        };

        // Find the sticky bar element
        const stickyBar = document.querySelector('.sticky-add-to-cart-block');
        if (!stickyBar) {
            console.error('Sticky bar element not found');
            return;
        }

        // Apply visibility classes instead of JavaScript show/hide
        stickyBar.classList.remove('sticky-visible-all', 'sticky-visible-desktop', 'sticky-visible-mobile');

        const visibility = this.get('sticky_visibility');
        if (visibility === 'all') {
            stickyBar.classList.add('sticky-visible-all');
        } else if (visibility === 'desktop') {
            stickyBar.classList.add('sticky-visible-desktop');
        } else if (visibility === 'mobile') {
            stickyBar.classList.add('sticky-visible-mobile');
        }

        const styles = this.getStyles();

        // Apply styles to the main sticky bar container
        Object.assign(stickyBar.style, styles);

        // Apply content display settings with mobile overrides
        const imageElement = stickyBar.querySelector('.sticky-product-image');
        const titleElement = stickyBar.querySelector('.sticky-product-title');
        const priceElement = stickyBar.querySelector('.sticky-product-price');
        const quantityElement = stickyBar.querySelector('.sticky-quantity-selector');

        if (imageElement) {
            const display = getSettingWithMobileOverride('sticky_content_display_image', 'sticky_mobile_content_display_image', true) ? 'block' : 'none';
            imageElement.style.display = display;
        }
        if (titleElement) {
            const display = getSettingWithMobileOverride('sticky_content_display_title', 'sticky_mobile_content_display_title', true) ? 'block' : 'none';
            titleElement.style.display = display;
        }
        if (priceElement) {
            const display = getSettingWithMobileOverride('sticky_content_display_price', 'sticky_mobile_content_display_price', true) ? 'block' : 'none';
            priceElement.style.display = display;
        }
        if (quantityElement) {
            const display = getSettingWithMobileOverride('sticky_content_display_quantity', 'sticky_mobile_content_display_quantity', true) ? 'flex' : 'none';
            quantityElement.style.display = display;
        }

        // Apply button settings with mobile overrides
        const button = stickyBar.querySelector('.sticky-add-to-cart-btn');
        if (button) {
            const buttonText = getSettingWithMobileOverride('sticky_button_text', 'sticky_mobile_button_text', 'Add to cart');
            const buttonBgColor = getSettingWithMobileOverride('sticky_button_bg_color', 'sticky_mobile_button_bg_color', '#141414');
            const buttonTextColor = getSettingWithMobileOverride('sticky_button_text_color', 'sticky_mobile_button_text_color', '#FFFFFF');
            const enableCartIcon = getSettingWithMobileOverride('sticky_enable_cart_icon', 'sticky_mobile_enable_cart_icon', false);

            button.textContent = buttonText;
            button.style.backgroundColor = buttonBgColor;
            button.style.color = buttonTextColor;

            // Add cart icon if enabled
            if (enableCartIcon) {
                // Create cart icon if it doesn't exist
                let cartIcon = button.querySelector('.cart-icon');
                if (!cartIcon) {
                    cartIcon = document.createElement('span');
                    cartIcon.className = 'cart-icon';
                    cartIcon.innerHTML = '🛒'; // Simple cart emoji as fallback
                    cartIcon.style.marginRight = '6px';
                    button.insertBefore(cartIcon, button.firstChild);
                }
                cartIcon.style.display = 'inline';
            } else {
                // Remove cart icon if disabled
                const cartIcon = button.querySelector('.cart-icon');
                if (cartIcon) {
                    cartIcon.style.display = 'none';
                }
            }
        }

        // Apply quantity input color with mobile override
        const quantityInput = stickyBar.querySelector('.sticky-quantity-input');
        if (quantityInput) {
            const quantityColor = getSettingWithMobileOverride('sticky_quantity_color', 'sticky_mobile_quantity_color', '#141414');
            quantityInput.style.color = quantityColor;
        }

        // Apply image size with mobile override
        const productImage = stickyBar.querySelector('.sticky-product-image');
        if (productImage) {
            const imageSize = getSettingWithMobileOverride('sticky_image_size', 'sticky_mobile_image_size', 'medium');
            let width, height;

            switch (imageSize) {
                case 'small':
                    width = '48px';
                    height = '48px';
                    break;
                case 'large':
                    width = '72px';
                    height = '72px';
                    break;
                default: // medium
                    width = '60px';
                    height = '60px';
                    break;
            }

            productImage.style.width = width;
            productImage.style.height = height;
            productImage.style.objectFit = 'cover';
            productImage.style.borderRadius = '8px';
        }

        // Apply custom CSS if provided
        if (settings.sticky_custom_css && settings.sticky_custom_css.trim()) {
            try {
                // Remove any existing custom CSS
                const existingStyle = document.getElementById('sticky-custom-css');
                if (existingStyle) {
                    existingStyle.remove();
                }

                // Add new custom CSS
                const styleElement = document.createElement('style');
                styleElement.id = 'sticky-custom-css';
                styleElement.textContent = settings.sticky_custom_css;
                document.head.appendChild(styleElement);
            } catch (error) {
            }
        }
    }
}

// Create global instance
window.StickyBarSettings = new StickyBarSettings();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.StickyBarSettings.load().then(() => {
        window.StickyBarSettings.applySettings();
    });
});

// Re-apply settings on window resize (for responsive visibility)
window.addEventListener('resize', () => {
    if (window.StickyBarSettings.loaded) {
        window.StickyBarSettings.applySettings();
    }
}); 
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
            sticky_content_display_mobile_image: true,
            sticky_content_display_mobile_title: true,
            sticky_content_display_mobile_price: true,
            sticky_content_display_mobile_quantity: true,
            sticky_bar_width: 'contained',
            sticky_bar_width_mobile: 'full',
            sticky_max_width_mobile: '',
            sticky_max_width_mobile_unit: 'px',
            sticky_alignment_mobile: 'right',
            sticky_outer_spacing_mobile: '',
            sticky_outer_spacing_mobile_unit: 'px',
            sticky_inner_spacing_mobile: '16',
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
            sticky_image_size_mobile: 'medium',
            sticky_quantity_color: '#141414',
            sticky_quantity_border_color: '#DFDFDF',
            sticky_button_behavior: 'add',
            sticky_button_text: 'Add to cart',
            sticky_enable_cart_icon: false,
            sticky_enable_mobile_cart_icon: false,
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

        // Calculate width and positioning based on bar width setting
        let width, maxWidth, left, right, transform;

        if (isMobile) {
            // Mobile settings
            if (settings.sticky_bar_width_mobile === 'full') {
                // Full width: spans the entire width with margins
                width = 'calc(100% - 40px)'; // Account for outer spacing
                maxWidth = 'none';
                left = '20px';
                right = '20px';
                transform = 'none';
            } else {
                // Contained width: respects max width and alignment
                maxWidth = settings.sticky_max_width_mobile ? `${settings.sticky_max_width_mobile}${settings.sticky_max_width_mobile_unit}` : '600px';

                // Handle alignment for contained width
                if (settings.sticky_alignment_mobile === 'left') {
                    left = '20px';
                    right = 'auto';
                    transform = 'none';
                } else if (settings.sticky_alignment_mobile === 'center') {
                    left = '50%';
                    right = 'auto';
                    transform = 'translateX(-50%)';
                } else if (settings.sticky_alignment_mobile === 'right') {
                    left = 'auto';
                    right = '20px';
                    transform = 'none';
                }
            }
        } else {
            // Desktop settings
            if (settings.sticky_bar_width === 'full') {
                // Full width: spans the entire width with margins
                width = 'calc(100% - 40px)'; // Account for outer spacing
                maxWidth = 'none';
                left = '20px';
                right = '20px';
                transform = 'none';
            } else {
                // Contained width: respects max width and alignment
                maxWidth = settings.sticky_max_width ? `${settings.sticky_max_width}${settings.sticky_max_width_unit}` : '600px';

                // Handle alignment for contained width
                if (settings.sticky_alignment === 'left') {
                    left = '20px';
                    right = 'auto';
                    transform = 'none';
                } else if (settings.sticky_alignment === 'center') {
                    left = '50%';
                    right = 'auto';
                    transform = 'translateX(-50%)';
                } else if (settings.sticky_alignment === 'right') {
                    left = 'auto';
                    right = '20px';
                    transform = 'none';
                }
            }
        }

        const styles = {
            backgroundColor: settings.sticky_background_color,
            borderColor: settings.sticky_border_color,
            color: settings.sticky_product_name_color,
            width: width,
            maxWidth: maxWidth,
            left: left,
            right: right,
            transform: transform,
            margin: isMobile ?
                (settings.sticky_outer_spacing_mobile ? `${settings.sticky_outer_spacing_mobile}${settings.sticky_outer_spacing_mobile_unit}` : 'unset') :
                (settings.sticky_outer_spacing ? `${settings.sticky_outer_spacing}${settings.sticky_outer_spacing_unit}` : 'unset'),
            padding: isMobile ?
                `${settings.sticky_inner_spacing_mobile}px` :
                `${settings.sticky_inner_spacing}${settings.sticky_inner_spacing_unit}`,
            border: `1px solid ${settings.sticky_border_color}`,
            borderRadius: `${settings.sticky_border_radius || '12'}px`,
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
            // Try to load from app proxy first
            const response = await fetch(`${this.proxyUrl}?t=${Date.now()}`);

            if (response.ok) {
                const data = await response.json();
                this.settings = data;
            } else {
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

        // Apply content display settings
        const imageElement = stickyBar.querySelector('.sticky-product-image');
        const titleElement = stickyBar.querySelector('.sticky-product-title');
        const priceElement = stickyBar.querySelector('.sticky-product-price');
        const quantityElement = stickyBar.querySelector('.sticky-quantity-selector');

        if (imageElement) {
            const isMobile = window.innerWidth <= 768;
            const shouldShowImage = isMobile ?
                (settings.sticky_content_display_mobile_image !== false) :
                (settings.sticky_content_display_image !== false);
            const display = shouldShowImage ? 'block' : 'none';
            imageElement.style.display = display;
        }
        if (titleElement) {
            const isMobile = window.innerWidth <= 768;
            const shouldShowTitle = isMobile ?
                (settings.sticky_content_display_mobile_title !== false) :
                (settings.sticky_content_display_title !== false);
            const display = shouldShowTitle ? 'block' : 'none';
            titleElement.style.display = display;
        }
        if (priceElement) {
            const isMobile = window.innerWidth <= 768;
            const shouldShowPrice = isMobile ?
                (settings.sticky_content_display_mobile_price !== false) :
                (settings.sticky_content_display_price !== false);
            const display = shouldShowPrice ? 'block' : 'none';
            priceElement.style.display = display;
        }
        if (quantityElement) {
            const isMobile = window.innerWidth <= 768;
            const shouldShowQuantity = isMobile ?
                (settings.sticky_content_display_mobile_quantity !== false) :
                (settings.sticky_content_display_quantity !== false);
            const display = shouldShowQuantity ? 'flex' : 'none';
            quantityElement.style.display = display;
        }

        // Apply button settings
        const button = stickyBar.querySelector('.sticky-add-to-cart-btn');
        if (button) {
            button.textContent = settings.sticky_button_text;
            button.style.backgroundColor = settings.sticky_button_bg_color;
            button.style.color = settings.sticky_button_text_color;

            // Add cart icon if enabled
            const isMobile = window.innerWidth <= 768;
            const shouldShowCartIcon = isMobile ?
                (settings.sticky_enable_mobile_cart_icon !== false) :
                (settings.sticky_enable_cart_icon !== false);

            if (shouldShowCartIcon) {
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

        // Apply quantity input color
        const quantityInput = stickyBar.querySelector('.sticky-quantity-input');
        if (quantityInput) {
            quantityInput.style.color = settings.sticky_quantity_color;
        }

        // Apply image size
        const productImage = stickyBar.querySelector('.sticky-product-image');
        if (productImage) {
            const isMobile = window.innerWidth <= 768;
            const imageSize = isMobile ?
                (settings.sticky_image_size_mobile || 'medium') :
                (settings.sticky_image_size || 'medium');
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
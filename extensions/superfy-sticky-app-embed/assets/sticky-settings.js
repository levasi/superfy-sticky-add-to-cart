/**
 * Sticky Bar Settings Loader
 * Fetches settings from the app proxy and applies them to the sticky bar
 * Updated: App Embed Version - v58
 */

class StickyBarSettings {
    constructor() {
        this.settings = null;
        this.loaded = false;
        this.callbacks = [];
        this.proxyUrl = '/apps/proxy/settings';
        this.metafieldsUrl = '/apps/proxy/metafields';
        this.stickyBar = null;
        this.triggerTimer = null;
        this.lastScrollPosition = 0;
        this.isVisible = false;
        this.triggerMet = false;
        this.scrollThrottleTimer = null;
    }

    // Default settings fallback
    getDefaultSettings() {
        return {
            sticky_bar_color: '#fff',
            sticky_visibility: 'all',
            sticky_trigger: 'after-summary',
            sticky_trigger_seconds: '3',
            sticky_trigger_pixels: '300',
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
            borderRadius: `${settings.sticky_border_radius || '12'}px`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            position: 'fixed',
            bottom: '20px',
            zIndex: 999,
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
            // Check for embedded settings first (from Liquid template)
            if (window.StickyBarEmbeddedSettings) {
                console.log('🔧 Using embedded settings:', window.StickyBarEmbeddedSettings);
                this.settings = window.StickyBarEmbeddedSettings;
                this.loaded = true;
                this.applySettings();

                // Call all registered callbacks
                this.callbacks.forEach(callback => callback(this.settings));
                this.callbacks = [];
                return;
            }

            // Try to load from app proxy first
            const url = `${this.proxyUrl}?t=${Date.now()}`;
            console.log('🔗 Fetching from URL:', url);
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                console.log('🔗 App Proxy Response:', data);
                console.log('🎯 App Proxy trigger_seconds:', data.sticky_trigger_seconds);
                this.settings = data;
            } else {
                console.log('❌ App Proxy failed, falling back to metafields');
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

        // Log all trigger-related settings for debugging
        console.log('🔧 STICKY BAR SETTINGS DEBUG (App Embed):');
        console.log('📋 All Settings:', settings);
        console.log('🎯 Trigger Settings:');
        console.log('  - sticky_trigger:', this.get('sticky_trigger'));
        console.log('  - sticky_trigger_seconds:', this.get('sticky_trigger_seconds'));
        console.log('  - sticky_trigger_pixels:', this.get('sticky_trigger_pixels'));
        console.log('  - sticky_visibility:', this.get('sticky_visibility'));
        console.log('🌐 Page Info:');
        console.log('  - Current URL:', window.location.href);
        console.log('  - Is Product Page:', window.location.pathname.includes('/products/'));
        console.log('  - Window Width:', window.innerWidth);
        console.log('  - Is Mobile:', window.innerWidth <= 768);

        // Find the sticky bar element
        const stickyBar = document.querySelector('.sticky-add-to-cart-block');
        if (!stickyBar) {
            console.error('❌ Sticky bar element not found');
            console.log('🔍 Available elements with "sticky" in class:',
                Array.from(document.querySelectorAll('*')).filter(el =>
                    el.className && el.className.toString().includes('sticky')
                ).map(el => ({ tag: el.tagName, class: el.className, id: el.id }))
            );
            return;
        }

        console.log('✅ Sticky bar element found:', stickyBar);

        // Setup variant change detection
        this.setupVariantChangeDetection(stickyBar);

        // Remove all visibility classes initially - they will be applied when trigger conditions are met
        const trigger = this.get('sticky_trigger');
        stickyBar.classList.remove('sticky-visible-all', 'sticky-visible-desktop', 'sticky-visible-mobile', 'show');

        // CSS handles the default hidden state with display: none !important

        const styles = this.getStyles();

        // Apply styles to the main sticky bar container
        Object.assign(stickyBar.style, styles);

        // For scroll-up trigger, ensure display is controlled by JavaScript, not CSS
        if (trigger === 'scroll-up') {
            stickyBar.style.display = 'none';
        }

        // Apply content display settings - updated for new CSS classes
        const imageElement = stickyBar.querySelector('.sfy-sb-image');
        const titleElement = stickyBar.querySelector('.sfy-sb-name');
        const priceElement = stickyBar.querySelector('.sfy-sb-price');
        const quantityElement = stickyBar.querySelector('.sfy-sb-qty');

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

        // Apply button settings - updated for new CSS classes
        const button = stickyBar.querySelector('.sfy-sb-add-to-cart-button');
        if (button) {
            const buttonText = button.querySelector('.sfy-sb-add-to-cart-text__content');
            if (buttonText) {
                buttonText.textContent = settings.sticky_button_text;
            }
            button.style.backgroundColor = settings.sticky_button_bg_color;
            button.style.color = settings.sticky_button_text_color;

            // Add click event listener for button behavior
            this.setupButtonClickHandler(button, settings);

            // Add cart icon if enabled
            const isMobile = window.innerWidth <= 768;
            const shouldShowCartIcon = isMobile ?
                (settings.sticky_enable_mobile_cart_icon !== false) :
                (settings.sticky_enable_cart_icon !== false);

            if (shouldShowCartIcon) {
                // Create cart icon if it doesn't exist
                let cartIcon = button.querySelector('.sfy-sb-add-to-cart-icon');
                if (!cartIcon) {
                    cartIcon = document.createElement('span');
                    cartIcon.className = 'sfy-sb-add-to-cart-icon sfy-svg';
                    cartIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 14.25C18.4142 14.25 18.75 14.5858 18.75 15V17.25H21C21.4142 17.25 21.75 17.5858 21.75 18C21.75 18.4142 21.4142 18.75 21 18.75H18.75V21C18.75 21.4142 18.4142 21.75 18 21.75C17.5858 21.75 17.25 21.4142 17.25 21V18.75H15C14.5858 18.75 14.25 18.4142 14.25 18C14.25 17.5858 14.5858 17.25 15 17.25H17.25V15C17.25 14.5858 17.5858 14.25 18 14.25ZM12 3.25C14.3681 3.25 16.3308 4.98306 16.6904 7.25H17C19.0711 7.25 20.75 8.92893 20.75 11V12C20.75 12.4142 20.4142 12.75 20 12.75C19.5858 12.75 19.25 12.4142 19.25 12V11C19.25 9.75736 18.2426 8.75 17 8.75H7C5.75736 8.75 4.75 9.75736 4.75 11V17C4.75 18.2426 5.75736 19.25 7 19.25H12C12.4142 19.25 12.75 19.5858 12.75 20C12.75 20.4142 12.4142 20.75 12 20.75H7C4.92893 20.75 3.25 19.0711 3.25 17V11C3.25 8.92893 4.92893 7.25 7 7.25H7.30957C7.6692 4.98306 9.63189 3.25 12 3.25ZM12 4.75C10.4633 4.75 9.17655 5.81675 8.83789 7.25H15.1621C14.8235 5.81675 13.5367 4.75 12 4.75Z" fill="currentColor"/></svg>';
                    const buttonTextSpan = button.querySelector('.sfy-sb-add-to-cart-text');
                    if (buttonTextSpan) {
                        buttonTextSpan.insertBefore(cartIcon, buttonTextSpan.firstChild);
                    }
                }
                cartIcon.style.display = 'flex';
            } else {
                // Remove cart icon if disabled
                const cartIcon = button.querySelector('.sfy-sb-add-to-cart-icon');
                if (cartIcon) {
                    cartIcon.style.display = 'none';
                }
            }
        }

        // Apply quantity input color - updated for new CSS classes
        const quantityInput = stickyBar.querySelector('.sfy-sb-qty input');
        if (quantityInput) {
            quantityInput.style.color = settings.sticky_quantity_color;
        }

        // Apply image size - updated for new CSS classes
        const productImageContainer = stickyBar.querySelector('.sfy-sb-image');
        if (productImageContainer) {
            const isMobile = window.innerWidth <= 768;
            const imageSize = isMobile ?
                (settings.sticky_image_size_mobile || 'medium') :
                (settings.sticky_image_size || 'medium');

            // Remove existing size classes
            productImageContainer.classList.remove('--sfy-tiny', '--sfy-small', '--sfy-medium', '--sfy-large');

            // Add new size class based on setting
            switch (imageSize) {
                case 'tiny':
                    productImageContainer.classList.add('--sfy-tiny');
                    break;
                case 'small':
                    productImageContainer.classList.add('--sfy-small');
                    break;
                case 'large':
                    productImageContainer.classList.add('--sfy-large');
                    break;
                default: // medium
                    productImageContainer.classList.add('--sfy-medium');
                    break;
            }
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
                console.error('Error applying custom CSS:', error);
            }
        }

        // Initialize quantity controls
        this.initializeQuantityControls();

        // Initialize trigger logic
        this.initializeTrigger();
    }

    // Initialize trigger logic based on settings
    initializeTrigger() {
        const trigger = this.get('sticky_trigger');
        console.log('🎯 Initializing trigger:', trigger);

        // Clear any existing timers
        if (this.triggerTimer) {
            clearTimeout(this.triggerTimer);
        }

        // Remove existing event listeners
        if (this.handleScrollPixels) window.removeEventListener('scroll', this.handleScrollPixels);
        if (this.handleScrollUp) window.removeEventListener('scroll', this.handleScrollUp);
        if (this.handleScrollSummary) window.removeEventListener('scroll', this.handleScrollSummary);
        if (this.handleScrollButton) window.removeEventListener('scroll', this.handleScrollButton);

        // Clear throttle timer
        if (this.scrollThrottleTimer) {
            clearTimeout(this.scrollThrottleTimer);
            this.scrollThrottleTimer = null;
        }

        switch (trigger) {
            case 'always':
                console.log('✅ Trigger: Always visible');
                // For 'always' trigger, apply visibility classes immediately
                const stickyBar = document.querySelector('.sticky-add-to-cart-block');
                if (stickyBar) {
                    const visibility = this.get('sticky_visibility');
                    stickyBar.classList.remove('sticky-visible-all', 'sticky-visible-desktop', 'sticky-visible-mobile');

                    if (visibility === 'all') {
                        stickyBar.classList.add('sticky-visible-all');
                    } else if (visibility === 'desktop') {
                        stickyBar.classList.add('sticky-visible-desktop');
                    } else if (visibility === 'mobile') {
                        stickyBar.classList.add('sticky-visible-mobile');
                    }
                }
                this.showStickyBar();
                break;

            case 'after-x-seconds':
                const seconds = parseInt(this.get('sticky_trigger_seconds')) || 3;
                console.log(`⏱️ Trigger: After ${seconds} seconds`);
                this.triggerTimer = setTimeout(() => {
                    this.showStickyBar();
                }, seconds * 1000);
                break;

            case 'after-x-pixels':
                const pixels = parseInt(this.get('sticky_trigger_pixels')) || 300;
                console.log(`📏 Trigger: After ${pixels} pixels scroll`);
                this.handleScrollPixels = () => this.handleScrollPixelsMethod();
                window.addEventListener('scroll', this.handleScrollPixels);
                break;

            case 'scroll-up':
                console.log('⬆️ Trigger: On scroll up');
                // Initialize scroll position
                this.lastScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                this.handleScrollUp = () => this.handleScrollUpMethod();
                window.addEventListener('scroll', this.handleScrollUp);
                break;

            case 'after-summary':
                console.log('📄 Trigger: After product summary');
                this.handleScrollSummary = () => this.handleScrollSummaryMethod();
                window.addEventListener('scroll', this.handleScrollSummary);
                break;

            case 'out-of-view':
                console.log('👁️ Trigger: When add to cart button out of view');
                this.handleScrollButton = () => this.handleScrollButtonMethod();
                window.addEventListener('scroll', this.handleScrollButton);
                break;

            default:
                console.log('⚠️ Unknown trigger, defaulting to after-summary');
                this.handleScrollSummary = () => this.handleScrollSummaryMethod();
                window.addEventListener('scroll', this.handleScrollSummary);
        }

        // No debug fallback - respect the trigger settings
    }

    // Show the sticky bar
    showStickyBar() {
        const stickyBar = document.querySelector('.sticky-add-to-cart-block');
        if (stickyBar && !this.isVisible) {
            console.log('👁️ Showing sticky bar');

            // Apply visibility classes when showing the bar
            const visibility = this.get('sticky_visibility');
            stickyBar.classList.remove('sticky-visible-all', 'sticky-visible-desktop', 'sticky-visible-mobile');

            if (visibility === 'all') {
                stickyBar.classList.add('sticky-visible-all');
            } else if (visibility === 'desktop') {
                stickyBar.classList.add('sticky-visible-desktop');
            } else if (visibility === 'mobile') {
                stickyBar.classList.add('sticky-visible-mobile');
            }

            stickyBar.classList.add('show');
            this.isVisible = true;
        }
    }

    // Hide the sticky bar
    hideStickyBar() {
        const stickyBar = document.querySelector('.sticky-add-to-cart-block');
        if (stickyBar && this.isVisible) {
            console.log('🙈 Hiding sticky bar');
            stickyBar.classList.remove('show');
            this.isVisible = false;
        }
    }

    // Handle scroll for pixel-based trigger
    handleScrollPixelsMethod() {
        const pixels = parseInt(this.get('sticky_trigger_pixels')) || 300;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop >= pixels && !this.triggerMet) {
            console.log(`📏 Scrolled ${scrollTop}px, showing sticky bar`);
            this.triggerMet = true;
            this.showStickyBar();
        }
    }

    // Handle scroll up trigger
    handleScrollUpMethod() {
        // Throttle scroll events for better performance
        if (this.scrollThrottleTimer) {
            return;
        }

        this.scrollThrottleTimer = setTimeout(() => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDifference = Math.abs(currentScrollTop - this.lastScrollPosition);

            // Only process if there's a meaningful scroll difference (avoid tiny movements)
            if (scrollDifference < 5) {
                this.scrollThrottleTimer = null;
                return;
            }

            // Show sticky bar when scrolling up and past a minimum threshold
            if (currentScrollTop < this.lastScrollPosition && currentScrollTop > 200) {
                console.log('⬆️ Scrolled up, showing sticky bar');
                this.showStickyBar();
            }
            // Hide sticky bar when scrolling down (any amount)
            else if (currentScrollTop > this.lastScrollPosition) {
                console.log('⬇️ Scrolled down, hiding sticky bar');
                this.hideStickyBar();
            }

            this.lastScrollPosition = currentScrollTop;
            this.scrollThrottleTimer = null;
        }, 16); // ~60fps throttling
    }

    // Handle scroll for product summary trigger
    handleScrollSummaryMethod() {
        const summaryElement = document.querySelector('.product-summary, .product-description, .product-details');
        if (summaryElement) {
            const rect = summaryElement.getBoundingClientRect();
            if (rect.bottom < 0 && !this.triggerMet) {
                console.log('📄 Product summary out of view, showing sticky bar');
                this.triggerMet = true;
                this.showStickyBar();
            }
        }
    }

    // Handle scroll for add to cart button trigger
    handleScrollButtonMethod() {
        const addToCartButton = document.querySelector('[name="add"], .btn-cart, .add-to-cart, .product-form__cart-button');
        if (addToCartButton) {
            const rect = addToCartButton.getBoundingClientRect();
            if (rect.bottom < 0 && !this.triggerMet) {
                console.log('🛒 Add to cart button out of view, showing sticky bar');
                this.triggerMet = true;
                this.showStickyBar();
            }
        }
    }

    // Initialize quantity controls
    initializeQuantityControls() {
        const stickyBar = document.querySelector('.sticky-add-to-cart-block');
        if (!stickyBar) return;

        const quantityInput = stickyBar.querySelector('.sfy-sb-qty-input');
        const minusButton = stickyBar.querySelector('.sfy-sb-qty-minus');
        const plusButton = stickyBar.querySelector('.sfy-sb-qty-plus');

        if (quantityInput && minusButton && plusButton) {
            // Remove existing event listeners
            minusButton.removeEventListener('click', this.handleQuantityMinus);
            plusButton.removeEventListener('click', this.handleQuantityPlus);
            quantityInput.removeEventListener('change', this.handleQuantityChange);

            // Add new event listeners
            this.handleQuantityMinus = () => {
                const currentValue = parseInt(quantityInput.value) || 1;
                const newValue = Math.max(1, currentValue - 1);
                quantityInput.value = newValue;
            };

            this.handleQuantityPlus = () => {
                const currentValue = parseInt(quantityInput.value) || 1;
                const newValue = Math.min(99, currentValue + 1);
                quantityInput.value = newValue;
            };

            this.handleQuantityChange = () => {
                const value = parseInt(quantityInput.value) || 1;
                const clampedValue = Math.max(1, Math.min(99, value));
                if (clampedValue !== value) {
                    quantityInput.value = clampedValue;
                }
            };

            minusButton.addEventListener('click', this.handleQuantityMinus);
            plusButton.addEventListener('click', this.handleQuantityPlus);
            quantityInput.addEventListener('change', this.handleQuantityChange);
        }
    }

    // Setup variant change detection to update sticky bar when variant changes
    setupVariantChangeDetection(stickyBar) {
        console.log('🔄 Setting up variant change detection...');

        // Listen for variant change events that themes typically dispatch
        const variantChangeEvents = [
            'variant:change',
            'variantChange',
            'product:variant-change',
            'change'
        ];

        variantChangeEvents.forEach(eventName => {
            document.addEventListener(eventName, (event) => {
                console.log(`🔄 Variant change detected via ${eventName}:`, event.detail);
                this.handleVariantChange(stickyBar, event.detail);
            });
        });

        // Also listen for form changes (variant selectors)
        const variantSelectors = document.querySelectorAll('select[name="id"], input[name="id"]:checked');
        variantSelectors.forEach(selector => {
            selector.addEventListener('change', (event) => {
                console.log('🔄 Variant selector changed:', event.target.value);
                this.handleVariantChange(stickyBar, { variant: { id: event.target.value } });
            });
        });

        // Listen for URL changes (when variant is selected via URL)
        let currentUrl = window.location.href;
        const urlCheckInterval = setInterval(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                console.log('🔄 URL changed, checking for variant update...');
                this.updateStickyBarFromCurrentVariant(stickyBar);
            }
        }, 500);

        // Clean up interval when page unloads
        window.addEventListener('beforeunload', () => {
            clearInterval(urlCheckInterval);
        });
    }

    // Handle variant change event
    async handleVariantChange(stickyBar, eventDetail) {
        try {
            console.log('🔄 Handling variant change:', eventDetail);

            let variantId = null;
            let variantData = null;

            // Extract variant ID from different event formats
            if (eventDetail?.variant?.id) {
                variantId = eventDetail.variant.id;
                variantData = eventDetail.variant;
            } else if (eventDetail?.id) {
                variantId = eventDetail.id;
                variantData = eventDetail;
            } else if (typeof eventDetail === 'string' || typeof eventDetail === 'number') {
                variantId = eventDetail;
            }

            if (variantId) {
                console.log('🔄 Updating sticky bar for variant:', variantId);
                console.log('🔄 Before update - dataset variantId:', stickyBar.dataset.variantId);

                // Update the sticky bar's variant ID
                stickyBar.dataset.variantId = variantId;

                console.log('🔄 After update - dataset variantId:', stickyBar.dataset.variantId);

                // If we have variant data, update price and image
                if (variantData) {
                    this.updateStickyBarPrice(stickyBar, variantData);
                    this.updateStickyBarImage(stickyBar, variantData);
                } else {
                    // Fetch variant data if not provided
                    await this.updateStickyBarFromVariantId(stickyBar, variantId);
                }
            }
        } catch (error) {
            console.error('❌ Error handling variant change:', error);
        }
    }

    // Update sticky bar from current variant (when URL changes)
    async updateStickyBarFromCurrentVariant(stickyBar) {
        try {
            // Extract variant ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const variantId = urlParams.get('variant');

            if (variantId) {
                console.log('🔄 Updating sticky bar from URL variant:', variantId);
                await this.updateStickyBarFromVariantId(stickyBar, variantId);
            }
        } catch (error) {
            console.error('❌ Error updating sticky bar from current variant:', error);
        }
    }

    // Update sticky bar from variant ID
    async updateStickyBarFromVariantId(stickyBar, variantId) {
        try {
            // Fetch variant data from the product
            const productId = stickyBar.dataset.productId;
            if (!productId) return;

            const response = await fetch(`/products/${productId}.js`);
            if (response.ok) {
                const product = await response.json();
                const variant = product.variants.find(v => v.id.toString() === variantId.toString());

                if (variant) {
                    console.log('🔄 Found variant data:', variant);
                    console.log('🔄 Updating dataset variantId from', stickyBar.dataset.variantId, 'to', variantId);
                    stickyBar.dataset.variantId = variantId;
                    console.log('🔄 Dataset variantId after update:', stickyBar.dataset.variantId);
                    this.updateStickyBarPrice(stickyBar, variant);
                    this.updateStickyBarImage(stickyBar, variant);
                }
            }
        } catch (error) {
            console.error('❌ Error fetching variant data:', error);
        }
    }

    // Update sticky bar price
    updateStickyBarPrice(stickyBar, variant) {
        const priceElement = stickyBar.querySelector('.sfy-sb-price .price');
        const comparePriceElement = stickyBar.querySelector('.sfy-sb-price .price-compare');

        if (priceElement && variant.price) {
            // Use Shopify's money formatting if available, otherwise format manually
            if (window.Shopify && window.Shopify.formatMoney) {
                priceElement.textContent = window.Shopify.formatMoney(variant.price);
            } else {
                // Fallback: format price (assuming variant.price is in cents)
                const price = (variant.price / 100).toFixed(2);
                priceElement.textContent = `$${price}`;
            }

            // Update compare price if it exists
            if (comparePriceElement && variant.compare_at_price && variant.compare_at_price > variant.price) {
                if (window.Shopify && window.Shopify.formatMoney) {
                    comparePriceElement.textContent = window.Shopify.formatMoney(variant.compare_at_price);
                } else {
                    const comparePrice = (variant.compare_at_price / 100).toFixed(2);
                    comparePriceElement.textContent = `$${comparePrice}`;
                }
                comparePriceElement.style.display = 'inline';
            } else if (comparePriceElement) {
                comparePriceElement.style.display = 'none';
            }

            console.log('✅ Updated sticky bar price:', priceElement.textContent);
        }
    }

    // Update sticky bar image
    updateStickyBarImage(stickyBar, variant) {
        const imageElement = stickyBar.querySelector('.sfy-sb-image img');

        if (imageElement && variant.featured_image) {
            // Use variant image if available, otherwise use product image
            const imageUrl = variant.featured_image.src || variant.featured_image;
            imageElement.src = imageUrl;
            imageElement.alt = variant.title || 'Product image';

            console.log('✅ Updated sticky bar image:', imageUrl);
        }
    }

    // Get the currently selected variant ID from the page
    getCurrentSelectedVariantId() {
        // Check URL parameter first
        const urlParams = new URLSearchParams(window.location.search);
        const urlVariantId = urlParams.get('variant');
        if (urlVariantId) {
            console.log('🔄 Found variant ID in URL:', urlVariantId);
            return urlVariantId;
        }

        // Check variant selectors
        const variantSelect = document.querySelector('select[name="id"]');
        if (variantSelect && variantSelect.value) {
            console.log('🔄 Found variant ID in select:', variantSelect.value);
            return variantSelect.value;
        }

        // Check radio buttons
        const variantRadio = document.querySelector('input[name="id"]:checked');
        if (variantRadio && variantRadio.value) {
            console.log('🔄 Found variant ID in radio:', variantRadio.value);
            return variantRadio.value;
        }

        // Check for data attributes on product form
        const productForm = document.querySelector('form[action*="/cart/add"]');
        if (productForm) {
            const formVariantId = productForm.querySelector('input[name="id"]')?.value;
            if (formVariantId) {
                console.log('🔄 Found variant ID in form:', formVariantId);
                return formVariantId;
            }
        }

        console.log('⚠️ No variant ID found on page');
        return null;
    }

    // Setup button click handler based on behavior setting
    setupButtonClickHandler(button, settings) {
        // Remove any existing click handlers
        button.removeEventListener('click', this.handleButtonClick);

        // Add new click handler
        this.handleButtonClick = (event) => {
            event.preventDefault();
            this.handleButtonAction(settings);
        };

        button.addEventListener('click', this.handleButtonClick);
    }

    // Handle button action based on behavior setting
    async handleButtonAction(settings) {
        const behavior = settings.sticky_button_behavior || 'add';
        const stickyBar = document.querySelector('.sticky-add-to-cart-block');

        if (!stickyBar) {
            console.error('❌ Sticky bar not found');
            return;
        }

        const productId = stickyBar.dataset.productId;
        let variantId = stickyBar.dataset.variantId;
        const quantityInput = stickyBar.querySelector('.sfy-sb-qty-input');
        const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

        // Double-check variant ID by getting current selection from page
        const currentVariantId = this.getCurrentSelectedVariantId();
        if (currentVariantId && currentVariantId !== variantId) {
            console.log('🔄 Variant mismatch detected! Sticky bar:', variantId, 'Page:', currentVariantId);
            console.log('🔄 Updating sticky bar variant ID to match page selection');
            variantId = currentVariantId;
            stickyBar.dataset.variantId = variantId;
        }

        console.log('🛒 Button clicked:', { behavior, productId, variantId, quantity });
        console.log('🛒 Current sticky bar dataset:', {
            productId: stickyBar.dataset.productId,
            variantId: stickyBar.dataset.variantId
        });

        switch (behavior) {
            case 'add':
                await this.addToCart(variantId, quantity);
                break;
            case 'buy':
                await this.buyNow(variantId, quantity);
                break;
            case 'custom':
                // Custom action - leave for later implementation
                console.log('🔧 Custom action not implemented yet');
                break;
            default:
                await this.addToCart(variantId, quantity);
        }
    }

    // Add to cart functionality - mimics default Shopify behavior with bundled section rendering
    async addToCart(variantId, quantity) {
        try {
            console.log('🛒 Adding to cart:', { variantId, quantity });

            const response = await fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    id: variantId,
                    quantity: quantity,
                    // Request cart drawer sections to be rendered with the cart update
                    sections: 'cart-drawer,cart-icon-bubble,cart-live-region-text',
                    sections_url: window.location.pathname
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Added to cart successfully:', data);

                // Use bundled section rendering to update cart drawer
                await this.updateCartDrawerWithSections(data);

            } else {
                const errorData = await response.json();
                console.error('❌ Add to cart failed:', errorData);
                this.showCartFeedback('Failed to add to cart', 'error');
            }
        } catch (error) {
            console.error('❌ Add to cart error:', error);
            this.showCartFeedback('Failed to add to cart', 'error');
        }
    }

    // Buy now functionality - redirect to checkout
    async buyNow(variantId, quantity) {
        try {
            console.log('💳 Buying now:', { variantId, quantity });

            // First add to cart
            const response = await fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    id: variantId,
                    quantity: quantity
                })
            });

            if (response.ok) {
                // Redirect to checkout
                window.location.href = '/checkout';
            } else {
                const errorData = await response.json();
                console.error('❌ Buy now failed:', errorData);
                this.showCartFeedback('Failed to proceed to checkout', 'error');
            }
        } catch (error) {
            console.error('❌ Buy now error:', error);
            this.showCartFeedback('Failed to proceed to checkout', 'error');
        }
    }

    // Show feedback message to user
    showCartFeedback(message, type = 'success') {
        // Remove any existing feedback
        const existingFeedback = document.querySelector('.sfy-cart-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `sfy-cart-feedback sfy-cart-feedback--${type}`;
        feedback.textContent = message;

        // Style the feedback
        Object.assign(feedback.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '10000',
            backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        document.body.appendChild(feedback);

        // Animate in
        setTimeout(() => {
            feedback.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            feedback.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 3000);
    }

    // Trigger cart update events for theme compatibility
    triggerCartUpdate() {
        // Dispatch custom events that themes might be listening for
        const cartUpdateEvent = new CustomEvent('cart:updated', {
            detail: { source: 'sticky-bar' }
        });
        document.dispatchEvent(cartUpdateEvent);

        // Also trigger the standard Shopify cart events
        const shopifyCartEvent = new CustomEvent('cart:build', {
            detail: { source: 'sticky-bar' }
        });
        document.dispatchEvent(shopifyCartEvent);
    }

    // Open cart drawer like default Shopify behavior
    openCartDrawer() {
        console.log('🛒 Attempting to open cart drawer...');

        // Try multiple methods to open the cart drawer
        const methods = [
            // Method 1: Look for cart drawer toggle buttons
            () => {
                const cartToggleButtons = document.querySelectorAll(
                    '[data-cart-drawer-toggle], .cart-drawer-toggle, .cart-toggle, [data-cart-toggle], .js-cart-drawer-toggle, .cart-drawer__toggle'
                );
                if (cartToggleButtons.length > 0) {
                    console.log('🛒 Found cart toggle button, clicking...');
                    cartToggleButtons[0].click();
                    return true;
                }
                return false;
            },

            // Method 2: Look for cart icon/link
            () => {
                const cartLinks = document.querySelectorAll(
                    'a[href*="/cart"], .cart-link, .cart-icon, [data-cart-link], .header__cart, .site-header__cart'
                );
                if (cartLinks.length > 0) {
                    console.log('🛒 Found cart link, clicking...');
                    cartLinks[0].click();
                    return true;
                }
                return false;
            },

            // Method 3: Trigger cart drawer events
            () => {
                console.log('🛒 Triggering cart drawer events...');
                const cartDrawerEvent = new CustomEvent('cart:open', {
                    detail: { source: 'sticky-bar' }
                });
                document.dispatchEvent(cartDrawerEvent);

                // Also try common theme events
                const themeEvents = ['cart:open', 'cart:show', 'drawer:open', 'cart-drawer:open'];
                themeEvents.forEach(eventName => {
                    document.dispatchEvent(new CustomEvent(eventName, {
                        detail: { source: 'sticky-bar' }
                    }));
                });
                return true;
            },

            // Method 4: Look for Shopify's native cart drawer
            () => {
                const shopifyCartDrawer = document.querySelector('cart-drawer, .cart-drawer, #cart-drawer');
                if (shopifyCartDrawer) {
                    console.log('🛒 Found Shopify cart drawer, opening...');
                    // Try to trigger the open method
                    if (typeof shopifyCartDrawer.open === 'function') {
                        shopifyCartDrawer.open();
                        return true;
                    }
                    // Try to add open class
                    shopifyCartDrawer.classList.add('open', 'active', 'is-open');
                    return true;
                }
                return false;
            },

            // Method 5: Look for cart modal/overlay
            () => {
                const cartModal = document.querySelector('.cart-modal, .cart-overlay, [data-cart-modal]');
                if (cartModal) {
                    console.log('🛒 Found cart modal, opening...');
                    cartModal.style.display = 'block';
                    cartModal.classList.add('open', 'active', 'is-open');
                    return true;
                }
                return false;
            }
        ];

        // Try each method until one succeeds
        for (let i = 0; i < methods.length; i++) {
            try {
                if (methods[i]()) {
                    console.log(`✅ Cart drawer opened using method ${i + 1}`);
                    return;
                }
            } catch (error) {
                console.log(`❌ Method ${i + 1} failed:`, error);
            }
        }

        console.log('⚠️ Could not open cart drawer, falling back to feedback message');
        this.showCartFeedback('Added to cart!', 'success');
    }

    // Open cart drawer with forced refresh to ensure content is updated
    async openCartDrawerWithRefresh() {
        console.log('🛒 Opening cart drawer with forced refresh...');

        try {
            // First, try to close any existing cart drawer
            const existingCartDrawer = document.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');
            if (existingCartDrawer) {
                console.log('🛒 Closing existing cart drawer first...');

                // Try to close the drawer
                if (typeof existingCartDrawer.close === 'function') {
                    existingCartDrawer.close();
                } else {
                    // Remove open classes
                    existingCartDrawer.classList.remove('open', 'active', 'is-open');
                    existingCartDrawer.style.display = 'none';
                }

                // Wait a moment for the close animation
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            // Now open the cart drawer
            this.openCartDrawer();

            // Wait a moment for the drawer to open
            await new Promise(resolve => setTimeout(resolve, 500));

            // Force a final refresh of the cart drawer content
            const cartResponse = await fetch('/cart.js');
            if (cartResponse.ok) {
                const cartData = await cartResponse.json();
                console.log('🛒 Final cart data refresh:', cartData);

                // Dispatch final cart update event
                document.dispatchEvent(new CustomEvent('cart:updated', {
                    detail: {
                        cart: cartData,
                        source: 'sticky-bar-final'
                    }
                }));
            }

        } catch (error) {
            console.log('❌ Error in openCartDrawerWithRefresh:', error);
            // Fallback to simple cart drawer opening
            this.openCartDrawer();
        }
    }

    // Update cart drawer using bundled section rendering (recommended by Shopify)
    async updateCartDrawerWithSections(cartData) {
        console.log('🛒 Updating cart drawer with bundled section rendering...');

        try {
            // Check if we have sections data from the bundled section rendering
            if (cartData.sections) {
                console.log('🛒 Using bundled section rendering data...');

                // Update cart drawer section if available
                if (cartData.sections['cart-drawer']) {
                    console.log('🛒 Updating cart drawer with bundled HTML...');
                    await this.updateCartDrawerSection(cartData.sections['cart-drawer']);
                }

                // Update cart icon bubble if available
                if (cartData.sections['cart-icon-bubble']) {
                    console.log('🛒 Updating cart icon bubble...');
                    await this.updateCartIconBubble(cartData.sections['cart-icon-bubble']);
                } else {
                    // If no cart-icon-bubble section, ensure cart-count-bubble exists
                    console.log('🛒 No cart-icon-bubble section, ensuring cart-count-bubble exists...');
                    this.ensureCartCountBubbleExists(cartData.item_count);
                }

                // Update cart live region text if available
                if (cartData.sections['cart-live-region-text']) {
                    console.log('🛒 Updating cart live region text...');
                    await this.updateCartLiveRegionText(cartData.sections['cart-live-region-text']);
                }

                // Dispatch cart updated event
                document.dispatchEvent(new CustomEvent('cart:updated', {
                    detail: {
                        cart: cartData,
                        source: 'sticky-bar-bundled'
                    }
                }));

                // Use Shopify's native cart count update system
                await this.updateShopifyCartCount(cartData);

                // Open the cart drawer
                this.openCartDrawer();

                // Trigger Shopify's native cart count update
                setTimeout(() => {
                    this.triggerShopifyCartUpdate(cartData);
                }, 100);

                // Immediate cart count synchronization
                this.synchronizeCartCountWithTheme();

                console.log('✅ Cart drawer updated successfully with bundled sections');
                return;
            }

            // Fallback to the old method if no sections data
            console.log('⚠️ No bundled sections data, falling back to standard method...');
            await this.updateCartDrawer(cartData);

        } catch (error) {
            console.error('❌ Failed to update cart drawer with sections:', error);
            // Fallback to the old method
            await this.updateCartDrawer(cartData);
        }
    }

    // Update cart drawer section with bundled HTML
    async updateCartDrawerSection(htmlContent) {
        try {
            // Parse the HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');

            // Find the cart drawer element in the new HTML
            const newCartDrawer = doc.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');

            if (newCartDrawer) {
                // Find existing cart drawer in the page
                const existingCartDrawer = document.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');

                if (existingCartDrawer) {
                    console.log('🛒 Replacing existing cart drawer with bundled content...');
                    // Replace the entire cart drawer
                    existingCartDrawer.outerHTML = newCartDrawer.outerHTML;

                    // Get the new cart drawer element and initialize it
                    const updatedCartDrawer = document.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');
                    if (updatedCartDrawer) {
                        this.initializeCartDrawerEvents(updatedCartDrawer);
                    }
                } else {
                    console.log('🛒 Adding new cart drawer from bundled content...');
                    // Add the cart drawer to the page
                    document.body.appendChild(newCartDrawer);
                    this.initializeCartDrawerEvents(newCartDrawer);
                }

                console.log('✅ Cart drawer section updated successfully');
                return true;
            }
        } catch (error) {
            console.error('❌ Failed to update cart drawer section:', error);
        }
        return false;
    }

    // Update cart icon bubble
    async updateCartIconBubble(htmlContent) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');

            // First, look specifically for cart-count-bubble
            let newCartCountBubble = doc.querySelector('.cart-count-bubble');

            if (newCartCountBubble) {
                console.log('🛒 Found cart-count-bubble in bundled sections...');

                // Check if cart-count-bubble already exists in the page
                let existingCartCountBubble = document.querySelector('.cart-count-bubble');

                if (existingCartCountBubble) {
                    console.log('🛒 Updating existing cart-count-bubble...');
                    // Get the correct count from the cart data, not from bundled sections
                    fetch('/cart.js')
                        .then(response => response.json())
                        .then(freshCartData => {
                            const correctCount = freshCartData.item_count || 0;
                            console.log('🛒 Using correct cart count:', correctCount);

                            // Update with the correct count
                            existingCartCountBubble.textContent = correctCount;
                            existingCartCountBubble.setAttribute('data-cart-count', correctCount);
                            console.log('✅ cart-count-bubble updated with correct count');
                        })
                        .catch(error => {
                            console.log('❌ Failed to get correct count, using bundled data:', error);
                            // Fallback to bundled data
                            existingCartCountBubble.textContent = newCartCountBubble.textContent;
                            existingCartCountBubble.setAttribute('data-cart-count', newCartCountBubble.getAttribute('data-cart-count') || newCartCountBubble.textContent);
                        });
                } else {
                    console.log('🛒 cart-count-bubble not found, creating it from bundled sections...');

                    // Find the cart element to attach the bubble to
                    const cartElement = document.querySelector('a[href*="/cart"], .cart-link, .cart-icon, [data-cart-link], .header__cart, .site-header__cart');

                    if (cartElement) {
                        // Ensure parent has relative positioning
                        if (getComputedStyle(cartElement).position === 'static') {
                            cartElement.style.position = 'relative';
                        }

                        cartElement.appendChild(newCartCountBubble);
                        console.log('✅ cart-count-bubble created from bundled sections');
                    } else {
                        console.log('⚠️ No cart element found to attach cart-count-bubble to');
                    }
                }

                return;
            }

            // Fallback: try other cart icon selectors
            const cartIconSelectors = [
                '[data-cart-icon-bubble]',
                '.cart-icon-bubble',
                '.cart-count',
                '.cart-badge',
                '.header__cart-count',
                '.site-header__cart-count',
                '.cart-link .count',
                '.cart-icon .count',
                '[data-cart-count]',
                '.cart-drawer-toggle .count',
                '.cart-toggle .count'
            ];

            let newCartIcon = null;
            for (const selector of cartIconSelectors) {
                newCartIcon = doc.querySelector(selector);
                if (newCartIcon) break;
            }

            if (newCartIcon) {
                // Try to find existing cart icon with the same selectors
                let existingCartIcon = null;
                for (const selector of cartIconSelectors) {
                    existingCartIcon = document.querySelector(selector);
                    if (existingCartIcon) break;
                }

                if (existingCartIcon) {
                    console.log('🛒 Updating existing cart icon bubble...');
                    existingCartIcon.outerHTML = newCartIcon.outerHTML;
                    console.log('✅ Cart icon bubble updated');
                } else {
                    // If no existing cart icon found, try to find the cart link/button and update its count
                    console.log('🛒 No existing cart icon found, trying to update cart link count...');
                    await this.updateCartLinkCount(newCartIcon);
                }
            } else {
                console.log('⚠️ No cart icon bubble found in bundled sections');
                // Fallback: manually update cart count
                await this.manuallyUpdateCartCount();
            }
        } catch (error) {
            console.error('❌ Failed to update cart icon bubble:', error);
            // Fallback: manually update cart count
            await this.manuallyUpdateCartCount();
        }
    }

    // Update cart link count when no dedicated cart icon bubble exists
    async updateCartLinkCount(newCartIcon) {
        try {
            // Find cart links/buttons
            const cartLinks = document.querySelectorAll(
                'a[href*="/cart"], .cart-link, .cart-icon, [data-cart-link], .header__cart, .site-header__cart, .cart-drawer-toggle, .cart-toggle'
            );

            for (const cartLink of cartLinks) {
                // Look for count elements within the cart link
                const countElements = cartLink.querySelectorAll('.count, .cart-count, .badge, [data-count]');

                if (countElements.length > 0) {
                    // Update existing count elements
                    for (const countEl of countElements) {
                        const newCount = newCartIcon.textContent || newCartIcon.innerText || '1';
                        countEl.textContent = newCount;
                        countEl.style.display = newCount === '0' ? 'none' : 'block';
                    }
                    console.log('✅ Updated cart link count elements');
                } else {
                    // Add count element if none exists
                    const newCount = newCartIcon.textContent || newCartIcon.innerText || '1';
                    if (newCount !== '0') {
                        const countEl = document.createElement('span');
                        countEl.className = 'cart-count';
                        countEl.textContent = newCount;
                        countEl.style.cssText = `
                            position: absolute;
                            top: -8px;
                            right: -8px;
                            background: #ff4444;
                            color: white;
                            border-radius: 50%;
                            min-width: 18px;
                            height: 18px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 12px;
                            font-weight: bold;
                        `;
                        cartLink.style.position = 'relative';
                        cartLink.appendChild(countEl);
                        console.log('✅ Added cart count element to cart link');
                    }
                }
            }
        } catch (error) {
            console.error('❌ Failed to update cart link count:', error);
        }
    }

    // Manually update cart count as fallback
    async manuallyUpdateCartCount() {
        try {
            console.log('🛒 Manually updating cart count...');

            // Fetch current cart data
            const cartResponse = await fetch('/cart.js');
            if (cartResponse.ok) {
                const cartData = await cartResponse.json();
                const itemCount = cartData.item_count || 0;

                console.log(`🛒 Current cart item count: ${itemCount}`);

                // Update all possible cart count elements
                const countSelectors = [
                    '.cart-count',
                    '.cart-badge',
                    '.header__cart-count',
                    '.site-header__cart-count',
                    '[data-cart-count]',
                    '.cart-drawer-toggle .count',
                    '.cart-toggle .count',
                    '.cart-link .count',
                    '.cart-icon .count'
                ];

                for (const selector of countSelectors) {
                    const elements = document.querySelectorAll(selector);
                    for (const element of elements) {
                        element.textContent = itemCount;
                        element.style.display = itemCount === 0 ? 'none' : 'block';
                    }
                }

                console.log('✅ Manually updated cart count elements');
            }
        } catch (error) {
            console.error('❌ Failed to manually update cart count:', error);
        }
    }

    // Update cart count using Shopify's native system
    async updateShopifyCartCount(cartData) {
        try {
            console.log('🛒 Updating cart count using Shopify native system...');

            // Get fresh cart data to ensure we have the correct item_count
            let itemCount = cartData.item_count;
            if (itemCount === undefined || itemCount === null) {
                console.log('🛒 item_count is undefined, fetching fresh cart data...');
                try {
                    const cartResponse = await fetch('/cart.js');
                    if (cartResponse.ok) {
                        const freshCartData = await cartResponse.json();
                        itemCount = freshCartData.item_count;
                        console.log('🛒 Fresh cart data item_count:', itemCount);
                    }
                } catch (error) {
                    console.log('❌ Failed to fetch fresh cart data:', error);
                    // Fallback: try to calculate from items
                    if (cartData.items && Array.isArray(cartData.items)) {
                        itemCount = cartData.items.reduce((total, item) => total + (item.quantity || 0), 0);
                        console.log('🛒 Calculated item_count from items:', itemCount);
                    }
                }
            }

            console.log('🛒 Final item_count to use:', itemCount);

            // Dispatch the standard Shopify cart:updated event that themes listen for
            document.dispatchEvent(new CustomEvent('cart:updated', {
                detail: {
                    cart: { ...cartData, item_count: itemCount },
                    source: 'sticky-bar'
                }
            }));

            // Also dispatch the cart:build event that some themes use
            document.dispatchEvent(new CustomEvent('cart:build', {
                detail: {
                    cart: { ...cartData, item_count: itemCount },
                    source: 'sticky-bar'
                }
            }));

            // Try to trigger theme-specific cart update methods
            if (window.theme && typeof window.theme.cartUpdate === 'function') {
                window.theme.cartUpdate({ ...cartData, item_count: itemCount });
            }

            if (window.Shopify && window.Shopify.theme && typeof window.Shopify.theme.cartUpdate === 'function') {
                window.Shopify.theme.cartUpdate({ ...cartData, item_count: itemCount });
            }

            // Update cart count using Shopify's standard approach
            this.updateCartCountElements(itemCount);

            console.log('✅ Shopify native cart count update completed');

        } catch (error) {
            console.error('❌ Failed to update Shopify cart count:', error);
        }
    }

    // Update cart count elements using Shopify's standard selectors
    updateCartCountElements(itemCount) {
        try {
            console.log(`🛒 Updating cart count elements to: ${itemCount}`);

            // First, ensure the cart-count-bubble element exists
            this.ensureCartCountBubbleExists(itemCount);

            // Shopify's standard cart count selectors
            const cartCountSelectors = [
                '.cart-count',
                '.cart-count-bubble',
                '[data-cart-count]',
                '.header__cart-count',
                '.site-header__cart-count',
                '.cart-icon-bubble',
                '.cart-badge',
                '.cart-notification-badge'
            ];

            let updatedElements = 0;

            for (const selector of cartCountSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    element.textContent = itemCount;
                    // Let the theme handle display and styling
                    if (itemCount > 0) {
                        element.style.display = '';
                        element.style.visibility = '';
                    } else {
                        element.style.display = 'none';
                    }
                    updatedElements++;
                    console.log(`✅ Updated cart count element: ${selector}`);
                }
            }

            // Also update any elements with cart count in their text content
            const cartLinks = document.querySelectorAll('a[href*="/cart"], .cart-link, .cart-icon');
            for (const cartLink of cartLinks) {
                const countElements = cartLink.querySelectorAll('.count, .badge, [data-count]');
                for (const countEl of countElements) {
                    countEl.textContent = itemCount;
                    // Let the theme handle display and styling
                    if (itemCount > 0) {
                        countEl.style.display = '';
                    } else {
                        countEl.style.display = 'none';
                    }
                    updatedElements++;
                }
            }

            console.log(`✅ Updated ${updatedElements} cart count elements`);

        } catch (error) {
            console.error('❌ Failed to update cart count elements:', error);
        }
    }

    // Ensure cart-count-bubble element exists in the DOM
    ensureCartCountBubbleExists(itemCount) {
        try {
            console.log('🛒 Ensuring cart-count-bubble element exists...');
            console.log('🛒 Current item count:', itemCount);

            // Handle undefined item count
            if (itemCount === undefined || itemCount === null) {
                console.log('🛒 item_count is undefined, skipping cart-count-bubble creation');
                return;
            }

            // Check if cart-count-bubble already exists
            let cartCountBubble = document.querySelector('.cart-count-bubble');
            console.log('🛒 Existing cart-count-bubble found:', !!cartCountBubble);

            if (!cartCountBubble && itemCount > 0) {
                console.log('🛒 cart-count-bubble not found, creating it...');

                // Find the cart icon/link to attach the bubble to
                const cartSelectors = [
                    'a[href*="/cart"]',
                    '.cart-link',
                    '.cart-icon',
                    '[data-cart-link]',
                    '.header__cart',
                    '.site-header__cart',
                    '.cart-drawer-toggle',
                    '.cart-toggle',
                    'header a[href*="/cart"]',
                    'nav a[href*="/cart"]',
                    '.main-header a[href*="/cart"]',
                    '.page-header a[href*="/cart"]'
                ];

                let cartElement = null;
                for (const selector of cartSelectors) {
                    cartElement = document.querySelector(selector);
                    if (cartElement) {
                        console.log(`🛒 Found cart element: ${selector}`);
                        console.log('🛒 Cart element:', cartElement);
                        break;
                    }
                }

                if (cartElement) {
                    // Create the cart-count-bubble element
                    cartCountBubble = document.createElement('span');
                    cartCountBubble.className = 'cart-count-bubble';
                    cartCountBubble.setAttribute('data-cart-count', itemCount);
                    cartCountBubble.textContent = itemCount;

                    // Let the theme handle the styling - no inline styles

                    // Ensure parent has relative positioning
                    const computedStyle = getComputedStyle(cartElement);
                    console.log('🛒 Cart element position:', computedStyle.position);
                    if (computedStyle.position === 'static') {
                        cartElement.style.position = 'relative';
                        console.log('🛒 Set cart element position to relative');
                    }

                    cartElement.appendChild(cartCountBubble);
                    console.log('✅ Created cart-count-bubble element');
                    console.log('🛒 Cart-count-bubble element:', cartCountBubble);
                    console.log('🛒 Cart-count-bubble parent:', cartCountBubble.parentElement);

                    // Force a re-render
                    cartCountBubble.style.display = 'none';
                    setTimeout(() => {
                        cartCountBubble.style.display = 'flex';
                        console.log('🛒 Forced cart-count-bubble re-render');
                    }, 10);

                } else {
                    console.log('⚠️ No cart element found to attach cart-count-bubble to');
                    console.log('🛒 Available cart-related elements:');
                    const allCartElements = document.querySelectorAll('a[href*="cart"], [class*="cart"], [id*="cart"]');
                    allCartElements.forEach((el, index) => {
                        console.log(`  ${index + 1}. ${el.tagName} - ${el.className} - ${el.id} - ${el.href || 'no href'}`);
                    });

                    // Last resort: create a floating cart count bubble
                    console.log('🛒 Creating floating cart-count-bubble as last resort...');
                    cartCountBubble = document.createElement('span');
                    cartCountBubble.className = 'cart-count-bubble';
                    cartCountBubble.setAttribute('data-cart-count', itemCount);
                    cartCountBubble.textContent = itemCount;

                    // Let the theme handle the styling - no inline styles

                    document.body.appendChild(cartCountBubble);
                    console.log('✅ Created floating cart-count-bubble');
                }
            } else if (cartCountBubble) {
                console.log('✅ cart-count-bubble already exists');
                cartCountBubble.textContent = itemCount;
                cartCountBubble.style.display = itemCount > 0 ? 'flex' : 'none';
            }

        } catch (error) {
            console.error('❌ Failed to ensure cart-count-bubble exists:', error);
        }
    }


    // Synchronize cart count with theme's native system
    async synchronizeCartCountWithTheme() {
        try {
            console.log('🛒 Synchronizing cart count with theme...');

            // Get fresh cart data immediately
            const response = await fetch('/cart.js');
            if (response.ok) {
                const cartData = await response.json();
                const itemCount = cartData.item_count || 0;
                console.log('🛒 Synchronizing with cart item count:', itemCount);

                // Dispatch theme-specific cart update events
                this.dispatchThemeCartEvents(cartData);

                // Update cart count elements using theme's expected selectors
                this.updateThemeCartCountElements(itemCount);

                console.log('✅ Cart count synchronized with theme');
            } else {
                console.error('❌ Failed to fetch cart data for synchronization');
            }

        } catch (error) {
            console.error('❌ Failed to synchronize cart count:', error);
        }
    }

    // Dispatch theme-specific cart events
    dispatchThemeCartEvents(cartData) {
        try {
            console.log('🛒 Dispatching theme cart events...');

            // Common theme cart events
            const themeEvents = [
                'cart:updated',
                'cart:build',
                'cart:refresh',
                'cart:open',
                'cart:data',
                'cart:section:updated',
                'cart:count:updated',
                'cart:item:added',
                'cart:change',
                'cart:update'
            ];

            themeEvents.forEach(eventName => {
                document.dispatchEvent(new CustomEvent(eventName, {
                    detail: {
                        cart: cartData,
                        source: 'sticky-bar-sync'
                    }
                }));
            });

            // Try to call theme-specific functions
            const themeFunctions = [
                'updateCart',
                'cartUpdate',
                'refreshCart',
                'updateCartCount',
                'cartCountUpdate',
                'cartRefresh',
                'cartRebuild'
            ];

            themeFunctions.forEach(funcName => {
                if (window[funcName] && typeof window[funcName] === 'function') {
                    try {
                        window[funcName](cartData);
                        console.log(`✅ Called theme function: ${funcName}`);
                    } catch (error) {
                        console.log(`⚠️ Theme function ${funcName} failed:`, error);
                    }
                }
            });

            console.log('✅ Theme cart events dispatched');

        } catch (error) {
            console.error('❌ Failed to dispatch theme cart events:', error);
        }
    }

    // Update cart count elements using theme's expected selectors
    updateThemeCartCountElements(itemCount) {
        try {
            console.log(`🛒 Updating theme cart count elements: ${itemCount}`);

            // Theme-specific cart count selectors
            const themeSelectors = [
                '.cart-count',
                '.cart-count-bubble',
                '[data-cart-count]',
                '.header__cart-count',
                '.site-header__cart-count',
                '.cart-icon-bubble',
                '.cart-badge',
                '.cart-notification-badge',
                '.cart-link .count',
                '.cart-icon .count',
                '.cart-drawer-toggle .count',
                '.cart-toggle .count',
                '.cart-button .count',
                '.cart-bag .count',
                '.shopping-cart .count'
            ];

            let updatedCount = 0;

            themeSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    // Only update if this looks like a cart count element
                    const parent = element.closest('a[href*="/cart"], .cart-link, .cart-icon, .header__cart, .site-header__cart, .cart-drawer-toggle, .cart-toggle');
                    if (parent || selector.includes('cart')) {
                        element.textContent = itemCount;
                        // Let the theme handle display and styling
                        if (itemCount > 0) {
                            element.style.display = '';
                        } else {
                            element.style.display = 'none';
                        }
                        updatedCount++;
                        console.log(`✅ Updated theme cart count: ${selector}`);
                    }
                });
            });

            console.log(`✅ Updated ${updatedCount} theme cart count elements`);

        } catch (error) {
            console.error('❌ Failed to update theme cart count elements:', error);
        }
    }

    // Trigger Shopify's native cart update system
    triggerShopifyCartUpdate(cartData) {
        try {
            console.log('🛒 Triggering Shopify native cart update...');

            // Dispatch all the standard Shopify cart events
            const events = [
                'cart:updated',
                'cart:build',
                'cart:refresh',
                'cart:open',
                'cart:data',
                'cart:section:updated'
            ];

            for (const eventName of events) {
                document.dispatchEvent(new CustomEvent(eventName, {
                    detail: {
                        cart: cartData,
                        source: 'sticky-bar'
                    }
                }));
            }

            // Try to call theme-specific cart update functions
            const themeFunctions = [
                'updateCart',
                'cartUpdate',
                'refreshCart',
                'updateCartCount',
                'cartCountUpdate'
            ];

            for (const funcName of themeFunctions) {
                if (window[funcName] && typeof window[funcName] === 'function') {
                    try {
                        window[funcName](cartData);
                        console.log(`✅ Called theme function: ${funcName}`);
                    } catch (error) {
                        console.log(`⚠️ Theme function ${funcName} failed:`, error);
                    }
                }
            }

            // Try to trigger cart drawer refresh if it exists
            const cartDrawer = document.querySelector('cart-drawer, .cart-drawer, #cart-drawer');
            if (cartDrawer) {
                if (typeof cartDrawer.refresh === 'function') {
                    cartDrawer.refresh();
                }
                if (typeof cartDrawer.update === 'function') {
                    cartDrawer.update(cartData);
                }
            }

            console.log('✅ Shopify native cart update triggered');

        } catch (error) {
            console.error('❌ Failed to trigger Shopify cart update:', error);
        }
    }

    // Legacy method - keeping for fallback
    async forceUpdateCartCount(cartData) {
        try {
            const itemCount = cartData.item_count || 0;
            console.log(`🛒 Force updating cart count to: ${itemCount}`);

            // Comprehensive list of cart count selectors
            const countSelectors = [
                // Standard cart count selectors
                '.cart-count',
                '.cart-badge',
                '.header__cart-count',
                '.site-header__cart-count',
                '[data-cart-count]',
                '.cart-drawer-toggle .count',
                '.cart-toggle .count',
                '.cart-link .count',
                '.cart-icon .count',

                // Theme-specific selectors
                '.cart-icon-bubble',
                '.cart-count-bubble',
                '[data-cart-icon-bubble]',
                '.header__cart .count',
                '.site-header__cart .count',
                '.cart-drawer-toggle .badge',
                '.cart-toggle .badge',

                // Generic count selectors
                '.count',
                '.badge',
                '[data-count]',
                '.notification-badge',
                '.cart-notification'
            ];

            let updatedCount = 0;

            // Update all found count elements
            for (const selector of countSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    // Check if this element is likely a cart count (not other counts on the page)
                    const parent = element.closest('a[href*="/cart"], .cart-link, .cart-icon, .header__cart, .site-header__cart, .cart-drawer-toggle, .cart-toggle');
                    if (parent || selector.includes('cart')) {
                        element.textContent = itemCount;
                        element.style.display = itemCount === 0 ? 'none' : 'block';
                        updatedCount++;
                        console.log(`✅ Updated cart count element: ${selector}`);
                    }
                }
            }

            // If no cart count elements found, try to add one to cart links
            if (updatedCount === 0) {
                console.log('🛒 No cart count elements found, adding count to cart links...');
                await this.addCartCountToLinks(itemCount);
            }

            // Also dispatch a custom event for themes that listen for cart count changes
            document.dispatchEvent(new CustomEvent('cart:count-updated', {
                detail: {
                    count: itemCount,
                    source: 'sticky-bar'
                }
            }));

            console.log(`✅ Force updated ${updatedCount} cart count elements`);

        } catch (error) {
            console.error('❌ Failed to force update cart count:', error);
        }
    }

    // Add cart count to cart links when no count elements exist
    async addCartCountToLinks(itemCount) {
        try {
            const cartLinks = document.querySelectorAll(
                'a[href*="/cart"], .cart-link, .cart-icon, [data-cart-link], .header__cart, .site-header__cart, .cart-drawer-toggle, .cart-toggle'
            );

            for (const cartLink of cartLinks) {
                // Check if this link already has a count
                const existingCount = cartLink.querySelector('.count, .cart-count, .badge, [data-count]');
                if (!existingCount && itemCount > 0) {
                    const countEl = document.createElement('span');
                    countEl.className = 'cart-count';
                    countEl.setAttribute('data-cart-count', itemCount);
                    countEl.textContent = itemCount;
                    countEl.style.cssText = `
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        background: #ff4444;
                        color: white;
                        border-radius: 50%;
                        min-width: 18px;
                        height: 18px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: bold;
                        z-index: 10;
                    `;

                    // Ensure parent has relative positioning
                    if (getComputedStyle(cartLink).position === 'static') {
                        cartLink.style.position = 'relative';
                    }

                    cartLink.appendChild(countEl);
                    console.log('✅ Added cart count to cart link');
                }
            }
        } catch (error) {
            console.error('❌ Failed to add cart count to links:', error);
        }
    }

    // Ensure cart count visibility with aggressive approach
    async ensureCartCountVisibility(cartData) {
        try {
            const itemCount = cartData.item_count || 0;
            console.log(`🛒 Ensuring cart count visibility for count: ${itemCount}`);

            // Find all possible cart icons/links
            const cartSelectors = [
                'a[href*="/cart"]',
                '.cart-link',
                '.cart-icon',
                '[data-cart-link]',
                '.header__cart',
                '.site-header__cart',
                '.cart-drawer-toggle',
                '.cart-toggle',
                '.cart-button',
                '.cart-bag',
                '.shopping-cart',
                '.cart-icon-link'
            ];

            let cartElements = [];
            for (const selector of cartSelectors) {
                const elements = document.querySelectorAll(selector);
                cartElements.push(...elements);
            }

            console.log(`🛒 Found ${cartElements.length} cart elements`);

            for (const cartElement of cartElements) {
                // Check if this element already has a count
                let existingCount = cartElement.querySelector('.count, .cart-count, .badge, [data-count], .cart-badge, .notification-badge');

                if (existingCount) {
                    // Update existing count
                    existingCount.textContent = itemCount;
                    existingCount.style.display = itemCount > 0 ? 'block' : 'none';
                    existingCount.style.visibility = itemCount > 0 ? 'visible' : 'hidden';
                    console.log(`✅ Updated existing cart count: ${itemCount}`);
                } else if (itemCount > 0) {
                    // Create new count element
                    const countEl = document.createElement('span');
                    countEl.className = 'cart-count';
                    countEl.setAttribute('data-cart-count', itemCount);
                    countEl.textContent = itemCount;
                    countEl.style.cssText = `
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        background: #ff4444;
                        color: white;
                        border-radius: 50%;
                        min-width: 18px;
                        height: 18px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: bold;
                        z-index: 1000;
                        line-height: 1;
                        padding: 2px;
                        box-sizing: border-box;
                    `;

                    // Ensure parent has relative positioning
                    const computedStyle = getComputedStyle(cartElement);
                    if (computedStyle.position === 'static') {
                        cartElement.style.position = 'relative';
                    }

                    cartElement.appendChild(countEl);
                    console.log(`✅ Created new cart count: ${itemCount}`);
                }
            }

            // Also try to find and update any standalone count elements
            const standaloneCountSelectors = [
                '.cart-count',
                '.cart-badge',
                '.header__cart-count',
                '.site-header__cart-count',
                '[data-cart-count]',
                '.cart-icon-bubble',
                '.cart-count-bubble',
                '[data-cart-icon-bubble]'
            ];

            for (const selector of standaloneCountSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    element.textContent = itemCount;
                    element.style.display = itemCount > 0 ? 'block' : 'none';
                    element.style.visibility = itemCount > 0 ? 'visible' : 'hidden';
                    console.log(`✅ Updated standalone cart count: ${selector}`);
                }
            }

            // Force a re-render by temporarily hiding and showing cart elements
            for (const cartElement of cartElements) {
                const countEl = cartElement.querySelector('.count, .cart-count, .badge, [data-count]');
                if (countEl && itemCount > 0) {
                    countEl.style.display = 'none';
                    setTimeout(() => {
                        countEl.style.display = 'flex';
                        countEl.style.visibility = 'visible';
                    }, 10);
                }
            }

            console.log(`✅ Ensured cart count visibility for ${itemCount} items`);

        } catch (error) {
            console.error('❌ Failed to ensure cart count visibility:', error);
        }
    }

    // Final cart count check - most aggressive approach
    async finalCartCountCheck(cartData) {
        try {
            const itemCount = cartData.item_count || 0;
            console.log(`🛒 Final cart count check for count: ${itemCount}`);

            // Get fresh cart data to ensure accuracy
            const cartResponse = await fetch('/cart.js');
            if (cartResponse.ok) {
                const freshCartData = await cartResponse.json();
                const freshItemCount = freshCartData.item_count || 0;
                console.log(`🛒 Fresh cart data shows ${freshItemCount} items`);

                // Find the cart icon in the header (most likely location)
                const headerCartSelectors = [
                    'header a[href*="/cart"]',
                    'header .cart-link',
                    'header .cart-icon',
                    '.header__cart',
                    '.site-header__cart',
                    '.main-header .cart',
                    '.page-header .cart',
                    'nav .cart',
                    '.navigation .cart'
                ];

                let headerCartElement = null;
                for (const selector of headerCartSelectors) {
                    headerCartElement = document.querySelector(selector);
                    if (headerCartElement) {
                        console.log(`🛒 Found header cart element: ${selector}`);
                        break;
                    }
                }

                if (headerCartElement && freshItemCount > 0) {
                    // Check if it already has a count
                    let existingCount = headerCartElement.querySelector('.count, .cart-count, .badge, [data-count], .cart-badge, .notification-badge');

                    if (existingCount) {
                        // Update existing count
                        existingCount.textContent = freshItemCount;
                        existingCount.style.display = 'block';
                        existingCount.style.visibility = 'visible';
                        existingCount.style.opacity = '1';
                        console.log(`✅ Updated existing header cart count: ${freshItemCount}`);
                    } else {
                        // Create a very visible count badge
                        const countEl = document.createElement('span');
                        countEl.className = 'cart-count-badge';
                        countEl.setAttribute('data-cart-count', freshItemCount);
                        countEl.textContent = freshItemCount;
                        countEl.style.cssText = `
                            position: absolute;
                            top: -10px;
                            right: -10px;
                            background: #ff0000;
                            color: white;
                            border-radius: 50%;
                            min-width: 20px;
                            height: 20px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 11px;
                            font-weight: bold;
                            z-index: 9999;
                            line-height: 1;
                            padding: 0;
                            box-sizing: border-box;
                            border: 2px solid white;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        `;

                        // Ensure parent has relative positioning
                        if (getComputedStyle(headerCartElement).position === 'static') {
                            headerCartElement.style.position = 'relative';
                        }

                        headerCartElement.appendChild(countEl);
                        console.log(`✅ Created new header cart count badge: ${freshItemCount}`);
                    }
                }

                // Also try to update any cart count elements that might be in the header
                const headerCountSelectors = [
                    'header .cart-count',
                    'header .cart-badge',
                    'header [data-cart-count]',
                    '.header__cart-count',
                    '.site-header__cart-count',
                    '.main-header .cart-count',
                    '.page-header .cart-count'
                ];

                for (const selector of headerCountSelectors) {
                    const elements = document.querySelectorAll(selector);
                    for (const element of elements) {
                        element.textContent = freshItemCount;
                        element.style.display = freshItemCount > 0 ? 'block' : 'none';
                        element.style.visibility = freshItemCount > 0 ? 'visible' : 'hidden';
                        element.style.opacity = freshItemCount > 0 ? '1' : '0';
                        console.log(`✅ Updated header count element: ${selector}`);
                    }
                }

                console.log(`✅ Final cart count check completed for ${freshItemCount} items`);
            }

        } catch (error) {
            console.error('❌ Failed final cart count check:', error);
        }
    }

    // Update cart live region text
    async updateCartLiveRegionText(htmlContent) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            const newLiveRegion = doc.querySelector('[data-cart-live-region-text], .cart-live-region-text');

            if (newLiveRegion) {
                const existingLiveRegion = document.querySelector('[data-cart-live-region-text], .cart-live-region-text');
                if (existingLiveRegion) {
                    existingLiveRegion.outerHTML = newLiveRegion.outerHTML;
                    console.log('✅ Cart live region text updated');
                }
            }
        } catch (error) {
            console.error('❌ Failed to update cart live region text:', error);
        }
    }

    // Update cart drawer using Shopify's standard approach (fallback)
    async updateCartDrawer(cartItem) {
        console.log('🛒 Updating cart drawer with Shopify standard approach...');

        try {
            // Step 1: Fetch the updated cart data
            const cartResponse = await fetch('/cart.js');
            if (!cartResponse.ok) {
                throw new Error('Failed to fetch cart data');
            }

            const cartData = await cartResponse.json();
            console.log('🛒 Updated cart data:', cartData);

            // Step 2: Dispatch the standard Shopify cart:updated event
            document.dispatchEvent(new CustomEvent('cart:updated', {
                detail: {
                    cart: cartData,
                    source: 'sticky-bar'
                }
            }));

            // Step 3: Try to find and update cart sections
            this.updateCartSections(cartData);

            // Step 4: Force cart drawer content refresh with multiple attempts
            let refreshSuccess = false;
            for (let attempt = 1; attempt <= 3; attempt++) {
                console.log(`🔄 Cart drawer refresh attempt ${attempt}/3...`);
                refreshSuccess = await this.refreshCartDrawerContent(cartData);
                if (refreshSuccess) {
                    console.log(`✅ Cart drawer refreshed successfully on attempt ${attempt}`);
                    break;
                }
                // Wait a bit before retry
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            // Step 5: Handle empty cart scenario
            if (cartData.item_count === 1) {
                console.log('🛒 First item added to empty cart, ensuring drawer structure...');
                await this.ensureCartDrawerStructure();
            }

            // Step 6: Force a complete cart drawer rebuild if refresh failed
            if (!refreshSuccess) {
                console.log('🔄 Refresh failed, attempting complete cart drawer rebuild...');
                await this.rebuildCartDrawer(cartData);
            }

            // Step 7: Open the cart drawer with forced refresh
            await this.openCartDrawerWithRefresh();

        } catch (error) {
            console.error('❌ Failed to update cart drawer:', error);
            // Fallback to simple cart drawer opening
            this.openCartDrawer();
        }
    }

    // Update cart sections with fresh data
    updateCartSections(cartData) {
        console.log('🔄 Updating cart sections...');

        // Find all cart sections and update them
        const cartSections = document.querySelectorAll('[data-cart-section], .cart-section, #cart-section');

        cartSections.forEach(section => {
            console.log('🔄 Updating cart section:', section);

            // Try to trigger section refresh
            if (typeof section.refresh === 'function') {
                section.refresh(cartData);
            }

            // Dispatch section-specific events
            section.dispatchEvent(new CustomEvent('cart:section:updated', {
                detail: { cart: cartData }
            }));
        });

        // Update cart count badges
        this.updateCartCount(cartData.item_count);

        // Update cart total
        this.updateCartTotal(cartData.total_price);
    }

    // Update cart count badges
    updateCartCount(count) {
        const countElements = document.querySelectorAll(
            '.cart-count, [data-cart-count], .cart-item-count, .cart-badge-count'
        );

        countElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'block' : 'none';
        });
    }

    // Update cart total
    updateCartTotal(total) {
        const totalElements = document.querySelectorAll(
            '.cart-total, [data-cart-total], .cart-subtotal, .cart-price'
        );

        const formattedTotal = this.formatMoney(total);

        totalElements.forEach(element => {
            element.textContent = formattedTotal;
        });
    }

    // Format money according to Shopify's format
    formatMoney(cents) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(cents / 100);
    }

    // Force refresh cart drawer content with fresh data
    async refreshCartDrawerContent(cartData) {
        console.log('🔄 Force refreshing cart drawer content...');

        try {
            // Method 1: Use Shopify's section_id approach (recommended for empty cart)
            const sectionResponse = await fetch('/?section_id=cart-drawer');
            if (sectionResponse.ok) {
                const sectionHTML = await sectionResponse.text();
                console.log('🔄 Fetched cart drawer section HTML, updating content...');

                // Parse the section HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(sectionHTML, 'text/html');
                const newCartDrawer = doc.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');
                const existingCartDrawer = document.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');

                if (newCartDrawer && existingCartDrawer) {
                    console.log('🔄 Found cart drawer section, updating HTML content...');
                    existingCartDrawer.innerHTML = newCartDrawer.innerHTML;
                    return true;
                }
            }
        } catch (error) {
            console.log('❌ Failed to fetch cart drawer section:', error);
        }

        try {
            // Method 2: Try to fetch cart drawer HTML directly
            const drawerResponse = await fetch('/cart?view=drawer');
            if (drawerResponse.ok) {
                const drawerHTML = await drawerResponse.text();
                console.log('🔄 Fetched cart drawer HTML, updating content...');

                // Find cart drawer and update its content
                const cartDrawer = document.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');
                if (cartDrawer) {
                    console.log('🔄 Found cart drawer, updating HTML content...');
                    cartDrawer.innerHTML = drawerHTML;
                    return true;
                }
            }
        } catch (error) {
            console.log('❌ Failed to fetch cart drawer HTML:', error);
        }

        try {
            // Method 3: Try to fetch cart page and extract drawer content
            const cartPageResponse = await fetch('/cart');
            if (cartPageResponse.ok) {
                const cartPageHTML = await cartPageResponse.text();
                console.log('🔄 Fetched cart page HTML, extracting drawer content...');

                // Create a temporary element to parse the HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = cartPageHTML;

                // Look for cart drawer content in the page
                const cartDrawerContent = tempDiv.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');
                if (cartDrawerContent) {
                    const cartDrawer = document.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');
                    if (cartDrawer) {
                        console.log('🔄 Found cart drawer in page, updating content...');
                        cartDrawer.innerHTML = cartDrawerContent.innerHTML;
                        return true;
                    }
                }
            }
        } catch (error) {
            console.log('❌ Failed to fetch cart page HTML:', error);
        }

        try {
            // Method 4: Try to manually update cart drawer with cart data
            const cartDrawer = document.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');
            if (cartDrawer) {
                console.log('🔄 Manually updating cart drawer with cart data...');

                // Try to call cart drawer update methods
                if (typeof cartDrawer.updateCart === 'function') {
                    cartDrawer.updateCart(cartData);
                    return true;
                }

                if (typeof cartDrawer.render === 'function') {
                    cartDrawer.render(cartData);
                    return true;
                }

                if (typeof cartDrawer.refresh === 'function') {
                    cartDrawer.refresh(cartData);
                    return true;
                }

                // Try to trigger cart drawer refresh events
                cartDrawer.dispatchEvent(new CustomEvent('cart:refresh', {
                    detail: { cart: cartData }
                }));

                cartDrawer.dispatchEvent(new CustomEvent('cart:updated', {
                    detail: { cart: cartData }
                }));

                return true;
            }
        } catch (error) {
            console.log('❌ Failed to manually update cart drawer:', error);
        }

        console.log('⚠️ Could not refresh cart drawer content');
        return false;
    }

    // Complete cart drawer rebuild as last resort
    async rebuildCartDrawer(cartData) {
        console.log('🔄 Rebuilding cart drawer completely...');

        try {
            // Method 1: Try to fetch the entire cart page and replace the drawer
            const cartPageResponse = await fetch('/cart');
            if (cartPageResponse.ok) {
                const cartPageHTML = await cartPageResponse.text();
                console.log('🔄 Fetched full cart page for rebuild...');

                // Parse the cart page
                const parser = new DOMParser();
                const doc = parser.parseFromString(cartPageHTML, 'text/html');

                // Find cart drawer in the page
                const newCartDrawer = doc.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');
                const existingCartDrawer = document.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');

                if (newCartDrawer && existingCartDrawer) {
                    console.log('🔄 Replacing cart drawer with fresh content...');

                    // Store the parent and next sibling for proper replacement
                    const parent = existingCartDrawer.parentNode;
                    const nextSibling = existingCartDrawer.nextSibling;

                    // Remove the old cart drawer
                    existingCartDrawer.remove();

                    // Insert the new cart drawer
                    if (nextSibling) {
                        parent.insertBefore(newCartDrawer, nextSibling);
                    } else {
                        parent.appendChild(newCartDrawer);
                    }

                    // Reinitialize the cart drawer
                    this.initializeCartDrawerEvents(newCartDrawer);

                    console.log('✅ Cart drawer rebuilt successfully');
                    return true;
                }
            }
        } catch (error) {
            console.log('❌ Failed to rebuild cart drawer:', error);
        }

        try {
            // Method 2: Try to force a page reload of just the cart drawer section
            const sectionResponse = await fetch('/?section_id=cart-drawer');
            if (sectionResponse.ok) {
                const sectionHTML = await sectionResponse.text();
                console.log('🔄 Fetched cart drawer section for rebuild...');

                // Parse the section
                const parser = new DOMParser();
                const doc = parser.parseFromString(sectionHTML, 'text/html');
                const newCartDrawer = doc.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');
                const existingCartDrawer = document.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');

                if (newCartDrawer && existingCartDrawer) {
                    console.log('🔄 Replacing cart drawer section...');

                    // Replace the entire cart drawer
                    existingCartDrawer.outerHTML = newCartDrawer.outerHTML;

                    // Get the new cart drawer element
                    const updatedCartDrawer = document.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');
                    if (updatedCartDrawer) {
                        this.initializeCartDrawerEvents(updatedCartDrawer);
                        console.log('✅ Cart drawer section rebuilt successfully');
                        return true;
                    }
                }
            }
        } catch (error) {
            console.log('❌ Failed to rebuild cart drawer section:', error);
        }

        console.log('⚠️ Could not rebuild cart drawer');
        return false;
    }

    // Ensure cart drawer has proper structure for empty cart scenarios
    async ensureCartDrawerStructure() {
        console.log('🛒 Ensuring cart drawer structure for empty cart...');

        try {
            // Method 1: Try to fetch the complete cart drawer section
            const sectionResponse = await fetch('/?section_id=cart-drawer');
            if (sectionResponse.ok) {
                const sectionHTML = await sectionResponse.text();
                console.log('🛒 Fetched complete cart drawer section...');

                // Parse the section HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(sectionHTML, 'text/html');
                const newCartDrawer = doc.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');

                if (newCartDrawer) {
                    // Check if cart drawer exists in DOM
                    let existingCartDrawer = document.querySelector('cart-drawer, .cart-drawer, #cart-drawer, [data-cart-drawer]');

                    if (!existingCartDrawer) {
                        console.log('🛒 Cart drawer not found in DOM, creating it...');
                        // Create the cart drawer if it doesn't exist
                        document.body.appendChild(newCartDrawer);
                        existingCartDrawer = newCartDrawer;
                    } else {
                        console.log('🛒 Cart drawer exists, updating structure...');
                        // Update the existing cart drawer with complete structure
                        existingCartDrawer.innerHTML = newCartDrawer.innerHTML;
                    }

                    // Ensure cart drawer has proper event listeners
                    this.initializeCartDrawerEvents(existingCartDrawer);

                    return true;
                }
            }
        } catch (error) {
            console.log('❌ Failed to ensure cart drawer structure:', error);
        }

        return false;
    }

    // Initialize cart drawer event listeners
    initializeCartDrawerEvents(cartDrawer) {
        console.log('🛒 Initializing cart drawer event listeners...');

        try {
            // Dispatch cart:refresh event to initialize the drawer
            cartDrawer.dispatchEvent(new CustomEvent('cart:refresh', {
                bubbles: true,
                detail: { source: 'sticky-bar' }
            }));

            // Dispatch cart:updated event
            cartDrawer.dispatchEvent(new CustomEvent('cart:updated', {
                bubbles: true,
                detail: { source: 'sticky-bar' }
            }));

            // Try to trigger theme-specific initialization
            if (typeof cartDrawer.initialize === 'function') {
                cartDrawer.initialize();
            }

            if (typeof cartDrawer.setup === 'function') {
                cartDrawer.setup();
            }

            console.log('✅ Cart drawer event listeners initialized');
        } catch (error) {
            console.log('❌ Failed to initialize cart drawer events:', error);
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

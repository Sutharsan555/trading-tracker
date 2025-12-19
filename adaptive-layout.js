/**
 * Adaptive Layout Manager
 * Automatically adjusts the interface based on user activity and device
 */

class AdaptiveLayoutManager {
    constructor() {
        this.currentMode = 'default';
        this.currentView = 'dashboard';
        this.init();
    }

    init() {
        // Detect device capabilities
        this.detectInputMethod();

        // Set up view change listeners
        this.setupViewListeners();

        // Set up modal listeners
        this.setupModalListeners();

        // Set up orientation change listener
        window.addEventListener('orientationchange', () => this.handleOrientationChange());
        window.addEventListener('resize', () => this.handleResize());

        // Initialize with current view
        this.updateLayout();
    }

    detectInputMethod() {
        // Detect if device uses touch or mouse
        if (window.matchMedia('(pointer: coarse)').matches) {
            document.body.classList.add('touch-mode');
        } else {
            document.body.classList.add('mouse-mode');
        }
    }

    setupViewListeners() {
        // Listen for view changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active')) {
                    this.currentView = mutation.target.id.replace('view-', '');
                    this.updateLayout();
                }
            });
        });

        // Observe all view sections
        document.querySelectorAll('.view-section').forEach(section => {
            observer.observe(section, { attributes: true, attributeFilter: ['class'] });
        });
    }

    setupModalListeners() {
        const modal = document.getElementById('tradeModal');
        if (modal) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target.style.display === 'flex') {
                        modal.classList.add('active');
                        this.enableFocusMode();
                    } else {
                        modal.classList.remove('active');
                        this.disableFocusMode();
                    }
                });
            });
            observer.observe(modal, { attributes: true, attributeFilter: ['style'] });
        }
    }

    updateLayout() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isLandscape = screenWidth > screenHeight;

        // Apply view-specific optimizations
        this.optimizeForView(this.currentView, screenWidth, isLandscape);
    }

    optimizeForView(view, width, isLandscape) {
        // Remove previous optimizations
        document.body.classList.remove('optimize-dashboard', 'optimize-trades', 'optimize-calendar', 'optimize-reports');

        // Apply view-specific class
        document.body.classList.add(`optimize-${view}`);

        // Apply size-specific optimizations
        if (width < 768) {
            this.optimizeForPhone(view);
        } else if (width < 1024) {
            this.optimizeForTablet(view, isLandscape);
        } else {
            this.optimizeForDesktop(view);
        }
    }

    optimizeForPhone(view) {
        switch (view) {
            case 'dashboard':
                // Hide side widgets, focus on charts
                this.setCompactMode();
                break;
            case 'trades':
                // Optimize table for scrolling
                this.enableHorizontalScroll();
                break;
            case 'calendar':
                // Compact calendar cells
                this.setCompactCalendar();
                break;
            case 'reports':
                // Simplify report controls
                this.setSimplifiedControls();
                break;
        }
    }

    optimizeForTablet(view, isLandscape) {
        if (isLandscape) {
            // Use desktop-like layout
            this.setComfortableMode();
        } else {
            // Use tablet-optimized layout
            this.setBalancedMode();
        }
    }

    optimizeForDesktop(view) {
        this.setComfortableMode();
    }

    setCompactMode() {
        document.body.classList.remove('comfortable-mode', 'balanced-mode');
        document.body.classList.add('compact-mode');
    }

    setBalancedMode() {
        document.body.classList.remove('compact-mode', 'comfortable-mode');
        document.body.classList.add('balanced-mode');
    }

    setComfortableMode() {
        document.body.classList.remove('compact-mode', 'balanced-mode');
        document.body.classList.add('comfortable-mode');
    }

    enableFocusMode() {
        document.body.classList.add('focus-mode');
    }

    disableFocusMode() {
        document.body.classList.remove('focus-mode');
    }

    enableHorizontalScroll() {
        const tables = document.querySelectorAll('.table-container');
        tables.forEach(table => {
            table.style.overflowX = 'auto';
            table.style.webkitOverflowScrolling = 'touch';
        });
    }

    setCompactCalendar() {
        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(day => {
            day.style.minHeight = '60px';
            day.style.fontSize = '0.75rem';
        });
    }

    setSimplifiedControls() {
        const formGroups = document.querySelectorAll('#view-reports .form-group');
        formGroups.forEach(group => {
            group.style.width = '100%';
            group.style.marginBottom = '1rem';
        });
    }

    handleOrientationChange() {
        setTimeout(() => {
            this.updateLayout();
        }, 100);
    }

    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.updateLayout();
        }, 250);
    }

    // Public API for manual mode switching
    setMode(mode) {
        const validModes = ['compact', 'balanced', 'comfortable', 'focus', 'reading'];
        if (validModes.includes(mode)) {
            this.currentMode = mode;
            document.body.className = document.body.className.replace(/\b\w+-mode\b/g, '');
            document.body.classList.add(`${mode}-mode`);
        }
    }

    toggleReadingMode() {
        document.body.classList.toggle('reading-mode');
    }

    toggleLargeText() {
        document.body.classList.toggle('large-text-mode');
    }
}

// Initialize adaptive layout manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.adaptiveLayout = new AdaptiveLayoutManager();
    });
} else {
    window.adaptiveLayout = new AdaptiveLayoutManager();
}

// Expose utility functions globally
window.setLayoutMode = function (mode) {
    if (window.adaptiveLayout) {
        window.adaptiveLayout.setMode(mode);
    }
};

window.toggleReadingMode = function () {
    if (window.adaptiveLayout) {
        window.adaptiveLayout.toggleReadingMode();
    }
};

window.toggleLargeText = function () {
    if (window.adaptiveLayout) {
        window.adaptiveLayout.toggleLargeText();
    }
};

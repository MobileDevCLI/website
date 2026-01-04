/**
 * Sketchbook Android - Utility Functions
 *
 * Shared helper functions used across modules.
 *
 * Location: CODE_MAP.md "Utility Functions"
 * Added: 2025-11-15 (CHANGELOG.md v1.1.0)
 */

// ====================
// KEYBOARD EVENT DISPATCH
// ====================

// Track active keys to prevent duplicate events
const activeKeys = new Set();

/**
 * Dispatches a KeyboardEvent to the document
 * @param {string} code - Key code (e.g., 'KeyW', 'Space')
 * @param {boolean} isPressed - True for keydown, false for keyup
 */
function dispatchKey(code, isPressed) {
    const event = new KeyboardEvent(isPressed ? 'keydown' : 'keyup', {
        code: code,
        key: code,
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(event);
}

/**
 * State-based key dispatch - only fires on state change
 * Prevents duplicate events that cause physics glitches
 *
 * @param {string} code - Key code
 * @param {boolean} pressed - True to press, false to release
 *
 * Technical: Uses Set to track active keys
 * See ARCHITECTURE.md "State-Based Key Dispatch"
 */
function setKey(code, pressed) {
    if (pressed && !activeKeys.has(code)) {
        activeKeys.add(code);
        dispatchKey(code, true);
    } else if (!pressed && activeKeys.has(code)) {
        activeKeys.delete(code);
        dispatchKey(code, false);
    }
}

/**
 * Release all currently pressed keys
 * Useful when losing focus or switching modes
 */
function releaseAllKeys() {
    activeKeys.forEach(code => {
        dispatchKey(code, false);
    });
    activeKeys.clear();
}

// ====================
// WORLD STATE CHECKS
// ====================

/**
 * Check if game world is fully initialized
 * @param {object} world - Sketchbook.World instance
 * @returns {boolean} True if safe to access world.characters[0]
 */
function isWorldReady(world) {
    return world &&
           world.characters &&
           world.characters.length > 0;
}

/**
 * Check if player is currently in a vehicle
 * @param {object} world - Sketchbook.World instance
 * @returns {boolean} True if player is sitting in a vehicle
 */
function isInVehicle(world) {
    if (!isWorldReady(world)) return false;
    const player = world.characters[0];
    return player.occupyingSeat !== null;
}

/**
 * Get current player character
 * @param {object} world - Sketchbook.World instance
 * @returns {object|null} Player character or null if not ready
 */
function getPlayer(world) {
    return isWorldReady(world) ? world.characters[0] : null;
}

// ====================
// MATH UTILITIES
// ====================

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Calculate distance between two points
 * @param {number} x1 - Point 1 X
 * @param {number} y1 - Point 1 Y
 * @param {number} x2 - Point 2 X
 * @param {number} y2 - Point 2 Y
 * @returns {number} Distance in pixels
 */
function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

// ====================
// DOM UTILITIES
// ====================

/**
 * Create a DOM element with attributes
 * @param {string} tag - Element tag name
 * @param {object} attributes - Attributes to set
 * @param {string} textContent - Optional text content
 * @returns {HTMLElement} Created element
 */
function createElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else {
            element.setAttribute(key, value);
        }
    });

    if (textContent) {
        element.textContent = textContent;
    }

    return element;
}

/**
 * Show element with fade-in animation
 * @param {HTMLElement} element - Element to show
 * @param {number} duration - Animation duration in ms
 */
function fadeIn(element, duration = 300) {
    element.style.display = 'block';
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;

    setTimeout(() => {
        element.style.opacity = '1';
    }, 10);
}

/**
 * Hide element with fade-out animation
 * @param {HTMLElement} element - Element to hide
 * @param {number} duration - Animation duration in ms
 */
function fadeOut(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;

    setTimeout(() => {
        element.style.display = 'none';
    }, duration);
}

// ====================
// LOGGING
// ====================

/**
 * Enhanced console log with emoji prefix
 * @param {string} type - Log type (info, warn, error, success)
 * @param {string} message - Log message
 */
function log(type, message) {
    const emojis = {
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
        success: '✅',
        debug: '🔧',
        input: '⌨️',
    };

    const emoji = emojis[type] || '📝';
    console.log(`${emoji} ${message}`);
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.GameUtils = {
        dispatchKey,
        setKey,
        releaseAllKeys,
        isWorldReady,
        isInVehicle,
        getPlayer,
        clamp,
        lerp,
        distance,
        createElement,
        fadeIn,
        fadeOut,
        log,
    };
}

console.log('✅ Utils loaded');

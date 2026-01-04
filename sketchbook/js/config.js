/**
 * Sketchbook Android - Configuration
 *
 * Single source of truth for all tunable values.
 * Modify values here instead of hardcoding throughout codebase.
 *
 * Location: CODE_MAP.md "Configuration Values"
 * Added: 2025-11-15 (CHANGELOG.md v1.1.0)
 */

const CONFIG = {
    // ====================
    // WORLD PHYSICS
    // ====================
    WORLD: {
        gravity: -9.81,  // m/s² (Earth standard)
    },

    // ====================
    // TOUCH CONTROLS
    // ====================
    TOUCH: {
        sensitivity: 0.15,      // Camera rotation speed (0.1 = slow, 0.3 = fast)
        threshold: 30,          // Minimum drag distance to register movement (pixels)
        sprintThreshold: 100,   // Distance to trigger sprint (pixels)
        deadzone: 20,           // Ignore small drags (prevents accidental inputs)

        // Throttle zones (vertical Y position)
        throttleTopZone: 0.3,    // Upper 30% of screen = accelerate
        throttleBottomZone: 0.7, // Lower 30% of screen = brake

        // Quick tap detection (for jump)
        tapMaxDuration: 300,     // Max milliseconds for tap
        tapMaxDistance: 40,      // Max pixel movement for tap
    },

    // ====================
    // GAMEPAD CONTROLS
    // ====================
    GAMEPAD: {
        deadzone: 0.15,            // Stick deadzone (0.0-1.0, prevents drift)
        sprintThreshold: 0.7,      // Stick magnitude to trigger sprint
        cameraSensitivity: 17.0,   // Right stick camera speed
        triggerThreshold: 0.1,     // Minimum trigger press to register

        // Standard gamepad button mapping
        buttonMap: {
            0: 'Space',      // A/Cross - Jump (foot) / Handbrake (vehicle)
            1: 'KeyB',       // B/Circle
            2: 'KeyX',       // X/Square
            3: 'KeyY',       // Y/Triangle
            8: 'Escape',     // Select/Share - Menu
            9: 'KeyF',       // Start/Options - Enter/Exit vehicle
        },
    },

    // ====================
    // CHARACTER DEFAULTS
    // ====================
    CHARACTER: {
        scale: 1.0,           // Visual scale multiplier
        movementSpeed: 4.0,   // Base walk speed
        jumpPower: 4.0,       // Jump force multiplier
        mass: 80,             // Kilograms (affects physics)

        // Slider ranges (for GUI)
        scaleRange: [0.5, 3.0],
        speedRange: [1.0, 16.0],
        jumpRange: [2.0, 20.0],
        gravityRange: [-20, -5],
    },

    // ====================
    // VEHICLE DEFAULTS
    // ====================
    VEHICLES: {
        car: {
            mass: 150,
            scale: 1.0,

            // Geometry
            rideHeight: 0.3,
            trackWidth: 1.0,
            trackLength: 2.0,
            tireDiameter: 0.6,
            tireWidth: 0.3,

            // Performance
            torque: 1000,
            horsepower: 1000,
            topSpeed: 150,
            traction: 1.0,
            suspensionStiffness: 30,

            // Physics properties
            frictionSlip: 5.0,        // Normal tire grip
            frictionSlipDrift: 0.8,   // Drift mode grip

            // Slider ranges
            scaleRange: [0.5, 3.0],
            rideHeightRange: [0.1, 2.0],
            trackWidthRange: [0.5, 3.0],
            trackLengthRange: [0.5, 3.0],
            tireDiameterRange: [0.3, 2.0],
            tireWidthRange: [0.1, 1.0],
            torqueRange: [100, 2000],
            horsepowerRange: [100, 2000],
            topSpeedRange: [50, 500],
            tractionRange: [0.5, 5.0],
            suspensionRange: [10, 200],
        },

        plane: {
            mass: 200,
            scale: 1.0,
            enginePower: 500,
            maxSpeed: 200,
            rollSensitivity: 1.0,
            pitchSensitivity: 1.0,
            yawSensitivity: 1.0,

            // Slider ranges
            scaleRange: [0.5, 3.0],
            enginePowerRange: [50, 500],
            maxSpeedRange: [50, 300],
            sensitivityRange: [0.1, 5.0],
        },

        helicopter: {
            mass: 250,
            scale: 1.0,
            enginePower: 400,
            maxSpeed: 150,
            rollSensitivity: 1.0,
            pitchSensitivity: 1.0,
            yawSensitivity: 1.0,
            liftForce: 300,

            // Slider ranges
            scaleRange: [0.5, 3.0],
            enginePowerRange: [50, 500],
            maxSpeedRange: [50, 300],
            sensitivityRange: [0.1, 5.0],
            liftForceRange: [50, 500],
        },
    },

    // ====================
    // GUI CONFIGURATION
    // ====================
    GUI: {
        // Panel animation
        transitionSpeed: 0.3,  // Seconds for panel fade in/out

        // Debugger
        fpsUpdateInterval: 100,  // Milliseconds between FPS updates
        fpsGoodThreshold: 50,    // Green color above this
        fpsWarningThreshold: 30, // Yellow between this and good
        // Red below warning

        // Console
        maxLogLines: 1000,       // Auto-prune after this many lines
        logScrollDelay: 100,     // Milliseconds before auto-scroll

        // Colors (elegant black/white theme)
        colors: {
            background: 'rgba(0, 0, 0, 0.9)',
            panelBackground: 'rgba(20, 20, 20, 0.95)',
            text: '#ffffff',
            textMuted: '#aaaaaa',
            accent: '#ffffff',
            border: 'rgba(255, 255, 255, 0.1)',
            hover: 'rgba(255, 255, 255, 0.1)',
            active: 'rgba(255, 255, 255, 0.2)',

            // FPS colors
            fpsGood: '#00ff00',
            fpsWarning: '#ffff00',
            fpsBad: '#ff0000',
        },

        // Sizes
        iconSize: 44,           // Touch-friendly button size (dp)
        panelMaxWidth: 400,     // Maximum panel width (px)
        sliderHeight: 40,       // Slider track height
    },

    // ====================
    // PERFORMANCE
    // ====================
    PERFORMANCE: {
        targetFPS: 60,
        maxPhysicsSteps: 10,
        cameraUpdateRate: 60,   // Times per second
    },
};

// Freeze config to prevent accidental modification
Object.freeze(CONFIG);
Object.freeze(CONFIG.WORLD);
Object.freeze(CONFIG.TOUCH);
Object.freeze(CONFIG.GAMEPAD);
Object.freeze(CONFIG.CHARACTER);
Object.freeze(CONFIG.VEHICLES);
Object.freeze(CONFIG.GUI);
Object.freeze(CONFIG.PERFORMANCE);

console.log('✅ Configuration loaded:', CONFIG);

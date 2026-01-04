/**
 * Sketchbook Android - Vehicle State Manager
 *
 * CRITICAL: This prevents state pollution between vehicles.
 * All slider modifications MUST go through this manager.
 *
 * Pattern: WeakMap stores factory defaults per vehicle instance.
 * When slider changes, we multiply from baseline (not current value).
 *
 * Location: CODE_MAP.md "State Management"
 * Added: 2025-11-16 (Phase 1 - Foundation)
 */

/**
 * Vehicle State Manager - Prevents cumulative slider errors
 *
 * Problem this solves:
 * - Without baselines: slider 2x then 1x = 2x (wrong!)
 * - With baselines: slider 2x then 1x = 1x (correct!)
 *
 * Example:
 *   captureBaseline(car) → stores wheelRadius = 0.3
 *   applyProperty(car, 'tireDiameter', 2.0) → wheelRadius = 0.3 * 2.0 = 0.6
 *   applyProperty(car, 'tireDiameter', 1.0) → wheelRadius = 0.3 * 1.0 = 0.3 ✅
 */
class VehicleStateManager {
    constructor() {
        // WeakMap: Automatic garbage collection when vehicle destroyed
        this.baselines = new WeakMap();     // Factory defaults per vehicle
        this.currentValues = new WeakMap(); // Current multipliers per vehicle

        console.log('✅ VehicleStateManager initialized');
    }

    /**
     * Capture factory baseline values for a vehicle
     * Called ONCE per vehicle before any slider modifications
     *
     * @param {object} vehicle - Sketchbook vehicle instance
     * @returns {object} Baseline values or null if failed
     */
    captureBaseline(vehicle) {
        // Already captured?
        if (this.baselines.has(vehicle)) {
            return this.baselines.get(vehicle);
        }

        const type = vehicle._editorType;
        if (!type) {
            console.warn('⚠️ Vehicle has no _editorType, cannot capture baseline');
            return null;
        }

        console.log(`📸 Capturing baseline for ${type}...`);

        const baseline = {};

        // Capture based on vehicle type
        if (type === 'car') {
            baseline.scale = vehicle.scale ? {
                x: vehicle.scale.x,
                y: vehicle.scale.y,
                z: vehicle.scale.z
            } : { x: 1, y: 1, z: 1 };

            if (vehicle.rayCastVehicle) {
                // Capture wheel properties
                if (vehicle.wheels && vehicle.wheels.length > 0) {
                    baseline.wheels = vehicle.wheels.map(wheel => ({
                        radius: wheel.radius,
                        suspensionRestLength: wheel.suspensionRestLength,
                        chassisConnectionPointLocal: wheel.chassisConnectionPointLocal ? {
                            x: wheel.chassisConnectionPointLocal.x,
                            y: wheel.chassisConnectionPointLocal.y,
                            z: wheel.chassisConnectionPointLocal.z
                        } : null
                    }));
                }

                // Capture wheel visuals scale
                if (vehicle.collision && vehicle.collision.children) {
                    baseline.wheelVisuals = [];
                    vehicle.collision.children.forEach(child => {
                        if (child.name && child.name.includes('wheel')) {
                            baseline.wheelVisuals.push({
                                x: child.scale.x,
                                y: child.scale.y,
                                z: child.scale.z
                            });
                        }
                    });
                }

                // Capture engine/physics properties
                baseline.maxEngineForce = vehicle.rayCastVehicle.maxEngineForce || 1000;
                baseline.maxSpeed = vehicle.maxSpeed || 150;
            }

        } else if (type === 'plane' || type === 'helicopter') {
            // Capture aircraft scale
            baseline.scale = vehicle.scale ? {
                x: vehicle.scale.x,
                y: vehicle.scale.y,
                z: vehicle.scale.z
            } : { x: 1, y: 1, z: 1 };

            // Capture physics multipliers (these may not exist yet)
            baseline.enginePowerMultiplier = vehicle.enginePowerMultiplier || 1.0;
            baseline.liftMultiplier = vehicle.liftMultiplier || 1.0;
            baseline.rollMultiplier = vehicle.rollMultiplier || 1.0;
            baseline.pitchMultiplier = vehicle.pitchMultiplier || 1.0;
            baseline.yawMultiplier = vehicle.yawMultiplier || 1.0;

            if (type === 'helicopter') {
                baseline.cyclicsMultiplier = vehicle.cyclicsMultiplier || 1.0;
                baseline.tailRotorMultiplier = vehicle.tailRotorMultiplier || 1.0;
                baseline.maxRPM = vehicle.maxRPM || 300;
                baseline.minRPM = vehicle.minRPM || 50;
            }
        }

        // Store baseline
        this.baselines.set(vehicle, baseline);

        // Initialize current values to 1.0 (no modification)
        const current = {
            scale: 1.0,
            tireDiameter: 1.0,
            tireWidth: 1.0,
            rideHeight: 1.0,
            trackWidth: 1.0,
            trackLength: 1.0,
            torque: 1.0,
            topSpeed: 1.0,
            tractionFront: 1.0,
            tractionRear: 1.0,
            suspensionStiffness: 1.0,
            enginePowerMultiplier: 1.0,
            liftMultiplier: 1.0,
            rollMultiplier: 1.0,
            pitchMultiplier: 1.0,
            yawMultiplier: 1.0,
            cyclicsMultiplier: 1.0,
            tailRotorMultiplier: 1.0
        };
        this.currentValues.set(vehicle, current);

        console.log(`✅ Baseline captured for ${type}:`, baseline);
        return baseline;
    }

    /**
     * Apply a property change to a vehicle
     * ALWAYS multiplies from baseline, never from current value
     *
     * @param {object} vehicle - Sketchbook vehicle instance
     * @param {string} propertyName - Property to modify (e.g., 'scale', 'tireDiameter')
     * @param {number} value - New value (usually a multiplier like 2.0)
     */
    applyProperty(vehicle, propertyName, value) {
        // Ensure baseline exists
        const baseline = this.baselines.get(vehicle);
        if (!baseline) {
            console.error('❌ No baseline for vehicle! Call captureBaseline() first.');
            return;
        }

        const current = this.currentValues.get(vehicle);
        const type = vehicle._editorType;

        // Store current multiplier
        current[propertyName] = value;

        console.log(`🔧 Applying ${propertyName} = ${value} to ${type}`);

        // Apply based on property name
        switch (propertyName) {
            case 'scale':
                if (baseline.scale) {
                    vehicle.setScale(
                        baseline.scale.x * value,
                        baseline.scale.y * value,
                        baseline.scale.z * value
                    );
                }
                break;

            case 'tireDiameter':
                if (type === 'car' && baseline.wheels) {
                    vehicle.wheels.forEach((wheel, i) => {
                        if (baseline.wheels[i]) {
                            wheel.radius = baseline.wheels[i].radius * value * current.scale;
                        }
                    });
                    this._updateWheelVisuals(vehicle, current, baseline);
                }
                break;

            case 'tireWidth':
                if (type === 'car') {
                    this._updateWheelVisuals(vehicle, current, baseline);
                }
                break;

            case 'rideHeight':
                if (type === 'car' && baseline.wheels) {
                    vehicle.wheels.forEach((wheel, i) => {
                        if (baseline.wheels[i]) {
                            wheel.suspensionRestLength = baseline.wheels[i].suspensionRestLength * value * current.scale;
                        }
                    });
                }
                break;

            case 'trackWidth':
                if (type === 'car' && baseline.wheels) {
                    vehicle.wheels.forEach((wheel, i) => {
                        if (baseline.wheels[i]) {
                            const baseX = baseline.wheels[i].chassisConnectionPointLocal.x;
                            wheel.chassisConnectionPointLocal.x = baseX * value * current.scale;
                        }
                    });
                }
                break;

            case 'trackLength':
                if (type === 'car' && baseline.wheels) {
                    vehicle.wheels.forEach((wheel, i) => {
                        if (baseline.wheels[i]) {
                            const baseZ = baseline.wheels[i].chassisConnectionPointLocal.z;
                            wheel.chassisConnectionPointLocal.z = baseZ * value * current.scale;
                        }
                    });
                }
                break;

            case 'torque':
                if (type === 'car' && vehicle.rayCastVehicle) {
                    vehicle.rayCastVehicle.maxEngineForce = baseline.maxEngineForce * value;
                }
                break;

            case 'topSpeed':
                if (type === 'car') {
                    vehicle.maxSpeed = baseline.maxSpeed * value;
                }
                break;

            case 'enginePowerMultiplier':
            case 'liftMultiplier':
            case 'rollMultiplier':
            case 'pitchMultiplier':
            case 'yawMultiplier':
            case 'cyclicsMultiplier':
            case 'tailRotorMultiplier':
                // For aircraft, these are direct property assignments
                // The game engine reads these multipliers
                vehicle[propertyName] = value;
                break;

            case 'maxRPM':
            case 'minRPM':
                if (type === 'helicopter') {
                    vehicle[propertyName] = value; // Absolute value, not multiplier
                }
                break;

            default:
                console.warn(`⚠️ Unknown property: ${propertyName}`);
        }
    }

    /**
     * Update wheel visual scale (combines multiple factors)
     * @private
     */
    _updateWheelVisuals(vehicle, current, baseline) {
        if (!vehicle.collision || !vehicle.collision.children) return;
        if (!baseline.wheelVisuals) return;

        let visualIndex = 0;
        vehicle.collision.children.forEach(child => {
            if (child.name && child.name.includes('wheel')) {
                if (baseline.wheelVisuals[visualIndex]) {
                    const base = baseline.wheelVisuals[visualIndex];

                    // Combine: base * scale * tireDiameter * tireWidth
                    child.scale.x = base.x * current.scale * current.tireWidth;
                    child.scale.y = base.y * current.scale * current.tireDiameter;
                    child.scale.z = base.z * current.scale * current.tireDiameter;

                    visualIndex++;
                }
            }
        });
    }

    /**
     * Reset vehicle to factory defaults
     *
     * @param {object} vehicle - Vehicle to reset
     */
    resetToFactory(vehicle) {
        const baseline = this.baselines.get(vehicle);
        if (!baseline) {
            console.error('❌ No baseline to reset to!');
            return;
        }

        const type = vehicle._editorType;
        console.log(`🔄 Resetting ${type} to factory defaults...`);

        // Reset all current values to 1.0
        const current = this.currentValues.get(vehicle);
        Object.keys(current).forEach(key => {
            current[key] = 1.0;
        });

        // Apply baseline values
        if (type === 'car') {
            this.applyProperty(vehicle, 'scale', 1.0);
            this.applyProperty(vehicle, 'tireDiameter', 1.0);
            this.applyProperty(vehicle, 'tireWidth', 1.0);
            this.applyProperty(vehicle, 'rideHeight', 1.0);
            this.applyProperty(vehicle, 'trackWidth', 1.0);
            this.applyProperty(vehicle, 'trackLength', 1.0);
            this.applyProperty(vehicle, 'torque', 1.0);
            this.applyProperty(vehicle, 'topSpeed', 1.0);
        } else if (type === 'plane' || type === 'helicopter') {
            this.applyProperty(vehicle, 'scale', 1.0);
            this.applyProperty(vehicle, 'enginePowerMultiplier', 1.0);
            this.applyProperty(vehicle, 'liftMultiplier', 1.0);
            this.applyProperty(vehicle, 'rollMultiplier', 1.0);
            this.applyProperty(vehicle, 'pitchMultiplier', 1.0);
            this.applyProperty(vehicle, 'yawMultiplier', 1.0);

            if (type === 'helicopter') {
                this.applyProperty(vehicle, 'cyclicsMultiplier', 1.0);
                this.applyProperty(vehicle, 'tailRotorMultiplier', 1.0);
                this.applyProperty(vehicle, 'maxRPM', baseline.maxRPM);
                this.applyProperty(vehicle, 'minRPM', baseline.minRPM);
            }
        }

        console.log('✅ Reset complete');
    }

    /**
     * Get current multiplier for a property
     *
     * @param {object} vehicle - Vehicle instance
     * @param {string} propertyName - Property name
     * @returns {number} Current multiplier value
     */
    getCurrentValue(vehicle, propertyName) {
        const current = this.currentValues.get(vehicle);
        return current ? current[propertyName] : 1.0;
    }

    /**
     * Check if baseline exists for vehicle
     *
     * @param {object} vehicle - Vehicle instance
     * @returns {boolean} True if baseline captured
     */
    hasBaseline(vehicle) {
        return this.baselines.has(vehicle);
    }
}

// Create global instance
if (typeof window !== 'undefined') {
    window.vehicleState = new VehicleStateManager();
    console.log('✅ VehicleStateManager available globally as window.vehicleState');
}

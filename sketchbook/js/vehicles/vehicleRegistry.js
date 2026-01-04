/**
 * Sketchbook Android - Vehicle Registry
 *
 * Tags vehicles with their types (_editorType property).
 * Prevents fragile hardcoded array index lookups.
 *
 * Location: CODE_MAP.md "Vehicle Management"
 * Added: 2025-11-16 (Phase 1 - Foundation)
 */

/**
 * Tag all vehicles in world with their editor types
 * Called once after world loads
 *
 * @param {object} world - Sketchbook.World instance
 * @returns {object} Tagged vehicle counts
 */
function tagVehicles(world) {
    if (!world || !world.vehicles) {
        console.error('❌ Cannot tag vehicles: world not ready');
        return null;
    }

    const counts = {
        car: 0,
        plane: 0,
        helicopter: 0,
        unknown: 0
    };

    console.log(`🏷️ Tagging ${world.vehicles.length} vehicles...`);

    world.vehicles.forEach((vehicle, index) => {
        // Identify vehicle type by properties
        let type = 'unknown';

        if (vehicle.rayCastVehicle) {
            // Has RaycastVehicle = car
            type = 'car';
            counts.car++;

        } else if (vehicle.rotorSpeed !== undefined || vehicle.cyclicsMultiplier !== undefined) {
            // Has rotor properties = helicopter
            type = 'helicopter';
            counts.helicopter++;

        } else if (vehicle.enginePowerMultiplier !== undefined || vehicle.liftMultiplier !== undefined) {
            // Has aircraft properties but no rotor = plane
            type = 'plane';
            counts.plane++;

        } else {
            // Unknown vehicle type
            type = 'unknown';
            counts.unknown++;
            console.warn(`⚠️ Unknown vehicle type at index ${index}`, vehicle);
        }

        // Tag vehicle
        vehicle._editorType = type;

        console.log(`  [${index}] → ${type}`);
    });

    console.log('✅ Vehicle tagging complete:', counts);
    return counts;
}

/**
 * Find vehicle by editor type
 *
 * @param {object} world - Sketchbook.World instance
 * @param {string} type - Vehicle type ('car', 'plane', 'helicopter')
 * @returns {object|null} First vehicle of that type, or null
 */
function findVehicleByType(world, type) {
    if (!world || !world.vehicles) {
        console.error('❌ Cannot find vehicle: world not ready');
        return null;
    }

    const vehicle = world.vehicles.find(v => v._editorType === type);

    if (!vehicle) {
        console.warn(`⚠️ No ${type} found in world`);
    }

    return vehicle || null;
}

/**
 * Find all vehicles of a specific type
 *
 * @param {object} world - Sketchbook.World instance
 * @param {string} type - Vehicle type ('car', 'plane', 'helicopter')
 * @returns {array} Array of vehicles of that type
 */
function findAllVehiclesByType(world, type) {
    if (!world || !world.vehicles) {
        console.error('❌ Cannot find vehicles: world not ready');
        return [];
    }

    return world.vehicles.filter(v => v._editorType === type);
}

/**
 * Get vehicle type from vehicle instance
 *
 * @param {object} vehicle - Vehicle instance
 * @returns {string|null} Vehicle type or null if not tagged
 */
function getVehicleType(vehicle) {
    return vehicle?._editorType || null;
}

/**
 * Check if vehicle is tagged
 *
 * @param {object} vehicle - Vehicle instance
 * @returns {boolean} True if vehicle has _editorType
 */
function isVehicleTagged(vehicle) {
    return vehicle && typeof vehicle._editorType === 'string';
}

/**
 * Wait for world to be ready, then tag vehicles
 * Returns a promise that resolves when tagging is complete
 *
 * @param {object} world - Sketchbook.World instance
 * @param {number} timeout - Maximum wait time in ms (default 30000)
 * @returns {Promise<object>} Resolves with tag counts, rejects on timeout
 */
function waitAndTagVehicles(world, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        function check() {
            if (world && world.vehicles && world.vehicles.length > 0) {
                // World ready, tag vehicles
                const counts = tagVehicles(world);
                resolve(counts);

            } else if (Date.now() - startTime > timeout) {
                // Timeout
                reject(new Error('Timeout waiting for world to load'));

            } else {
                // Check again in 100ms
                setTimeout(check, 100);
            }
        }

        check();
    });
}

// Export to global scope
if (typeof window !== 'undefined') {
    window.VehicleRegistry = {
        tagVehicles,
        findVehicleByType,
        findAllVehiclesByType,
        getVehicleType,
        isVehicleTagged,
        waitAndTagVehicles
    };
    console.log('✅ VehicleRegistry available globally');
}

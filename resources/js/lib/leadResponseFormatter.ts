/**
 * Utility for formatting lead form responses into human-readable values
 */

interface ModuleConfig {
    options?: Array<{
        title: string;
        value?: string;
        [key: string]: any;
    }>;
    [key: string]: any;
}

interface ModuleConfigs {
    [moduleKey: string]: ModuleConfig;
}

/**
 * Resolves an option ID (like "service-selection_option_0") to its human-readable title
 * @param optionId - The option ID string (e.g., "service-selection_option_0")
 * @param moduleKey - The module key (e.g., "service-selection")
 * @param moduleConfigs - The widget's module configurations
 * @returns The human-readable title or the original ID if not found
 */
export function resolveOptionTitle(
    optionId: string,
    moduleKey: string,
    moduleConfigs: ModuleConfigs
): string {
    // Extract the option index from the ID using regex
    const match = optionId.match(/_option_(\d+)$/);
    if (!match) {
        return optionId; // Return original if pattern doesn't match
    }

    const optionIndex = parseInt(match[1], 10);

    // Get the module config - with fallback for target-challenges
    let moduleConfig = moduleConfigs[moduleKey];

    // Fallback: if target-challenges is missing, use origin-challenges (same options)
    if (!moduleConfig && moduleKey === 'target-challenges' && moduleConfigs['origin-challenges']) {
        moduleConfig = moduleConfigs['origin-challenges'];
    }

    if (!moduleConfig || !moduleConfig.options) {
        return optionId; // Return original if module or options not found
    }

    // Get the option at the specified index
    const option = moduleConfig.options[optionIndex];
    if (!option) {
        return optionId; // Return original if index is out of bounds
    }

    // Return the title or value
    return option.title || option.value || optionId;
}

/**
 * Resolves multiple option IDs to their titles
 * @param optionIds - Array of option ID strings
 * @param moduleKey - The module key
 * @param moduleConfigs - The widget's module configurations
 * @returns Array of human-readable titles
 */
export function resolveOptionTitles(
    optionIds: string[],
    moduleKey: string,
    moduleConfigs: ModuleConfigs
): string[] {
    return optionIds.map(id => resolveOptionTitle(id, moduleKey, moduleConfigs));
}

/**
 * Formats a form response value for display
 * @param key - The response key (e.g., "service-selection")
 * @param value - The response value (can be object, string, array, etc.)
 * @param moduleConfigs - The widget's module configurations
 * @returns Formatted response data
 */
export function formatFormResponse(
    key: string,
    value: any,
    moduleConfigs: ModuleConfigs
): { type: string; data: any } {
    if (!value) {
        return { type: 'empty', data: null };
    }

    // Handle location data
    if (key === 'origin-location' || key === 'target-location') {
        return {
            type: 'location',
            data: {
                address: value.address || 'Not provided',
                coordinates: value.coordinates,
            },
        };
    }

    // Handle date selection
    if (key === 'date-selection') {
        return {
            type: 'date',
            data: value.inputValue || value.selectedDate || 'Not selected',
        };
    }

    // Handle distance calculation
    if (key === 'distance-calculation') {
        return {
            type: 'distance',
            data: {
                distance: value.distance,
                duration: value.duration,
                route: value.route,
            },
        };
    }

    // Handle supply selection
    if (key === 'supply-selection') {
        return {
            type: 'supplies',
            data: {
                needsSupplies: value.needsSupplies,
                selectedSupplies: value.selectedSupplies,
            },
        };
    }

    // Handle challenges (origin-challenges, target-challenges)
    if (key === 'origin-challenges' || key === 'target-challenges') {
        // Handle object with selections array
        if (value.selections && Array.isArray(value.selections)) {
            const resolvedValues = resolveOptionTitles(value.selections, key, moduleConfigs);
            return {
                type: 'multiple-selection',
                data: resolvedValues,
            };
        }
        // Handle direct string option ID (e.g., "target-challenges_option_1")
        if (typeof value === 'string' && value.includes('_option_')) {
            const resolved = resolveOptionTitle(value, key, moduleConfigs);
            return {
                type: 'single-selection',
                data: resolved,
            };
        }
    }

    // Handle additional services (multiple selection with option IDs)
    if (key === 'additional-services' && value.values) {
        const resolvedValues = resolveOptionTitles(value.values, key, moduleConfigs);
        return {
            type: 'multiple-selection',
            data: resolvedValues,
        };
    }

    // Handle review quote confirmation
    if (key === 'review-quote' && value.reviewConfirmed === true) {
        return {
            type: 'confirmation',
            data: 'Quote Reviewed and Confirmed',
        };
    }

    // Handle single selection with option ID
    if (value.selectedOption && typeof value.selectedOption === 'string') {
        const resolved = resolveOptionTitle(value.selectedOption, key, moduleConfigs);
        return {
            type: 'single-selection',
            data: resolved,
        };
    }

    // Handle value field
    if (value.value !== undefined) {
        return {
            type: 'value',
            data: value.value,
        };
    }

    // Handle inputValue field
    if (value.inputValue !== undefined) {
        return {
            type: 'input',
            data: value.inputValue,
        };
    }

    // Default: return as-is
    return {
        type: 'raw',
        data: value,
    };
}

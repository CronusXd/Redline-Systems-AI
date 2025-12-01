/**
 * Phone number normalization utilities
 * Ensures all phone numbers are stored with consistent formatting
 */

/**
 * Normalizes a phone number to include country code
 * 
 * Rules:
 * - Removes all non-digit characters
 * - For Brazilian numbers (10-11 digits with valid DDD), adds "55" prefix if missing
 * - For international numbers, preserves existing country code
 * - Returns consistently formatted number with country code
 * 
 * @param phoneNumber - Raw phone number input (can include spaces, parentheses, hyphens, etc.)
 * @returns Normalized phone number with country code
 * 
 * @example
 * normalizePhoneNumber('(11) 99988-7766') // Returns: '5511999887766'
 * normalizePhoneNumber('11999887766') // Returns: '5511999887766'
 * normalizePhoneNumber('5511999887766') // Returns: '5511999887766'
 * normalizePhoneNumber('+1 234 567 8900') // Returns: '12345678900'
 */
export function normalizePhoneNumber(phoneNumber: string): string {
    const hasPlus = phoneNumber.trim().startsWith('+')

    // Remove all non-digit characters
    let cleanNumber = phoneNumber.replace(/\D/g, '')

    // If it started with +, assume it's already an international number
    // Just return the cleaned digits
    if (hasPlus) {
        return cleanNumber
    }

    // Check if it's a Brazilian number without country code
    // Brazilian numbers have 10-11 digits (DDD + number)
    // DDD ranges from 11 to 99
    if (cleanNumber.length === 10 || cleanNumber.length === 11) {
        const ddd = parseInt(cleanNumber.substring(0, 2))

        // Verify it's a valid Brazilian DDD (11-99)
        if (ddd >= 11 && ddd <= 99) {
            // Add Brazil country code if not already present
            cleanNumber = '55' + cleanNumber
        }
    }

    // For numbers that already have country code or international numbers,
    // return as-is (already cleaned of non-digits)
    return cleanNumber
}

/**
 * Validates if a phone number is in the correct format after normalization
 * 
 * @param phoneNumber - Normalized phone number
 * @returns true if valid, false otherwise
 */
export function isValidNormalizedPhone(phoneNumber: string): boolean {
    // Should only contain digits
    if (!/^\d+$/.test(phoneNumber)) {
        return false
    }

    // Should be between 10-15 digits (international standard)
    if (phoneNumber.length < 10 || phoneNumber.length > 15) {
        return false
    }

    return true
}

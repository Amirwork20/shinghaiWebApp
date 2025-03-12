// Custom class name utility without dependencies

/**
 * Combines multiple class names, filtering out falsy values
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' '); // Remove duplicate spaces
} 
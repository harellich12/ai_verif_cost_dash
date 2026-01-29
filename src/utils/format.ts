/**
 * Format currency with appropriate suffix for large numbers
 */
export function formatCurrency(value: number, compact = false): string {
    if (compact) {
        const absValue = Math.abs(value);
        if (absValue >= 1_000_000) {
            return `$${(value / 1_000_000).toFixed(1)}M`;
        } else if (absValue >= 1_000) {
            return `$${(value / 1_000).toFixed(0)}K`;
        }
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Format percentage with sign
 */
export function formatPercent(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

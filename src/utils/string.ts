// Small string helper utilities
export const truncate = (s: string, max = 160) => s.length > max ? s.slice(0, max - 1) + '…' : s;

export const toTitleCase = (s: string) => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substring(1).toLowerCase());

export const isEmpty = (s?: string | null) => !s || s.trim().length === 0;

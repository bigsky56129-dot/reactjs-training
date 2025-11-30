// Simple form validation helpers
export const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (s: string) => emailRx.test(s);

export const passwordIsValid = (s: string) => typeof s === 'string' && s.length >= 6;

export const minLength = (s: string, n: number) => s?.trim().length >= n;

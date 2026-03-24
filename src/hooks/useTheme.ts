'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Theme preference options.
 */
export type Theme = 'light' | 'dark' | 'system';

/** Local storage key for persisting theme preference. */
const THEME_KEY = 'seteuk-theme';

/**
 * Determines the system's preferred color scheme.
 * @returns 'dark' if the system prefers dark mode, otherwise 'light'.
 */
function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Applies the specified theme to the document.
 * @param theme The theme to apply.
 */
function applyTheme(theme: Theme) {
    if (typeof window === 'undefined') return;

    const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
    document.documentElement.dataset.theme = effectiveTheme;
}

/**
 * Custom hook for managing application theme (light, dark, system).
 * Persists the preference to localStorage and listens for system preference changes.
 * @returns An object containing the current theme, resolved theme, and toggle functions.
 */
export function useTheme() {
    const [theme, setThemeState] = useState<Theme>('system');
    const [mounted, setMounted] = useState(false);

    // Initialize theme from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(THEME_KEY) as Theme | null;
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
            setThemeState(stored);
            applyTheme(stored);
        } else {
            applyTheme('system');
        }
        setMounted(true);
    }, []);

    // Listen for system theme changes
    useEffect(() => {
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme('system');

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
        applyTheme(newTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
        const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }, [theme, setTheme]);

    // Get the actual displayed theme (resolving 'system')
    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

    return {
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        mounted,
    };
}

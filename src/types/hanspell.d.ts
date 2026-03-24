/**
 * Type definitions for 'hanspell' module.
 * Provides spell checking functionality using DAUM and PNU services.
 */
declare module 'hanspell' {
    /**
     * Structure of a spell check result.
     */
    export interface SpellCheckResult {
        /** The type of error found. */
        type: string;
        /** The token (word) that was flagged. */
        token: string;
        /** List of suggested corrections. */
        suggestions: string[];
        /** The context in which the error occurred. */
        context: string;
        /** Additional information about the error. */
        info: string;
    }

    /** Callback function for handling individual spell check results. */
    export type ResultCallback = (result: SpellCheckResult) => void;
    /** Callback function called when spell checking ends. */
    export type EndCallback = () => void;
    /** Callback function for handling errors during spell check. */
    export type ErrorCallback = (err: Error) => void;

    /**
     * Performs spell checking using DAUM service.
     * @param text The text to check.
     * @param timeout Timeout in milliseconds.
     * @param callback Function called for each error found.
     * @param endCallback Function called when checking completes.
     * @param errorCallback Function called on error.
     */
    export function spellCheckByDAUM(
        text: string,
        timeout: number,
        callback: ResultCallback,
        endCallback: EndCallback,
        errorCallback: ErrorCallback
    ): void;

    /**
     * Performs spell checking using PNU service.
     * @param text The text to check.
     * @param timeout Timeout in milliseconds.
     * @param callback Function called for each error found.
     * @param endCallback Function called when checking completes.
     * @param errorCallback Function called on error.
     */
    export function spellCheckByPNU(
        text: string,
        timeout: number,
        callback: ResultCallback,
        endCallback: EndCallback,
        errorCallback: ErrorCallback
    ): void;
}

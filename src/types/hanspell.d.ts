declare module 'hanspell' {
    export interface SpellCheckResult {
        type: string;
        token: string;
        suggestions: string[];
        context: string;
        info: string;
    }

    export type ResultCallback = (result: SpellCheckResult) => void;
    export type EndCallback = () => void;
    export type ErrorCallback = (err: Error) => void;

    export function spellCheckByDAUM(
        text: string,
        timeout: number,
        callback: ResultCallback,
        endCallback: EndCallback,
        errorCallback: ErrorCallback
    ): void;

    export function spellCheckByPNU(
        text: string,
        timeout: number,
        callback: ResultCallback,
        endCallback: EndCallback,
        errorCallback: ErrorCallback
    ): void;
}

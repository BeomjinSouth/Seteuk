import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

/**
 * Input Component
 * 
 * @description
 * Shared input component with label and error message support.
 * Wraps the native input element.
 * 
 * @param {object} props - Input props extending HTMLInputElement
 * @param {string} [props.label] - Optional label text displayed above input
 * @param {string} [props.error] - Error message displayed below input in red
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="input-wrapper">
                {label && (
                    <label className="input-label">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={clsx('input', error && 'input-error', className)}
                    {...props}
                />
                {error && <p className="error-text">{error}</p>}
            </div>
        );
    }
);
Input.displayName = 'Input';

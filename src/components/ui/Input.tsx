import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

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

import { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

/**
 * Button Component
 * 
 * @description
 * Shared button component with variant and size support.
 * Includes built-in loading state with spinner.
 * 
 * @param {object} props - Button props extending HTMLButtonElement
 * @param {'primary' | 'secondary' | 'ghost' | 'destructive'} [props.variant='primary'] - Visual style variant
 * @param {'xs' | 'sm' | 'md' | 'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.isLoading] - Whether to show loading spinner (disables button)
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx(
                    'btn',
                    {
                        'btn-primary': variant === 'primary',
                        'btn-secondary': variant === 'secondary',
                        'btn-destructive': variant === 'destructive',
                        'btn-ghost': variant === 'ghost',
                        'btn-xs': size === 'xs',
                        'btn-sm': size === 'sm',
                    },
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="animate-spin" size={18} />}
                {!isLoading && children}
            </button>
        );
    }
);
Button.displayName = 'Button';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

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
                        // Size overrides can be added to globals or inline styles if needed, 
                        // but standard .btn has padding. 
                        // Let's rely on base padding or add specific classes if needed. 
                        // For now, I'll assume base size is fine or handled by utility classes passed in className.
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

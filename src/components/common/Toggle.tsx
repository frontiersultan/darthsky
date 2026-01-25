import { forwardRef, type InputHTMLAttributes } from 'react';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, className = '', checked, onChange, id, ...props }, ref) => {
    const toggleId = id || `toggle-${Math.random().toString(36).slice(2)}`;

    return (
      <label
        htmlFor={toggleId}
        className={`inline-flex items-center cursor-pointer ${className}`}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={toggleId}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div
            className={`
              w-11 h-6 rounded-full
              bg-slate-200 dark:bg-slate-700
              peer-checked:bg-sky-500
              peer-focus:ring-2 peer-focus:ring-sky-500 peer-focus:ring-offset-2
              transition-colors duration-200
            `}
          />
          <div
            className={`
              absolute left-0.5 top-0.5
              w-5 h-5 rounded-full bg-white shadow-sm
              transition-transform duration-200
              peer-checked:translate-x-5
            `}
          />
        </div>
        {label && (
          <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';

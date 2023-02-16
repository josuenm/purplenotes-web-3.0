import { ButtonHTMLAttributes, RefObject } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: RefObject<HTMLButtonElement>;
}

export function NormalButton({ className, children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`bg-primary rounded-md p-2 text-white duration-300 md:hover:opacity-80 flex items-center justify-center gap-1 disabled:opacity-75 ${className}`}
    >
      {children}
    </button>
  );
}

export function SoftButton({ className, children, ...rest }: ButtonProps) {
  return (
    <>
      <button
        {...rest}
        className={`rounded-md p-2 text-primary duration-300 bg-primary/20 text-primary bg-transparent active:bg-primary/20 md:hover:bg-primary/20 flex items-center justify-center gap-1 disabled:opacity-75 ${className}`}
      >
        {children}
      </button>
    </>
  );
}

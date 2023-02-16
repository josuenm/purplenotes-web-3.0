import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form/dist/types/form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegisterReturn<string>;
}

export function Input({ className, register, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      {...register}
      className={`outline-none rounded-md text-md p-2 bg-neutral-800 border-2 border-neutral-700 focus:border-primary ${className}`}
    />
  );
}

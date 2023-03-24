import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps } from "react";
import { type UseFormRegister } from "react-hook-form";

const inputStyles = cva("rounded-md border focus:outline-none ", {
  variants: {
    intent: {
      primary:
        "border-selago text-coal font-bold text-[0.938rem] tracking-[-0.25px] p-3 disabled:border-none disabled:bg-transparent disabled:text-gray bg-white disabled:px-0 ",
    },
    sizes: {
      sm: "w-1/2",
      base: "w-full",
    },
  },
  defaultVariants: {
    intent: "primary",
    sizes: "base",
  },
});

type Props = VariantProps<typeof inputStyles> & ComponentProps<"input">;

interface InputProps extends Props {
  className?: string;
  divClass?: string;
  type?: "text" | "email" | "password" | "number";
  name: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  label?: string;
  errorMessage?: string;
  required?: boolean;
}

export default function TextInput({
  sizes,
  intent,
  type = "text",
  name,
  register,
  placeholder,
  label,
  errorMessage,
  className,
  divClass,
  required = true,
  ...props
}: InputProps) {
  return (
    <div
      className={divClass}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {label && (
        <label
          htmlFor={name}
          className="mb-1 text-[0.813rem] font-medium capitalize tracking-[-0.1px] text-light_blue"
        >
          {label}
        </label>
      )}
      <input
        className={inputStyles({ intent, sizes, className })}
        style={{ borderColor: errorMessage && "#EE374A" }}
        type={type}
        {...register(name)}
        id={name}
        placeholder={placeholder}
        aria-required={required}
        aria-invalid={errorMessage ? "true" : "false"}
        {...props}
      />
      {errorMessage && (
        <span className="text-right text-sm text-[#EE374A]">
          {errorMessage}
        </span>
      )}
    </div>
  );
}

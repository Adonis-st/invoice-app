import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps } from "react";
import { type UseFormRegister } from "react-hook-form";

const selectStyles = cva("rounded-md border focus:outline-none ", {
  variants: {
    intent: {
      primary:
        "border-selago text-coal font-bold text-[0.938rem] tracking-[-0.25px] p-3",
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

type Props = VariantProps<typeof selectStyles> & ComponentProps<"select">;

interface SelectProps extends Props {
  className?: string;
  divClass?: string;
  name: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  label: string;
  errorMessage?: string;
  required?: boolean;
}

export default function SelectDropdown({
  sizes,
  intent,
  name,
  register,
  placeholder,
  label,
  errorMessage,
  className,
  divClass,
  required = true,
  ...props
}: SelectProps) {
  const options = [
    { label: "Net 1 Day", value: 1 },
    { label: "Net 7 Days", value: 7 },
    { label: "Net 14 Days", value: 14 },
    { label: "Net 30 Days", value: 30 },
  ];
  return (
    <div
      className={divClass}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <label
        htmlFor={name}
        className="mb-1 text-[0.813rem] font-medium capitalize tracking-[-0.1px] text-light_blue"
      >
        {label}
      </label>
      <select
        className={selectStyles({ intent, sizes, className })}
        style={{ borderColor: errorMessage && "#EE374A" }}
        {...register(name, {
          valueAsNumber: true,
        })}
        id={name}
        placeholder={placeholder}
        aria-required={required}
        aria-invalid={errorMessage ? "true" : "false"}
        {...props}
      >
        {options.map((option, index) => {
          return (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
      {errorMessage && (
        <span className="text-right text-sm text-[#EE374A]">
          {errorMessage}
        </span>
      )}
    </div>
  );
}

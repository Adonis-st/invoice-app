import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps } from "react";

const checkboxStyles = cva("aspect-square", {
  variants: {
    intent: {
      primary:
        "checkbox relative cursor-pointer appearance-none rounded-sm border border-transparent lg:hover:border-purple checked:bg-purple checked:before:border-white bg-selago  dark:bg-dark_Navy dark:checked:bg-purple",
    },
    size: {
      small: "text-sm py-1 px-2",
      medium: "w-[14px]",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

type Props = VariantProps<typeof checkboxStyles> & ComponentProps<"input">;

interface CheckboxProps extends Props {
  className?: string;
  name: string;
  label: string;
}
export default function Checkbox({
  intent,
  size,
  className,
  name,
  label,
  ...props
}: CheckboxProps) {
  return (
    <div className="mb-3 flex items-center last:mb-0">
      <input
        type="checkbox"
        className={checkboxStyles({ intent, size, className })}
        name={name}
        id={name}
        {...props}
      />
      <label
        htmlFor={name}
        className="heading-s ml-2 cursor-pointer text-[13px] leading-[15px] text-coal dark:text-white "
      >
        {label}
      </label>
    </div>
  );
}

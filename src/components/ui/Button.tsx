import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { VscLoading } from "react-icons/vsc";

const buttonStyles = cva(
  "font-bold shrink-0 grow-0 disabled:pointer-events-none",
  {
    variants: {
      intent: {
        primary: "bg-purple text-white lg:hover:bg-light_purple rounded-full ",
        secondary:
          "rounded-full text-light_blue bg-[#F9FAFE] dark:bg-navy dark:text-selago lg:hover:bg-selago ",
        dark: "bg-[#373B53] text-gray rounded-full dark:text-selago hover:bg-dark_Navy",
        danger: "bg-danger rounded-full text-white lg:hover:bg-danger_hover ",
      },
      size: {
        xs: "p-1 sm:p-2 ",
        sm: "py-4 px-[1.63rem]",
        md: "py-4 px-8",
      },
      fullWidth: {
        true: "w-full ",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
);
type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<"button">;

interface Props extends ButtonProps {
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
}

export default function Button({
  intent,
  size,
  fullWidth,
  children,
  className,
  isLoading = false,
  ...props
}: Props) {
  return (
    <button
      disabled={isLoading}
      className={buttonStyles({ intent, size, fullWidth, className })}
      {...props}
    >
      {isLoading ? (
        <span className="relative flex items-center justify-center">
          <VscLoading className="absolute z-10 h-7 w-7 animate-spin" />
          <span className="-z-10 opacity-0">{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

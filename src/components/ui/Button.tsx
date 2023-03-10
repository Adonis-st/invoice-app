import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps, ReactNode } from "react";

const buttonStyles = cva("flex items-center justify-center font-bold shrink-0 grow-0", {
	variants: {
		intent: {
			primary: "bg-purple text-white lg:hover:bg-light_purple rounded-full ",
			secondary: "rounded-full  text-light_blue bg-[#F9FAFE]",
			dark: "bg-[#373B53] text-gray rounded-full",
			danger: "bg-danger rounded-full text-white lg:hover:bg-danger_hover ",
		},
		size: {
			xs: "p-1",
			sm: "py-4 px-6",
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
});

type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<"button">;

interface Props extends ButtonProps {
	children: ReactNode;
	className?: string;
}

export default function Button({ intent, size, fullWidth, children, className, ...props }: Props) {
	return (
		<button className={buttonStyles({ intent, size, fullWidth, className })} {...props}>
			{children}
		</button>
	);
}

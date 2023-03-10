import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";

const checkboxStyles = cva("", {
	variants: {
		intent: {
			primary: "",
			secondary: ["bg-white", "text-gray-800", "border-gray-400", "hover:bg-gray-100"],
			danger: "bg-danger lg:hover:bg-danger_hover",
		},
		size: {
			small: ["text-sm", "py-1", "px-2"],
			medium: ["text-base", "py-2", "px-4"],
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
		<div className="flex ">
			<input
				type="checkbox"
				className={checkboxStyles({ intent, size, className })}
				name={name}
				id={name}
				{...props}
			/>
			<label htmlFor={name} className="ml-2 text-sm">
				{label}
			</label>
		</div>
	);
}

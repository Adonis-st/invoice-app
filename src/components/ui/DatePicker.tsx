import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, useState, useRef, useEffect } from "react";
import { getDaysInMonth, format, getYear } from "date-fns";
import { datePickerAtom } from "~/store";
import { useAtom } from "jotai";
import { type UseFormRegister, type UseFormSetValue } from "react-hook-form";

const dateStyles = cva("rounded-md border focus:outline-none ", {
  variants: {
    intent: {
      primary:
        "border-selago text-coal font-bold text-[0.938rem] tracking-[-0.25px] p-3 focus:border-purple",
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

type Props = VariantProps<typeof dateStyles> & ComponentProps<"input">;

interface InputProps extends Props {
  className?: string;
  name: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  label: string;
  errorMessage?: string;
  required?: boolean;
  setValue: UseFormSetValue<any>;
}

export default function DatePicker({
  sizes,
  intent,
  setValue,
  name,
  register,
  placeholder,
  label,
  errorMessage,
  className,
  required = true,
  ...props
}: InputProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // initial values
  const initialSelectedDate = new Date(Date.now());
  const initialCurrentMonth = new Date(initialSelectedDate).getMonth();
  const initialCurrentYear = getYear(initialSelectedDate);
  const initialDaysInMonth = getDaysInMonth(initialSelectedDate);

  // hooks
  const [open, setOpen] = useAtom(datePickerAtom);
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [currentMonth, setCurrentMonth] = useState(initialCurrentMonth);
  const [currentYear, setCurrentYear] = useState(initialCurrentYear);
  const [daysInMonth, setDaysInMonth] = useState(initialDaysInMonth);

  // useEffect(() => {
  // 	setSelectedDate(new Date(value));
  // }, [value]);

  const resetDaysInMonthEffect = () => {
    setDaysInMonth(getDaysInMonth(new Date(currentYear, currentMonth)));
  };

  const handleClickOff = (e: MouseEvent) => {
    if (!ref.current?.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  // close datepicker on click outside of the datepicker
  const clickOffEffect = () => {
    if (open) {
      window.addEventListener("click", handleClickOff);
    } else {
      window.removeEventListener("click", handleClickOff);
    }
    return () => {
      window.removeEventListener("click", handleClickOff);
    };
  };

  const setFocus = () => {
    if (open) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  };

  useEffect(resetDaysInMonthEffect, [currentMonth]);
  useEffect(clickOffEffect, [open]);
  useEffect(setFocus, [open]);

  // handlers
  const handlePrevMonth = () => {
    setCurrentMonth((curr) => {
      if (curr - 1 < 0) {
        setCurrentYear((prev) => prev - 1);
        return 11;
      } else {
        return curr - 1;
      }
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((curr) => {
      if (curr + 1 > 11) {
        setCurrentYear((prev) => prev + 1);
        return 0;
      } else {
        return curr + 1;
      }
    });
  };

  const handleDateSelect = (selectedDay: number) => {
    const newDate = new Date(currentYear, currentMonth, selectedDay);
    setSelectedDate(newDate);
    setValue(name, newDate);
    // setInvoiceDate(format(newDate, "yyyy-MM-dd"));
    setOpen(false);
  };

  return (
    <div className="relative mb-6 flex flex-col" ref={ref}>
      <label
        htmlFor={name}
        className="mb-1 text-[0.813rem] font-medium capitalize tracking-[-0.1px] text-light_blue"
      >
        {label}
      </label>
      <div className="relative">
        <input
          className={dateStyles({ intent, sizes, className })}
          style={{ borderColor: errorMessage && "#EE374A" }}
          type="text"
          {...register(name, {
            value: selectedDate,
            valueAsDate: true,
          })}
          value={format(selectedDate, "dd MMM yyyy")}
          id={name}
          readOnly={true}
          onFocus={() => setOpen(true)}
          ref={inputRef}
          placeholder={placeholder}
          aria-required={required}
          aria-invalid={errorMessage ? "true" : "false"}
          {...props}
        />
        <svg
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute right-[5%] top-1/2 -translate-y-1/2"
        >
          <path
            d="M14 2h-.667V.667A.667.667 0 0012.667 0H12a.667.667 0 00-.667.667V2H4.667V.667A.667.667 0 004 0h-.667a.667.667 0 00-.666.667V2H2C.897 2 0 2.897 0 4v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm.667 12c0 .367-.3.667-.667.667H2A.668.668 0 011.333 14V6.693h13.334V14z"
            fill="#7E88C3"
            fillRule="nonzero"
            opacity=".5"
          />
        </svg>
      </div>
      {open && (
        <div className="absolute top-[105%] left-0 z-[4] min-h-[243px] w-full max-w-[240px] rounded-lg bg-white p-6 text-center shadow-[0px_10px_20px_rgba(72,_84,_159,_0.25)]">
          <div className="mb-4 flex items-center justify-between font-bold ">
            <button type="button" onClick={() => handlePrevMonth()}>
              <img src="/assets/icon-arrow-left.svg" alt="Left Arrow" />
            </button>
            <p>
              {format(new Date(currentYear, currentMonth), "MMM")} {currentYear}
            </p>
            <button onClick={() => handleNextMonth()} type="button">
              <img src="/assets/icon-arrow-right.svg" alt="Right Arrow" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-4 font-bold ">
            {Array.from(Array(daysInMonth).keys())
              .map((p) => p + 1)
              .map((p, i) =>
                selectedDate.getDate() === p &&
                selectedDate.getFullYear() === currentYear &&
                selectedDate.getMonth() === currentMonth ? (
                  <p
                    key={i}
                    className="cursor-pointer text-purple"
                    onClick={() => handleDateSelect(p)}
                  >
                    {p}
                  </p>
                ) : (
                  <p
                    key={i}
                    onClick={() => handleDateSelect(p)}
                    className="hover:text-purple"
                  >
                    {p}
                  </p>
                )
              )}
          </div>
        </div>
      )}

      {errorMessage && (
        <span className="text-right text-sm text-[#EE374A]">
          {errorMessage}
        </span>
      )}
    </div>
  );
}

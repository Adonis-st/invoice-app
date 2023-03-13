import { Checkbox } from "~/components/ui";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { HiChevronDown } from "react-icons/hi2";

export const Filter = () => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white bg-opacity-20 px-4 py-2 text-sm font-medium text-coal hover:bg-opacity-30 ">
              Filter
              <HiChevronDown
                className={`${
                  open ? "rotate-180" : ""
                } ml-2 -mr-1 h-5 w-5 text-purple transition duration-200 ease-in-out`}
                aria-hidden="true"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className="absolute right-0 mt-2 w-32 rounded-lg 
                  bg-white shadow-[0px_10px_20px_rgba(72,84,159,0.25)] focus:outline-none "
            >
              <div className="px-1 py-1 ">
                <div className="px-2 py-2">
                  <Checkbox name="draft" label="Draft" />

                  <Checkbox name="pending" label="Pending" />

                  <Checkbox name="paid" label="Paid" />
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

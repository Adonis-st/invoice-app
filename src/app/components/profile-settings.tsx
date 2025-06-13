"use client";

import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import { Fragment } from "react";
import { FaSignOutAlt } from "react-icons/fa";

export const ProfileSettings = () => {
  return (
    <>
      {/* <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="flex h-12 w-12 shrink-0 items-center justify-center">
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="h-7 w-7 max-w-full rounded-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <button
                onClick={() => void signOut({ redirectTo: "/sign-in" })}
                className="group flex w-max items-center rounded-md  bg-white px-2 py-2 text-sm text-coal hover:bg-violet-500 hover:text-white dark:bg-dark_Navy dark:text-white"
              >
                <LogOut className="mr-2 h-4 w-4 fill-white hover:fill-white" />
                Sign Out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      <Menu as="div" className="">
        <div>
          <Menu.Button className="p-5 ">
            <img
              src={
                //   sessionData?.user?.image ||
                "/assets/image-avatar.jpg"
              }
              alt="avatar"
              className="aspect-square w-10 max-w-full rounded-full "
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
          <Menu.Items className="divide-gray-100 absolute right-2 origin-top-right divide-y rounded-lg bg-white shadow-lg focus:outline-none dark:bg-navy lg:bottom-4 lg:left-28">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => void signOut({ redirectTo: "/sign-in" })}
                    className={`${
                      active
                        ? "bg-violet-500 text-white "
                        : "bg-white text-coal dark:bg-dark_Navy dark:text-white"
                    } group flex w-max items-center rounded-md  px-2 py-2 text-sm`}
                  >
                    <FaSignOutAlt
                      className={`${
                        active ? "fill-white" : "fill-violet-500"
                      } mr-2 aspect-square w-4`}
                    />
                    Sign Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

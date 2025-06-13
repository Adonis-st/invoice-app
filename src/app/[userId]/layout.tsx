import Link from "next/link";
import { ProfileSettings } from "../components/profile-settings";
import { ToggleDarkMode } from "../components/toggle-dark-mode";
import { auth } from "~/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <>
      <nav className="sticky top-0 z-20 flex bg-[#373B53] transition-all duration-500 dark:bg-dark_Navy max-lg:items-center lg:fixed lg:left-0 lg:h-full lg:w-[103px] lg:flex-col lg:items-center lg:rounded-br-[20px] lg:rounded-tr-3xl">
        <div className="flex w-full items-center justify-between border-[#494E6E] max-lg:border-r max-lg:pr-4 lg:h-full lg:flex-col lg:border-b lg:pb-8">
          <Link
            href={`/${session.user.id}`}
            className="flex aspect-square w-[72px] items-center justify-center rounded-r-3xl bg-purple lg:w-[103px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26">
              <path
                fill="#FFF"
                fillRule="evenodd"
                d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9z"
              />
            </svg>
          </Link>
          <ToggleDarkMode />
        </div>
        <ProfileSettings />
      </nav>

      <main>{children}</main>
    </>
  );
}

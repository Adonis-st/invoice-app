import { FcGoogle } from "react-icons/fc";
import { signIn, auth } from "~/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  //   const { data: sessionData } = useSession();
  //   const router = useRouter();

  //   useEffect(() => {
  //     if (sessionData && !isRedirecting && router.isReady) {
  //       // display some message to the user that he is being redirected
  //       setIsRedirecting(true);
  //       setTimeout(() => {
  //         // redirect to the return url or home page
  //         void router.push((router.query.returnUrl as string) || "/");
  //       }, 500);
  //     }
  //   }, [sessionData, isRedirecting, router]);

  //   if (isRedirecting) return <Spinner />;

  const session = await auth();

  if (session) {
    redirect(`/${session.user?.id}`);
  }

  return (
    <div className="absolute left-1/2 top-[40%] flex w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-md bg-white p-10 dark:bg-dark_Navy">
      <h1 className="text-5xl dark:text-white">Login</h1>
      <p className="dark:text-selago">Please login in to countinue</p>

      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button
          type="submit"
          className=" mt-3 flex items-center rounded-full border border-stone-300  px-3 py-2 dark:border-stone-500 dark:text-white"
        >
          <FcGoogle className="mr-2" />
          Sign in with Google
        </button>
      </form>
    </div>
  );
}

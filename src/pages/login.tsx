import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Spinner } from "~/components/ui";

const LoginPage: NextPage = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionData && !isRedirecting && router.isReady) {
      // display some message to the user that he is being redirected
      setIsRedirecting(true);
      setTimeout(() => {
        // redirect to the return url or home page
        void router.push((router.query.returnUrl as string) || "/");
      }, 500);
    }
  }, [sessionData, isRedirecting, router]);

  if (isRedirecting) return <Spinner />;

  return (
    <div className="absolute top-[40%] left-1/2 flex w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-md bg-white p-10">
      <h1 className="text-5xl">Login</h1>
      <p>Please login in to countinue</p>
      <button
        onClick={() => void signIn("google")}
        className=" mt-3 flex  items-center rounded-full border border-stone-300 px-3 py-2"
      >
        <FcGoogle className="mr-2" />
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginPage;

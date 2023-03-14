import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

const LoginPage: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionData?.user) {
      void router.push("/");
    }
  }, [sessionData?.user]);

  if (sessionData?.user) return null;

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

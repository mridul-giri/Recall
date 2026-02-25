"use client";
import { signIn } from "next-auth/react";

export const SignIn = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed top-7 md:top-12 left-0 w-full h-px bg-black/30 z-50" />
      <div className="fixed bottom-7 md:bottom-12 left-0 w-full h-px bg-black/30 z-50" />
      <div className="fixed top-0 left-7 md:left-12 h-full w-px bg-black/30 z-50" />
      <div className="fixed top-0 right-7 md:right-12 h-full w-px bg-black/30 z-50" />

      <div className="min-h-screen flex justify-center items-center px-8 md:px-10">
        <div className="flex flex-col justify-center w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
          <span className="text-sm uppercase tracking-wider">
            Turn Telegram into your personal knowledge system
          </span>

          <span className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl font-medium mt-2">
            Build your second brain directly inside Telegram.
          </span>

          <span className="text-base sm:text-lg font-medium mt-4 sm:mt-5">
            W Capture links, files, images, and videos in seconds, and organize
            them with tags <br /> without breaking your workflow.
          </span>

          <button
            className="flex justify-center items-center gap-2 cursor-pointer hover:opacity-90 tertiary-bg text-white w-fit py-2 px-4 sm:px-6 rounded-lg mt-5 sm:mt-6 text-sm sm:text-base transition-opacity duration-500"
            onClick={async () =>
              await signIn("google", { callbackUrl: "/dashboard/tags" })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.503c-1.649,4.657-6.08,8-11.503,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.506,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.506,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.503c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

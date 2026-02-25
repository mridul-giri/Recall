"use client";
import { BookmarkCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hiddent">
      <div className="fixed top-0 left-7 md:left-12 h-full w-px bg-black/30 z-0 pointer-events-none" />
      <div className="fixed top-0 right-7 md:right-12 h-full w-px bg-black/30 z-0 pointer-events-none" />

      <span className="relative z-10 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl h-12 font-light backdrop-blur-md border-b border-black/30">
        <BookmarkCheck className="w-4 h-4 mb-2" /> Recall
      </span>

      <div className="relative z-10 flex flex-col gap-10 sm:gap-14 md:gap-20 pt-10 sm:pt-16 md:pt-20 pb-16 md:pb-20 px-8 sm:px-12 md:px-20">
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
            Organize your digital life without <br /> leaving Telegram.
          </h1>
          <h2 className="text-base font-light sm:text-lg md:text-2xl mt-3 sm:mt-4 md:mt-5 text-black/70 leading-relaxed">
            Recall helps you store links, documents, images, and videos in one
            structured system <br /> so nothing important gets lost in chats
            again.
          </h2>
          <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row gap-3 sm:gap-5">
            <button
              onClick={() =>
                (window.location.href = "https://t.me/TheRecallBot")
              }
              className="px-6 sm:px-10 py-2.5 sm:py-2 border w-full sm:w-fit tertiary-bg text-white rounded-lg cursor-pointer hover:opacity-95 text-sm sm:text-base transition-opacity"
            >
              Try now
            </button>
            <Link
              href="/auth/register"
              className="px-6 sm:px-10 py-2.5 sm:py-2 border w-full sm:w-fit tertiary-bg text-white rounded-lg cursor-pointer hover:opacity-95 text-sm sm:text-base text-center transition-opacity"
            >
              Sign in
            </Link>
          </div>
        </div>

        <section>
          <div className="relative w-full overflow-hidden rounded-lg shadow-md">
            <video
              src="/hero-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-auto object-cover"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

"use client";
import axios from "axios";
import { Bookmark, Link2, Tags, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useState } from "react";
import { Spinner } from "@repo/ui";
import UserCard from "./UserCard";

const DashboardNavbar = ({ session }: any) => {
  const [tokenLoading, setTokenLoading] = useState<boolean>(false);
  const [userCardOpen, setUserCardOpen] = useState<boolean>(false);

  const getToken = async () => {
    setTokenLoading(true);
    try {
      const res = await axios.post("/api/web/token");
      window.location.href = res.data.data;
    } catch (error) {
      toast.error(getErrorMessage(error), { position: "top-center" });
    } finally {
      setTokenLoading(false);
    }
  };
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 md:px-20 py-2">
      <div className="flex items-center justify-between gap-10 tertiary-bg text-white py-2 px-6 shadow-lg rounded-4xl">
        <Link
          href={"/dashboard/tags"}
          className="group flex items-center gap-2 cursor-pointer"
        >
          <Tags className="w-5 h-5" />
          <span className="hidden sm:inline transform -translate-x-1 group-hover:translate-x-1 transition-all duration-300 ease-out">
            Tags
          </span>
        </Link>
        <Link
          href={"/dashboard/content"}
          className="group flex items-center gap-2 cursor-pointer"
        >
          <Bookmark className="w-5 h-5" />
          <span className="hidden sm:inline transform -translate-x-1 group-hover:translate-x-1 transition-all duration-300 ease-out">
            Bookmark
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="group flex gap-2 py-2 px-4 cursor-pointer rounded-4xl shadow-lg tertiary-bg text-white hover:opacity-90 transition-all duration-300"
          onClick={getToken}
        >
          {tokenLoading ? (
            <Spinner className="w-6 h-6" />
          ) : (
            <Link2 className="w-6 h-6" />
          )}

          <span className="hidden sm:inline transform -translate-x-1 group-hover:translate-x-1 transition-all duration-300 ease-out">
            Connect Telegram
          </span>
        </button>
        <div className="relative">
          <button
            className="p-2 rounded-full cursor-pointer shadow-lg tertiary-bg hover:opacity-90 transition-all duration-300 text-white"
            onClick={() => setUserCardOpen((prev) => !prev)}
          >
            <User className="w-6 h-6" />
          </button>
          {userCardOpen && (
            <UserCard
              open={userCardOpen}
              session={session}
              onClose={() => setUserCardOpen(false)}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;

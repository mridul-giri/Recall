"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, Trash2 } from "lucide-react";
import DeleteAccountDialog from "./DeleteAccountDialog";

export default function UserCard({ open, session, onClose }: any) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const user = session.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: any) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`absolute top-full right-0 mt-2 w-72 bg-white rounded-4xl shadow-md overflow-hidden z-50 transition-all duration-300 ease-out ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="p-4 pb-3">
          <div className="flex items-center gap-3">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#3b3c36] flex items-center justify-center text-white font-semibold text-sm ring-2 ring-gray-100">
                {initials}
              </div>
            )}

            <div className="flex-1 min-w-0">
              {user?.name && (
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.name}
                </p>
              )}
              {user?.email && (
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              )}
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 mx-3" />

        <div className="p-2">
          <button
            onClick={async () => await signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            <span className="text-sm font-medium">Log out</span>
          </button>

          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer group"
          >
            <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-500 transition-colors" />
            <span className="text-sm font-medium">Delete Account</span>
          </button>
        </div>
      </div>

      <DeleteAccountDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </>
  );
}

"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { getErrorMessage } from "../utils/getErrorMessage";
import { Spinner } from "@repo/ui";
import { AlertTriangle, X } from "lucide-react";

export default function DeleteAccountDialog({ open, onClose }: any) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete("/api/user");
      toast.success("Account deleted successfully", {
        position: "top-center",
      });
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast.error(getErrorMessage(error), { position: "top-center" });
      setDeleting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        open ? "visible" : "invisible pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`relative bg-white rounded-4xl shadow-2xl p-6 w-full max-w-md mx-4 transition-all duration-300 ease-out ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          Delete Account
        </h3>

        <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
          If you delete this account, all your saved content will be deleted{" "}
          <span className="font-semibold text-red-500">Permanently</span>. This
          action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <Spinner className="w-4 h-4" />
                Deleting...
              </>
            ) : (
              "Delete Account"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

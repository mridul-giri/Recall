"use client";
import { Spinner } from "@repo/ui";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export const CreateTagModal = ({
  open,
  onClose,
  onCreateTag,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onCreateTag: (tagName: string) => void;
  loading: boolean;
}) => {
  const [tagName, setTagName] = useState("");

  useEffect(() => {
    if (!open) {
      setTagName("");
    }
  }, [open]);

  const handleCreate = () => {
    if (!tagName.trim()) return;
    onCreateTag(tagName.trim());
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
        className={`relative w-full max-w-md mx-4 bg-white rounded-4xl shadow-2xl p-6 transition-all duration-300 ease-out ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold">Create Tag</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={2.1} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Enter a name for your new tag
        </p>
        <input
          placeholder="Tag name..."
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          required
          autoFocus
          className="w-full h-12 px-3 rounded-lg border border-color bg-gray-50 text-sm outline-none focus:ring-1 focus:ring-ring mb-6"
        />
        <button
          onClick={handleCreate}
          disabled={!tagName.trim() || loading}
          className="h-12 px-4 w-full text-center rounded-lg tertiary-bg text-white cursor-pointer text-sm font-medium hover:opacity-95 transition-colors inline-flex items-center justify-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <Spinner /> : "Create"}
        </button>
      </div>
    </div>
  );
};

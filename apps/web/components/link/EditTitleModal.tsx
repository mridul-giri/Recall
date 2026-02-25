import { Spinner } from "@repo/ui";
import { X } from "lucide-react";

export const EditTitleModal = ({
  open,
  value,
  onSetTitle,
  onClose,
  onUpdateTitle,
  loading,
}: any) => {
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
          <h3 className="text-lg font-semibold">Edit Title</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={2.1} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Update the title for this link
        </p>
        <input
          placeholder="Enter new title..."
          value={value}
          onChange={(e) => onSetTitle(e.target.value)}
          required
          className="w-full h-12 px-3 rounded-lg border border-color bg-gray-50 text-sm outline-none focus:ring-1 focus:ring-ring mb-6"
        />
        <button
          onClick={onUpdateTitle}
          className="h-12 px-4 w-full text-center rounded-lg tertiary-bg text-white cursor-pointer text-sm font-medium hover:opacity-95 transition-colors inline-flex items-center justify-center gap-1"
        >
          {loading ? <Spinner /> : "Save"}
        </button>
      </div>
    </div>
  );
};

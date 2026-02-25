import { Spinner } from "@repo/ui";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export const AddTagModal = ({
  open,
  onClose,
  onAddTag,
  tags,
  loading,
  contentTags = [],
  contentTagsLoading = false,
  onDetachTag,
}: any) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedTag(null);
    }
  }, [open]);

  const handleAdd = () => {
    if (!selectedTag) return;
    onAddTag(selectedTag);
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
          <h3 className="text-lg font-semibold">Tags</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={2.1} />
          </button>
        </div>

        {contentTagsLoading ? (
          <div className="flex items-center gap-2 py-3">
            <Spinner />
            <span className="text-sm text-gray-400">Loading tags...</span>
          </div>
        ) : contentTags.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3 mb-5">
            {contentTags.map((tag: any) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-gray-100 text-sm text-gray-700 border border-gray-200"
              >
                {tag.name}
                {onDetachTag && (
                  <button
                    onClick={() => onDetachTag(tag.id)}
                    className="p-0.5 rounded-full hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                )}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-1 mb-4">
            No tags attached yet
          </p>
        )}

        <div className="h-px bg-gray-200 mb-4" />

        <p className="text-sm text-gray-500 mb-3">Add a tag to this content</p>

        <select
          value={selectedTag ?? ""}
          onChange={(e) => {
            setSelectedTag(e.target.value);
          }}
          className="w-full h-12 px-3 rounded-lg border border-color bg-gray-50 text-sm outline-none focus:ring-1 focus:ring-ring mb-6"
        >
          <option value="" disabled>
            Select tag...
          </option>
          {tags.map((item: any) => (
            <option key={item.id} value={item.id} className="bg-gray-200">
              {item.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            className="h-12 px-4 w-full text-center rounded-lg tertiary-bg text-white cursor-pointer text-sm font-medium hover:opacity-95 transition-colors inline-flex items-center justify-center gap-1"
          >
            {loading ? <Spinner /> : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

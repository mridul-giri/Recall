"use client";
import {
  X,
  Trash2,
  Type,
  Download,
  Tag,
  Calendar,
  VideoIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@repo/ui";

export const VideoPopup = ({
  open,
  onClose,
  video,
  onDelete,
  onAddTag,
  tags,
  value,
  onSetTitle,
  onUpdateTitle,
  deleteLoading,
  titleLoading,
  tagLoading,
  contentTags = [],
  contentTagsLoading = false,
  onDetachTag,
}: any) => {
  const [downloading, setDownloading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) {
      setSelectedTag(null);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } else {
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }, 300);
    }
  }, [open]);

  const handleAdd = () => {
    if (!selectedTag) return;
    onAddTag(selectedTag);
  };

  const handleDownload = async () => {
    if (!video?.cloudfrontUrl) return;

    try {
      setDownloading(true);

      const link = document.createElement("a");
      link.href = video.cloudfrontUrl;
      link.download = video.title || "video";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Failed to download video", { position: "top-center" });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[900px] md:h-[80vh] z-50 bg-white rounded-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300 ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="md:w-[55%] h-[35vh] md:h-full secondary-bg flex items-center justify-center p-6 relative overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            {video?.cloudfrontUrl && (
              <video
                ref={videoRef}
                src={video.cloudfrontUrl}
                controls
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}
          </div>
        </div>

        <div className="md:w-[45%] h-[calc(65vh-2rem)] md:h-full p-6 flex flex-col overflow-y-auto">
          <div className="mb-6 pr-6">
            <h2 className="text-xl font-semibold">
              {video?.title || "Untitled Video"}
            </h2>
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{video?.createdAt || "—"}</span>
            </div>
          </div>

          <div className="h-px bg-gray-200 mb-5" />

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700">
                Edit Title
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={value}
                onChange={(e) => onSetTitle(e.target.value)}
                className="flex-1 h-10 px-3 rounded-xl border border-color bg-gray-50 text-sm outline-none focus:ring-1 focus:ring-gray-300 transition-all"
                placeholder="Enter a title..."
              />
              <button
                onClick={() => onUpdateTitle()}
                className="h-10 px-4 rounded-xl tertiary-bg text-white text-sm font-medium hover:opacity-90 transition-all cursor-pointer"
              >
                {titleLoading ? <Spinner /> : "Save"}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
            </div>

            {contentTagsLoading ? (
              <div className="flex items-center gap-2 mb-3">
                <Spinner />
                <span className="text-sm text-gray-400">Loading tags...</span>
              </div>
            ) : contentTags.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-3">
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
              <p className="text-sm text-gray-400 mb-3">No tags attached</p>
            )}

            <div className="flex items-center gap-2">
              <select
                value={selectedTag ?? ""}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="flex-1 h-10 px-3 rounded-xl border border-color bg-gray-50 text-sm outline-none focus:ring-1 focus:ring-gray-300 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select a tag...
                </option>
                {tags.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAdd}
                className="h-10 px-4 rounded-xl tertiary-bg text-white text-sm font-medium hover:opacity-90 transition-all cursor-pointer"
              >
                {tagLoading ? <Spinner /> : "Add"}
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-200 mb-5" />

          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-3">
              <VideoIcon className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700">Actions</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-color text-sm font-medium hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {downloading ? "Downloading..." : "Download"}
              </button>
              <button
                onClick={() =>
                  video && onDelete(video.contentId, video.extension)
                }
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 transition-all cursor-pointer"
              >
                {deleteLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

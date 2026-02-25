"use client";
import { useEffect, useState } from "react";
import { getErrorMessage } from "../../utils/getErrorMessage";
import axios from "axios";
import { TagItem } from "./TagItem";
import { CreateTagModal } from "./CreateTagModal";
import { Plus } from "lucide-react";
import { Skeleton } from "@repo/ui";
import { toast } from "sonner";

export const TagContainer = () => {
  const [tags, setTags] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchTags = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get("/api/web/tag");
      setTags(res.data.data);
    } catch (error) {
      toast.error(getErrorMessage(error), { position: "top-center" });
    } finally {
      setIsFetching(false);
    }
  };

  const addTag = async (tagName: string) => {
    if (!tagName) return;
    setIsCreating(true);
    try {
      const res = await axios.post("/api/web/tag", { tagName });
      if (res.data.data) {
        setTags((prev) => [...prev, res.data.data]);
        toast.success("Tag created", { position: "top-center" });
      }
    } catch (error) {
      toast.error(getErrorMessage(error), { position: "top-center" });
    } finally {
      setIsCreating(false);
      setCreateModalOpen(false);
    }
  };

  const deleteTag = async (tagId: string) => {
    try {
      await axios.delete(`/api/web/tag/${tagId}`);
      setTags((prev) => prev.filter((tag) => tag.id !== tagId));
      toast.success("Tag deleted", { position: "top-center" });
    } catch (error) {
      toast.error(getErrorMessage(error), { position: "top-center" });
    }
  };

  const updateTag = async (tagId: string, newTagName: string) => {
    try {
      const res = await axios.patch(`/api/web/tag/${tagId}`, {
        tagName: newTagName,
      });
      if (res.data.data) {
        setTags((prev) =>
          prev.map((tag) =>
            tag.id === tagId ? { ...tag, name: res.data.data.name } : tag,
          ),
        );
        toast.success("Tag updated", { position: "top-center" });
      }
    } catch (error) {
      toast.error(getErrorMessage(error), { position: "top-center" });
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="my-10 mx-4 sm:mx-8 md:mx-[80px]">
      {isFetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[180px] rounded-4xl bg-black/10"
            />
          ))}
        </div>
      ) : (
        <>
          {tags.length === 0 && !createModalOpen ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-gray-500 text-lg font-medium">
                No tags yet. Create your first tag to get started.
              </p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-6 py-3 rounded-xl tertiary-bg text-white text-sm font-medium cursor-pointer hover:opacity-90 transition-all duration-300 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Tag
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-10 gap-5">
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="flex items-center justify-center gap-3 h-full min-h-[180px] rounded-4xl tag-bg cursor-pointer shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200">
                    <Plus
                      className="w-10 h-10 text-gray-500"
                      strokeWidth={1.3}
                    />
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-10 border-t-2 border-color">
                {tags.map((tag) => (
                  <TagItem
                    key={tag.id}
                    tag={tag}
                    onDelete={deleteTag}
                    onUpdate={updateTag}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <CreateTagModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateTag={addTag}
        loading={isCreating}
      />
    </div>
  );
};

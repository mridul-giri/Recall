"use client";
import { useEffect, useState } from "react";
import { ContentType } from "../utils/constants";
import { useListContentFromTag } from "../hooks/useListContentFromTag";
import { useUserTags } from "../hooks/useUserTags";
import axios from "axios";
import { getErrorMessage } from "../utils/getErrorMessage";
import { toast } from "sonner";
import { EditTitleModal } from "./link/EditTitleModal";
import { AddTagModal } from "./link/AddTagModal";
import { X, Layers, PlayCircle, Image, File, Link } from "lucide-react";
import { LinkTable } from "./link/LinkTable";
import { ImageGrid } from "./image/ImageGrid";
import { ImagePopup } from "./image/ImagePopup";
import { VideoGrid } from "./video/VideoGrid";
import { VideoPopup } from "./video/VideoPopup";
import { DocumentGrid } from "./document/DocumentGrid";
import { DocumentPopup } from "./document/DocumentPopup";
import { LoaderOne, Spinner } from "@repo/ui";

const filterItems = [
  { icon: Link, label: "Link", id: ContentType.link },
  { icon: Image, label: "Image", id: ContentType.image },
  { icon: PlayCircle, label: "Video", id: ContentType.video },
  { icon: File, label: "Document", id: ContentType.document },
];

export const TagDetailDashboard = ({ tagId }: { tagId: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [contentType, setContentType] = useState<string>(ContentType.link);

  const {
    tagContent,
    domRef,
    fetchLoading,
    inititalLoading,
    hasMore,
    resetAndRefetchContentFromTag,
  } = useListContentFromTag(contentType, tagId);

  const { tags } = useUserTags();

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [contentId, setContentId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const [tagLoading, setTagLoading] = useState(false);
  const [titleLoading, setTitleLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [titleDialogOpen, setTitleDialogOpen] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [contentTags, setContentTags] = useState<any[]>([]);
  const [contentTagsLoading, setContentTagsLoading] = useState(false);

  const getContentTags = async (id?: string | null) => {
    const targetId = id ?? contentId;
    if (!targetId) return;

    setContentTagsLoading(true);
    try {
      const res = await axios.get(`/api/web/content/${targetId}/tags`);
      setContentTags(res.data.data);
    } catch (error) {
      toast.error(getErrorMessage(error), { position: "top-center" });
    } finally {
      setContentTagsLoading(false);
    }
  };

  const detachTagFromContent = async (detachTagId: string) => {
    try {
      await axios.delete(`/api/web/tag/${detachTagId}/contents/${contentId}`);
      toast.success("Tag detached from content", { position: "top-center" });
      resetAndRefetchContentFromTag();
      getContentTags();
    } catch (error) {
      toast.error(getErrorMessage(error), { position: "top-center" });
    }
  };

  const deleteContent = async (id: string, extension: string) => {
    if (!id || !extension) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/web/content/${id}`, {
        params: {
          extension,
        },
      });
      toast.success("Content has been deleted", { position: "top-center" });
      resetAndRefetchContentFromTag();
    } catch (error) {
      toast.error(getErrorMessage(error), { position: "top-center" });
    } finally {
      setDeleteLoading(false);
      setDetailOpen(false);
    }
  };

  const deleteLinkContent = async (id: string) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/web/content/${id}`);
      toast.success("Link has been deleted", { position: "top-center" });
      resetAndRefetchContentFromTag();
    } catch (error) {
      toast.error(getErrorMessage(error), { position: "top-center" });
    } finally {
      setDeleteLoading(false);
    }
  };

  const updateTitle = async () => {
    if (!contentId || !newTitle) return;
    setTitleLoading(true);
    try {
      await axios.patch(`/api/web/content/${contentId}`, { title: newTitle });
      toast.success("Title has been added", { position: "top-center" });
      resetAndRefetchContentFromTag();
    } catch (error) {
      toast.error(getErrorMessage(error), { position: "top-center" });
    } finally {
      setTitleLoading(false);
      setDetailOpen(false);
      setContentId(null);
      setSelectedItem(null);
      setNewTitle("");
      setTitleDialogOpen(false);
    }
  };

  const addTag = async (newTagId: string) => {
    if (!contentId || !newTagId) return;
    setTagLoading(true);
    try {
      await axios.post(`/api/web/tag/${newTagId}/contents`, {
        contentIds: [contentId],
      });
      toast.success("Tag has been added", { position: "top-center" });
      resetAndRefetchContentFromTag();
      getContentTags();
    } catch (error) {
      toast.error(getErrorMessage(error), { position: "top-center" });
    } finally {
      setTagLoading(false);
    }
  };

  const openDetail = (item: any) => {
    setSelectedItem(item);
    setContentId(item.contentId);
    setDetailOpen(true);
  };

  const openTitleModal = (id: string) => {
    setContentId(id);
    setTitleDialogOpen(true);
  };

  const openTagModal = (id: string) => {
    setContentId(id);
    setTagDialogOpen(true);
  };

  useEffect(() => {
    setContentTags([]);
    if (contentId) {
      getContentTags(contentId);
    }
  }, [contentId]);

  return (
    <div>
      {contentType === ContentType.link && (
        <>
          <LinkTable
            links={tagContent}
            onDelete={deleteLinkContent}
            onEditTitle={openTitleModal}
            onAddTag={openTagModal}
            inititalLoading={inititalLoading}
          />

          <EditTitleModal
            open={titleDialogOpen}
            value={newTitle}
            onClose={() => setTitleDialogOpen(false)}
            onSetTitle={setNewTitle}
            onUpdateTitle={updateTitle}
            loading={titleLoading}
          />

          <AddTagModal
            open={tagDialogOpen}
            onClose={() => setTagDialogOpen(false)}
            onAddTag={addTag}
            tags={tags}
            loading={tagLoading}
            contentTags={contentTags}
            contentTagsLoading={contentTagsLoading}
            onDetachTag={detachTagFromContent}
          />
        </>
      )}

      {contentType === ContentType.image && (
        <>
          <ImageGrid
            images={tagContent}
            inititalLoading={inititalLoading}
            onSelectedImage={openDetail}
          />
          <ImagePopup
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            image={selectedItem}
            onDelete={deleteContent}
            onAddTag={addTag}
            value={newTitle}
            onSetTitle={setNewTitle}
            onUpdateTitle={updateTitle}
            tags={tags}
            deleteLoading={deleteLoading}
            titleLoading={titleLoading}
            tagLoading={tagLoading}
            contentTags={contentTags}
            contentTagsLoading={contentTagsLoading}
            onDetachTag={detachTagFromContent}
          />
        </>
      )}

      {contentType === ContentType.video && (
        <>
          <VideoGrid
            videos={tagContent}
            inititalLoading={inititalLoading}
            onSelectVideo={openDetail}
          />
          <VideoPopup
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            video={selectedItem}
            onDelete={deleteContent}
            onAddTag={addTag}
            value={newTitle}
            onSetTitle={setNewTitle}
            onUpdateTitle={updateTitle}
            tags={tags}
            deleteLoading={deleteLoading}
            titleLoading={titleLoading}
            tagLoading={tagLoading}
            contentTags={contentTags}
            contentTagsLoading={contentTagsLoading}
            onDetachTag={detachTagFromContent}
          />
        </>
      )}

      {contentType === ContentType.document && (
        <>
          <DocumentGrid
            documents={tagContent}
            inititalLoading={inititalLoading}
            onSelectDocument={openDetail}
          />
          <DocumentPopup
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            document={selectedItem}
            onDelete={deleteContent}
            onAddTag={addTag}
            value={newTitle}
            onSetTitle={setNewTitle}
            onUpdateTitle={updateTitle}
            tags={tags}
            deleteLoading={deleteLoading}
            titleLoading={titleLoading}
            tagLoading={tagLoading}
            contentTags={contentTags}
            contentTagsLoading={contentTagsLoading}
            onDetachTag={detachTagFromContent}
          />
        </>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/5 overflow-hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`fixed bottom-20 md:bottom-24 right-4 sm:right-6 md:right-[80px] z-50 backdrop-blur-sm secondary-bg rounded-4xl shadow-xl border border-color p-5 w-72 origin-bottom-right transition-all duration-200 ease-out ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        }`}
      >
        <h3 className="text-lg font-semibold pb-2 mb-4 border-b border-color">
          Content Type
        </h3>
        <div className="flex flex-col gap-1">
          {filterItems.map((item) => (
            <button
              key={item.id}
              onClick={() => (setContentType(item.id), setIsOpen(false))}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors hover:bg-accent group"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-gray-500" />
                <span className="text-lg">{item.label}</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  contentType === item.id ? "tertiary-bg" : "border-color"
                }`}
              >
                {contentType === item.id && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 md:bottom-10 right-4 sm:right-6 md:right-[80px] flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full tertiary-bg text-white flex items-center justify-center shadow-lg cursor-pointer hover:opacity-90 transition-all duration-300"
        >
          <div className="relative w-5 h-5">
            <X
              className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
                isOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
              }`}
              strokeWidth={2.3}
            />
            <Layers
              className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
                isOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"
              }`}
              strokeWidth={2.3}
            />
          </div>
        </button>
      </div>

      {hasMore && !inititalLoading && fetchLoading && (
        <div className="flex items-center justify-center">
          <LoaderOne />
        </div>
      )}
      <div ref={domRef} style={{ height: "1px" }} />
    </div>
  );
};

"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Tag, Trash2, Pencil, Check, X } from "lucide-react";

export const TagItem = ({
  tag,
  onDelete,
  onUpdate,
}: {
  tag: { id: string; name: string };
  onDelete: (tagId: string) => void;
  onUpdate: (tagId: string, newTagName: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(tag.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== tag.name) {
      onUpdate(tag.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(tag.name);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col tag-bg rounded-4xl py-2 transition-all duration-300 shadow-md hover:shadow-lg h-full min-h-[180px] hover:border-color">
      <div className="flex items-center justify-between border-b pb-2 border-black/30">
        <div className="w-10 h-10 ml-2 flex items-center justify-center shrink-0">
          <Tag className="w-5 h-5 text-black" />
        </div>
        <div className="mr-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors cursor-pointer"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-500 transition-colors cursor-pointer"
                title="Edit tag name"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(tag.id);
                }}
                className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors cursor-pointer"
                title="Delete tag"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        {isEditing ? (
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              className="flex-1 h-9 px-3 rounded-lg border border-color bg-gray-50 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        ) : (
          <Link href={`/dashboard/tags/${tag.id}`}>
            <span className="text-lg font-medium ">{tag.name}</span>
          </Link>
        )}
      </div>
    </div>
  );
};

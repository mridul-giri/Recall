import { Trash2, Tag, Type } from "lucide-react";

export const LinkRow = ({ item, onDelete, onEditTitle, onAddTag }: any) => {
  return (
    <tr className="border-b border-color last:border-b-0 group hover:bg-accent/50 transition-colors">
      <td className="px-2 py-3"></td>
      <td className="px-4 py-3">
        <a
          href={item.url}
          target="_blank"
          className="max-w-32 sm:max-w-48 md:max-w-60 truncate block hover:text-blue-800"
        >
          {item.url}
        </a>
        <p className="text-sm text-gray-800">{item.title}</p>
      </td>
      <td className="text-sm px-4 py-3 md:table-cell">
        <span className="text-gray-700">{item.createdAt}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-evenly gap-1">
          <button
            onClick={() => onEditTitle(item.contentId)}
            className="p-1 rounded-md hover:bg-gray-300 transition-colors"
          >
            <Type className="w-4 h-4 cursor-pointer" strokeWidth={2.1} />
          </button>

          <button
            onClick={() => onAddTag(item.contentId)}
            className="p-1 rounded-md hover:bg-gray-300 transition-colors"
          >
            <Tag className="w-4 h-4 cursor-pointer" strokeWidth={2.1} />
          </button>

          <button
            onClick={() => onDelete(item.contentId)}
            className="p-1 rounded-md hover:bg-red-100 transition-colors"
          >
            <Trash2
              className="w-4 h-4 cursor-pointer text-red-600"
              strokeWidth={2.1}
            />
          </button>
        </div>
      </td>
    </tr>
  );
};

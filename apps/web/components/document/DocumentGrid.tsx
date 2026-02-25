import { FileText } from "lucide-react";
import { Skeleton } from "@repo/ui";

export const DocumentGrid = ({
  documents,
  onSelectDocument,
  inititalLoading,
}: any) => {
  return (
    <div className="my-10 mx-4 sm:mx-8 md:mx-[80px]">
      {inititalLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 transition-all duration-400">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-48 bg-black/10 rounded-4xl max-w-full"
            />
          ))}
        </div>
      ) : (
        <>
          {documents.length === 0 ? (
            <h3 className="text-center py-10 text-gray-500 text-xl font-medium">
              Nothing here yet. Add your first item to get started.
            </h3>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {documents.map((item: any, index: any) => (
                <button
                  key={index}
                  onClick={() => onSelectDocument(item)}
                  className="w-full rounded-4xl border border-color bg-white overflow-hidden text-left hover:shadow-md transition-shadow group cursor-pointer shadow-2xs"
                >
                  <div className="h-1 bg-gray-500/50 mx-5 rounded-4xl" />
                  <div className="relative h-36 bg-white rounded-t-2xl flex items-center justify-center">
                    <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white border border-color flex items-center justify-center">
                      <FileText className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-2xl font-bold text-gray-300 uppercase tracking-wider">
                      {item.extension
                        ? `.${item.extension.toUpperCase()}`
                        : "DOC"}
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {item.title || "Untitled Document"}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {item.createdAt}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

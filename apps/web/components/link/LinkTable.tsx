import { Skeleton } from "@repo/ui";
import { LinkRow } from "./LinkRow";

export const LinkTable = ({
  links,
  onDelete,
  onEditTitle,
  onAddTag,
  inititalLoading,
}: any) => {
  return (
    <div className="flex flex-col justify-center items-center my-10 mx-4 sm:mx-8 md:mx-[80px]">
      {inititalLoading ? (
        <div className="flex justify-center w-full max-w-4xl flex-col gap-2 mt-20 transition-all duration-300">
          {Array.from({ length: 12 }).map((_, index) => (
            <div className="flex gap-4 " key={index}>
              <Skeleton className="h-6 flex-1 rounded-4xl bg-black/10" />
              <Skeleton className="h-6 w-24 rounded-4xl bg-black/10" />
              <Skeleton className="h-6 w-24 rounded-4xl bg-black/10" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {links.length === 0 ? (
            <h1 className="text-center py-10 text-gray-500 text-xl font-medium">
              Nothing here yet. Add your first item to get started.
            </h1>
          ) : (
            <>
              <div className="transition-all duration-300 flex items-center justify-end mb-3 mr-2 w-full">
                <span className="font-medium text-gray-600">
                  {links.length} Links
                </span>
              </div>

              <div className="w-full rounded-4xl border border-color secondary-bg overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-color">
                      <th className="w-8 px-2 py-3"></th>
                      <th className="px-4 py-3 text-left font-medium">Link</th>
                      <th className="px-4 py-3 text-left font-medium ">
                        Created At
                      </th>
                      <th className="px-4 py-3 text-center font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {links.map((item: any, index: any) => (
                      <LinkRow
                        key={index}
                        item={item}
                        onDelete={onDelete}
                        onEditTitle={onEditTitle}
                        onAddTag={onAddTag}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

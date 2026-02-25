import Image from "next/image";
import { Skeleton } from "@repo/ui";

export const ImageGrid = ({
  images,
  onSelectedImage,
  inititalLoading,
}: any) => {
  return (
    <div className="my-10 mx-4 sm:mx-8 md:mx-[80px]">
      {inititalLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5 transition-all duration-400">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="aspect-video bg-black/10 rounded-4xl max-w-full"
            />
          ))}
        </div>
      ) : (
        <>
          {images.length === 0 ? (
            <h3 className="text-center py-10 text-gray-500 text-xl font-medium">
              Nothing here yet. Add your first item to get started.
            </h3>
          ) : (
            <div className="columns columns-2 sm:columns-2 md:columns-3 lg:columns-4 items-center self-center transition-all duration-300">
              {images.map((item: any, index: any) =>
                item.cloudfrontUrl ? (
                  <div key={index}>
                    <Image
                      src={item.cloudfrontUrl}
                      alt="image"
                      width={400}
                      height={400}
                      onClick={() => onSelectedImage(item)}
                      className="mb-5 w-full h-auto object-cover rounded-4xl cursor-pointer hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : null,
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

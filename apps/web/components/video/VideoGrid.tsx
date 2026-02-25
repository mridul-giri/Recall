import { Play } from "lucide-react";
import { Skeleton } from "@repo/ui";

export const VideoGrid = ({ videos, onSelectVideo, inititalLoading }: any) => {
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
          {videos.length === 0 ? (
            <h3 className="text-center py-10 text-gray-500 text-xl font-medium">
              Nothing here yet. Add your first item to get started.
            </h3>
          ) : (
            <div className="columns columns-2 sm:columns-2 md:columns-3 lg:columns-4 items-center self-center transition-all duration-300">
              {videos.map((item: any, index: any) =>
                item.cloudfrontUrl ? (
                  <div
                    key={index}
                    className="relative group cursor-pointer"
                    onClick={() => onSelectVideo(item)}
                  >
                    <video
                      src={item.cloudfrontUrl}
                      muted
                      preload="metadata"
                      className="mb-5 w-full h-auto object-cover rounded-4xl"
                    />
                    <div className="absolute inset-0 rounded-4xl bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <Play
                          className="w-6 h-6 text-gray-800 ml-1"
                          fill="currentColor"
                        />
                      </div>
                    </div>
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

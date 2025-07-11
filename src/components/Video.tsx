import { useState, type ChangeEvent } from "react";

interface Props {
  setParentVideo: any,
  setParentMetadata: any
}

export const Video = ( { setParentVideo, setParentMetadata }: Props ) => {
  const [urlVideo, setUrlVideo] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const worker = new Worker(new URL('../lib/ffmpegWorker.ts', import.meta.url), { type: 'module', });
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const video = event.target.files[0];
      setParentVideo(video);
      setUrlVideo(URL.createObjectURL(video));
      setIsLoading(true);

      worker.postMessage({
        action: "getMetadata",
        video: video
      })

      worker.onmessage = (event) => {
        if (event.data.finished) {
          worker.terminate();
        } else {
          const { metadata } = event.data;
          setParentMetadata(metadata);
          setIsLoading(false);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div> 
        <p className="text-center">Loading video...</p>
      </div>
    )
  }

  return (
    <>
      <label htmlFor="video" className="block mb-2 font-medium"> Upload Video </label>
      <input
        type="file"
        id="video"
        onChange={handleFileChange}
        className="w-full text-gray-400"
      />
      { urlVideo && (
        <div className="flex justify-center items-center mt-5">
          <video controls width="500" src={urlVideo} />
        </div>
      )}
    </>
  );
};
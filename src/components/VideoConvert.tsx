import { type ChangeEvent, useState } from 'react';
import type { VideoMetadata } from '../lib/common';

export const VideoConvert = ( { setParentUrls }: { setParentUrls: any } ) => {
  const [video, setVideo] = useState<File | undefined>(undefined);
  const [urlGif, setUrlGif] = useState<string>("");
  const [, setUrlImg] = useState<string>("");
  const [metadata, setMetadata] = useState<VideoMetadata>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [timeFrom, setTimeFrom] = useState<string>("");
  const [timeTo, setTimeTo] = useState<string>("");

  const worker = new Worker(new URL('../lib/ffmpegWorker.ts', import.meta.url), { type: 'module', });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const v = event.target.files[0];
      setIsLoading(true);

      worker.postMessage({
        action: "getMetadata",
        video: event.target.files[0]
      })

      worker.onmessage = (event) => {
        if (event.data.finished) {
          worker.terminate();
        } else {
          const { metadata } = event.data;
          setMetadata(metadata);
          setVideo(v);
          setUrlImg("");
          setUrlGif("");
          setIsLoading(false);
        }
      }
    }
  };

  const convertToGif = async () => {
    if (Number(timeTo) <= Number(timeFrom)) {
      throw new Error("Initial value must be less than the Final value.");
    }

    setIsProcessing(true);

    worker.postMessage({
      action: "getImgAndGif",
      video: video,
      metadata: metadata,
      gap: { from: timeFrom, to: timeTo }
    })
    
    worker.onmessage = (event) => {
      if (event.data.progress) {
        setProgress(event.data.progress);
      } else if (event.data.finished) {
        worker.terminate();
      } else {
        const { img, imgUrl, gif, gifUrl } = event.data;
        setUrlImg(imgUrl)
        setUrlGif(gifUrl);
        setParentUrls(gif, img);
        setIsProcessing(false);
      }
    }
  }

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
      { video && (
        <div className="mt-5">
          <div className="flex justify-center items-center mb-5">
            { isProcessing ? (
              <div className="flex flex-col text-center">
                <p>Processing...</p>
                <progress value={progress} />
              </div>
            ) : (
              (metadata && 
                <div className="flex flex-col text-center">
                  <video controls width="500" src={URL.createObjectURL(video)} />
                  <input
                    type="range"
                    min={0}
                    max={metadata.duration}
                    step={0.1}
                    value={timeFrom}
                    id="timeFrom"
                    onChange={(e) => setTimeFrom(e.target.value)}
                    className="p-2"
                  />
                  <input
                    type="range"
                    min={0}
                    max={metadata.duration}
                    step={0.1}
                    value={timeTo}
                    id="timeTo"
                    onChange={(e) => setTimeTo(e.target.value)}
                    className="p-2"
                  />
                </div>
              )
            )}
          </div>
          <div className="flex justify-center items-center">
            { urlGif ? (
              <img src={urlGif} width="500" />
            ) : (
              <button
                type="button"
                className="bg-blue-500 text-white mt-2 mb-2 px-4 py-2 rounded cursor-pointer"
                onClick={convertToGif}
                disabled={ isProcessing ? true : false }
              >
                  { isProcessing ? "Creating..." : "Create GIF" }
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
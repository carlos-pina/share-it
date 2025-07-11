import { useState } from 'react';
import type { VideoMetadata } from '../lib/common';

interface Props {
  video?: File, 
  videoMetadata?: VideoMetadata, 
  setParentUrls: any
}

export const VideoConvert = ( { video, videoMetadata, setParentUrls }: Props ) => {
  const [urlGif, setUrlGif] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [timeFrom, setTimeFrom] = useState<string>("");
  const [timeTo, setTimeTo] = useState<string>("");

  const worker = new Worker(new URL('../lib/ffmpegWorker.ts', import.meta.url), { type: 'module', });

  const convertToGif = async () => {
    if (Number(timeTo) <= Number(timeFrom)) {
      throw new Error("Initial value must be less than the Final value.");
    }

    setIsProcessing(true);
    setUrlGif("");

    worker.postMessage({
      action: "getImgAndGif",
      video: video,
      metadata: videoMetadata,
      gap: { from: timeFrom, to: timeTo }
    })
    
    worker.onmessage = (event) => {
      if (event.data.progress) {
        setProgress(event.data.progress);
      } else if (event.data.finished) {
        worker.terminate();
      } else {
        const { img, gif, gifUrl } = event.data;
        setUrlGif(gifUrl);
        setParentUrls(gif, img);
        setTimeFrom("");
        setTimeTo("");
        setIsProcessing(false);
      }
    }
  }

  return (
    <div className="mt-5">
      <div className="flex justify-center items-center mb-5">
        { isProcessing ? (
          <div className="flex flex-col text-center">
            <p>Processing...</p>
            <progress value={progress} />
          </div>
        ) : (
          (videoMetadata && 
            <div className="flex flex-col text-center">
              <input
                type="range"
                min={0}
                max={videoMetadata.duration}
                step={0.1}
                value={timeFrom}
                id="timeFrom"
                onChange={(e) => setTimeFrom(e.target.value)}
                className="p-2"
              />
              <p>{timeFrom}</p>
              <input
                type="range"
                min={0}
                max={videoMetadata.duration}
                step={0.1}
                value={timeTo}
                id="timeTo"
                onChange={(e) => setTimeTo(e.target.value)}
                className="p-2"
              />
              <p>{timeTo}</p>
              <button
                type="button"
                className="bg-blue-500 text-white mt-2 mb-2 px-4 py-2 rounded cursor-pointer"
                onClick={convertToGif}
                disabled={ isProcessing ? true : false }
              >
                { isProcessing ? "Creating..." : "Create GIF" }
              </button>
              <div className="flex justify-center items-center">
                { urlGif && ( <img src={urlGif} width="500" /> ) }
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
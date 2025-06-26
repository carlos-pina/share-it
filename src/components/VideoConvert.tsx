import { type ChangeEvent, useState } from 'react';

export const VideoConvert = ( { setParentUrls }: { setParentUrls: any } ) => {
  const [video, setVideo] = useState<File | undefined>(undefined);
  const [urlGif, setUrlGif] = useState<string>("");
  const [_, setUrlImg] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setVideo(event.target.files[0]);
      setUrlImg("");
      setUrlGif("");
    }
  };

  const convertToGif = async () => {
    setIsProcessing(true);

    const worker = new Worker(new URL('../lib/ffmpegWorker.ts', import.meta.url), { type: 'module', });

    worker.postMessage({
      video: video,
    });
    
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
    };
  }

  return (
    <>
      <label htmlFor="video" className="block mb-2 font-medium"> Upload Video </label>
      <input
        type="file"
        id="video"
        required
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
              <video controls width="500" src={URL.createObjectURL(video)} />
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
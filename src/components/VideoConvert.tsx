import { type ChangeEvent, useState } from 'react';
import { fetchFile } from '@ffmpeg/util';
import { Video } from "./Video"
import { useFfmpeg } from '../context/FfmpegContext';

export const VideoConvert = () => {
  const [video, setVideo] = useState<File | undefined>(undefined);
  const [urlGif, setUrlGif] = useState<string>("");
  const { ffmpeg, progress } = useFfmpeg();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setVideo(event.target.files[0]);
    }
  };

  const convertToGif = async () => {
    // Write the file to memory 
    await ffmpeg.writeFile('test.mp4', await fetchFile(video));

    // Exec the FFMpeg command
    await ffmpeg.exec(['-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif']);

    // Read the result
    const fileData = await ffmpeg.readFile("out.gif");
    const data = new Uint8Array(fileData as ArrayBuffer);

    // Set the url gif
    const url: string = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setUrlGif(url)
  }

  return (
    <>
      <Video />
      <div className="flex justify-center text-blue-500">
        {video ? (
          <div className="mt-10">
            <video controls width="250" src={URL.createObjectURL(video)} />
            <div className="text-center">
              <button 
                className="bg-blue-500 text-white mt-5 mb-5 px-4 py-2 rounded cursor-pointer"
                onClick={convertToGif}>
                  Convert
              </button>
            </div>
            { urlGif && <img src={urlGif} width="250" />}
            { progress && progress < 1 && <p className="text-xl font-bold pt-6 text-center text-yellow-500">{progress}</p>}
          </div>
          ) : (
          <div className="mt-10">
            <input
              type="file" 
              onChange={handleFileChange}
              className="bg-blue-500 text-white text-center mt-5 mb-5 px-4 py-2 rounded cursor-pointer"
            />
          </div>
        )}
      </div>
    </>
  );
};
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import type { gapData, VideoMetadata } from './common';

onmessage = async (event) => {
  const { action, video, metadata, gap } = event.data;

  if (action == "getMetadata") {
    getMetadata(video);
  } else if (action == "getImgAndGif") {
    getImgAndGif(video, metadata, gap);
  }
};

const getMetadata = async (video: File) => {
  let metadata: VideoMetadata = { 
    duration: "",
    size: 0,
    width: 0,
    height: 0
  };
  
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  // Write the file to memory 
  await ffmpeg.writeFile('test.mp4', await fetchFile(video));

  // Get metadata information
  await ffmpeg.ffprobe(["-v", "error", "-select_streams", "v:0", "-show_entries", "format=duration,size:stream=width,height", "-of", "default=noprint_wrappers=1", "test.mp4", "-o", "out.txt"]);
  
  const txt = await ffmpeg.readFile("out.txt");
  const txtData = new Uint8Array(txt as ArrayBuffer);
  
  // Get info in text format
  const text = await new Blob([txtData.buffer]).text();

  for (const line of text.split(/[\r\n]+/)) {
    const keyValue = line.split('=');
    if (keyValue.length == 2) {
      switch (keyValue[0]) {
        case "duration":
          metadata.duration = keyValue[1];
          break;
        case "size":
          metadata.size = Number(keyValue[1]);
          break;
        case "width":
          metadata.width = Number(keyValue[1]);
          break;
        case "height":
          metadata.height = Number(keyValue[1]);
          break;
      }
    }
  }

  postMessage({
    metadata: metadata,
  });

  postMessage({
    finished: true
  });
};

const getImgAndGif = async (video: File, metadata: VideoMetadata, gap: gapData) => {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  ffmpeg.on("progress", ({ progress }) => {
    postMessage({
      progress: progress
    });
  });

  const duration = Number(metadata.duration);
  const middle = duration * 0.5;
  const time = Number(gap.to) - Number(gap.from);
  const start = Number(gap.from);

  // Write the file to memory 
  await ffmpeg.writeFile('test.mp4', await fetchFile(video));

  // Create screenshot from FFMpeg command
  await ffmpeg.exec(['-ss', middle.toString(), '-i', 'test.mp4', '-frames:v', '1', '-vf', "scale='min(640,iw)':-1", '-r', '10', 'out.png']);  

  const img = await ffmpeg.readFile("out.png");
  const imgData = new Uint8Array(img as ArrayBuffer);

  // Set the url img
  const imgUrl = URL.createObjectURL(new Blob([imgData.buffer], { type: 'image/png' }));

  // Create gif from FFMpeg command
  await ffmpeg.exec(['-i', 'test.mp4', '-t', time.toString(), '-ss', start.toString(), '-vf', "scale='min(640,iw)':-1", '-r', '10', '-f', 'gif', 'out.gif']);

  // Read the result
  const gif = await ffmpeg.readFile("out.gif");
  const gifData = new Uint8Array(gif as ArrayBuffer);

  // Set the url gif
  const gifUrl = URL.createObjectURL(new Blob([gifData.buffer], { type: 'image/gif' }));
  
  postMessage({
    img: img,
    imgUrl: imgUrl,
    gif: gif,
    gifUrl: gifUrl,
  });

  postMessage({
    finished: true
  });
};

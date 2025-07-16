import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import type { gapData, VideoMetadata } from './common';

onmessage = async (event) => {
  const { action, video, gap } = event.data;

  if (action == "getMetadata") {
    getMetadata(video);
  } else if (action == "getImgAndGif") {
    getImgAndGif(video, gap);
  }
};

const getMetadata = async (video: File) => {
  const metadata: VideoMetadata = { 
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
  
  const txtData = await ffmpeg.readFile("out.txt");
  
  // Get info in text format
  const text = await new Blob([txtData]).text();

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

const getImgAndGif = async (video: File, gap: gapData) => {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  ffmpeg.on("progress", ({ progress }) => {
    postMessage({
      progress: progress
    });
  });

  const gapTo = Number(gap.to);
  const gapFrom = Number(gap.from);
  const time = gapTo - gapFrom;
  const middle = (time * 0.5) + gapFrom;
  const start = gapFrom;

  // Write the file to memory 
  await ffmpeg.writeFile('test.mp4', await fetchFile(video));

  // Create screenshot from FFMpeg command
  await ffmpeg.exec(['-ss', middle.toString(), '-i', 'test.mp4', '-frames:v', '1', '-vf', "scale='min(320,iw)':-1", 'out.png']);  

  const imgData = await ffmpeg.readFile("out.png");

  // Create gif from FFMpeg command
  await ffmpeg.exec(['-i', 'test.mp4', '-t', time.toString(), '-ss', start.toString(), '-vf', "fps=6,scale='min(320,iw)':-1", '-f', 'gif', 'out.gif']);

  // Read the result
  const gifData = await ffmpeg.readFile("out.gif");
  
  postMessage({
    img: imgData,
    gif: gifData,
  });

  postMessage({
    finished: true
  });
};

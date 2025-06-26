import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

onmessage = async (event) => {
  const { video } = event.data;
  
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  ffmpeg.on("progress", ({ progress }) => {
    postMessage({
      progress: progress
    });
  });

  // Write the file to memory 
  await ffmpeg.writeFile('test.mp4', await fetchFile(video));

  // Create screenshot from FFMpeg command
  await ffmpeg.exec(['-ss', '1.0', '-i', 'test.mp4', '-frames:v', '1', 'out.png']);  

  const img = await ffmpeg.readFile("out.png");
  const imgData = new Uint8Array(img as ArrayBuffer);

  // Set the url img
  const imgUrl = URL.createObjectURL(new Blob([imgData.buffer], { type: 'image/png' }));

  // Create gif from FFMpeg command
  await ffmpeg.exec(['-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif']);

  // Read the result
  const gif = await ffmpeg.readFile("out.gif");
  const gifData = new Uint8Array(gif as ArrayBuffer);

  // Set the url gif
  const gifUrl = URL.createObjectURL(new Blob([gifData.buffer], { type: 'image/gif' }));
  
  postMessage({
    img: img,
    imgUrl: imgUrl,
    gif: gif,
    gifUrl: gifUrl
  });

  postMessage({
    finished: true
  });
};

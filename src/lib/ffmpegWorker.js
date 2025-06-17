import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

onmessage = async (event) => {
  const { videoUrls, action, options } = event.data;
  const ffmpeg = new FFmpeg();

  await ffmpeg.load();
  let outputFileName = 'output.mp4';

  if (action === 'extractAudio') {
    outputFileName = 'output.mp3';
  }

  if (videoUrls.length === 1) {
    await fetchAndWriteFile(ffmpeg, videoUrls[0]);

    if (action === 'cut') {
      await cutVideos(ffmpeg, options.cutStart, options.cutEnd);
    }

    if (action === 'extractAudio') {
      await extractAudio(ffmpeg);
    }
  } else if (videoUrls.length > 1 && action === 'combine') {
    await combineVideos(ffmpeg, videoUrls);
  }

  const data = await ffmpeg.readFile(outputFileName);

  if (action === 'extractAudio') {
    postMessage({ audioData: data.buffer });
  } else {
    postMessage({ videoData: data.buffer });
  }
};

async function fetchAndWriteFile(ffmpeg, url, index = 0) {
  const videoData = await fetchFile(url);
  await ffmpeg.writeFile(`input${index}.mp4`, videoData);
}

async function combineVideos(ffmpeg, videoUrls) {
  for (let i = 0; i < videoUrls.length; i++) {
    const videoData = await fetchFile(videoUrls[i]);
    await ffmpeg.writeFile(`input${i}.mp4`, videoData);
  }

  const concatFile = 'concat.txt';
  const concatContent = videoUrls.map((_, i) => `file 'input${i}.mp4'`).join('\n');
  await ffmpeg.writeFile(concatFile, new TextEncoder().encode(concatContent));
  await ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', concatFile, '-c', 'copy','-y', 'output.mp4']);
}

async function cutVideos(ffmpeg, cutStart, cutEnd) {
  await ffmpeg.exec(['-i', 'input0.mp4', '-ss', cutStart, '-to', cutEnd, '-c:v', 'libx264', '-c:a', 'aac','-y', 'output.mp4']);
}

async function extractAudio(ffmpeg) {
  await ffmpeg.exec(['-i', 'input0.mp4', '-q:a', '0', '-map', 'a', '-y', 'output.mp3']);
}
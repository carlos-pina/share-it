import { useState } from "react";

const worker = new Worker(new URL('../lib/ffmpegWorkerExample.js', import.meta.url), { type: 'module', });

export const Video = () => {
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddUrl = () => {
    if (videoUrls.length < 2) {
      setVideoUrls([...videoUrls, '']);
    }
  };

  const handleRemoveUrl = (index: number) => {
    if (videoUrls.length > 1) {
      const updatedUrls = videoUrls.filter((_, idx) => idx !== index);
      setVideoUrls(updatedUrls);
    }
  };

  const handleUrlChange = (index: number, value: string) => {
    const updatedUrls = videoUrls.map((url, idx) => (idx === index ? value : url));
    setVideoUrls(updatedUrls);
  };

  const combineVideos = () => {
    setIsProcessing(true);
    worker.postMessage({
      videoUrls,
      action: 'combine',
    });

    worker.onmessage = (event) => {
      const { videoData } = event.data;
      const url = URL.createObjectURL(new Blob([videoData], { type: 'video/mp4' }));
      setVideoSrc(url);
      setIsProcessing(false);
    };
  };

  const cutVideo = (cutStart: string, cutEnd: string) => {
    setIsProcessing(true);
    worker.postMessage({
      videoUrls: [videoUrls[0]],
      action: 'cut',
      options: { cutStart, cutEnd },
    });
    
    worker.onmessage = (event) => {
      const { videoData } = event.data;
      const url = URL.createObjectURL(new Blob([videoData], { type: 'video/mp4' }));
      setVideoSrc(url);
      setIsProcessing(false);
    };
  };

  const extractAudio = () => {
    setIsProcessing(true);
    worker.postMessage({
      videoUrls: [videoUrls[0]],
      action: 'extractAudio',
    });
    
    worker.onmessage = (event) => {
      const { audioData } = event.data;
      const url = URL.createObjectURL(new Blob([audioData], { type: 'audio/mp3' }));
      setAudioSrc(url);
      setIsProcessing(false);
    };
  };
  
  return (
    <div className="text-center space-x-5 text-blue-500">
      
      {videoUrls.map((url, index) => (
        <div key={index}>
          <input
            type="text"
            value={url}
            onChange={(e) => handleUrlChange(index, e.target.value)}
            placeholder="Enter video URL"
          />
          <button onClick={() => handleRemoveUrl(index)} disabled={videoUrls.length <= 1}>
            Remove
          </button>
        </div>
      ))}

      {videoUrls.length < 2 && (
        <button onClick={handleAddUrl} disabled={isProcessing}>
          Add Video URL
        </button>
      )}
      
      <button onClick={combineVideos} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Combine Videos'}
      </button>
      
      <button onClick={() => cutVideo('00:00:10', '00:00:30')} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Cut Video'}
      </button>
      
      <button onClick={extractAudio} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Extract Audio'}
      </button>
      
      {videoSrc && (
        <video controls width="600" src={videoSrc} />
      )}
      
      {audioSrc && (
        <audio controls src={audioSrc} />
      )}
    </div>
  );
};
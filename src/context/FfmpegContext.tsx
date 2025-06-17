import { FFmpeg } from "@ffmpeg/ffmpeg";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface FfmpegContextType {
  ffmpeg: FFmpeg;
  message: string;
  progress: number;
}

const FfmpegContext = createContext<FfmpegContextType | undefined>(undefined);

export const FfmpegProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const ffmpegRef = useRef<FFmpeg>(new FFmpeg());

  const load = async () => {
    const ffmpeg = ffmpegRef.current;

    ffmpeg.on("log", ({ type, message }) => {
      setMessage(type + " - " + message);
    });

    ffmpeg.on("progress", ({ progress }) => {
      setProgress(progress);
    });

    if (await ffmpeg.load()) {
      console.log("FFmpeg Loaded.");
    } else {
      throw new Error("Error loading ffmpeg.");
    }

    return () => {
      ffmpeg.terminate();
      console.log("FFmpeg Terminated.");
    };
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <FfmpegContext.Provider value={{ ffmpeg: ffmpegRef.current, message, progress }}>
      {children}
    </FfmpegContext.Provider>
  );
};

export const useFfmpeg = (): FfmpegContextType => {
  const context = useContext(FfmpegContext);
  if (context === undefined) {
    throw new Error("useFfmpeg must be used within the FfmpegProvider");
  }
  return context;
};

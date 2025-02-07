import { SetUp } from "./pages/SetUp/SetUp";
import { useState } from "react";
import "./App.css";

function App() {
  const [audioFileBuffer, setAudioFileBuffer] = useState<ArrayBuffer | null>(
    null
  );
  const [videoFileBuffer, setVideoFileBuffer] = useState<ArrayBuffer | null>(
    null
  );

  const [fps, setFps] = useState("");
  const [duration, setDuration] = useState("");
  const [pointCount, setPointCount] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [maxDistThresh, setMaxDistThresh] = useState("");

  return (
    <SetUp
      audioFileBuffer={audioFileBuffer}
      videoFileBuffer={videoFileBuffer}
      fps={fps}
      duration={duration}
      pointCount={pointCount}
      width={width}
      height={height}
      maxDistThresh={maxDistThresh}
      setAudioFileBuffer={setAudioFileBuffer}
      setVideoFileBuffer={setVideoFileBuffer}
      setFps={setFps}
      setDuration={setDuration}
      setPointCount={setPointCount}
      setWidth={setWidth}
      setHeight={setHeight}
      setMaxDistThresh={setMaxDistThresh}
    />
  );
}

export default App;

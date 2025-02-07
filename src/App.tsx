import { SetUp } from "./pages/SetUp/SetUp";
import { Renderer } from "./pages/Renderer/Renderer";
import { useState } from "react";
import "./App.css";
import { PANELS } from "./constants";

function App() {
  const [panel, setPanel] = useState<string>(PANELS.RENDERER);

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

  const goToPanel = (val: string) => {
    setPanel(val);
  };

  return (
    <>
      {panel === PANELS.SET_UP && (
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
          goToPanel={goToPanel}
        />
      )}
      {panel === PANELS.RENDERER && (
        <Renderer
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
          goToPanel={goToPanel}
        />
      )}
    </>
  );
}

export default App;

import { SetUp } from "./pages/SetUp/SetUp";
import { Renderer } from "./pages/Renderer/Renderer";
import { useState } from "react";
import "./App.css";
import { PANELS } from "./constants";

function App() {
  const [panel, setPanel] = useState<string>(PANELS.SET_UP);

  const [audioFileBuffer, setAudioFileBuffer] = useState<ArrayBuffer | null>(
    null
  );
  const [videoFileBuffer, setVideoFileBuffer] = useState<ArrayBuffer | null>(
    null
  );

  const [fps, setFps] = useState<number>(40);
  const [duration, setDuration] = useState<number>(0);
  const [pointCount, setPointCount] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maxDistThresh, setMaxDistThresh] = useState<number>(0);
  const [rngSeed,setRngSeed] = useState<number>(-1);
  const [instanceUUID, setInstanceUUID] = useState<string>("");

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
          rngSeed={rngSeed}
          instanceUUID={instanceUUID}
          setAudioFileBuffer={setAudioFileBuffer}
          setVideoFileBuffer={setVideoFileBuffer}
          setFps={setFps}
          setDuration={setDuration}
          setPointCount={setPointCount}
          setWidth={setWidth}
          setHeight={setHeight}
          setMaxDistThresh={setMaxDistThresh}
          setRngSeed={setRngSeed}
          setInstanceUUID={setInstanceUUID}
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
          rngSeed={rngSeed}
          instanceUUID={instanceUUID}
          setAudioFileBuffer={setAudioFileBuffer}
          setVideoFileBuffer={setVideoFileBuffer}
          setFps={setFps}
          setDuration={setDuration}
          setPointCount={setPointCount}
          setWidth={setWidth}
          setHeight={setHeight}
          setMaxDistThresh={setMaxDistThresh}
          setRngSeed={setRngSeed}
          setInstanceUUID={setInstanceUUID}
          goToPanel={goToPanel}
        />
      )}
    </>
  );
}

export default App;

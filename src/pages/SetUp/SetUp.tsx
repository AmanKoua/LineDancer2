import "./SetUp.css";
import { useState } from "react";
import { SetState, ICorePageProps } from "../../types";
import { PANELS } from "../../constants";

export const SetUp = ({
    audioFileBuffer,
    videoFileBuffer,
    fps,
    duration,
    pointCount,
    width,
    height,
    maxDistThresh,
    setAudioFileBuffer,
    setVideoFileBuffer,
    setFps,
    setDuration,
    setPointCount,
    setWidth,
    setHeight,
    setMaxDistThresh,
    goToPanel
}:ICorePageProps) => {
  const continueHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!audioFileBuffer || !videoFileBuffer) {
      alert("missing audio or video file");
      return;
    }

    if (!getIsValidRange(fps, 1, 100, "fps")) {
      return;
    }

    if (!getIsValidRange(duration, 1, 120, "duration")) {
      return;
    }

    if (!getIsValidRange(width, 100, 1500, "width")) {
      return;
    }

    if (!getIsValidRange(height, 100, 1500, "height")) {
      return;
    }

    if (!getIsValidRange(maxDistThresh, 1, 1500, "maxDistThresh")) {
      return;
    }

    goToPanel(PANELS.RENDERER);

  };

  const getIsValidRange = (
    value: string,
    min: number,
    max: number,
    name: string
  ): boolean => {
    if (
      !value ||
      Number.parseInt(value) < min ||
      Number.parseInt(value) > max ||
      Number.isNaN(Number.parseInt(value))
    ) {
      alert(`Invalid ${name} value!`);
      return false;
    }

    return true;
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const fileListLen = e.target.files.length;

    if (fileListLen != 1) {
      return;
    }

    const isValidFileType = ["audio/mpeg"].includes(e.target.files[0].type);

    if(!isValidFileType){
        alert("invalid audio file format!"); 
        return;
    }

    setAudioFileBuffer(await e.target.files[0].arrayBuffer());
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const fileListLen = e.target.files.length;

    if (fileListLen != 1) {
      return;
    }

    const isValidFileType = ["video/mp4"].includes(e.target.files[0].type);

    if(!isValidFileType){
        alert("invalid video file format!"); 
        return;
    }

    setVideoFileBuffer(await e.target.files[0].arrayBuffer());
  };

  return (
    <main>
      <section className="setup__section">
        <h1>Set up</h1>
        <form className="section__form">
          <fieldset className="section__fieldset">
            <div className="fieldset__inputcard">
              <label>Video (mp4)</label>
              <input
                type="file"
                accept="video/mp4"
                onChange={handleVideoUpload}
              ></input>
            </div>

            <div className="fieldset__inputcard">
              <label>Audio (mp3)</label>
              <input
                type="file"
                accept="audio/mpeg"
                onChange={handleAudioUpload}
              ></input>
            </div>

            <div className="fieldset__inputcard">
              <label>frames per second</label>
              <input
                type="text"
                value={fps}
                onChange={(e) => {
                  setFps(e.target.value);
                }}
              ></input>
            </div>

            <div className="fieldset__inputcard">
              <label>duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                }}
              ></input>
            </div>

            <div className="fieldset__inputcard">
              <label>Point Count</label>
              <input
                type="text"
                value={pointCount}
                onChange={(e) => {
                  setPointCount(e.target.value);
                }}
              ></input>
            </div>

            <div className="fieldset__inputcard">
              <label>Width</label>
              <input
                type="text"
                value={width}
                onChange={(e) => {
                  setWidth(e.target.value);
                }}
              ></input>
            </div>

            <div className="fieldset__inputcard">
              <label>Height</label>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              ></input>
            </div>

            <div className="fieldset__inputcard">
              <label>Max dist thresh</label>
              <input
                type="text"
                value={maxDistThresh}
                onChange={(e) => setMaxDistThresh(e.target.value)}
              ></input>
            </div>
          </fieldset>
          <button className="form__submit" onClick={continueHandler}>
            Generate
          </button>
        </form>
      </section>
    </main>
  );
};

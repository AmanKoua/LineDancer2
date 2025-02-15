# Description

A nice side project, where I turn code into art. With this project, I will visualize black and white videos
as a series of lines that respond to music.

# Requirements

The UI (render process) will support 2 modes. 1 mode will be for generating the files required for artistic playback,
and the 2nd mode will be the artistic playback mode.

In the preparation mode, the user will provide the video, audio, and configuration options they'd like to generate.
Configuration options will include point count, max dist thresh, randomness seed, width, height, etc. From this information,
the application will serialize and persist the data required for artistic playback (as protobuf).

In the artistic playback mode, the application will generate a series of pseudo-random (from seed) points that travel
across the canvas. When the distance of 2 points is below a certain threshold AND both points are within the dark region
of the video, a line will be drawn. The dist threshold will be determined by the volume of the audio at that given point
in time. The audio will be played alongside the visual. Processing that is too intensive to be performed in real-time will
have been cached and serialized (as protobuf) to be used by the app at runtime.

# Usage notes (WIP temporary steps)

NOTE : The application is still in development, but it's at a point where the main functionality has been implemented. The steps required for the application to run properly will change, based on code changes made over time.

- Install required packages with "npm install"
- Execute "npm run dev" to start the application
- Upload an mp4 file (short ~30s videos that are purely black and white work best. Lorn - Anvil's music video at 2:24 is a perfect example).
- Upload an mp3 file (songs with lots of dynamic range have the most apparent visual effect. first 30s of player - baby come back work well.).
- ignore the rest of the paramaters on the set up page (they're hard coded for testing)
- click generate
- let application run for the duration of the video. There will be a "data" folder created. in another subfolder there will be "points.json". Note : at this point, now visuals will be drawn.
- Manually delete the "lineDataProto.bin" folder within the subfolder.
- Repeat the following steps : upload THE SAME mp3 & mp4, click generate, let app run until end of video. lineDataProto.bin should be in the folder. Note : at this point, now visuals will be drawn.
- Repat the same steps : upload THE SAME mp3 & mp4, click generate, let app run until end of video. This time, there will be visuals drawn.

hmu for any questions.
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
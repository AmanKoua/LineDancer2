import { ICorePageProps, IPoint } from "../../types";
import { useRef, useEffect } from "react";
import * as proto from "protobufjs";
import { createSeededRNG, sleep } from "./utils/utils";

import "./Renderer.css";
import {
  getSerializedEncodedLineData,
  getSerializedPointsData,
  registerIpcHandler,
  serializeAndPersistEncodedLineData,
  serializeAndPersistPointData,
} from "../rendererIpcService";
import { Point } from "./utils/point";
import { Bitmap } from "./utils/bitmap";
import {
  ENCODED_POINT_INDICES_PROTO_DEFINITION,
  Uint32Matrix,
} from "./constants";

export const Renderer = ({
  audioFileBuffer,
  videoFileBuffer,
  fps,
  duration,
  pointCount,
  width,
  height,
  maxDistThresh,
  rngSeed,
  instanceUUID,
  setAudioFileBuffer,
  setVideoFileBuffer,
  setFps,
  setDuration,
  setPointCount,
  setWidth,
  setHeight,
  setMaxDistThresh,
  setInstanceUUID,
  goToPanel,
}: ICorePageProps) => {
/*
  NOTE : Works, but cannot initialize points and protobuf in same go. Run once to save points, then next time for protobuf
*/

  // TODO : remove temp initialization values!
  pointCount = 1000; // TODO : NOTE - Data folder seems to need to be deleted when the pointcount changes (fails otherwise)
  width = 500;
  height = 500;
  maxDistThresh = 20;
  fps = 30; // TODO : revert after testing (to ~30)
  rngSeed = 1360736; // TODO : take rngSeed from setup component. Store RNGseed in data dir
  // instanceUUID = uuidv4();
  instanceUUID = "9893b066-a0b3-4583-a749-9f078b1f9cae"; // TODO : take instanceUUID from setup component

  let canvasRef = useRef<HTMLCanvasElement>(null);
  let canvasRefAux = useRef<HTMLCanvasElement>(null);
  let videoRef = useRef<HTMLVideoElement>(null);
  let renderInterval: NodeJS.Timeout | undefined = undefined;
  let clearRenderInterval: NodeJS.Timeout | undefined = undefined;
  let points: Point[] = [];
  let updatePointsCallCount = 0;
  const pointsDarknessBitmap = new Bitmap(pointCount);
  const linePointIndicesMap = new Map<number, any>(); // key will be a 32 bit int (encodes 2 16 bit ints)
  let decodedPointIndicesArr: Uint32Array[] | null = null;
  let decodedPointIndicesIdx: number = 0;
  let encodedPointIdicesArr: number[][] = []; // Each uint32[][] represents the point indices for lines, for 1 call of draw() (time tick).
  let encodedLineDataBuffer: Buffer<ArrayBufferLike> | null = null;
  let didGetEncodedLineDataBufferFromDisk = false;

  const updatePoints = (val: IPoint[]) => {
    updatePointsCallCount++;
    points = [];

    for (let i = 0; i < val.length; i++) {
      points.push(Point.constructFromPointData(val[i], i));
    }
  };

  const updateLinePointIndicesMap = (val: number) => {
    linePointIndicesMap.set(val, 0);
  };

  const setEncodedLineDataBuffer = (val: Buffer<ArrayBufferLike> | null) => {
    encodedLineDataBuffer = val;
  };

  registerIpcHandler(points, updatePoints, setEncodedLineDataBuffer);

  const setPointsFromPersistedData = async (): Promise<boolean> => {
    let dataRetrievalAttempts = 0;

    while (dataRetrievalAttempts < 3) {
      getSerializedPointsData(instanceUUID);
      await sleep(500);

      const didRetrievalAttemptComplete = updatePointsCallCount > 0;

      if (!didRetrievalAttemptComplete) {
        dataRetrievalAttempts++;
        continue;
      }

      return points.length > 0;
    }

    return false;
  };

  const initializePoints = async () => {
    let didSetPointsFromPersistedData: boolean =
      await setPointsFromPersistedData();

    if (didSetPointsFromPersistedData) {
      return;
    }

    const w = width;
    const h = height;
    const pc = pointCount;

    var rng = createSeededRNG(rngSeed);

    for (let i = 0; i < pc; i++) {
      points.push(
        new Point(
          Math.floor(rng() * w),
          Math.floor(rng() * h),
          rng() * 3 + 1,
          rng() * 3 + 1,
          i
        )
      );
    }

    serializeAndPersistPointData(points, instanceUUID);
  };

  const draw = async () => {
    if (points.length == 0) {
      await initializePoints();
    }

    if (points.length < pointCount - 1) {
      return;
    }

    if (!canvasRef.current || !canvasRefAux.current) {
      return;
    }

    const ctx: CanvasRenderingContext2D = canvasRef.current.getContext("2d")!;
    const ctxAux: CanvasRenderingContext2D =
      canvasRefAux.current.getContext("2d")!;
    const w = width;
    const h = height;
    const pc = pointCount;

    ctx.clearRect(0, 0, w, h);

    if (!didGetEncodedLineDataBufferFromDisk) {
      ctxAux.clearRect(0, 0, w, h);
      ctxAux.drawImage(videoRef.current!, 0, 0, width, height); // NOTE : the 4th and 5th arguments determine video scaling, when displaying to the convas.

      refreshPointsToDarknessBitmap(pc, ctxAux);
      linePointIndicesMap.clear();

      for (let i = 0; i < pc; i++) {
        points[i].draw(
          pointsDarknessBitmap,
          ctx,
          pointCount,
          points,
          maxDistThresh,
          updateLinePointIndicesMap
        );
        points[i].updatePosition(w, h);
        // break;
      }

      let encodedPointIndicesPairs = Array.from(linePointIndicesMap.keys());
      encodedPointIdicesArr.push(encodedPointIndicesPairs); // NOTE : this will most likely become very large!
    } else {
      if (decodedPointIndicesIdx >= decodedPointIndicesArr!.length) {
        return;
      }

      /*
        NOTE : 
        Not 100% sure what happened, but the decodedPointIndicesArr is NOT a Uint32Array[].
        It is assigned as such, but somewhere along the way it's converted to the following type:

        {
          0: {
            values: [2646,462642,2426]
          },
          1:{
            ...
          }
        }

      */

      Point.drawLinesToOtherPointsFromDiskData(
        ctx,
        points,
        decodedPointIndicesArr![`${decodedPointIndicesIdx}`].values as unknown as  number[], // hacky, but necessary
        width,
        height
      );

      decodedPointIndicesIdx++;
    }
  };

  const refreshPointsToDarknessBitmap = (
    pc: number,
    ctxAux: CanvasRenderingContext2D
  ) => {
    for (let i = 0; i < pc; i++) {
      const isPixelInDarkSpace = getIsPixelInDarkSpace(
        ctxAux,
        points[i].x,
        points[i].y
      );
      pointsDarknessBitmap.setBitValue(i, isPixelInDarkSpace);
    }
  };

  const getIsPixelInDarkSpace = (
    ctxAux: CanvasRenderingContext2D,
    x: number,
    y: number
  ): boolean => {
    if (x + 1 > width || y + 1 > height || x < 0 || y < 0) {
      return false;
    }

    const imageData = ctxAux.getImageData(x, y, 1, 1);
    return imageData.data[0] + imageData.data[1] + imageData.data[2] < 30;
  };

  const getEncodedLineDataBuffer = async (): Promise<boolean> => {
    let refreshCount = 0;
    getSerializedEncodedLineData(instanceUUID);

    while (refreshCount < 10) {
      await sleep(100);

      if (encodedLineDataBuffer) {
        return true;
      }

      refreshCount++;
    }

    return false;
  };

  const setDecodedPointIndicesArr = async () => {
    const root = proto.parse(ENCODED_POINT_INDICES_PROTO_DEFINITION).root;
    const uint32Matrix = root.lookupType("Uint32Matrix");
    const decoded = uint32Matrix.decode(encodedLineDataBuffer!);

    let decodedData = decoded as unknown as Uint32Matrix;
    decodedPointIndicesArr = decodedData.rows;
  };

  const startRendering = async () => {
    if (
      !canvasRef.current ||
      renderInterval !== undefined ||
      !videoRef.current
    ) {
      return;
    }

    if (!encodedLineDataBuffer) {
      didGetEncodedLineDataBufferFromDisk = await getEncodedLineDataBuffer();
    }

    if (didGetEncodedLineDataBufferFromDisk) {
      await setDecodedPointIndicesArr();
    }

    videoRef.current.play();

    renderInterval = setInterval(() => {
      draw();
    }, fps);

    if (!clearRenderInterval) {
      clearRenderInterval = setInterval(() => {
        if (videoRef.current?.ended) {
          handleVideoEnding();
        }
      }, 500);
    }
  };

  const handleVideoEnding = async () => {
    clearInterval(renderInterval);
    clearInterval(clearRenderInterval);
    serializeAndPersistEncodedLineData(encodedPointIdicesArr, instanceUUID);
  };

  useEffect(() => {
    if (renderInterval) {
      return;
    }

    const temp = setInterval(() => {
      startRendering();

      if (renderInterval) {
        clearInterval(temp);
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    if (!videoFileBuffer) {
      return;
    }

    const blob = new Blob([videoFileBuffer]);
    videoRef.current.src = URL.createObjectURL(blob);
  }, [videoRef.current]);

  return (
    <main className="renderer__main">
      <video
        width={width}
        height={height}
        ref={videoRef}
        className="renderer__video"
        controls
        muted={true}
      ></video>
      <canvas
        width={width}
        height={height}
        className="renderer__canvas__aux"
        id="canvas-aux"
        ref={canvasRefAux}
      ></canvas>
      <canvas
        width={width}
        height={height}
        className="renderer__canvas"
        id="canvas"
        ref={canvasRef}
      ></canvas>
    </main>
  );
};

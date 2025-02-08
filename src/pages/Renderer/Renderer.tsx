import { ICorePageProps, IPoint } from "../../types"
import { useRef, useEffect} from "react";
import { createSeededRNG, sleep } from "./utils";
import {v4 as uuidv4} from "uuid";
import { ipcRenderer } from "electron";

import "./Renderer.css";
import { getSerializedPointsData, registerIpcHandler, serializeAndPersistPointData } from "../rendererIpcService";
import { Point } from "./point";

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
    goToPanel
}:ICorePageProps) => {

    // TODO : remove temp initialization values!
    pointCount = 300;
    width = 500;
    height = 500;
    maxDistThresh = 30;
    fps = 1000; // TODO : revert after testing (to ~30)
    rngSeed = 1360736; // TODO : take rngSeed from setup component. Store RNGseed in data dir
    // instanceUUID = uuidv4();
    instanceUUID = "9893b066-a0b3-4583-a749-9f078b1f9cae"; // TODO : take instanceUUID from setup component

    let canvasRef = useRef<HTMLCanvasElement>(null);
    let videoRef = useRef<HTMLVideoElement>(null);
    let renderInterval: NodeJS.Timeout | undefined = undefined;
    let points: Point[] = [];
    let updatePointsCallCount = 0;
    
    const updatePoints = (val: IPoint[]) => {
        updatePointsCallCount++;
        points = [];

        for(let i = 0; i < val.length; i++){
            points.push(Point.constructFromPointData(val[i]))
        }
    }

    registerIpcHandler(points, updatePoints);

    const getPeristedPointData = async (): Promise<boolean> => {
        let dataRetrievalAttempts = 0;

        while(dataRetrievalAttempts < 3) {
            getSerializedPointsData(instanceUUID);
            await sleep(500);
    
            const didRetrievalAttemptComplete = updatePointsCallCount > 0;

            if(!didRetrievalAttemptComplete){
                dataRetrievalAttempts++;
                continue;
            }

            return points.length > 0;
        }

        return false;
    }

    const initializePoints = async () => {

        let didGetPersistedPointsData: boolean = await getPeristedPointData();

        if(didGetPersistedPointsData){
            return;
        }

        const w = width;
        const h = height;
        const pc = pointCount;

        var rng = createSeededRNG(rngSeed);

        for(let i = 0; i < pc; i++){
            points.push(
                new Point(
                    Math.floor(rng() * w),
                    Math.floor(rng() * h),
                    (rng() * 3) + 1,
                    (rng() * 3) + 1,
                )
            )
        }

        serializeAndPersistPointData(points, instanceUUID);
        
    }

    const draw = async () => {
    
        if(points.length == 0){
           await initializePoints();
        }

        if(!canvasRef.current){
            return;
        }

        const ctx: CanvasRenderingContext2D = canvasRef.current.getContext("2d")!;
        const w = width;
        const h = height;
        const pc = pointCount;

        ctx.clearRect(0,0,w,h);
        ctx.globalAlpha = 0.4;
        ctx.drawImage(videoRef.current!, 0, 0); // draws video on top of canvas
        ctx.globalAlpha = 1;

        /**
         * TODO : STOPPED HERE!
         * 
         * Each pixed will be added as 4 uint8 values to that imageData.data array.
         * values will be in RGBA order. Get the pixel's brightness.
         * 
         */
        const imageData = ctx.getImageData(0,0,width,height);


        for(let i = 0; i < pc; i++){
            points[i].draw(ctx, pointCount, points, maxDistThresh);
            points[i].updatePosition(w,h);
        }

    }

    const startRendering = () => {

        if(!canvasRef.current || renderInterval !== undefined){
            return;
        }

        renderInterval = setInterval(()=>{
            draw();
        }, fps)

    }

    useEffect(()=>{

        if(renderInterval){
            return;
        }

        const temp = setInterval(()=>{
            startRendering();

            if(renderInterval){
                clearInterval(temp);
            }
        },100);

    },[])

    useEffect(()=>{

        if(!videoRef.current){
            return;
        }

        if(!videoFileBuffer){
            return;
        }

        const blob = new Blob([videoFileBuffer]);
        videoRef.current.src = URL.createObjectURL(blob);

    },[videoRef.current])

    return <main className="renderer__main">
        <video width={width} height={height} ref={videoRef} style={{display:"block"}}controls></video>
        <canvas width={width} height={height} className="renderer__canvas" id="canvas" ref={canvasRef}></canvas>
    </main>
}
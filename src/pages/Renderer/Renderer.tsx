import { ICorePageProps } from "../../types"
import { useRef, useEffect} from "react";
import { createSeededRNG, saveSerializedPoints } from "./utils";
import {v4 as uuidv4} from "uuid";

import "./Renderer.css";

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
    fps = 20;
    rngSeed = 1360736;
    instanceUUID = uuidv4();

    let canvasRef = useRef<HTMLCanvasElement>(null);
    let renderInterval: NodeJS.Timeout | undefined = undefined;
    const points: Point[] = [];

    class Point {
        x: number;
        y:number;
        speedX: number;
        speedY: number;

        constructor(x: number,y: number,speedX: number,speedY: number){
            this.x = x;
            this.y = y;
            this.speedX = speedX;
            this.speedY = speedY;
        }

        static constructFromJson(json: string): Point {
            const obj: Point = JSON.parse(json);
            return new Point(obj.x,obj.y,obj.speedX, obj.speedY);
        }

        draw(ctx: CanvasRenderingContext2D){
            ctx.beginPath();
            ctx.arc(this.x,this.y,1,0,Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();


            this.drawLinesToOtherPoints(ctx);
        }

        drawLinesToOtherPoints(ctx: CanvasRenderingContext2D){

            for(let i = 0; i < pointCount; i++){

                if(this.x === points[i].x && this.y === points[i].y){
                    continue
                }

                if(!this.isBelowMaxDistThresh(points[i])){
                    continue;
                }

                ctx.beginPath();
                ctx.moveTo(this.x,this.y);
                ctx.lineTo(points[i].x, points[i].y);
                ctx.closePath();
                ctx.lineWidth = 1;  
                ctx.stroke();

            }

        }

        isBelowMaxDistThresh(point: Point): boolean {
            const dx = point.x - this.x;
            const dy = point.y - this.y;
            const dist = Math.sqrt((dx*dx) + (dy * dy));
            return dist < maxDistThresh;
        }       

        updatePosition(width:number, height:number) {
            
            this.x += this.speedX;
            this.y += this.speedY;

            if(this.x <= 0 || this.x >= width) {
                this.speedX *= -1;
            }

            if(this.y <= 0 || this.y >= height){
                this.speedY *= -1;
            }

        }

    }

    const initializePoints = () => {
        // TODO : initialize with seed, such that consecutive initializations will be saved.
        // Alternatively, store the values in a protobuf.

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

        // saveSerializedPoints("",[]);

    }

    const draw = () => {
    
        if(points.length == 0){
            initializePoints();
        }

        if(!canvasRef.current){
            return;
        }

        const ctx: CanvasRenderingContext2D = canvasRef.current.getContext("2d")!;
        const w = width;
        const h = height;
        const pc = pointCount;

        ctx.clearRect(0,0,w,h);

        for(let i = 0; i < pc; i++){
            points[i].draw(ctx);
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

    return <main className="renderer__main">
        <canvas width={width} height={height} className="renderer__canvas" id="canvas" ref={canvasRef}></canvas>
    </main>
}
import { ICorePageProps } from "../../types"
import { useRef } from "react";
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

    let canvasRef = useRef<HTMLCanvasElement | undefined>(undefined);
    let renderInterval: number | undefined;
    const points: Point[] = [];

    class Point {
        x: number;
        y:number ;
        speedX: number;
        speedY: number;
        constructor(x: number,y: number,speedX: number,speedY: number){
            this.x = x;
            this.y = y;
            this.speedX = speedX;
            this.speedY = speedY;
        }
    }

    const initializePoints = () => {
        // TODO : initialize with seed, such that consecutive initializations will be saved.
        // Alternatively, store the values in a protobuf.

        const w = Number.parseInt(width);
        const h = Number.parseInt(height);
        const pc = Number.parseInt(pointCount);

        for(let i = 0; i < pc; i++){
            points.push(
                new Point(
                    Math.random() * w,
                    Math.random() * h,
                    Math.random() * 30,
                    Math.random() * 30,
                )
            )
        }

    }

    const draw = () => {

        for(let i = 0; i <)

    }

    const startRendering = () => {



    }

    return <main className="renderer__main">
        <canvas width={width} height={height} className="renderer__canvas" id="canvas" ref={canvasRef}></canvas>
    </main>
}
import { ICorePageProps } from "../../types"
import { useRef, useEffect} from "react";
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

    // TODO : remove temp initialization values!
    pointCount = "100";
    width = "500";
    height = "500";
    fps = "20";

    let canvasRef = useRef<HTMLCanvasElement>(null);
    let renderInterval: NodeJS.Timeout | undefined = undefined;
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

        draw(ctx: CanvasRenderingContext2D){
            ctx.beginPath();
            ctx.arc(this.x,this.y,1,0,Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        drawLinesToOtherPoints(ctx: CanvasRenderingContext2D){

            for(let i = 0; i < Number.parseInt(pointCount); i++){

            }

            ctx.beginPath();
            ctx.moveTo(this.x,this.y);
            // ctx.lineTo();
            ctx.closePath();
            ctx.stroke();

        }

        isBelowMaxDistThresh(point: Point): boolean {

            return false;

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

        const w = Number.parseInt(width);
        const h = Number.parseInt(height);
        const pc = Number.parseInt(pointCount);

        for(let i = 0; i < pc; i++){
            points.push(
                new Point(
                    Math.floor(Math.random() * w),
                    Math.floor(Math.random() * h),
                    (Math.random() * 3) + 1,
                    (Math.random() * 3) + 1,
                )
            )
        }

    }

    const draw = () => {
    
        if(points.length == 0){
            initializePoints();
        }

        if(!canvasRef.current){
            return;
        }

        const ctx: CanvasRenderingContext2D = canvasRef.current.getContext("2d")!;
        const w = Number.parseInt(width);
        const h = Number.parseInt(height);
        const pc = Number.parseInt(pointCount);

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
        },Number.parseInt(fps))

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
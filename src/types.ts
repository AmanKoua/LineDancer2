
export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface ICorePageProps {
    audioFileBuffer:ArrayBuffer | null;
    videoFileBuffer:ArrayBuffer | null;
    fps:number;
    duration:number;
    pointCount: number;
    width: number;
    height: number;
    maxDistThresh: number;
    rngSeed: number;
    instanceUUID: string;

    setAudioFileBuffer:SetState<ArrayBuffer | null>;
    setVideoFileBuffer:SetState<ArrayBuffer | null>;
    setFps:SetState<number>;
    setDuration:SetState<number>;
    setPointCount:SetState<number>;
    setWidth:SetState<number>;
    setHeight:SetState<number>;
    setMaxDistThresh:SetState<number>;
    setRngSeed: SetState<number>;
    setInstanceUUID: SetState<string>;

    goToPanel: (val: string) => void;
}

export interface Point {
    x: number;
    y:number;
    speedX: number;
    speedY: number;
}
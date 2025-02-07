
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

    setAudioFileBuffer:SetState<ArrayBuffer | null>;
    setVideoFileBuffer:SetState<ArrayBuffer | null>;
    setFps:SetState<number>;
    setDuration:SetState<number>;
    setPointCount:SetState<number>;
    setWidth:SetState<number>;
    setHeight:SetState<number>;
    setMaxDistThresh:SetState<number>;

    goToPanel: (val: string) => void;
}
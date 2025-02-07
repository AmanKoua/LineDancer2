
export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface ICorePageProps {
    audioFileBuffer:ArrayBuffer | null;
    videoFileBuffer:ArrayBuffer | null;
    fps:string;
    duration:string;
    pointCount: string;
    width: string;
    height: string;
    maxDistThresh: string;

    setAudioFileBuffer:SetState<ArrayBuffer | null>;
    setVideoFileBuffer:SetState<ArrayBuffer | null>;
    setFps:SetState<string>;
    setDuration:SetState<string>;
    setPointCount:SetState<string>;
    setWidth:SetState<string>;
    setHeight:SetState<string>;
    setMaxDistThresh:SetState<string>;

    goToPanel: (val: string) => void;
}
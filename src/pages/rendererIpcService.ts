import { IPoint } from "../types";

const ipcOn = window.ipcRenderer.on;
const ipcSend = window.ipcRenderer.send;

export const registerIpcHandler = (points: IPoint[], updatePoints: (val: IPoint[]) => void) => {
    ipcOn("SERIALIZE_AND_PERSIST_POINT_DATA_RESPONSE", () => {
        console.log("Persisted points...");
    })  

    ipcOn("GET_SERIALIZED_POINTS_DATA_RESPONSE", (_, data: string) => {
        if(data.length === 0){
            return;
        }

        updatePoints(JSON.parse(data))
    })
}

export const getSerializedPointsData = (instanceUUID: string) => {
    ipcSend("GET_SERIALIZED_POINTS_DATA", instanceUUID);
}

export const serializeAndPersistPointData = (points: IPoint[], instanceUUID: string) => {
    ipcSend("SERIALIZE_AND_PERSIST_POINT_DATA", JSON.stringify(points), instanceUUID);
}

export const serializeAndPersistEncodedLineData = (encodedPointIdicesArr: number[][], instanceUUID: string) => {
    ipcSend("SERIALIZE_AND_PERSIST_ENCODED_LINE_DATA", encodedPointIdicesArr, instanceUUID);
}


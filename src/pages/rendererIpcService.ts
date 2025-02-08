import { Point } from "../types";

const ipcOn = window.ipcRenderer.on;
const ipcSend = window.ipcRenderer.send;

export const registerIpcHandler = () => {
    ipcOn("SERIALIZE_AND_PERSIST_POINT_DATA_RESPONSE", () => {
        alert("received main process response!");
    })
}

export const serializeAndPersistPointData = (points: Point[]) => {
    ipcSend("SERIALIZE_AND_PERSIST_POINT_DATA", points);
}


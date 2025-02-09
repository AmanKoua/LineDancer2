import { IPoint } from "../types";

const ipcOn = window.ipcRenderer.on;
const ipcSend = window.ipcRenderer.send;

export const registerIpcHandler = (
  points: IPoint[],
  updatePoints: (val: IPoint[]) => void,
  setEncodedLineDataBuffer: (val: Buffer<ArrayBufferLike>) => void,
) => {
  const serailizeAndPersistPointDataResponseHandler = () => {
    console.log("Persisted points...");
  };

  const getSerializedPointsDataReponse = (_: any, data: string) => {
    if (data.length === 0) {
      return;
    }

    updatePoints(JSON.parse(data));
  };

  const getEncodedLineDataResponseHandler = (_: any, encodedLineDataBuffer: Buffer<ArrayBufferLike>) => {
    setEncodedLineDataBuffer(encodedLineDataBuffer);
  }

  ipcOn(
    "SERIALIZE_AND_PERSIST_POINT_DATA_RESPONSE",
    serailizeAndPersistPointDataResponseHandler
  );
  ipcOn("GET_SERIALIZED_POINTS_DATA_RESPONSE", getSerializedPointsDataReponse);
  ipcOn("GET_ENCODED_LINE_DATA_RESPONSE", getEncodedLineDataResponseHandler);
};

export const getSerializedPointsData = (instanceUUID: string) => {
  ipcSend("GET_SERIALIZED_POINTS_DATA", instanceUUID);
};

export const serializeAndPersistPointData = (
  points: IPoint[],
  instanceUUID: string
) => {
  ipcSend(
    "SERIALIZE_AND_PERSIST_POINT_DATA",
    JSON.stringify(points),
    instanceUUID
  );
};

export const serializeAndPersistEncodedLineData = (
  encodedPointIdicesArr: number[][],
  instanceUUID: string
) => {
  ipcSend(
    "SERIALIZE_AND_PERSIST_ENCODED_LINE_DATA",
    encodedPointIdicesArr,
    instanceUUID
  );
};

export const getSerializedEncodedLineData = (instanceUUID: string) => {
    ipcSend("GET_ENCODED_LINE_DATA", instanceUUID);
}
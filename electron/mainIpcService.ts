import { ipcMain, BrowserWindow } from "electron";
import fs from "fs";

export const registerIpcHandler = (win: BrowserWindow) => {
  const serializeAndPersistDataHandler = (
    _: unknown,
    pointsJson: string,
    instanceUUID: string
  ) => {

    const instanceDataDir = `./data/${instanceUUID}`;

    fs.mkdirSync(`./data/${instanceUUID}`, {
      recursive: true, // create parent folders if they don't exist
    });
    
    fs.writeFileSync(`${instanceDataDir}/points.json`, pointsJson);

    win!.webContents.send("SERIALIZE_AND_PERSIST_POINT_DATA_RESPONSE");
  };

  const getSerializedPointsDataHandler = (_: any, instanceUUID: string) => {
    let data = "";
    const doesPointsFileExist = fs.existsSync(
      `./data/${instanceUUID}/points.json`
    );

    if (doesPointsFileExist) {
      data = fs
        .readFileSync(`./data/${instanceUUID}/points.json`)
        .toLocaleString();
    }

    win!.webContents.send("GET_SERIALIZED_POINTS_DATA_RESPONSE", data);
  };

  ipcMain.on(
    "SERIALIZE_AND_PERSIST_POINT_DATA",
    serializeAndPersistDataHandler
  );
  ipcMain.on("GET_SERIALIZED_POINTS_DATA", getSerializedPointsDataHandler);
};

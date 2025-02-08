import {ipcMain, BrowserWindow } from 'electron'
import fs from "fs";


export const registerIpcHandler = (win:BrowserWindow) => {

    const serializeAndPersistDataHandler = (_:unknown, pointsJson: string, instanceUUID: string) => {
        const dataDirContents = fs.readdirSync("./data");
        const instanceDataDir = `./data/${instanceUUID}`;

        if (!dataDirContents.includes(instanceUUID)){
            fs.mkdirSync(`./data/${instanceUUID}`);
        }

        fs.writeFileSync(`${instanceDataDir}/points.json`, pointsJson);

        win!.webContents.send("SERIALIZE_AND_PERSIST_POINT_DATA_RESPONSE");      
    }

      ipcMain.on("SERIALIZE_AND_PERSIST_POINT_DATA", serializeAndPersistDataHandler);

}
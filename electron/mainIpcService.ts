import {ipcMain, BrowserWindow } from 'electron'


export const registerIpcHandler = (win:BrowserWindow) => {

    const serializeAndPersistDataHandler = () => {
        console.log("------- message received by main process! -------------");
        win!.webContents.send("SERIALIZE_AND_PERSIST_POINT_DATA_RESPONSE");      
    }

      ipcMain.on("SERIALIZE_AND_PERSIST_POINT_DATA", serializeAndPersistDataHandler);

}
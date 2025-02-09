import { ipcMain, BrowserWindow } from "electron";
import * as proto from "protobufjs";
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

  const serializeAndPersistsLineDataHandler = async (_: any,  encodedPointIdicesArr: number[][], instanceUUID: string) => {

      const protobufData = fs.readFileSync("./protobuf/encodedPointIndices.proto").toLocaleString();
      const root = proto.parse(protobufData).root;
      const uint32Matrix = root.lookupType("Uint32Matrix");
  
      const matrixData = {
        rows: [] as any //  {values : [1,3,4]}
      };
  
      for(let i = 0; i < encodedPointIdicesArr.length; i++) {
        matrixData.rows.push({values : encodedPointIdicesArr[i]});
      }
  
      const errMsg = uint32Matrix.verify(matrixData);
  
      if(errMsg){
        console.log(errMsg);
        return;
      }
  
      const buffer = uint32Matrix.encode(uint32Matrix.create(matrixData)).finish();

      const instanceDataDir = `./data/${instanceUUID}`;

      fs.mkdirSync(`./data/${instanceUUID}`, {
        recursive: true, // create parent folders if they don't exist
      });
    
      const doesFileExist = fs.existsSync(`${instanceDataDir}/lineDataProto.bin`);
      
      if(doesFileExist){
        fs.rmSync(`${instanceDataDir}/lineDataProto.bin`)
      }

      fs.writeFileSync(`${instanceDataDir}/lineDataProto.bin`, buffer);

  }

  ipcMain.on(
    "SERIALIZE_AND_PERSIST_POINT_DATA",
    serializeAndPersistDataHandler
  );
  ipcMain.on("GET_SERIALIZED_POINTS_DATA", getSerializedPointsDataHandler);
  ipcMain.on("SERIALIZE_AND_PERSIST_ENCODED_LINE_DATA", serializeAndPersistsLineDataHandler);

};

import { IPoint } from "../../../types";
import { Bitmap } from "./bitmap";

export class Point {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  selfArrIdx: number;

  constructor(
    x: number,
    y: number,
    speedX: number,
    speedY: number,
    selfArrIdx: number
  ) {
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.selfArrIdx = selfArrIdx;
  }

  static constructFromPointData(data: IPoint, selfArrIdx: number): Point {
    return new Point(data.x, data.y, data.speedX, data.speedY, selfArrIdx);
  }

  draw(
    pointsDarknessBitmap: Bitmap,
    ctx: CanvasRenderingContext2D,
    pointCount: number,
    points: Point[],
    maxDistThresh: number,
    updateLinePointIndicesMap: (val: number) => void
  ) {
    // NOTE : uncomment to render point locations
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    // ctx.closePath();
    // ctx.fill();
    // ctx.stroke();

    this.drawLinesToOtherPoints(
      pointsDarknessBitmap,
      ctx,
      pointCount,
      points,
      maxDistThresh,
      updateLinePointIndicesMap
    );
  }

  drawFromDiskData(
    ctx: CanvasRenderingContext2D,
    pointCount: number,
    points: Point[]
  ) {
    // NOTE : uncomment to render point locations
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    // ctx.closePath();
    // ctx.fill();
    // ctx.stroke();
    // Point.drawLinesToOtherPointsFromDiskData(ctx, pointCount, points);
  }

  drawLinesToOtherPoints(
    pointsDarknessBitmap: Bitmap,
    ctx: CanvasRenderingContext2D,
    pointCount: number,
    points: Point[],
    maxDistThresh: number,
    updateLinePointIndicesMap: (val: number) => void
  ) {
    for (let i = 0; i < pointCount; i++) {
      const isSelf = this.x === points[i].x && this.y === points[i].y;

      if (isSelf) {
        continue;
      }

      const IsBelowMaxDistThresh = !this.getIsBelowMaxDistThresh(
        points[i],
        maxDistThresh
      );

      if (IsBelowMaxDistThresh) {
        continue;
      }

      const isPixelInDarkArea = pointsDarknessBitmap.getBitValue(i);

      if (!isPixelInDarkArea) {
        continue;
      }

      this.addPointPairToLinePointIndicesMap(i, updateLinePointIndicesMap);

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(points[i].x, points[i].y);
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  static drawLinesToOtherPointsFromDiskData(
    ctx: CanvasRenderingContext2D,
    points: Point[],
    encodedPointIdices: number[],
    width: number,
    height: number
  ) {
    for (let i = 0; i < encodedPointIdices.length; i++) {
      const pointIdices = Point.getPointIdicesFromEncodedData(
        encodedPointIdices[i]
      );
      const idx1 = pointIdices[0];
      const idx2 = pointIdices[1];
      ctx.beginPath();
      ctx.moveTo(points[idx1].x, points[idx1].y);
      ctx.lineTo(points[idx2].x, points[idx2].y);
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (let i = 0; i < points.length; i++) {
      points[i].updatePosition(width, height);
    }
  }

  private static getPointIdicesFromEncodedData = (
    encodedUint32: number
  ): number[] => {
    let idx1, idx2;
    encodedUint32 |= 0x00000000;
    idx1 = (encodedUint32 & 0xffff0000) >> 16;
    idx2 = encodedUint32 & 0x0000ffff;
    return [idx1, idx2];
  };

  /**
   * The index that is set as a key in this map, will be used to encode 2 16 bit uint values (32 bit uint key).
   * The map value is not important. The 1st 16 bits encodes the 1dx of the 1st point's array idx, and the 2nd 16 bits
   * encodes the 2nd point's array idx. map entry value is IRRELEVENT (encodes no data).
   */
  addPointPairToLinePointIndicesMap = (
    otherIdx: number,
    updateLinePointIndicesMap: (val: number) => void
  ) => {
    const firstIdx = this.selfArrIdx < otherIdx ? this.selfArrIdx : otherIdx;
    const secondIdx = this.selfArrIdx > otherIdx ? this.selfArrIdx : otherIdx;
    let indexKey = 0x00000000; // forces creation of uint32

    indexKey |= firstIdx << 16;
    indexKey |= secondIdx;
    updateLinePointIndicesMap(indexKey);
  };

  getIsBelowMaxDistThresh(point: Point, maxDistThresh: number): boolean {
    const dx = point.x - this.x;
    const dy = point.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < maxDistThresh;
  }

  updatePosition(width: number, height: number) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x <= 0 || this.x >= width) {
      this.speedX *= -1;
    }

    if (this.y <= 0 || this.y >= height) {
      this.speedY *= -1;
    }
  }
}

import { IPoint } from "../../types";

export class Point {
  x: number;
  y: number;
  speedX: number;
  speedY: number;

  constructor(x: number, y: number, speedX: number, speedY: number) {
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  static constructFromPointData(data: IPoint): Point {
    return new Point(data.x, data.y, data.speedX, data.speedY);
  }

  draw(ctx: CanvasRenderingContext2D, pointCount: number, points: Point[], maxDistThresh: number) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    this.drawLinesToOtherPoints(ctx, pointCount, points, maxDistThresh);
  }

  drawLinesToOtherPoints(ctx: CanvasRenderingContext2D, pointCount: number, points: Point[], maxDistThresh: number) {
    for (let i = 0; i < pointCount; i++) {
      if (this.x === points[i].x && this.y === points[i].y) {
        continue;
      }

      if (!this.isBelowMaxDistThresh(points[i], maxDistThresh)) {
        continue;
      }

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(points[i].x, points[i].y);
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  isBelowMaxDistThresh(point: Point, maxDistThresh: number): boolean {
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

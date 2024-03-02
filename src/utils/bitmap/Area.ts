import { Point } from './Point';

export class Area {
  public minX: number;
  public maxX: number;
  public minY: number;
  public maxY: number;

  static fromRectangle(x: number, y: number, width: number, height: number) {
    return new Area(new Point(x, y), new Point(x + width, y + height));
  }

  constructor(p1: Point, p2: Point) {
    this.minX = Math.min(p1.x, p2.x);
    this.maxX = Math.max(p1.x, p2.x);
    this.minY = Math.min(p1.y, p2.y);
    this.maxY = Math.max(p1.y, p2.y);
  }

  get minPoint() {
    return new Point(this.minX, this.minY);
  }

  get maxPoint() {
    return new Point(this.maxX, this.maxY);
  }

  get width() {
    return this.maxX - this.minX;
  }

  get height() {
    return this.maxY - this.minY;
  }

  isIntersect(point: Point): boolean {
    return point.x >= this.minX && point.x <= this.maxX && point.y >= this.minY && point.y <= this.maxY;
  }

  isEqual(area: Area): boolean {
    return area.minX === this.minX && area.maxX === this.maxX && area.minY === this.minY && area.maxY === this.maxY;
  }

  isNotEqual(area: Area): boolean {
    return !this.isEqual(area);
  }

  forEach(cb: (p: Point) => void) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        cb(new Point(x, y));
      }
    }
  }
}

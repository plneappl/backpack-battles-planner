import Size from "./Size"

interface ICoord {
  x: number
  y: number
}

export default class Coord extends Object {
  constructor(
    public x: number,
    public y: number
  ) { super() }

  static mk({ x, y }: ICoord) {
    return new Coord(x, y)
  }

  static equals(c1: Coord, c2: Coord) {
    return c1.x == c2.x && c1.y == c2.y
  }

  public override toString() {
    return `Coord(x=${this.x}, y=${this.y})`
  }

  public toKeyPart() {
    return `${this.x}-${this.y}`
  }

  public getFrom<T>(arr: T[][]): T | null {
    return arr[this.y]?.[this.x]
  }

  public setIn<T>(arr: T[][], elem: T) {
    arr[this.y][this.x] = elem
  }

  public plus(other: Coord) {
    return new Coord(this.x + other.x, this.y + other.y)
  }

  public minus(other: Coord) {
    return new Coord(this.x - other.x, this.y - other.y)
  }

  public isOutside(area: Size) {
    return this.x < 0 || this.y < 0 || this.x >= area.width || this.y >= area.height
  }
}
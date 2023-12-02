
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

  public override toString() {
    return `Coord(x=${this.x}, y=${this.y})`
  }

  public getFrom<T>(arr: T[][]): T {
    return arr[this.y][this.x]
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
}
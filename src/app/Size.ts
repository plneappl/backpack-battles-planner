import Coord from "./Coord"

export default class Size extends Object {
  constructor(
    public width: number,
    public height: number
  ) { super() }

  override toString() {
    return `Size(width=${this.width}, height=${this.height})`
  }

  public plus(other: Coord) {
    return new Size(this.width + other.x, this.height + other.y)
  }

  public isOutside(other: Size) {
    return this.width > other.width || this.height > other.height
  }

  public * iterateCoords() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        yield new Coord(x, y)
      }
    }
  }
}
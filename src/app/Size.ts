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
}
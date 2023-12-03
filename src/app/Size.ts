import Coord from "./Coord"
import Rotation, { Rotations } from "./Rotation"

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

  public rotatedSize(rotation: Rotation) {
    if (rotation == Rotations.UP) {
      return this
    } else if (rotation == Rotations.RIGHT) {
      return new Size(this.height, this.width)
    } else if (rotation == Rotations.DOWN) {
      return this
    } else if (rotation == Rotations.LEFT) {
      return new Size(this.height, this.width)
    } else {
      throw new Error("unknown rotation: " + rotation)
    }
  }

  public rotatedCoord({ x, y }: Coord, rotation: Rotation) {
    if (rotation == Rotations.UP) {
      return new Coord(x, y)
    } else if (rotation == Rotations.RIGHT) {
      return new Coord(y, this.width - x - 1)
    } else if (rotation == Rotations.DOWN) {
      return new Coord(this.width - x - 1, this.height - y - 1)
    } else if (rotation == Rotations.LEFT) {
      return new Coord(this.height - y - 1, x)
    } else {
      throw new Error("unknown rotation: " + rotation)
    }
  }

  // for rotating back from a rotated coordinate system to the upright one
  public rotatedCoordInverse({ x, y }: Coord, rotation: Rotation) {
    if (rotation == Rotations.UP) {
      return new Coord(x, y)
    } else if (rotation == Rotations.LEFT) {
      return new Coord(y, this.width - x - 1)
    } else if (rotation == Rotations.DOWN) {
      return new Coord(this.width - x - 1, this.height - y - 1)
    } else if (rotation == Rotations.RIGHT) {
      return new Coord(this.height - y - 1, x)
    } else {
      throw new Error("unknown rotation: " + rotation)
    }
  }

  public * iterateCoordsAssoc(rotation: Rotation) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const coord = new Coord(x, y)
        yield [coord, this.rotatedCoord(coord, rotation)]
      }
    }
  }
}
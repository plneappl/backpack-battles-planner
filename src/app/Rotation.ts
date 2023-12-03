
export default interface Rotation {
  ordinal: number
  prev(): Rotation
  next(): Rotation
  inverse(): Rotation
  subtract(other: Rotation): Rotation
  cssString(): string
}

class RotationImpl implements Rotation {
  constructor(
    public ordinal: number,
    public angleDeg: number
  ) {}

  prev(): Rotation {
    if(this == Rotations.UP) {
      return Rotations.LEFT
    }
    
    if(this == Rotations.RIGHT) {
      return Rotations.UP
    }
    
    if(this == Rotations.DOWN) {
      return Rotations.RIGHT
    }
    
    return Rotations.DOWN
  }

  next(): Rotation {
    if(this == Rotations.UP) {
      return Rotations.RIGHT
    }
    
    if(this == Rotations.RIGHT) {
      return Rotations.DOWN
    }
    
    if(this == Rotations.DOWN) {
      return Rotations.LEFT
    }
    
    return Rotations.UP
  }

  inverse(): Rotation {
    if(this == Rotations.UP) {
      return Rotations.DOWN
    }
    
    if(this == Rotations.RIGHT) {
      return Rotations.LEFT
    }
    
    if(this == Rotations.DOWN) {
      return Rotations.UP
    }
    
    return Rotations.RIGHT
  }

  subtract(other: Rotation) {
    let result: Rotation = this
    for (let cnt = 0; cnt < other.ordinal; cnt++) {
      result = result.prev()
    }
    return result
  }

  cssString(): string {
    return `${this.angleDeg}deg`
  }
}

export const Rotations = {
  UP: new RotationImpl(0, 0),
  RIGHT: new RotationImpl(1, 90),
  DOWN: new RotationImpl(2, 180),
  LEFT: new RotationImpl(3, 270)
}
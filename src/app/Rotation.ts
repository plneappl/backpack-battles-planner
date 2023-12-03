
export default interface Rotation {
  next(): Rotation
  cssString(): string
}

class RotationImpl implements Rotation {
  constructor(
    public angleDeg: number
  ) {}

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

  cssString(): string {
    return `${this.angleDeg}deg`
  }
}

export const Rotations = {
  UP: new RotationImpl(0),
  RIGHT: new RotationImpl(90),
  DOWN: new RotationImpl(180),
  LEFT: new RotationImpl(270)
}
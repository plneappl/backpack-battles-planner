import Coord from "./Coord"

export default interface Direction {
  coord: Coord
}

class DirectionImpl implements Direction {
  constructor(
    public coord: Coord
  ) {}
}

export const Directions = {
  UP: new DirectionImpl(Coord.mk({x: 0, y: -1})),
  RIGHT: new DirectionImpl(Coord.mk({x: 1, y: 0})),
  DOWN: new DirectionImpl(Coord.mk({x: 0, y: 1})),
  LEFT: new DirectionImpl(Coord.mk({x: -1, y: 0}))
}
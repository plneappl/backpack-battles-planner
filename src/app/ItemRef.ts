import Coord from "./Coord"
import Item from "./Item"
import Rotation from "./Rotation"

export default class ItemRef {
  constructor(
    public item: Item,
    public coord: Coord,
    public rotation: Rotation
  ) { }

  public hasCollision(withOther: ItemRef | null) {
    return this.coord.getFrom(this.item.shape) && (withOther == null || this.item.isBag == withOther.item.isBag)
  }

  public negativeMargins() {
    return `-${5 * this.coord.y}em 0 0 -${5*this.coord.x}em`
  }
}
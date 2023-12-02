import Coord from "./Coord"
import Item from "./Item"

export default class ItemRef {
  constructor(
    public item: Item,
    public coord: Coord
  ) { }

  public hasCollision(withOther: ItemRef | null) {
    return this.coord.getFrom(this.item.shape) && withOther != null && this.item.isBag == withOther.item.isBag
  }
}
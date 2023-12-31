import Coord from "./Coord"
import Item from "./Item"
import Rotation from "./Rotation"

export default class ItemRef {
  constructor(
    public item: Item,
    public coord: Coord,
    public rotation: Rotation,
    public itemRefCollection: ItemRefCollection | null
  ) {
    itemRefCollection?.refs?.push(this)
  }

  public hasCollision(withOther: ItemRef | null) {
    return this.coord.getFrom(this.item.shape) && (withOther == null || this.item.isBag == withOther.item.isBag)
  }

  public negativeMargins() {
    const rotCoord = this.item.getSize().rotatedCoordInverse(this.coord, this.rotation)
    return `-${5 * rotCoord.y}em 0 0 -${5 * rotCoord.x}em`
  }
}


export class ItemRefCollection {
  public refs: ItemRef[] = []
}
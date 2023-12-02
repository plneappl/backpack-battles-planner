import Coord from "./Coord"
import Item from "./Item"

export default class ItemRef {
  constructor(
    public item: Item,
    public coord: Coord
  ) { }
}
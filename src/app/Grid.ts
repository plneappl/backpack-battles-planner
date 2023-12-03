import Coord from "./Coord"
import ItemRef from "./ItemRef"
import Size from "./Size"

export default class Grid {
  static mk(size: Size) {
    return new Grid(size, createEmptyGrid(size), createEmptyGrid(size))
  }
  constructor(
    public size: Size,
    public items: (ItemRef | null)[][],
    public bags: (ItemRef | null)[][]
  ) { }

  public getItemOrBag(isBag: boolean, at: Coord) {
    if (isBag) {
      return this.getBag(at)
    } else {
      return this.getItem(at)
    }
  }

  public getItem(at: Coord) {
    return at.getFrom(this.items)
  }

  public getBag(at: Coord) {
    return at.getFrom(this.bags)
  }

  public setItemOrBag(isBag: boolean, at: Coord, item: ItemRef | null) {
    if (isBag) {
      this.setBag(at, item)
    } else {
      this.setItem(at, item)
    }
  }

  public setItem(at: Coord, item: ItemRef | null) {
    at.setIn(this.items, item)
  }

  public setBag(at: Coord, item: ItemRef | null) {
    at.setIn(this.bags, item)
  }

  public copy() {
    return new Grid(this.size, [...this.items], [...this.bags])
  }
}

function createEmptyGrid({ width, height }: Size) {
  return [...Array(height).keys()].map(it => [...Array(width).keys()].map(_ => null))
}

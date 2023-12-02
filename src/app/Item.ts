import Coord from "./Coord"
import Size from "./Size"

interface IItem {
  id: number
  filename: string
  shape: boolean[][]
}

export default class Item extends Object {
  constructor(
    public id: number,
    public filename: string,
    public shape: boolean[][]
  ) { super() }

  override toString() {
    return `Item(id=${this.id}, filename=${this.filename}, shape=${this.shape})`
  }

  static mk(item: IItem) {
    return new Item(item.id, item.filename, item.shape)
  }

  public getSize(): Size {
    let columnCount = this.shape[0].length
    let rowCount = this.shape.length
    return new Size(columnCount, rowCount)
  }
}
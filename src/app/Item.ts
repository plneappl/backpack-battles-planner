import Coord from "./Coord"

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

  public getSize(): Coord {
    let columnCount = this.shape[0].length
    let rowCount = this.shape.length
    return new Coord(columnCount, rowCount)
  }
}
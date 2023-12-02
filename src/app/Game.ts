import Coord from "./Coord"
import { Grid } from "./Grid"
import Item from "./Item"
import { itemData } from "./ItemJson"
import ItemRef from "./ItemRef"

const rowCount = 7
const columnCount = 8
const boardSize = new Coord(columnCount, rowCount)

let observer: ((grid: Grid) => void) = (it) => { }
let theGrid = createEmptyGrid()

export function createEmptyGrid(): Grid {
  return [...Array(rowCount).keys()].map(it => [...Array(columnCount).keys()].map(_ => null))
}

export function observe(receive: (grid: (ItemRef | null)[][]) => void) {
  observer = receive
  emitChange()
}

export function setItem(item: Item, coord: Coord) {
  let grid = [...theGrid]
  let {x: width, y: height} = item.getSize()
  if (height + coord.y > rowCount) {
    console.log(`coord ${coord} OOB! Height: ${height}`)
    return
  }
  if (width + coord.x > columnCount) {
    console.log(`coord ${coord} OOB! Width: ${width}`)
    return
  }
  for (const itemCoord of iterateCoords(width, height)) {
    let gridCoord = itemCoord.plus(coord)
    let oldItem = gridCoord.getFrom(grid)
    if (oldItem != null && oldItem.coord.getFrom(oldItem.item.shape)) {
      removeItem(grid, oldItem, gridCoord, item)
    }
    gridCoord.setIn(grid, new ItemRef(item, itemCoord))
  }
  theGrid = grid
  emitChange()
}

function* iterateCoords(width: number, height: number) {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      yield new Coord(x, y)
    }
  }
}

export function removeItem(grid: Grid, item: ItemRef, coord: Coord, unlessIs: Item) {
  let width = item.item.shape[0].length
  let height = item.item.shape.length

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let currentItem = grid[coord.y + y - item.coord.y][coord.x + x - item.coord.y]
      if (currentItem == null) {
        continue
      }
      if (currentItem.item.id == item.item.id && currentItem.coord.x == x) {
        grid[coord.y + y - item.coord.y][coord.x + x - item.coord.y] = null
      }
    }

  }
}

function emitChange() {
  console.log(`sending grind ${theGrid}`)
  observer(theGrid)
}

function foo() {
  setInterval(() => {
    const itemIdx = Math.floor(Math.random() * (itemData.length - 1))
    const item = itemData[itemIdx]
    let posX = Math.floor(Math.random() * (columnCount - 1))
    let posY = Math.floor(Math.random() * (rowCount - 1))
    setItem(item, Coord.mk({ x: posX, y: posY }))
    emitChange()
  }, 1000)
}
//foo()
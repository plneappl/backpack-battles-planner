import Coord from "./Coord"
import { Grid } from "./Grid"
import Item from "./Item"
import { itemData } from "./ItemJson"
import ItemRef from "./ItemRef"
import Size from "./Size"

const rowCount = 7
const columnCount = 8
const boardSize = new Size(columnCount, rowCount)

let observer: ((grid: Grid) => void) = (it) => { }
let theGrid = createEmptyGrid()
//setItem(itemData[7], new Coord(1, 1))

export function getGrid(): Grid {
  return theGrid
}

export function createEmptyGrid(): Grid {
  return [...Array(rowCount).keys()].map(it => [...Array(columnCount).keys()].map(_ => null))
}

export function observe(receive: (grid: (ItemRef | null)[][]) => void) {
  observer = receive
  emitChange()
}

export function setItem(item: Item, coord: Coord) {
  let grid = [...theGrid]
  let itemSize = item.getSize()
  let itemBB = itemSize.plus(coord)
  if(itemBB.isOutside(boardSize)) {
    console.log(`coord ${coord} OOB! Size: ${itemSize} results in: ${itemBB} outside board: ${boardSize}`)
    return
  }

  for (const itemCoord of iterateCoords(itemSize)) {
    let newItem = new ItemRef(item, itemCoord)
    let gridCoord = itemCoord.plus(coord)
    let oldItem = gridCoord.getFrom(grid)
    if (oldItem != null) {
      let isOverlapping = oldItem.hasCollision() && newItem.hasCollision()
      let isDifferentItem = oldItem.item.id != newItem.item.id
      let isDifferentRelativeCoord = !Coord.equals(oldItem.coord, itemCoord)
      if (isOverlapping && (isDifferentItem || isDifferentRelativeCoord)) {
        removeItem(grid, oldItem, gridCoord, item)
      }
    }
    oldItem = gridCoord.getFrom(grid)
    if(oldItem == null || !oldItem.hasCollision()) {
      gridCoord.setIn(grid, newItem)
    }
  }
  theGrid = grid
  emitChange()
}

function* iterateCoords({width, height}: Size) {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      yield new Coord(x, y)
    }
  }
}

function removeItem(grid: Grid, itemToRemove: ItemRef, coord: Coord, newItem: Item | null) {
  let itemSize = itemToRemove.item.getSize()

  for (const itemCoord of iterateCoords(itemSize)) {
    let gridCoord = coord.minus(itemToRemove.coord).plus(itemCoord)
    let currentItem = gridCoord.getFrom(grid)
    if (currentItem == null) {
      continue
    }
    if(newItem != null && currentItem.item.id == newItem.id && Coord.equals(currentItem.coord, itemCoord)) {
      gridCoord.setIn(grid, null)
    }
    else if (currentItem.item.id == itemToRemove.item.id) {
      gridCoord.setIn(grid, null)
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
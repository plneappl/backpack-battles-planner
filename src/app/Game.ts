import Coord from "./Coord"
import Grid from "./Grid"
import Item from "./Item"
import { itemData } from "./ItemJson"
import ItemRef from "./ItemRef"
import Rotation from "./Rotation"
import Size from "./Size"

const rowCount = 7
const columnCount = 8
const boardSize = new Size(columnCount, rowCount)

let observer: (grid: Grid) => void = (it) => { }
let theGrid = Grid.mk(boardSize)
//setItem(itemData[7], new Coord(1, 1))

export function getGrid(): Grid {
  return theGrid
}

export function observe(receive: (grid: Grid) => void) {
  observer = receive
  emitChange()
}

export function setItem(item: Item, coord: Coord, rotation: Rotation) {
  let grid = theGrid.copy()
  let itemSize = item.getSize()
  let itemBB = itemSize.plus(coord)
  if (itemBB.isOutside(boardSize)) {
    console.log(`coord ${coord} OOB! Size: ${itemSize} results in: ${itemBB} outside board: ${boardSize}`)
    return
  }

  for (const itemCoord of itemSize.iterateCoords()) {
    let newItem = new ItemRef(item, itemCoord, rotation)
    let gridCoord = itemCoord.plus(coord)
    let oldItem = grid.getItemOrBag(item.isBag, gridCoord)
    if (oldItem != null) {
      let isOverlapping = oldItem.hasCollision(newItem) && newItem.hasCollision(oldItem)
      let isDifferentItem = oldItem.item.id != newItem.item.id
      let isDifferentRelativeCoord = !Coord.equals(oldItem.coord, itemCoord)
      if (isOverlapping && (isDifferentItem || isDifferentRelativeCoord)) {
        removeItem(grid, oldItem, gridCoord, item)
      }
    }
    oldItem = grid.getItemOrBag(item.isBag, gridCoord)
    if (oldItem == null || !oldItem.hasCollision(newItem)) {
      grid.setItemOrBag(item.isBag, gridCoord, newItem)
    }
  }
  theGrid = grid
  emitChange()
}

function removeItem(grid: Grid, itemToRemove: ItemRef, coord: Coord, newItem: Item | null) {
  let itemSize = itemToRemove.item.getSize()

  for (const itemCoord of itemSize.iterateCoords()) {
    let gridCoord = coord.minus(itemToRemove.coord).plus(itemCoord)
    let currentItem = grid.getItemOrBag(itemToRemove.item.isBag, gridCoord)
    if (currentItem == null) {
      continue
    }
    if (newItem != null && currentItem.item.id == newItem.id && Coord.equals(currentItem.coord, itemCoord)) {
      grid.setItemOrBag(itemToRemove.item.isBag, gridCoord, null)
    }
    else if (currentItem.item.id == itemToRemove.item.id) {
      grid.setItemOrBag(itemToRemove.item.isBag, gridCoord, null)
    }
  }
}

function emitChange() {
  observer(theGrid)
}

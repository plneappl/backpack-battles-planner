import Coord from "./Coord"
import Grid from "./Grid"
import Item from "./Item"
import { itemData } from "./ItemJson"
import ItemRef, { ItemRefCollection } from "./ItemRef"
import Rotation from "./Rotation"
import Size from "./Size"

const rowCount = 7
const columnCount = 9
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
  let itemRefCollection = new ItemRefCollection()
  let itemSize = item.getSize()
  let itemBB = itemSize.plus(coord)
  if (itemBB.isOutside(boardSize)) {
    console.log(`coord ${coord} OOB! Size: ${itemSize} results in: ${itemBB} outside board: ${boardSize}`)
    return
  }

  for (const [gridOffset, itemCoord] of itemSize.rotatedSize(rotation).iterateCoordsAssoc(rotation)) {
    let newItem = new ItemRef(item, itemCoord, rotation, itemRefCollection)
    let gridCoord = coord.plus(gridOffset)
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
  const itemRefs = new Set<ItemRef | null>(itemToRemove.itemRefCollection?.refs ?? [])
  const isBag = itemToRemove.item.isBag

  for (const coord of grid.size.iterateCoords()) {
    if(itemRefs.has(grid.getItemOrBag(isBag, coord))) {
      grid.setItemOrBag(isBag, coord, null)
    }
  }
}

function emitChange() {
  observer(theGrid)
}

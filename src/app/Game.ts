import Coord from "./Coord"
import Direction from "./Direction"
import Grid from "./Grid"
import Item from "./Item"
import { itemData } from "./ItemJson"
import ItemRef, { ItemRefCollection } from "./ItemRef"
import Rotation, { Rotations } from "./Rotation"
import Size from "./Size"

const rowCount = 7
const columnCount = 9
const boardSize = new Size(columnCount, rowCount)

let observer: (grid: Grid) => void = (it) => { }
let theGrid = Grid.mk(boardSize)
//setItem(itemData["other"][7], new Coord(1, 1), Rotations.UP)

export function getGrid(): Grid {
  return theGrid
}

export function observe(receive: (grid: Grid) => void) {
  observer = receive
  emitChange()
}

export function setItem(item: Item, coord: Coord, rotation: Rotation) {
  let grid = theGrid.copy()
  setItemImpl(grid, item, coord, rotation)
  emitChange()
}
function setItemImpl(grid: Grid, item: Item, coord: Coord, rotation: Rotation) {
  let itemRefCollection = new ItemRefCollection()
  let itemSize = item.getSize().rotatedSize(rotation)
  let itemBB = itemSize.plus(coord)
  if (itemBB.isOutside(boardSize)) {
    console.log(`coord ${coord} OOB! Size: ${itemSize} results in: ${itemBB} outside board: ${boardSize}`)
    return
  }

  for (const [gridOffset, itemCoord] of itemSize.iterateCoordsAssoc(rotation)) {
    let newItem = new ItemRef(item, itemCoord, rotation, itemRefCollection)
    let gridCoord = coord.plus(gridOffset)
    let oldItem = grid.getItemOrBag(item.isBag, gridCoord)
    if (oldItem != null) {
      let isOverlapping = oldItem.hasCollision(newItem) && newItem.hasCollision(oldItem)
      let isDifferentItem = oldItem.item.id != newItem.item.id
      let isDifferentRelativeCoord = !Coord.equals(oldItem.coord, itemCoord)
      if (isOverlapping && (isDifferentItem || isDifferentRelativeCoord)) {
        removeItem(grid, oldItem)
      }
    }
    oldItem = grid.getItemOrBag(item.isBag, gridCoord)
    if (oldItem == null || !oldItem.hasCollision(newItem)) {
      grid.setItemOrBag(item.isBag, gridCoord, newItem)
    }
  }
  theGrid = grid
}

export function removeItem(grid: Grid, itemToRemove: ItemRef, ) {
  const itemRefs = new Set<ItemRef | null>(itemToRemove.itemRefCollection?.refs ?? [])
  const isBag = itemToRemove.item.isBag

  for (const coord of grid.size.iterateCoords()) {
    if(itemRefs.has(grid.getItemOrBag(isBag, coord))) {
      grid.setItemOrBag(isBag, coord, null)
    }
  }
}

export function emitChange() {
  observer(theGrid)
}

export function moveItems(direction: Direction) {
  let oldGrid = theGrid.copy()
  let grid = Grid.mk(boardSize)
  for (const oldGridCoord of oldGrid.size.iterateCoords()) {
    const newCoord = oldGridCoord.plus(direction.coord)
    let bag = oldGrid.getBag(oldGridCoord)
    if(bag != null) {
      if(newCoord.isOutside(boardSize)) {
        removeItem(oldGrid, bag)
        removeItem(grid, bag)
      } else {
        grid.setBag(newCoord, bag)
      }
    }
    let item = oldGrid.getItem(oldGridCoord)
    if(item != null) {
      if(newCoord.isOutside(boardSize)) {
        removeItem(oldGrid, item)
        removeItem(grid, item)
      } else {
        grid.setItem(newCoord, item)
      }
    }
  }
  theGrid = grid
  emitChange()
}

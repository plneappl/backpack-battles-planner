import React from 'react'
import Item from './Item'
import { DragDropPayload, DragDropTypes } from './DragDropTypes'
import ItemRef from './ItemRef'
import Coord from './Coord'
import { Rotations } from './Rotation'
import { BoardAsGrid, DragHandlers, RenderItemSolo } from './Board'
import Grid from './Grid'

export default function ItemWithGrid(item: Item) {
  let columnCount = item.shape[0].length
  let rowCount = item.shape.length

  let itemWidth = 5 * columnCount
  let itemHeight = 5 * rowCount

  let subItemWidth = 100 / columnCount
  let subItemHeight = 100 / rowCount

  let grid = Grid.mk(item.getSize())
  for (const coord of item.getSize().iterateCoords()) {
    grid.setItem(coord, new ItemRef(item, coord, Rotations.UP))
  }

  return RenderItemSolo("item-", item, (c) => DragHandlers.mk({
    onPickup: () => new ItemRef(item, c, Rotations.UP),
    onDrop: (e) => { }
  }))
} 
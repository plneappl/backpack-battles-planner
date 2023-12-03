import React from 'react'
import Item from './Item'
import GridOfShape from './GridOfShape'
import { useDrag } from 'react-dnd'
import { DragDropPayload, DragDropTypes } from './DragDropTypes'
import ItemRef from './ItemRef'
import Coord from './Coord'
import { Rotations } from './Rotation'

export default function ItemWithGrid(item: Item) {
  const [, drag] = useDrag(() => ({
    type: DragDropTypes.ITEM,
    item: new DragDropPayload(new ItemRef(item, new Coord(0, 0), Rotations.UP)),
  }))

  let columnCount = item.shape[0].length
  let rowCount = item.shape.length

  let itemWidth = 5 * columnCount
  let itemHeight = 5 * rowCount

  let subItemWidth = 100 / columnCount
  let subItemHeight = 100 / rowCount

  let itemBoxes = [...GridOfShape(item.shape)]

  return (
    <li key={"item-" + item.id} style={{ position: "relative" }} ref={drag}>
      <div className='container' style={{
        width: `${itemWidth}em`,
        height: `${itemHeight}em`
      }}>
        <img src={"/Items/" + item.filename} className='inner' style={{
          objectFit: 'contain'
        }} />
        <div className='inner grid-container' style={{
          width: '100%',
          height: '100%',
          gridTemplateColumns: `repeat(${columnCount}, 5em)`,
          gridTemplateRows: `repeat(${rowCount}, 5em)`,
          gridAutoColumns: `${subItemWidth}%`,
          gridAutoRows: `${subItemHeight}%`
        }}>
          {itemBoxes}
        </div>
      </div>
    </li>
  )
} 
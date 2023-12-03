import ItemRef from "./ItemRef";
import Coord from "./Coord";
import Item from "./Item";
import Grid from "./Grid";
import Rotation, { Rotations } from "./Rotation";
import React from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { DragDropPayload } from "./DragDropTypes";
import { emitChange, removeItem } from "./Game";

type DropHandler = (item: Item, coord: Coord, rotation: Rotation) => void

interface DropEvent {
  droppedItem: ItemRef
}

export type PickupHandler = () => ItemRef | null
export type DropdownHandler = (_: DropEvent) => void
type DragHandlersFactory = (_: Coord) => DragHandlers

interface IDragHandlers {
  onPickup: PickupHandler | null
  onDrop: DropdownHandler | null
}

export class DragHandlers {
  static mk({ onPickup, onDrop }: IDragHandlers) {
    return new DragHandlers(onPickup, onDrop)
  }
  constructor(
    public onPickup: PickupHandler | null,
    public onDrop: DropdownHandler | null
  ) { }
}

type BoardArg = {
  board: Grid,
  boardId: string,
  onDrop: (item: Item, coord: Coord, rotation: Rotation) => void,
  drawBoxOnNoCollision: boolean,
  dragHandlers: DragHandlersFactory
}
type BoardArgNullable = {
  board: Grid,
  boardId: string,
  onDrop: (item: Item, coord: Coord, rotation: Rotation) => void,
  drawBoxOnNoCollision: boolean,
  dragHandlers: DragHandlersFactory | null
}

const boardDragHandlersFactory: (grid: Grid, _: DropHandler) => DragHandlersFactory = (grid, onDrop) => (coord) => DragHandlers.mk({
  onPickup: () => {
    const item = grid.getItem(coord)
    if (item != null) {
      removeItem(grid, item, coord, null)
      emitChange()
      return item
    }
    const bag = grid.getBag(coord)
    if (bag != null) {
      removeItem(grid, bag, coord, null)
      emitChange()
      return bag
    }
    return null
  },
  onDrop: e => {
    const actualPosition = coord.minus(e.droppedItem.item.getSize().rotatedCoordInverse(e.droppedItem.coord, e.droppedItem.rotation))
    onDrop(e.droppedItem.item, actualPosition, e.droppedItem.rotation)
  }
})

export function BoardAsGrid({ board, boardId, onDrop, drawBoxOnNoCollision, dragHandlers }: BoardArgNullable) {
  let columnCount = board.items[0].length
  let rowCount = board.items.length

  return (<div
    className="grid-container"
    key={boardId + "-grid"}
    style={{
      gridTemplateColumns: `repeat(${columnCount}, 5em)`,
      gridTemplateRows: `repeat(${rowCount}, 5em)`,
      gridAutoColumns: `5em`,
      gridAutoRows: `5em`,
      gridAutoFlow: 'column',
    }}>
    <Board
      board={board}
      onDrop={onDrop}
      boardId={boardId}
      drawBoxOnNoCollision={drawBoxOnNoCollision}
      dragHandlers={dragHandlers ?? boardDragHandlersFactory(board, onDrop)}></Board>
  </div>)
}

export function RenderItemSolo(id: string, item: Item, rotation: Rotation, dragHandlers: DragHandlersFactory) {
  let s2 = item.getSize().rotatedSize(rotation)
  let grid = Grid.mk(s2)
  for (const [coord, itemCoord] of s2.iterateCoordsAssoc(rotation)) {
    grid.setItem(coord, new ItemRef(item, itemCoord, rotation, null))
  }

  return <BoardAsGrid
    key={id + "-grid-solo"}
    board={grid}
    boardId={`${id}-${item.id}`}
    onDrop={() => { }}
    drawBoxOnNoCollision={false}
    dragHandlers={dragHandlers}
  />
}

function Board(args: BoardArg) {
  return [...BoardGen(args)]
}

function BoardSquare({ board, boardId, drawBoxOnNoCollision }: BoardArg, coord: Coord, dragHandlers: DragHandlers) {
  let item = board.getItem(coord)
  let itemImg = item != null ? renderImage(`${boardId}-item-${coord.toKeyPart()}`, item, null) : null
  let bag = board.getBag(coord)
  let bagImg = bag != null ? renderImage(`${boardId}-bag-${coord.toKeyPart()}`, bag, itemImg) : itemImg
  if (!!bag?.hasCollision(null) || !!item?.hasCollision(null) || drawBoxOnNoCollision) {
    return BoardSquareBorder(boardId, dragHandlers, coord, bag ?? item, bagImg)
  }
  return bagImg ?? <div key={`${boardId}-empty-${coord.toKeyPart()}`} />
}

export function renderImage(id: string, item: ItemRef, child: React.JSX.Element | null) {
  let columnCount = item.item.shape[0].length
  let rowCount = item.item.shape.length

  let itemWidth = 5 * columnCount
  let itemHeight = 5 * rowCount

  return (<div
    className="wrapper"
    key={id}
    style={{
      backgroundColor: "transparent",
      backgroundImage: `url("/Items/${item.item.filename}")`,
      backgroundSize: `${itemWidth}em ${itemHeight}em`,
      backgroundPosition: `-${5 * item.coord.x}em -${5 * item.coord.y}em`,
      transform: `rotate(${item.rotation.cssString()})`
    }}>{child}</div>)
}

export function BoardSquareBorder(id: string, {onPickup, onDrop}: DragHandlers, coord: Coord, item: ItemRef | null, child: React.JSX.Element | null) {
  const subId = `${id}-item-grid-${coord.toKeyPart()}`;
  let result = child
  const dragId = 'drag-' + subId
  const dropId = 'drop-' + subId
  const { attributes, listeners, setNodeRef: setNodeRefDrag } = useDraggable({
    id: dragId,
    data: {
      payload: onPickup,
    }
  })
  const { setNodeRef: setNodeRefDrop } = useDroppable({
    id: dropId,
    data: {
      payload: onDrop
    }
  })

  if (item != null && onPickup != null) {
    result = (<div ref={setNodeRefDrag} key={dragId} className="wrapper" {...listeners} {...attributes}>{result}</div>)
  }
  if (onDrop != null) {
    result = (<div ref={setNodeRefDrop} key={dropId} className="wrapper">{result}</div>)
  }
  
  const img = <div
    key={subId}
    className="wrapper"
    style={{
      border: '1px solid',
      margin: "-0.5px",
    }}>{result}</div>
  return img
}

function* BoardGen(args: BoardArg) {
  for (const coord of args.board.size.iterateCoords()) {
    yield BoardSquare(args, coord, args.dragHandlers(coord))
  }
}
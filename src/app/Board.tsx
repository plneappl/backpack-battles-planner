import ItemRef from "./ItemRef";
import Coord from "./Coord";
import Item from "./Item";
import Grid from "./Grid";
import Rotation, { Rotations } from "./Rotation";
import React from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { DragDropPayload } from "./DragDropTypes";

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

const boardDragHandlersFactory: (_: DropHandler) => DragHandlersFactory = (onDrop) => (coord) => DragHandlers.mk({
  onPickup: null,
  onDrop: e => { onDrop(e.droppedItem.item, coord.minus(e.droppedItem.coord), e.droppedItem.rotation) }
})

export function BoardAsGrid({ board, boardId, onDrop, drawBoxOnNoCollision, dragHandlers }: BoardArgNullable) {
  let columnCount = board.items[0].length
  let rowCount = board.items.length

  return (<div className="grid-container" style={{
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
      dragHandlers={dragHandlers ?? boardDragHandlersFactory(onDrop)}></Board>
  </div>)
}

export function RenderItemSolo(id: string, item: Item, dragHandlers: DragHandlersFactory) {
  let grid = Grid.mk(item.getSize())
  for (const coord of item.getSize().iterateCoords()) {
    grid.setItem(coord, new ItemRef(item, coord, Rotations.UP))
  }

  return <BoardAsGrid
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
  let itemImg = item != null ? renderImage(item, null) : null
  let bag = board.getBag(coord)
  let bagImg = bag != null ? renderImage(bag, itemImg) : itemImg
  if (!!bag?.hasCollision(null) || !!item?.hasCollision(null) || drawBoxOnNoCollision) {
    return BoardSquareBorder(boardId, dragHandlers, coord, bag ?? item, bagImg)
  }
  return bagImg ?? <div />
}

export function renderImage(item: ItemRef, child: React.JSX.Element | null) {
  let columnCount = item.item.shape[0].length
  let rowCount = item.item.shape.length

  let itemWidth = 5 * columnCount
  let itemHeight = 5 * rowCount

  return (<div
    className="wrapper"
    style={{
      backgroundColor: "transparent",
      backgroundImage: `url(/Items/${item.item.filename})`,
      backgroundSize: `${itemWidth}em ${itemHeight}em`,
      backgroundPosition: `-${5 * item.coord.x}em -${5 * item.coord.y}em`,
    }}>{child}</div>)
}

export function BoardSquareBorder(id: string, dragHandlers: DragHandlers, coord: Coord, item: ItemRef | null, child: React.JSX.Element | null) {
  const subId = `${id}-item-grid-${coord.toKeyPart()}`;
  const img = <div
    key={subId}
    className="wrapper"
    style={{
      border: '1px solid',
      margin: "-0.5px",
    }}>{child}</div>
  let result = img
  if (item != null && dragHandlers.onPickup != null) {
    result = DraggableSquare(dragHandlers.onPickup, id, item, result)
  }
  if (dragHandlers.onDrop != null) {
    result = DroppableSquare(dragHandlers.onDrop, subId, result)
  }
  return result
}

function DraggableSquare(onPickup: PickupHandler, id: string, item: ItemRef, child: React.JSX.Element | null) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'drag-' + id,
    data: {
      payload: onPickup,
    }
  })
  const style = transform ? {
    //transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  return (<div ref={setNodeRef} className="wrapper" style={style} {...listeners} {...attributes}>{child}</div>)
}

function DroppableSquare(onDrop: DropdownHandler, id: string, child: React.JSX.Element | null) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'drop-' + id,
    data: {
      payload: onDrop
    }
  })
  return (<div ref={setNodeRef} className="wrapper">{child}</div>)
}


function* BoardGen(args: BoardArg) {
  for (const coord of args.board.size.iterateCoords()) {
    yield BoardSquare(args, coord, args.dragHandlers(coord))
  }
}
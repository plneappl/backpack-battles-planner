import ItemRef from "./ItemRef";
import Coord from "./Coord";
import { useDrop } from "react-dnd";
import { DragDropTypes } from "./DragDropTypes";
import Item from "./Item";
import Grid from "./Grid";

type BoardArg = {
  board: Grid,
  onDrop: (item: Item, coord: Coord) => void
}

function Board(args: BoardArg) {
  return [...BoardGen(args)]
}

function BoardSquare({ board, onDrop }: BoardArg, coord: Coord) {
  const [, drop] = useDrop(() => ({
    accept: DragDropTypes.ITEM,
    drop: (item, monitor) => {
      console.log(`dropped ${item} / ${monitor.getItem()} at ${coord}`)
      onDrop(item as Item, coord)
    }
  }))
  let item = board.getItem(coord)
  let itemImg = item != null? renderImage(item, null): null
  let bag = board.getBag(coord)
  let bagImg = bag != null? renderImage(bag, itemImg) : itemImg
  return BoardSquareBorder(drop, coord, bagImg)
}

function renderImage(item: ItemRef, child: any | null) {
  let columnCount = item.item.shape[0].length
  let rowCount = item.item.shape.length

  let itemWidth = 5 * columnCount
  let itemHeight = 5 * rowCount

  return (<div style={{
    width: '100%',
    height: '100%',
    backgroundColor: "transparent",
    backgroundImage: `url(/Items/${item.item.filename})`,
    backgroundSize: `${itemWidth}em ${itemHeight}em`,
    backgroundPosition: `-${5 * item.coord.x}em -${5 * item.coord.y}em`,
  }}>{child}</div>)
}

function BoardSquareBorder(drop: any, coord: Coord, child: any | null) {
  return (<div
    ref={drop}
    key={`item-grid-${coord.toKeyPart()}`}
    style={{
      border: '1px solid',
      margin: "-0.5px",
    }}>{child}</div>)
}

function* BoardGen(args: BoardArg) {
  for (let y = 0; y < args.board.items.length; y++) {
    const row = args.board.items[y];
    for (let x = 0; x < row.length; x++) {
      yield BoardSquare(args, Coord.mk({ x, y }))
    }
  }
}

export function BoardAsGrid({ board, onDrop }: BoardArg) {
  let columnCount = board.items[0].length
  let rowCount = board.items.length

  return (<div className="grid-container" style={{
    gridTemplateColumns: `repeat(${columnCount}, 5em)`,
    gridTemplateRows: `repeat(${rowCount}, 5em)`,
    gridAutoColumns: `5em`,
    gridAutoRows: `5em`
  }}>
    <Board board={board} onDrop={onDrop}></Board>
  </div>)
}
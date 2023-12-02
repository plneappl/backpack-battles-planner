import ItemRef from "./ItemRef";
import Coord from "./Coord";
import { useDrop } from "react-dnd";
import { DragDropTypes } from "./DragDropTypes";
import Item from "./Item";

type BoardArg = {
  board: (ItemRef | null)[][],
  onDrop: (item: Item, coord: Coord) => void
}

function Board(args: BoardArg) {
  return [...BoardGen(args)]
}

function BoardSquare({ board, onDrop }: BoardArg, coord: Coord) {
  const { x, y } = coord
  const [, drop] = useDrop(() => ({
    accept: DragDropTypes.ITEM,
    drop: (item, monitor) => {
      console.log(`dropped ${item} / ${monitor.getItem()} at ${x}, ${y}`)
      onDrop(item as Item, coord)
    }
  }), [x, y])
  const item = board[y][x]
  if (item != null) {
    let columnCount = item.item.shape[0].length
    let rowCount = item.item.shape.length

    let itemWidth = 5 * columnCount
    let itemHeight = 5 * rowCount

    return (<div
      ref={drop}
      key={`item-grid-${x}-${y}`}
      style={{
        border: '1px solid',
        margin: "-0.5px",
        backgroundImage: `url(/Items/${item.item.filename})`,
        backgroundSize: `${itemWidth}em ${itemHeight}em`,
        backgroundPosition: `${5 * item.coord.x}em ${5 * item.coord.y}em`,
      }} />)
  } else {
    return (<div
      ref={drop}
      key={`item-grid-${x}-${y}`}
      style={{
        border: '1px solid',
        margin: "-0.5px",
      }} />)
  }
}

function* BoardGen(args: BoardArg) {
  for (let y = 0; y < args.board.length; y++) {
    const row = args.board[y];
    for (let x = 0; x < row.length; x++) {
      yield BoardSquare(args, Coord.mk({ x, y }))
    }
  }
}

export function BoardAsGrid({ board, onDrop }: BoardArg) {
  let columnCount = board[0].length
  let rowCount = board.length

  return (<div className="grid-container" style={{
    gridTemplateColumns: `repeat(${columnCount}, 5em)`,
    gridTemplateRows: `repeat(${rowCount}, 5em)`,
    gridAutoColumns: `5em`,
    gridAutoRows: `5em`
  }}>
    <Board board={board} onDrop={onDrop}></Board>
  </div>)
}
import Coord from "./Coord";

export default function* GridOfShape(shape: boolean[][]) {
  for (let y = 0; y < shape.length; y++) {
    const row = shape[y];
    for (let x = 0; x < row.length; x++) {
      const shouldShow = row[x];
      if (shouldShow) {
        yield (<div key={`item-grid-${x}-${y}`} style={{ border: '1px solid', margin: "-0.5px" }} />)
      } else {
        yield (<div key={`item-grid-${x}-${y}`} />)
      }
    }
  }
}
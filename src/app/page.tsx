"use client"
import { BoardAsGrid } from './Board'
import { observe, setItem, getGrid } from './Game'
import { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ItemList from './ItemList'


export default function Home() {
  const [grid, setGrid] = useState(getGrid())
  useEffect(() => observe((grid) => {
    console.log(`received ${grid}`)
    setGrid(grid)
  }))
  return (
    <DndProvider backend={HTML5Backend}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24 grid-container" style={{
        gridTemplateColumns: "3fr 1fr"
      }}>
        <BoardAsGrid
          board={grid}
          onDrop={(item, coord, rotation) => setItem(item, coord, rotation)} />
        <ItemList />
      </main>
    </DndProvider>
  )
}

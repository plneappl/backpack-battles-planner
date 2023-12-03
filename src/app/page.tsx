"use client"
import { BoardAsGrid, BoardSquareBorder, DragHandlers, DropdownHandler, PickupHandler, RenderItemSolo, renderImage } from './Board'
import { observe, setItem, getGrid } from './Game'
import { useEffect, useState } from 'react'
import ItemList from './ItemList'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { DragDropPayload } from './DragDropTypes'
import Coord from './Coord'

const keys = {
  KEY_R: {
    key: 'R'
  }
}

export default function Home() {
  const [dragPayload, setDraggedItem] = useState<DragDropPayload | null>(null)
  const handleDragStart = (e: DragStartEvent) => {
    const provider = e.active.data.current?.payload as PickupHandler
    const pickedItem = provider?.()
    setDraggedItem(pickedItem? {item: pickedItem}: null)
  }
  const handleDragEnd = (e: DragEndEvent) => {
    console.log("drag end")
    const payload = dragPayload
    const onDrop = e.over?.data.current?.payload as DropdownHandler
    setDraggedItem(null)
    if(payload != null && onDrop != null) {
      onDrop({
        droppedItem: payload.item
      })
    } 
  }
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Main />
      <DragOverlay className='wrapper'>
        {dragPayload ? (RenderItemSolo("dragboard-", dragPayload.item.item, (c) => new DragHandlers(null, null))) : null}
      </DragOverlay>
    </DndContext>
  )
}

function Main() {
  const [grid, setGrid] = useState(getGrid())
  useEffect(() => {
    observe((grid) => {
      setGrid(grid)
    })

    const keyEventListener = ({ key }: KeyboardEvent): void => {
      console.log("key pressed", key)
      if (key == keys.KEY_R.key) {
        console.log("should rotate now")
      }
    }
    window.addEventListener('keydown', keyEventListener)
    return () => {
      window.removeEventListener('keydown', keyEventListener)
    }
  })

  return <main className="flex min-h-screen flex-col items-center justify-between p-24 grid-container" style={{
    gridTemplateColumns: "3fr 1fr"
  }}>
    <BoardAsGrid
      board={grid}
      boardId='mainboard'
      onDrop={(item, coord, rotation) => setItem(item, coord, rotation)}
      drawBoxOnNoCollision={true}
      dragHandlers={null} />
    <ItemList />
  </main>
}

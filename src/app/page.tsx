"use client"
import { BoardAsGrid, BoardSquareBorder, DragHandlers, DropdownHandler, PickupHandler, RenderItemSolo, renderImage } from './Board'
import { observe, setItem, getGrid, moveItems } from './Game'
import { useEffect, useState } from 'react'
import ItemList from './ItemList'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, pointerWithin } from '@dnd-kit/core'
import { DragDropPayload } from './DragDropTypes'
import Coord from './Coord'
import ItemRef from './ItemRef'
import { Directions } from './Direction'

const keys = {
  KEY_R: {
    key: 'R'
  },
  KEY_RIGHT: {
    key: 'ArrowRight'
  },
  KEY_DOWN: {
    key: 'ArrowDown'
  },
  KEY_LEFT: {
    key: 'ArrowLeft'
  },
  KEY_UP: {
    key: 'ArrowUp'
  }
}

type DragDropPayloadNullable = DragDropPayload | null

interface MainArgs {
  dragPayload: DragDropPayloadNullable
  setDraggedItem: (_: DragDropPayloadNullable) => void
}

export default function Home() {
  const [dragPayload, setDraggedItem] = useState<DragDropPayload | null>(null)
  const handleDragStart = (e: DragStartEvent) => {
    const provider = e.active.data.current?.payload as PickupHandler
    const pickedItem = provider?.()
    setDraggedItem(pickedItem ? { item: pickedItem } : null)
  }
  const handleDragEnd = (e: DragEndEvent) => {
    console.log("drag end")
    const payload = dragPayload
    const onDrop = e.over?.data.current?.payload as DropdownHandler
    setDraggedItem(null)
    if (payload != null && onDrop != null) {
      onDrop({
        droppedItem: payload.item
      })
    }
  }
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <Main dragPayload={dragPayload} setDraggedItem={setDraggedItem}/>
      <DragOverlay className='wrapper' dropAnimation={null}>
        {dragPayload ? (<div style={{
          margin: dragPayload.item.negativeMargins()
        }}>
          {RenderItemSolo("dragboard-", dragPayload.item.item, dragPayload.item.rotation, (c) => new DragHandlers(null, null))}
        </div>) : null}
      </DragOverlay>
    </DndContext>
  )
}

function Main({dragPayload, setDraggedItem}: MainArgs) {
  const [grid, setGrid] = useState(getGrid())
  useEffect(() => {
    observe((grid) => {
      setGrid(grid)
    })

    const keyEventListener = ({ key }: KeyboardEvent): void => {
      if (key.toUpperCase() == keys.KEY_R.key && dragPayload != null) {
        const item = dragPayload.item
        const nextRot = item.rotation.next()
        setDraggedItem({
          item: new ItemRef(item.item, item.coord, nextRot, null)
        })
      } else if(key == keys.KEY_UP.key) {
        moveItems(Directions.UP)
      } else if(key == keys.KEY_RIGHT.key) {
        moveItems(Directions.RIGHT)
      } else if(key == keys.KEY_DOWN.key) {
        moveItems(Directions.DOWN)
      } else if(key == keys.KEY_LEFT.key) {
        moveItems(Directions.LEFT)
      }
    }
    window.addEventListener('keydown', keyEventListener)
    return () => {
      window.removeEventListener('keydown', keyEventListener)
    }
  })

  return <main className="flex min-h-screen flex-col items-center justify-between p-24 grid-container" style={{
    gridTemplateColumns: "3fr 1fr",
    backgroundImage: "url(/Background/Shop.jpg)",
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    justifyItems: "center"
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

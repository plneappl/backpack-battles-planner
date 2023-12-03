import { useState } from 'react'
import Item from './Item'
import { itemData } from './ItemJson'
import ItemWithGrid from './ItemWithGrid'

export default function ItemList() {
  const itemList = Object.entries(itemData).map(([cat, items]) => SubItemList(cat, items))
  return <div className='wrapper' style={{
    maxHeight: "80vh",
    overflow: "hidden",
    backgroundColor: "#FFFFFF40"
  }}>
    {itemList}
  </div>
}

function SubItemList(description: string, items: Item[]) {
  let itemComponents = items.map(element => ItemWithGrid(element))
  const [collapse, setCollapse] = useState(true)
  return <div
    key={"list-" + description.replaceAll(" ", "-")}
    style={{
      maxHeight: "80vh",
      width: "100%",
      overflow: 'hidden'
    }}>
    <button className='collapseBtn' onClick={() => setCollapse(!collapse)}>{collapse ? '▶' : '▼'} {description}</button><br />
    <ul style={{
      display: collapse ? 'none' : 'inline-block',
      maxHeight: "60vh",
      width: "100%",
      overflow: "auto",
    }}>
      {itemComponents}
    </ul></div>
}
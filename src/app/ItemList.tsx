import { useState } from 'react'
import Item from './Item'
import { itemData } from './ItemJson'
import ItemWithGrid from './ItemWithGrid'

export default function ItemList() {
  const itemList = Object.entries(itemData).map(([cat, items]) => SubItemList(cat, items))
  return <div style={{ maxHeight: "80vh", overflow: "auto" }}>
    {itemList}
  </div>
}

function SubItemList(description: string, items: Item[]) {
  let itemComponents = items.map(element => ItemWithGrid(element))
  const [collapse, setCollapse] = useState(true)
  return <div
    key={ "list-" + description.replaceAll(" ", "-") }
  >
    <button className='collapseBtn' onClick={() => setCollapse(!collapse)}>{collapse? '▶': '▼'} {description}</button><br />
    <ul style={{
      display: collapse? 'none': 'initial'
    }}>
      {itemComponents}
    </ul></div>
}
import Item from './Item'
import { itemData } from './ItemJson'
import ItemWithGrid from './ItemWithGrid'

export default function ItemList() {
  const itemList = Object.entries(itemData).map(([cat, items]) => SubItemList(cat, items))
  return <div style={{ maxHeight: "100vh", overflow: "auto" }}>
    {itemList}
  </div>
}

function SubItemList(description: string, items: Item[]) {
  let itemComponents = items.map(element => ItemWithGrid(element))
  return <div>
    <h1>{description}</h1><br/>
    <ul>
    {itemComponents}
  </ul></div>
}
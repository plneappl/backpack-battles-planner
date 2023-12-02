import Item from './Item'
import { itemData } from './ItemJson'
import ItemWithGrid from './ItemWithGrid'

export default function ItemList() {
  const itemList = itemData.map(element => ItemWithGrid(element))
  return <ul style={{ maxHeight: "100vh", overflow: "auto" }}>
    {itemList}
  </ul>
}
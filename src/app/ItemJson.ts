import Item from './Item'
import _itemData from './items_cat.json'

export const itemData = Object.fromEntries(Object.entries(_itemData).map(([k, v], i) =>
  [k, v.map((it) => Item.mk(it))]
))
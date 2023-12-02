import Item from './Item'
import _itemData from './items.json'

export const itemData = _itemData.map(it => Item.mk(it))
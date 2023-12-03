import ItemRef from "./ItemRef";
import Rotation from "./Rotation";

export const DragDropTypes = {
  ITEM: 'item'
}

export class DragDropPayload {
  constructor(
    public item: ItemRef
  ) {}
}
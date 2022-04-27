import { MouseEventHandler } from "react";
import { CategoryList } from "./CategoryList";
import { Category } from "./DynamicNestedList";
import { Item } from "./DynamicNestedList";

export const Dnl = ({
  data,
  removeItem,
  addItem,
}: {
  data: [Category, Item[]][];
  removeItem: MouseEventHandler<HTMLButtonElement>;
  addItem: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div>
      {data.map((categoryAndItem) => (
        <CategoryList
          categoryAndItems={categoryAndItem}
          removeItem={removeItem}
          addItem={addItem}
          key={categoryAndItem[0]._id}
        />
      ))}
    </div>
  );
};

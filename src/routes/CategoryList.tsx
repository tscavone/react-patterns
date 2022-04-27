import { MouseEventHandler } from "react";
import { Category, Item } from "./DynamicNestedList";

export const CategoryList = ({
  categoryAndItems,
  removeItem,
  addItem,
}: {
  categoryAndItems: [Category, Item[]];
  removeItem: MouseEventHandler<HTMLButtonElement>;
  addItem: MouseEventHandler<HTMLButtonElement>;
}) => {
  const categoryId = categoryAndItems[0]._id;
  return (
    <div>
      <p>{categoryAndItems[0]._name}</p>
      <ul>
        {categoryAndItems[1].map((item) => (
          <li key={item._id}>
            {item._name}{" "}
            <button onClick={removeItem} value={item._id}>
              -
            </button>
          </li>
        ))}
      </ul>
      new item: <input type="text" id={"newItem-" + categoryId}></input>
      <button onClick={addItem} value={categoryId}>
        +
      </button>
    </div>
  );
};

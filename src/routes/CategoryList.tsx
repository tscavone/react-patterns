import { Category, Item } from "./DynamicNestedList";

export const CategoryList = ({
  categoryAndItems,
}: {
  categoryAndItems: [Category, Item[]];
}) => {
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
    </div>
  );
};

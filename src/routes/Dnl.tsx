import { CategoryList } from "./CategoryList";
import { Category } from "./DynamicNestedList";
import { Item } from "./DynamicNestedList";

export const Dnl = ({
  data,
  removeItem,
}: {
  data: [Category, Item[]][];
  removeItem: Function;
}) => {
  return (
    <div>
      {data.map((categoryAndItem) => (
        <CategoryList
          categoryAndItems={categoryAndItem}
          removeItem={removeItem}
          key={categoryAndItem[0]._id}
        />
      ))}
    </div>
  );
};

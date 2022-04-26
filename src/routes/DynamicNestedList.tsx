import { Dnl } from "./Dnl";

export class Item {
  _id: string;
  _name: string;
  _deleted: boolean;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this._deleted = false;
  }
}

export class Category {
  _id: string;
  _name: string;
  _deleted: boolean;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this._deleted = false;
  }
}

const removeItem = (event: any) => {
  console.log("removing item", event.target);
};

export const DynamicNestedList = () => {
  const data: [Category, Item[]][] = [
    [
      new Category("1", "fruit"),
      [
        new Item("1-1", "apple"),
        new Item("1-2", "banana"),
        new Item("1-3", "orange"),
      ],
    ],
    [
      new Category("2", "car"),
      [new Item("2-1", "toyota"), new Item("2-2", "ford")],
    ],
    [
      new Category("3", "animal"),
      [
        new Item("3-1", "cat"),
        new Item("3-2", "dog"),
        new Item("3-3", "fish"),
        new Item("3-4", "bird"),
      ],
    ],
  ];

  return (
    <div>
      <h3>Here is a dynamic nested list</h3>
      <Dnl data={data} removeItem={removeItem} />
    </div>
  );
};

import React from "react";
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

export const DynamicNestedList = () => {
  const origData: [Category, Item[]][] = [
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

  const [data, setData] = React.useState(origData);

  const removeItem = (event: any) => {
    let newData: any = [];
    //copy array because this part of react is stupid
    for (const categoryAndItem of data) {
      newData.push([categoryAndItem[0], [...categoryAndItem[1]]]);
    }

    for (const categoryAndItem of newData) {
      const foundIndex = categoryAndItem[1].findIndex(
        (item: any) => item._id === event.target.value
      );

      if (foundIndex !== -1) {
        categoryAndItem[1].splice(foundIndex, 1);
        setData(newData);
        return;
      }
    }

    throw new Error("did not find item:" + event.target.value);
  };

  const addItem = (event: any) => {
    const categoryId = event.target.value;

    const newInputEntered: HTMLInputElement | null = document.getElementById(
      "newItem-" + categoryId
    ) as HTMLInputElement;

    if (newInputEntered === null)
      throw new Error("did not find element ID:" + "newItem-" + categoryId);

    const newInput = newInputEntered.value;

    const newData: any = [];
    for (const categoryAndItem of data) {
      newData.push([categoryAndItem[0], [...categoryAndItem[1]]]);
    }

    for (const [index, categoryAndItem] of newData.entries()) {
      if (categoryAndItem[0]._id === categoryId) {
        categoryAndItem[1].push(new Item(Math.random() + "", newInput));
        newData[index] = [categoryAndItem[0], [...categoryAndItem[1]]];

        setData(newData);
      }
    }
  };

  return (
    <div>
      <h3>Here is a dynamic nested list</h3>
      <Dnl data={data} removeItem={removeItem} addItem={addItem} />
      <button
        onClick={() => {
          console.log("Here is the data", data);
        }}
      >
        save
      </button>
    </div>
  );
};

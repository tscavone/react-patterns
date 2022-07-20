import { useState, useEffect, ReactNode } from "react";

export const DataList = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/data", {
      method: "GET",
      headers: { "Content-type": "application/json" },
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin",
    })
      .then((response) => response.json())
      .then((jsonData) => setList(jsonData.items));
  }, []);

  const listItems: ReactNode[] = list.map((item: string) => <li>{item}</li>);
  return <ol>{listItems}</ol>;
};

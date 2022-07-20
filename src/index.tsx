import "./index.css";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App } from "./App";
import { DynamicNestedList } from "./routes/DynamicNestedList";
import { OneColumn } from "./routes/OneColumn";
import { OtherExample } from "./routes/OtherExample";
import { RichTextEdit } from "./routes/RichTextEdit";
import { DataList } from "./routes/DataList";
import { Login } from "./routes/Login";
const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="dnl" element={<DynamicNestedList />} />
      <Route path="oe" element={<OtherExample />} />
      <Route path="dl" element={<DataList />} />
      <Route path="login" element={<Login />} />
      <Route path="onecolumn" element={<OneColumn />} />
      <Route path="rte" element={<RichTextEdit />} />{" "}
    </Routes>
  </BrowserRouter>,
  rootElement
);

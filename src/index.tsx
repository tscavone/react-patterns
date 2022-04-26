import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App } from "./App";
import { DynamicNestedList } from "./routes/DynamicNestedList";
import { OtherExample } from "./routes/OtherExample";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="dnl" element={<DynamicNestedList />} />
      <Route path="oe" element={<OtherExample />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);

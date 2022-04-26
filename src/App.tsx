import { Link } from "react-router-dom";

export function App() {
  return (
    <div>
      <h1>Patterns</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/dnl">Dynamic Nested List</Link> |{" "}
        <Link to="/oe">Other Example</Link>
      </nav>
    </div>
  );
}

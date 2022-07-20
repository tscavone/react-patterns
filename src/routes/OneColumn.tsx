import "./styles/OneColumn.flex.css";

export const OneColumn = () => {
  return (
    <div className="one-column-container">
      <div className="header">header</div>
      <main className="main-container">
        <div className="aside">aside</div>
        <div className="body">body</div>
      </main>
      <div className="footer">footer</div>
    </div>
  );
};

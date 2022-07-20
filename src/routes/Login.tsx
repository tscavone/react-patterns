export const Login = () => {
  const submitForm = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/login?name=tony&name=abc123", {
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
    });
  };

  return (
    <div>
      <form action="http://localhost:3001/login">
        <label htmlFor="name">name</label>
        <input type="text" name="name" id="name"></input>
        <label htmlFor="password"></label>
        <input type="text" name="name" id="password"></input>
        <input type="submit" onClick={submitForm} value="Submit"></input>
      </form>
    </div>
  );
};

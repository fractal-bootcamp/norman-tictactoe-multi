import axios from "axios";
import "./App.css";

function App() {
  return (
    <>
      <button
        onClick={() => {
          axios.get("http://localhost:3005/").then((data) => console.log(data));
        }}
      >
        callGet
      </button>
      <button
        onClick={() => {
          axios
            .post("http://localhost:3005/", { name: "norman" })

            .then((data) => console.log(data));
        }}
      >
        callPost
      </button>
    </>
  );
}

export default App;

//axios?

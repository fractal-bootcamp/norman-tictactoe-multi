import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const Square = (props) => {
  //have checkwin return the indicies
  //checkwin runs on the rerender after click
  //if there is a win on the rerender, pass indicies down
  //you technically could put state in square??

  if (props.isWon != false) {
    const won = props.isWon;
    if (
      !!won.find(
        (element) =>
          element[0] === props.rowIndex && element[1] === props.columnIndex
      )
    ) {
      return (
        <button
          style={{ backgroundColor: "brown", width: 200, height: 200 }}
        ></button>
      );
    }
  }

  return (
    <button
      style={{ backgroundColor: "lightblue", width: 200, height: 200 }}
      onClick={() => {
        axios
          .post("http://localhost:3005", {
            row: props.rowIndex,
            column: props.columnIndex,
            player: props.player,
          })
          .then((response) => {
            props.setBoard(response.data.board);
            props.setPlayer(response.data.player);
            props.setWon(response.data.isWon);
          });
      }}
    >
      <div style={{ fontSize: 80 }}>{props.value}</div>
    </button>
  );
};

const Row = (props) => {
  return (
    <div style={{ display: "flex" }}>
      {props.row.map((value, index) => {
        return (
          <Square
            key={index}
            columnIndex={index}
            rowIndex={props.rowIndex}
            value={value}
            board={props.board}
            setBoard={props.setBoard}
            player={props.player}
            setPlayer={props.setPlayer}
            setWon={props.setWon}
            isWon={props.isWon}
          ></Square>
        );
      })}
    </div>
  );
};

const Board = () => {
  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  const [player, setPlayer] = useState("x");
  const [isWon, setWon] = useState(false);

  return (
    <div>
      {board.map((row, index) => {
        return (
          <Row
            key={index}
            rowIndex={index}
            row={row}
            board={board}
            setBoard={setBoard}
            player={player}
            setPlayer={setPlayer}
            setWon={setWon}
            isWon={isWon}
          ></Row>
        );
      })}
      <button
        onClick={() => {
          axios.get("http://localhost:3005").then((response) => {
            setBoard(response.data);
          });
        }}
      >
        Reset Board
      </button>
      <button
        onClick={() => {
          axios
            .post("http://localhost:3005", { norman: "abc" })
            .then((response) => {
              console.log(response.data);
            });
        }}
      >
        Post
      </button>
    </div>
  );
};

function App() {
  return (
    <>
      <Board></Board>
    </>
  );
}

export default App;

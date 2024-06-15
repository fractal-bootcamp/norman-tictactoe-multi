import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const Square = (props) => {
  //Before a Square renders, it checks if isWon contains data
  //Then, the Square looks for rowIndex and columnIndex in the data
  //If found, a red Square is rendered
  //edit: coerce iswon
  //edit: maybe solve the multiple victories here
  console.log(props.isWon);

  if (
    !!props.isWon &&
    !!props.isWon.find(
      (element) =>
        element[0] === props.rowIndex && element[1] === props.columnIndex
    )
  ) {
    return (
      <button style={{ backgroundColor: "brown", width: 200, height: 200 }}>
        <div style={{ fontSize: 80 }}>{props.value}</div>
      </button>
    );
  }

  //if isWon did not contain data, a blue Square is rendered, with
  //the ability to send a post request to the squareClick route containing
  //row, column, and player data
  //After a post request is sent, the server responds with the updated board, player, and the win data
  //Then, the states of Board, Player, and isWon are updated

  return (
    <button
      style={{ backgroundColor: "lightblue", width: 200, height: 200 }}
      onClick={() => {
        axios
          .post("http://localhost:3005/squareClick", {
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
  //A Row component returns an array of Square components.
  return (
    //Flexbox aligns Square components in a row
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

const Board = (/*{ initialBoard }*/) => {
  //A Board component keeps track of the board, player, and win state
  //A Board component returns an array of rows

  const [board, setBoard] = useState([
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
  ]);

  const [player, setPlayer] = useState("x");

  const [isWon, setWon] = useState(false);

  //row, index
  return (
    <div>
      {board.map((row, index) => {
        return (
          <Row
            //A row contains key, a mandatory prop, and rowIndex, uniquely identifying each row
            key={index}
            rowIndex={index}
            row={row}
            //The remaining props are passed down and used by the Square component
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
        //This button sends a post request to the /reset route on the server.
        //Which responds with an empty board, emp
        //It also resets isWon to false
        onClick={() => {
          axios.post("http://localhost:3005/reset").then((response) => {
            setBoard(response.data.board);
            setPlayer(response.data.player);
            setWon(response.data.isWon);
          });
        }}
      >
        Reset Board
      </button>
    </div>
  );
};

function App() {
  /*
  const [initialBoard]; state
  useEffect();
  axios.get("http://localhost:3005/game").then((response) => {
     setBoard(response.data);
   });

  if (!initialBoard) return <div>loading</div>;

  */
  return (
    <>
      <Board /*intialBoard={todo}*/></Board>
    </>
  );
}

export default App;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import axios from "axios";
import "./App.css";

const Square = (props) => {
  //Before a Square renders, it checks if isWon contains data
  //Then, the Square looks for rowIndex and columnIndex in the data
  //If found, a red Square is rendered

  if (
    !!props.isWon &&
    !!props.isWon.find(
      (element) =>
        element[0] === props.rowIndex && element[1] === props.columnIndex
    )
  ) {
    return (
      <motion.div
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 270, 270, 0],
          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
        }}
      >
        <button style={{ backgroundColor: "brown", width: 200, height: 200 }}>
          <div style={{ fontSize: 80 }}>{props.value}</div>
        </button>
      </motion.div>
    );
  }

  //if isWon did not contain data, a blue Square is rendered, with
  //the ability to send a post request to the squareClick route containing
  //row, column, and player data
  //After a post request is sent, the server responds with the updated board, player, and the win data
  //Then, the states of Board, Player, and isWon are updated

  return (
    /*<motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      key={props.board}
    >
    </motion.div>
    */

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

  const [board, setBoard] = useState<string[][] | null>(null);

  const [player, setPlayer] = useState(null);

  const [isWon, setWon] = useState(null);

  const [poller, setPoller] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3005/").then((response) => {
      setBoard(response.data.board);
      setPlayer(response.data.player);
      setWon(response.data.isWon);
    });
    setTimeout(() => {
      setPoller(poller + 1);
    }, 1000);
  }, [poller]);

  //row, index
  return (
    <div>
      {board &&
        board.map((row, index) => {
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

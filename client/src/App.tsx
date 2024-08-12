import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./App.css";

type Player = "x" | "o";
type Board = string[][];
type WinState = [number, number][] | "draw" | false;

interface SquareProps {
  rowIndex: number;
  columnIndex: number;
  value: string;
  board: Board;
  setBoard: React.Dispatch<React.SetStateAction<Board | null>>;
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  setWon: React.Dispatch<React.SetStateAction<WinState | null>>;
  isWon: WinState;
}

interface RowProps {
  row: string[];
  rowIndex: number;
  board: Board;
  setBoard: React.Dispatch<React.SetStateAction<Board | null>>;
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  setWon: React.Dispatch<React.SetStateAction<WinState | null>>;
  isWon: WinState;
}

const Square: React.FC<SquareProps> = (props) => {
  const {
    rowIndex,
    columnIndex,
    value,
    board,
    setBoard,
    player,
    setPlayer,
    setWon,
    isWon,
  } = props;

  if (
    isWon &&
    isWon !== "draw" &&
    isWon.find(
      (element) => element[0] === rowIndex && element[1] === columnIndex
    )
  ) {
    return (
      <motion.div
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 270, 270, 0],
          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
        }}
        className="square won"
      >
        <div className="square-content">{value}</div>
      </motion.div>
    );
  }

  return (
    <button
      className="square"
      onClick={() => {
        axios
          .post("http://localhost:3005/squareClick", {
            row: rowIndex,
            column: columnIndex,
            player: player,
          })
          .then((response) => {
            setBoard(response.data.board);
            setPlayer(response.data.player);
            setWon(response.data.isWon);
          });
      }}
    >
      <div className="square-content">{value}</div>
    </button>
  );
};

const Row: React.FC<RowProps> = (props) => {
  const { row, rowIndex, board, setBoard, player, setPlayer, setWon, isWon } =
    props;

  return (
    <div className="row">
      {row.map((value, index) => (
        <Square
          key={index}
          columnIndex={index}
          rowIndex={rowIndex}
          value={value}
          board={board}
          setBoard={setBoard}
          player={player}
          setPlayer={setPlayer}
          setWon={setWon}
          isWon={isWon}
        />
      ))}
    </div>
  );
};

const Board: React.FC = () => {
  const [board, setBoard] = useState<Board | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [isWon, setWon] = useState<WinState | null>(null);
  const [poller, setPoller] = useState<number | null>(null);

  useEffect(() => {
    axios.get("http://localhost:3005/").then((response) => {
      setBoard(response.data.board);
      setPlayer(response.data.player);
      setWon(response.data.isWon);
    });
    const timer = setTimeout(() => {
      setPoller((prev) => (prev !== null ? prev + 1 : 0));
    }, 1000);
    return () => clearTimeout(timer);
  }, [poller]);

  return (
    <div className="board-container">
      {board &&
        board.map((row, index) => (
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
          />
        ))}

      {isWon === "draw" && <div className="draw-message">It's a draw!</div>}

      <button
        className="reset-button"
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
  return (
    <>
      <Board />
    </>
  );
}

export default App;

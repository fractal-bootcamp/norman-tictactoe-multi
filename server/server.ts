import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3005;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send(board);
});

app.post("/", (req, res) => {
  //update the board
  board = board.map((row, index) => {
    if (index == req.body.row)
      return row.map((value, index) => {
        if (index == req.body.column) return req.body.player;
        else return value;
      });
    else return row;
  });

  //update the player
  if (req.body.player == "x") {
    player = "o";
  } else if (req.body.player == "o") {
    player = "x";
  }

  //check win
  const isWon = checkWin(board);
  res.send({ board: board, player: player, isWon: isWon });
});

let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let player = "x";

//debug multiple wins
//if multiple wins, what happens

const checkRow = (row) => {
  let winner = [];
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] == row[i + 1] && row[i] != "") {
      winner.push(i);
    }
    if (winner.length == row.length - 1) {
      winner.push(i + 1);
      return winner;
    }
  }
  return false;
};

const checkRows = (board) => {
  for (let i = 0; i < board.length; i++) {
    if (checkRow(board[i]) != false) {
      return checkRow(board[i]).map((element) => [i, element]);
    }
  }
  return false;
};

const checkColumns = (board) => {
  for (let i = 0; i < board[0].length; i++) {
    let winner = [];
    for (let j = 0; j < board.length - 1; j++) {
      if (board[j][i] == board[j + 1][i] && board[j][i] != "") {
        winner.push([j, i]);
      }
      if (winner.length == board.length - 1) {
        winner.push([j + 1, i]);
        return winner;
      }
    }
  }
  return false;
};

const checkDiag0 = (board) => {
  let winner = [];
  for (let i = 0; i < board[0].length - 1; i++) {
    for (let j = 0; j < board.length - 1; j++) {
      if (i == j && board[j][i] == board[j + 1][i + 1] && board[j][i] != "") {
        winner.push([i, j]);
      }
      if (winner.length == board.length - 1) {
        winner.push([j + 1, i + 1]);
        return winner;
      }
    }
  }

  return false;
};

const checkDiag1 = (board) => {
  let winner = [];
  for (let i = 0; i < board[0].length - 1; i++) {
    for (let j = 0; j < board.length + 1; j++) {
      if (
        i + j == board.length - 1 &&
        board[j][i] == board[j - 1][i + 1] &&
        board[j][i] != ""
      ) {
        winner.push([j, i]);
      }
      if (winner.length == board.length - 1) {
        winner.push([j - 1, i + 1]);
        return winner;
      }
    }
  }

  return false;
};

const checkWin = (board) => {
  return (
    checkDiag0(board) ||
    checkDiag1(board) ||
    checkRows(board) ||
    checkColumns(board)
  );
};

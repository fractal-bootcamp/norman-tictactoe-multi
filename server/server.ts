import express from "express";

const app = express();

const PORT = 3005;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("meep");
});

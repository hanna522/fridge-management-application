const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api.js");

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware for parsing request body
app.use(express.json());
app.use(cors());

// connect with mongoDB
var { mongoDB } = require("./config/mongo-db");

app.get("/", (req, res) => {
  console.log(req);
  res.send("Hello from MERN stack!");
});

app.use("/api", apiRoutes);

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}.`);
  await mongoDB();
});
